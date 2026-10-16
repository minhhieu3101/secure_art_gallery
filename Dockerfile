
FROM node:22-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    pkg-config \
    libpqxx-dev \
    libnode-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN cmake -S src/cpp_core -B src/cpp_core/build \
    -DNODE_API_INCLUDE_DIR=/usr/include/node \
    && cmake --build src/cpp_core/build --config Release

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
