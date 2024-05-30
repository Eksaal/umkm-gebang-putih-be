# UMKM Gebang Putih

## How to use

-   Clone this repo
-   copy .env.example to .env
-   Run command: `npm install`
-   Run command: `node ace generate:key`. This command will replace AP_KEY value in .env file.
<!-- -   Edit `ecosystem.config.js` file and change name to domain name or something unique on server. -->

## Features

-   Login
-   Registration
-   Email verification
-   Middleware for email verified users only
-   Forgot password
-   Reset password
-   MJML for mail templates

## Deploy script

```
cd /path/to/your/project/folder

git pull origin main
# Laravel Forge Users: git pull origin $FORGE_SITE_BRANCH

npm install --no-save

npm run build

ENV_PATH=/path/to/env pm2 restart ecosystem.config.js

node ace migration:run --force --disable-locks
```

## Important Note

Please be aware that this is a very minimal starter kit. While it provides basic functionalities such as user login, registration, email verification, and password management, it does not include advanced security features like rate limiting. For instance, there is no built-in mechanism to prevent unlimited password reset email calls. If you anticipate high traffic or potential abuse, you might need to add a rate limiter or similar security measures to protect your application.
