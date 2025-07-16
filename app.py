# app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import json
from sqlalchemy import func
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///jerkco.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'static/uploads')

# Initialize extensions
db = SQLAlchemy(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user')  # 'user' or 'admin'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    ratings = db.relationship('Rating', backref='user', lazy=True, cascade='all, delete-orphan')
    purchases = db.relationship('Purchase', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    category = db.Column(db.String(100), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    sizes = db.Column(db.Text, nullable=True)
    stock = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ratings = db.relationship('Rating', backref='product', lazy=True, cascade='all, delete-orphan')
    purchases = db.relationship('Purchase', backref='product', lazy=True, cascade='all, delete-orphan')
    
    @property
    def average_rating(self):
        if self.ratings:
            return sum(r.rating for r in self.ratings) / len(self.ratings)
        return 0
    
    @property
    def rating_count(self):
        return len(self.ratings)
    
    def get_sizes(self):
        if self.sizes:
            try:
                return json.loads(self.sizes)
            except:
                return []
        return []
    
    def set_sizes(self, sizes_list):
        self.sizes = json.dumps(sizes_list)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url,
            'category': self.category,
            'brand': self.brand,
            'color': self.color,
            'sizes': self.get_sizes(),
            'stock': self.stock,
            'average_rating': round(self.average_rating, 2),
            'rating_count': self.rating_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'product_id', name='unique_user_product_rating'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'rating': self.rating,
            'review': self.review,
            'created_at': self.created_at.isoformat(),
            'username': self.user.username
        }

class Purchase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    size = db.Column(db.String(10), nullable=True)
    total_price = db.Column(db.Float, nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='completed')  # completed, pending, cancelled
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'size': self.size,
            'total_price': self.total_price,
            'purchase_date': self.purchase_date.isoformat(),
            'status': self.status,
            'product_name': self.product.name,
            'product_price': self.product.price,
            'username': self.user.username
        }

# Helper functions
def allowed_file(filename):
    """Check if uploaded file is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes

# Test Route
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'JerkCo API is running!', 'timestamp': datetime.utcnow().isoformat()}), 200

# Authentication Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({'error': 'Missing required fields: username, email, password'}), 400
        
        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            role=data.get('role', 'user')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login data:", data)

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({'error': 'Missing username or password'}), 400

        user = User.query.filter_by(username=username).first()
        print("User from DB:", user)

        if user:
            print("Password match:", user.check_password(password))

        if user and user.check_password(password):
            return jsonify({
                'message': 'Login successful',
                'user': user.to_dict()
            }), 200

        return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500

@app.route('/api/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict()), 200

# Product Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        category = request.args.get('category')
        search = request.args.get('search')
        brand = request.args.get('brand')
        color = request.args.get('color')
        size = request.args.get('size')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        query = Product.query
        
        # Apply filters
        if category:
            query = query.filter(Product.category == category)
        
        if brand:
            query = query.filter(Product.brand == brand)
        
        if color:
            query = query.filter(Product.color == color)
        
        if search:
            query = query.filter(Product.name.contains(search))
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        if size:
            query = query.filter(Product.sizes.contains(f'"{size}"'))
        
        # Apply sorting
        if sort_by == 'name':
            query = query.order_by(Product.name.asc() if sort_order == 'asc' else Product.name.desc())
        elif sort_by == 'price':
            query = query.order_by(Product.price.asc() if sort_order == 'asc' else Product.price.desc())
        else:
            query = query.order_by(Product.created_at.asc() if sort_order == 'asc' else Product.created_at.desc())
        
        products = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'products': [p.to_dict() for p in products.items],
            'total': products.total,
            'pages': products.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch products: {str(e)}'}), 500

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        product_data = product.to_dict()
        
        # Add ratings
        ratings = Rating.query.filter_by(product_id=product_id).all()
        product_data['ratings'] = [r.to_dict() for r in ratings]
        
        return jsonify(product_data), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch product: {str(e)}'}), 500

@app.route('/api/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        
        if not all(k in data for k in ('name', 'price')):
            return jsonify({'error': 'Missing required fields: name, price'}), 400
        
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            image_url=data.get('image_url', ''),
            category=data.get('category', ''),
            brand=data.get('brand', ''),
            color=data.get('color', ''),
            stock=data.get('stock', 0)
        )
        
        if 'sizes' in data:
            product.set_sizes(data['sizes'])
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully',
            'product': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create product: {str(e)}'}), 500

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = data['price']
        if 'image_url' in data:
            product.image_url = data['image_url']
        if 'category' in data:
            product.category = data['category']
        if 'brand' in data:
            product.brand = data['brand']
        if 'color' in data:
            product.color = data['color']
        if 'stock' in data:
            product.stock = data['stock']
        if 'sizes' in data:
            product.set_sizes(data['sizes'])
        
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update product: {str(e)}'}), 500

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete product: {str(e)}'}), 500

# Rating Routes
@app.route('/api/products/<int:product_id>/rate', methods=['POST'])
def rate_product(product_id):
    try:
        data = request.get_json()
        
        if not all(k in data for k in ('user_id', 'rating')):
            return jsonify({'error': 'Missing required fields: user_id, rating'}), 400
        
        if not (1 <= data['rating'] <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        product = Product.query.get_or_404(product_id)
        user = User.query.get_or_404(data['user_id'])
        
        existing_rating = Rating.query.filter_by(user_id=data['user_id'], product_id=product_id).first()
        
        if existing_rating:
            existing_rating.rating = data['rating']
            existing_rating.review = data.get('review', '')
            message = 'Rating updated successfully'
        else:
            rating = Rating(
                user_id=data['user_id'],
                product_id=product_id,
                rating=data['rating'],
                review=data.get('review', '')
            )
            db.session.add(rating)
            message = 'Rating added successfully'
        
        db.session.commit()
        
        return jsonify({'message': message}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to rate product: {str(e)}'}), 500

# Purchase Routes
@app.route('/api/purchase', methods=['POST'])
def create_purchase():
    try:
        data = request.get_json()
        
        if not all(k in data for k in ('user_id', 'product_id', 'quantity')):
            return jsonify({'error': 'Missing required fields: user_id, product_id, quantity'}), 400
        
        product = Product.query.get_or_404(data['product_id'])
        user = User.query.get_or_404(data['user_id'])
        
        if product.stock < data['quantity']:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        total_price = product.price * data['quantity']
        
        purchase = Purchase(
            user_id=data['user_id'],
            product_id=data['product_id'],
            quantity=data['quantity'],
            size=data.get('size', ''),
            total_price=total_price
        )
        
        product.stock -= data['quantity']
        
        db.session.add(purchase)
        db.session.commit()
        
        return jsonify({
            'message': 'Purchase created successfully',
            'purchase': purchase.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create purchase: {str(e)}'}), 500

@app.route('/api/purchases/<int:user_id>', methods=['GET'])
def get_user_purchases(user_id):
    try:
        purchases = Purchase.query.filter_by(user_id=user_id).order_by(Purchase.purchase_date.desc()).all()
        
        return jsonify([p.to_dict() for p in purchases]), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch purchases: {str(e)}'}), 500

# Admin Routes
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        users = User.query.all()
        return jsonify([u.to_dict() for u in users]), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch users: {str(e)}'}), 500

@app.route('/api/admin/purchases', methods=['GET'])
def get_all_purchases():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        purchases = Purchase.query.order_by(Purchase.purchase_date.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'purchases': [p.to_dict() for p in purchases.items],
            'total': purchases.total,
            'pages': purchases.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch purchases: {str(e)}'}), 500

@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    try:
        total_users = User.query.count()
        total_products = Product.query.count()
        total_purchases = Purchase.query.count()
        total_ratings = Rating.query.count()
        
        # Sales statistics
        total_revenue = db.session.query(func.sum(Purchase.total_price)).scalar() or 0
        
        # Today's sales
        today = datetime.utcnow().date()
        today_sales = Purchase.query.filter(func.date(Purchase.purchase_date) == today).count()
        today_revenue = db.session.query(func.sum(Purchase.total_price)).filter(
            func.date(Purchase.purchase_date) == today
        ).scalar() or 0
        
        # This month's sales
        this_month = datetime.utcnow().replace(day=1).date()
        monthly_sales = Purchase.query.filter(Purchase.purchase_date >= this_month).count()
        monthly_revenue = db.session.query(func.sum(Purchase.total_price)).filter(
            Purchase.purchase_date >= this_month
        ).scalar() or 0
        
        # Top selling products
        top_products = db.session.query(
            Product.name,
            func.sum(Purchase.quantity).label('total_sold'),
            func.sum(Purchase.total_price).label('total_revenue')
        ).join(Purchase).group_by(Product.id).order_by(func.sum(Purchase.quantity).desc()).limit(5).all()
        
        return jsonify({
            'total_users': total_users,
            'total_products': total_products,
            'total_purchases': total_purchases,
            'total_ratings': total_ratings,
            'total_revenue': float(total_revenue),
            'today_sales': today_sales,
            'today_revenue': float(today_revenue),
            'monthly_sales': monthly_sales,
            'monthly_revenue': float(monthly_revenue),
            'top_products': [
                {
                    'name': product.name,
                    'total_sold': product.total_sold,
                    'total_revenue': float(product.total_revenue)
                }
                for product in top_products
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch stats: {str(e)}'}), 500

@app.route('/api/admin/sales-report', methods=['GET'])
def get_sales_report():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Purchase.query
        
        if start_date:
            query = query.filter(Purchase.purchase_date >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.filter(Purchase.purchase_date <= datetime.fromisoformat(end_date))
        
        purchases = query.order_by(Purchase.purchase_date.desc()).all()
        
        # Calculate totals
        total_sales = len(purchases)
        total_revenue = sum(p.total_price for p in purchases)
        total_quantity = sum(p.quantity for p in purchases)
        
        # Group by date
        daily_sales = {}
        for purchase in purchases:
            date = purchase.purchase_date.date().isoformat()
            if date not in daily_sales:
                daily_sales[date] = {'sales': 0, 'revenue': 0, 'quantity': 0}
            daily_sales[date]['sales'] += 1
            daily_sales[date]['revenue'] += purchase.total_price
            daily_sales[date]['quantity'] += purchase.quantity
        
        return jsonify({
            'purchases': [p.to_dict() for p in purchases],
            'summary': {
                'total_sales': total_sales,
                'total_revenue': float(total_revenue),
                'total_quantity': total_quantity,
                'average_order_value': float(total_revenue / total_sales) if total_sales > 0 else 0
            },
            'daily_sales': daily_sales
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to generate sales report: {str(e)}'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request'}), 400

@app.errorhandler(401)
def unauthorized(error):
    return jsonify({'error': 'Unauthorized'}), 401

@app.errorhandler(403)
def forbidden(error):
    return jsonify({'error': 'Forbidden'}), 403

def init_db():
    """Initialize database with sample data"""
    with app.app_context():
        db.create_all()
        
        # Create default admin user
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@jerkco.com',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            print("Default admin user created: admin/admin123")
        
        # Create sample user
        user = User.query.filter_by(username='user').first()
        if not user:
            user = User(
                username='user',
                email='user@jerkco.com',
                role='user'
            )
            user.set_password('user123')
            db.session.add(user)
            print("Default user created: user/user123")
        
        # Create sample products
        if Product.query.count() == 0:
            sample_products = [
                Product(
                    name='Kaos Polos Hitam',
                    description='Kaos polos warna hitam, bahan cotton combed 30s',
                    price=75000,
                    category='Kaos',
                    brand='JerkCo',
                    color='Hitam',
                    stock=50,
                    sizes='["S", "M", "L", "XL"]'
                ),
                Product(
                    name='Kemeja Formal Putih',
                    description='Kemeja formal warna putih untuk kebutuhan kantor',
                    price=150000,
                    category='Kemeja',
                    brand='JerkCo',
                    color='Putih',
                    stock=30,
                    sizes='["M", "L", "XL", "XXL"]'
                ),
                Product(
                    name='Celana Jeans Blue',
                    description='Celana jeans warna biru, model slim fit',
                    price=200000,
                    category='Celana',
                    brand='JerkCo',
                    color='Biru',
                    stock=25,
                    sizes='["28", "30", "32", "34", "36"]'
                ),
                Product(
                    name='Jaket Hoodie Navy',
                    description='Jaket hoodie warna navy, cocok untuk cuaca dingin',
                    price=180000,
                    category='Jaket',
                    brand='JerkCo',
                    color='Navy',
                    stock=20,
                    sizes='["S", "M", "L", "XL"]'
                )
            ]
            
            for product in sample_products:
                db.session.add(product)
            
            print("Sample products created")
        
        db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)