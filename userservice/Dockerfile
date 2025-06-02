# userservice/Dockerfile

FROM node:18

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json ./
ENV PNPM_SKIP_VERIFY_STORE_INTEGRITY=true
RUN pnpm install --ignore-scripts
RUN pnpm rebuild bcrypt protobufjs

COPY . .

EXPOSE 50051
CMD [ "node", "index.js" ]
