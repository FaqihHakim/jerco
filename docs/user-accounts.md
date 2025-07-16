
# Demo User Accounts

This document lists the available demo customer accounts for testing the application, especially the k-NN recommendation feature.

**Universal Password:** All test users have the same password for simplicity: `password123`

---

### 1. TestUser (Generalist)
- **Username:** `TestUser`
- **Email:** `user@example.com`
- **Password:** `password123`
- **Persona:** A general buyer who has purchased items from different brands (Puma and Adidas). Their recommendations will likely be diverse.

---

### 2. PumaFan (Brand Loyalist)
- **Username:** `PumaFan`
- **Email:** `pumafan@example.com`
- **Password:** `password123`
- **Persona:** Has a strong purchase history exclusively with Puma products. This user is ideal for testing how recommendations work for users with a clear brand preference.

---

### 3. AdidasLover (Primary Preference)
- **Username:** `AdidasLover`
- **Email:** `adidaslover@example.com`
- **Password:** `password123`
- **Persona:** Primarily buys Adidas products but has also made a smaller purchase from Puma. This profile demonstrates how the algorithm handles users with a dominant but not exclusive preference.

---

### 4. PumaSupporter (Neighbor for k-NN)
- **Username:** `PumaSupporter`
- **Email:** `pumasupporter@example.com`
- **Password:** `password123`
- **Persona:** Another user with a strong preference for Puma. Logging in as `PumaFan` should identify this user as a "nearest neighbor," and their purchase history will influence `PumaFan`'s recommendations.

---

### 5. LocalBrandHero (Mixed Preferences)
- **Username:** `LocalBrandHero`
- **Email:** `localhero@example.com`
- **Password:** `password123`
- **Persona:** Prefers the local brand (Ortuseight) but is also open to buying from major international brands like Adidas. This profile is good for testing recommendations for users with non-mainstream tastes.
