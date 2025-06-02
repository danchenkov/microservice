// userservice/api.js

import bcrypt from 'bcrypt'
import { generateToken, verify } from './auth.js'


export default class API {
    constructor(db, grpc) {
        this.db = db
        this.grpc = grpc
    }

    Register = async (call, callback) => {
        const users = this.db.collection('users')

        try {
            const hash = await bcrypt.hash(call.request.password, 10)

            const user = {
                name: call.request.name,
                email: call.request.email,
                password: hash,
            }

            const result = await users.insertOne(user)
            user._id = result.insertedId

            const resp = {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                token: generateToken(user),
            }

            callback(null, resp)
        } catch (err) {
            callback(err)
        }
    }

    Login = (call, callback) => {
        const users = this.db.collection("users")

        users.findOne({ email: call.request.getEmail() }).then(user => {
            if (user) {
                bcrypt.compare(call.request.getPassword(), user.password, (err, result) => {
                    if (result) {
                        let resp = new messages.UserResponse()
                        resp.setId(user._id.toString())
                        resp.setName(user.name)
                        resp.setEmail(user.email)
                        resp.setToken(generateToken(user))
                        callback(null, resp)
                    }
                })
            } else {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "No user found",
                })
            }
        })
    }

    Verify = (call, callback) => {
        verify(call.request.getToken(), (usr) => {
            const users = this.db.collection("users")

            let resp = new messages.VerifyResponse()
            if (usr) {
                users.findOne({ email: usr.email }).then(user => {
                    resp.setId(user._id.toString())
                    resp.setName(user.name)
                    resp.setEmail(user.email)
                    callback(null, resp)
                })
            } else {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "No user found",
                })
            }
        })
    }

    GetUser = (call, callback) => {
        const users = this.db.collection("users")
        let resp = new messages.VerifyResponse()
        let userId = ObjectId(call.request.getUserId())
        users.findOne({ _id: userId }).then(user => {
            if (user) {
                resp.setId(user._id.toString())
                resp.setName(user.name)
                resp.setEmail(user.email)
                callback(null, resp)
            } else {
                return callback({
                    code: this.grpc.status.UNAUTHENTICATED,
                    message: "No user found",
                })
            }
        })
    }
}
