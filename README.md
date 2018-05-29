# Requirements
1. nodejs (8+)
2. docker (18+)

# Develop
1. cd ./server && yarn install && yarn dev
2. cd ./dashboard && yarn install && yarn start

# Deployment
1. copy .env.template -> .env
2. modify paramaters
3. docker-compose up -d

## Configuration env
- PORT: Binding port
- JWT_SECRET: JWT secret token
- DELOY_SECRET_KEY: Deployment secret key ( using 1st time setup )
- MONGODB_URI: Mongodb connection uri
- BLOCKPASS_BASE_URL: Blockpass api url
- BLOCKPASS_CLIENT_ID: Blockpass clientId
- BLOCKPASS_SECRET_ID: Blockpass secretId


# License
ApacheV2