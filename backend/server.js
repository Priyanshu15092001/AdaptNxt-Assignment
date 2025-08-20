const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config();
connectDB();
 
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth",authRoutes );
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
