import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

import { resolveProtoPath } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })
const PROTO_PATH = resolveProtoPath('protos/user/user.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
const userPackage = protoDescriptor.userpackage

const client = new userPackage.UserService(
    `${process.env.HOST}:${process.env.PORT}`,
    grpc.credentials.createInsecure()
)

const request = {
    name: 'Alice',
    email: 'alice@example.com',
    password: '123456',
}

client.Register(request, (err, response) => {
    if (err) {
        console.error('gRPC error:', err)
    } else {
        console.log('User registered:', response)
    }
})
