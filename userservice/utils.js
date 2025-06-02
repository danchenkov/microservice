// userservice/utils.js

import path from 'path'
import { fileURLToPath } from 'url'

// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import fs from 'fs'

export function resolveProtoPath(relativePath) {
    const localPath = path.resolve(__dirname, '..', relativePath)
    const dockerPath = path.resolve(__dirname, relativePath)

    return fs.existsSync(localPath) ? localPath : dockerPath
}
