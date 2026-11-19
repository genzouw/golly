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

## index.html の inline script を変更するとき

`https://golly.genzouw.com` の CSP（`Content-Security-Policy`）は、`index.html` の inline `<script>` 2 個（gtag の初期化と `adsbygoogle.push`）を、中身の sha256 だけで許可しています。
`report-uri` は未設定のため、ブロックされても通知は来ません。

`index.html` の inline `<script>` を変えたら、配信する前に、genzouw/genzouw.com の `terraform/environments/aws/main.tf` の `csp_directives_golly` のハッシュを更新して apply してください。
ハッシュはソースではなく、ビルド後の `dist/index.html` から計算します。照合のコマンドは genzouw/genzouw.com の `terraform/README.md` の「golly の静的コンテンツ」にあります。

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
