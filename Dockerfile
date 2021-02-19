FROM php:7.2-apache-stretch

RUN apt-get update \
  && apt-get install --no-install-recommends -y \
    apt-transport-https \
    apt-utils \
    build-essential \
    curl \
    debconf-utils \
    gcc \
    git \
    vim \
    gnupg2 \
    libfreetype6-dev \
    libicu-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libpq-dev \
    libzip-dev \
    locales \
    unzip \
    zlib1g-dev \
  && echo "en_US.UTF-8 UTF-8" >/etc/locale.gen \
  && locale-gen \
  && docker-php-ext-install -j$(nproc) zip gd opcache intl \
  && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
  && apt-get install --no-install-recommends -y \
    nodejs \
  && rm -rf /var/lib/apt/lists/* \
  ;

RUN docker-php-ext-install -j$(nproc) zip gd mysqli pdo_mysql opcache \
  ;

RUN a2enmod headers \
  && a2enmod rewrite \
  ;

COPY . /var/www

RUN cd /var/www && npm install && npm run build && cp -a dist/* dist/.htaccess /var/www/html/

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /etc/apache2/apache2.conf
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf
