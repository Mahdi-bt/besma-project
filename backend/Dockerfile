FROM php:8.2-apache

# Install system dependencies and PostgreSQL client
RUN apt-get update && apt-get install -y \
    libpq-dev \
    postgresql-client \
    dos2unix \
    && docker-php-ext-install pdo pdo_pgsql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html/

# Fix line endings and set permissions
RUN dos2unix /var/www/html/docker-entrypoint.sh \
    && chmod +x /var/www/html/docker-entrypoint.sh \
    && chown -R www-data:www-data /var/www/html \
    && sed -i 's/\r$//' /var/www/html/docker-entrypoint.sh

# Configure Apache
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Expose port 80
EXPOSE 80

# Use the entrypoint script
ENTRYPOINT ["/bin/bash", "/var/www/html/docker-entrypoint.sh"] 