
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Docker

```bash
# build an image
$ npm run docker-build or docker build --tag opodatkuvayco-backend .

# run an image
$ npm run docker-run or docker run -p 3000:3000 opodatkuvayco-backend or docker compose up
```