const mongoose = require("mongoose");
const DB_name = 'eCommerce';
require("dotenv").config();


const connect = async() => {
    // const mongo = process.env.MONGODB_URI;
    // console.log(mongo);
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
        console.log(`\n Connected !!`);
        // console.log(connectionInstance);
    } catch (error) {
        console.log("Connection not successfull");
        console.log(error);
    }
}

module.exports = connect;