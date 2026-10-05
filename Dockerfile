# フロントエンド (Vue) をビルドするステージ。
# Node のバージョンは package.json の engines.node を満たし、CI (.github/workflows/build.yml) と揃える。
FROM node:24.21-bookworm-slim AS build

WORKDIR /app

# 依存の解決を先に済ませ、ソースだけの変更で npm ci のレイヤーを作り直さないようにする。
COPY package.json package-lock.json .npmrc ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# 配信用のステージ。Apache + PHP で dist (静的ファイルと static/ の PHP) を配信する。
# 旧ベースイメージ (php:7.2-apache-stretch) は PHP 7.2 と Debian 9 がサポート終了で、Snyk が 400 件超の脆弱性を報告していた。
# サポート中の PHP と Debian (trixie) のイメージを使う。
# PHP が使う拡張は PDO (MySQL) だけで、pdo_mysql と opcache は追加の apt パッケージ無しでビルドできる。
FROM php:8.4-apache-trixie

# headers と rewrite は dist/.htaccess (CORS ヘッダーと SPA 用の rewrite) が使う。
# .htaccess 自体はベースイメージの docker-php.conf が /var/www/ に AllowOverride All を設定済みで有効。
RUN docker-php-ext-install -j"$(nproc)" pdo_mysql opcache \
  && a2enmod headers rewrite

# php.ini が無いと PHP 8 は E_ALL の警告を出力し、JSON レスポンスの前に混ざる。
# 本番向けの設定 (display_errors=Off) を php.ini として有効にする。
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --from=build /app/dist/ /var/www/html/
