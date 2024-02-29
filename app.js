const express = require("express");
const connect = require("./utils/connection");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const addressRoutes = require("./routes/addressRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const offerRoutes = require("./routes/offerRoutes");

const app = express();
connect();
app.use(express.json());
// app.use(express.urlencoded({extended: true}))

require("dotenv").config();
app.use(cookieParser());

const port = process.env.PORT;
// const connectDB = process.env.MONGODB_URI;


app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.use('/api/offer', offerRoutes);


app.listen(port, () => {
    // console.log(connectDB, port);
  console.log(`Server running on port ${port}`);
});
