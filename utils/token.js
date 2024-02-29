const jwt = require("jsonwebtoken");

function generateAccessToken(userId){
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRY;

    const token = jwt.sign({userId}, secretKey, {expiresIn});
    return token;
}

function generateRefreshAccessToken(userId){
    const secretKey = process.env.REFRESH_TOKEN_SECRET;
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRY;

    const token = jwt.sign({userId}, secretKey, {expiresIn});
    return token;
}

module.exports = {generateAccessToken, generateRefreshAccessToken}