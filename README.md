# NUTD Automotive Parts Portal (نماء المتحدة للتجارة والتوزيع)

A comprehensive enterprise-grade B2B website, dynamic catalog, and full-stack Content Management System (CMS) designed for **Nama United Trading & Distribution (NUTD)**, a leading distributor of automotive spare parts in Egypt (partners with Bosch, NGK, Valvoline).

## ✨ Features

- **Bilingual Interface (العربية / English):** Seamlessly switch between languages with native Right-to-Left (RTL) support.
- **Modern UI/UX Design:** Implemented using Glassmorphism styles, fluid scroll reveals, CSS grids, and fully responsive layouts.
- **Dynamic Media Center:** A highly optimized SEO-friendly news and articles section. Supports rich text, Youtube/Video uploads, and auto-generated `JSON-LD Schema` for top-tier Google search ranking.
- **Enterprise Visual Builder (CMS):** Administrators can change site texts, hero images, and branding assets instantly via the dashboard without any coding.
- **B2B Dealer Portal:** Private authentication, product catalogs, interactive cart, and an order management system tailored for wholesale clients.

## 🛠 Technology Stack

### Frontend
- HTML5, CSS3, Vanilla JS
- **External Libraries:** FontAwesome (Icons), Quill.js (Rich Text Editor)

### Backend
- **Framework:** Node.js, Express.js
- **Database:** MongoDB / Mongoose
- **Middlewares:** Multer (File Uploads), CORS, body-parser

## 🚀 How to Run Locally

### 1. Backend Server Setup
1. Make sure you have **Node.js** and **MongoDB** installed and running on your system.
2. Navigate to the `backend` directory in your terminal:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server (will run on port `5000`):
   ```bash
   npm run dev
   ```

*(Optional) Seed the database with sample news articles:*
```bash
node seed_articles.js
```

### 2. Frontend Development Server
The frontend is primarily static HTML/JS files that fetch data dynamically.
1. Use an extension like **Live Server** in VS Code.
2. Run the server on Port **3002** (or adjust CORS in the backend if you use another port).
3. The frontend communicates with the backend via `http://localhost:5000/api`.

## 🔗 Important Links

When the development servers are up and running, use the following links:

*   🌐 **Main Website:** [http://localhost:3002/index.html](http://localhost:3002/index.html)
*   📰 **Media Center:** [http://localhost:3002/media.html](http://localhost:3002/media.html)
*   🛍 **Products & Brands:** [http://localhost:3002/brands.html](http://localhost:3002/brands.html)
*   🔐 **Dealer Login Portal:** [http://localhost:3002/dealer/login.html](http://localhost:3002/dealer/login.html)
*   ⚙️ **Admin Dashboard:** [http://localhost:3002/admin/dashboard.html](http://localhost:3002/admin/dashboard.html)
*   🔌 **Backend API Engine:** `http://localhost:5000/api/...`

---
*Built with ❤️ for Nama United Trading & Distribution.*
