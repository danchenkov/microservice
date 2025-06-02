// userservice/auth.js

import jwt from 'jsonwebtoken'

export function generateToken(payload) {
    return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_LIFE })
}

export function verify(token, callback) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error(err)
            return callback(err)
        }
        callback(null, user)
    })
}