# 🛒 Simple E-commerce Application  

A simple **E-commerce web application** built with the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.  
This project includes a **backend API** (with authentication, role-based access, product/cart/order management) and a **frontend React UI** for customers and admins.  

---

## 🚀 Features
- **Authentication & Authorization**
  - JWT-based login & registration.
  - Role-based access:  
    - **Customer:** Can view products, manage cart, and place orders.  
    - **Admin:** Can manage products (add, update, delete).  
- **Product Management**
  - CRUD operations for products (Admin only).  
  - Pagination and search.  
- **Cart Management**
  - Add, update, and remove items in cart.  
- **Order Management**
  - Create an order from the cart.  

---

## 🛠️ Technologies Used
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Frontend:** React.js (with React Router, CSS Modules)  
- **Authentication:** JWT (JSON Web Tokens), bcryptjs  
- **Other Tools:** dotenv, cors, axios  

---

## 📂 Project Structure
AdaptNxt-Assignment/
│── backend/ # Node.js + Express API
│── frontend/ # React.js frontend
└── README.md

---

## 📦 Installation

### 1️⃣ Clone Repository
```bash
https://github.com/Priyanshu15092001/AdaptNxt-Assignment.git
cd AdaptNxt-Assignment
```
### 2️⃣ Setup Backend
```bash
cd backend
npm install
```
Create a .env file inside backend/:
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
Run backend:
```bash
npm run dev
```

### 3️⃣ Setup Frontend
```bash
cd ../frontend
npm install
```
Run frontend:
```bash
npm run dev
```

---

## 📖 API Documentation
### Auth Routes
  - POST <mark>/api/auth/register</mark> → Register user (customer/admin)
  - POST <mark>/api/auth/login</mark> → Login user

### Product Routes
  - GET <mark>/api/products</mark> → Get all products (with pagination & search)
  - POST <mark>/api/products</mark> → Create product (Admin only)
  - PUT <mark>/api/products/:id</mark> → Update product (Admin only)
  - DELETE <mark>/api/products/:id</mark> → Delete product (Admin only)

### Cart Routes
  - GET <mark>/api/cart</mark> → Get user cart
  - POST <mark>/api/cart</mark> → Add product to cart
  - DELETE <mark>/api/cart/:productId</mark> → Remove product from cart

### Order Routes
  - POST <mark>/api/orders</mark> → Create order from cart

---

## 👨‍💻 Roles Summary

- Customer:
  - View products
  - Manage cart
  - Place orders

- Admin:
  - All customer privileges
  - Manage products (Add, Update, Delete)

---

## 📌 Future Improvements
  - Add order history page for customers.
  - Implement payment gateway integration.
  - Add admin dashboard with analytics.
