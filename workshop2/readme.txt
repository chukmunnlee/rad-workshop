Running with Caddy, requires the following module
    http.handlers.openapi - chukmunnlee/caddy-openapi
    http.handlers.rate_limit - RussellLuo/caddy-ext/ratelimit

    caddy run -config ./Caddyfile

Validate OpenAPI 
    openapi-generator-cli validate -i customer_oas.yaml


Generating code (client)
    https://openapi-generator.tech/docs/generators/

    openapi-generator-cli generate -i customer_oas.yaml -g python -o src
