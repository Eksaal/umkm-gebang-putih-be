# UMKM Gebang Putih API Documentation

Welcome to the UMKM Gebang Putih API documentation. This documentation provides an overview of the routes and their functionalities available in the UMKM Gebang Putih API.

## Table of Contents

-   [Base URL](#base-url)
-   [Authentication Routes](#authentication-routes)
-   [UMKM Routes](#umkm-routes)
-   [Reviewer Routes](#reviewer-routes)
-   [Picture Routes](#picture-routes)
-   [Welcome Route](#welcome-route)
-   [Middleware](#middleware)

## Base URL

The base URL for all API routes is:

## Base URL

The base URL for all API routes is:

## Authentication Routes

These routes handle user authentication, including login, registration, password management, and email verification.

### Routes

-   **POST /auth/login**

    -   Controller: `AuthController`
    -   Action: `login`
    -   Description: Authenticates a user.

-   **POST /auth/register**

    -   Controller: `AuthController`
    -   Action: `register`
    -   Description: Registers a new user.

-   **GET /auth/email/verify/:email/:id**

    -   Controller: `AuthController`
    -   Action: `verifyEmail`
    -   Description: Verifies a user's email address.

-   **POST /auth/password/forgot**

    -   Controller: `AuthController`
    -   Action: `forgotPassword`
    -   Description: Sends a password reset link to the user.

-   **POST /auth/password/reset/:id/:token**

    -   Controller: `AuthController`
    -   Action: `resetPassword`
    -   Description: Resets the user's password using the provided token.

-   **GET /auth/user**

    -   Controller: `AuthController`
    -   Action: `user`
    -   Description: Retrieves the authenticated user's information.
    -   Middleware: `auth`

-   **POST /auth/logout**

    -   Controller: `AuthController`
    -   Action: `logout`
    -   Description: Logs out the authenticated user.
    -   Middleware: `auth`

-   **POST /auth/email/verify/resend**
    -   Controller: `AuthController`
    -   Action: `resendVerificationEmail`
    -   Description: Resends the email verification link.
    -   Middleware: `auth`

## UMKM Routes

These routes manage UMKM (Micro, Small, and Medium Enterprises) data.

### Routes

-   **GET /umkm/**

    -   Controller: `UmkmController`
    -   Action: `index`
    -   Description: Retrieves a list of all UMKM.

-   **POST /umkm/**

    -   Controller: `UmkmController`
    -   Action: `store`
    -   Description: Creates a new UMKM entry.

-   **GET /umkm/:id**

    -   Controller: `UmkmController`
    -   Action: `show`
    -   Description: Retrieves details of a specific UMKM by ID.

-   **DELETE /umkm/:id**
    -   Controller: `UmkmController`
    -   Action: `destroy`
    -   Description: Deletes a specific UMKM by ID.

## Reviewer Routes

These routes manage reviewer data.

### Routes

-   **GET /reviewers/**

    -   Controller: `ReviewersController`
    -   Action: `index`
    -   Description: Retrieves a list of all reviewers.

-   **POST /reviewers/**

    -   Controller: `ReviewersController`
    -   Action: `store`
    -   Description: Creates a new reviewer entry.

-   **GET /reviewers/:id**

    -   Controller: `ReviewersController`
    -   Action: `show`
    -   Description: Retrieves details of a specific reviewer by ID.

-   **GET /reviewers/umkm/:id**

    -   Controller: `ReviewersController`
    -   Action: `showByUmkmDataId`
    -   Description: Retrieves details of reviewers by UMKM ID.

-   **PATCH /reviewers/:id**

    -   Controller: `ReviewersController`
    -   Action: `update`
    -   Description: Updates a specific reviewer by ID.

-   **DELETE /reviewers/:id**
    -   Controller: `ReviewersController`
    -   Action: `destroy`
    -   Description: Deletes a specific reviewer by ID.

## Picture Routes

These routes manage pictures related to UMKM.

### Routes

-   **GET /pictures/**

    -   Controller: `UmkmPicturesController`
    -   Action: `index`
    -   Description: Retrieves a list of all UMKM pictures.

-   **POST /pictures/**

    -   Controller: `UmkmPicturesController`
    -   Action: `store`
    -   Description: Uploads a new picture for UMKM.

-   **GET /pictures/:id**

    -   Controller: `UmkmPicturesController`
    -   Action: `show`
    -   Description: Retrieves details of a specific picture by ID.

-   **GET /pictures/umkm/:id**

    -   Controller: `UmkmPicturesController`
    -   Action: `showByUmkmDataId`
    -   Description: Retrieves pictures by UMKM ID.

-   **PATCH /pictures/:id**

    -   Controller: `UmkmPicturesController`
    -   Action: `update`
    -   Description: Updates a specific picture by ID.

-   **DELETE /pictures/:id**
    -   Controller: `UmkmPicturesController`
    -   Action: `destroy`
    -   Description: Deletes a specific picture by ID.

## Welcome Route

A general welcome route for the API.

### Route

-   **GET /**
    -   Description: Displays a welcome message.
    -   Response:
        ```json
        {
            "status": 200,
            "message": "Welcome to UMKM Gebang Putih"
        }
        ```

## Middleware

Certain routes are protected by middleware to ensure proper authentication and authorization.

-   **auth**: Ensures the user is authenticated.
-   **verifiedEmail**: Ensures the user's email is verified.

### Middleware Usage

-   The `auth` middleware is applied to user-specific routes within the `/auth` group.
-   The `verifiedEmail` middleware is applied to routes that require verified email access within the `/api/v1` group.
