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
# PHP が使う拡張は PDO (MySQL) だけで、pdo_mysql は追加の apt パッケージ無しでビルドできる。
# opcache は PHP 8.5 から本体に組み込まれたため、docker-php-ext-install の対象にしない (指定するとビルドが失敗する)。
# タグの種類 (apache-trixie) を変えない。Snyk の自動 PR は脆弱性数だけで alpine や zts、rc 版への変更を提案するが、
# alpine は a2enmod と Apache を持たず、rc は安定版ではない (#180)。zts は Apache の mod_php (prefork) と組み合わせる NTS 版とは別の系統で、apache タグの代わりにはならない。
# 変更が必要なら docker ワークフローが通ることを確認してから取り込む。
FROM php:8.5-apache-trixie

# headers と rewrite は dist/.htaccess (CORS ヘッダーと SPA 用の rewrite) が使う。
# .htaccess 自体はベースイメージの docker-php.conf が /var/www/ に AllowOverride All を設定済みで有効。
# Snyk が報告する Debian の perl の脆弱性は、パッチ版が出るまでベースイメージに残る。ビルド時に apt-get upgrade で取り込む。
RUN apt-get update \
  && apt-get upgrade -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && docker-php-ext-install -j"$(nproc)" pdo_mysql \
  && a2enmod headers rewrite

# php.ini が無いと PHP 8 は E_ALL の警告を出力し、JSON レスポンスの前に混ざる。
# 本番向けの設定 (display_errors=Off) を php.ini として有効にする。
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --from=build /app/dist/ /var/www/html/
