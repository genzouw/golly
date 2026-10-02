# golly

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Docker Compose

``` bash
docker compose up --build
```

db は `mysql:8.4` を使う。MySQL 5.7 で作成した `dbdata` ボリュームは 8.4 が読めず、db が起動しない
（5.7 から 8.4 へ直接アップグレードできないため）。`ddl.sql` で作り直せる開発用データなので、
5.7 時代のボリュームが残っている環境では次で捨ててから起動する。残したいデータがある場合は、
先に 8.0 を経由してダンプ・リストアする。

``` bash
docker compose down -v
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
