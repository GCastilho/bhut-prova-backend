FROM node:12

WORKDIR /tmp/app

# Copy config files
COPY tsconfig.json ./
COPY package*.json ./

# Copy production config
COPY package*.json /app/

# Install build and production dependencies
RUN npm ci
RUN npm ci --prefix /app --production

# Copy source code
COPY . .

# Build project
RUN npm run build

# Copy build files do production folder
WORKDIR /app
RUN mv /tmp/app/build/* . && rm -rf /tmp/app

EXPOSE 3000
CMD ["node", "index.js"]
