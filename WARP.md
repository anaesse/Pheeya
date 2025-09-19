# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Sails.js application using the "Mellow" template from The Boring JavaScript Stack. It combines:
- **Backend**: Sails.js (Node.js MVC framework)
- **Frontend**: Vue.js 3 with Inertia.js for SPA-like experience
- **Styling**: Tailwind CSS with custom brand colors
- **Authentication**: Complete email-based auth system with OAuth support

## Development Commands

### Core Development
```bash
# Start development server with hot reload
npm run dev
# or
node --watch app.js

# Production server
npm start
# or
NODE_ENV=production node app.js
```

### Code Quality
```bash
# Check formatting
npm run lint

# Fix formatting issues
npm run lint:fix

# Run all tests
npm test

# Run unit tests specifically
npm run test:unit

# Run single test file
node --test tests/unit/helpers.test.js
```

### Sails.js Generators
```bash
# Generate new controller action
sails generate action auth/new-action

# Generate Inertia page (custom generator)
sails generate inertia dashboard/settings

# Generate Inertia redirect action
sails generate inertia-redirect auth/redirect-somewhere

# Generate bad-request response action
sails generate bad-request auth/invalid-data
```

## Architecture

### Request Flow
1. **Routes** (`config/routes.js`) → **Controllers** (`api/controllers/`) → **Views** (Vue components)
2. Controllers use `res.inertia()` to render Vue components instead of traditional EJS templates
3. Inertia.js handles client-side navigation and form submissions

### Directory Structure
- `api/controllers/` - Organized by feature (auth, user, dashboard, home)
- `api/models/` - Waterline ORM models (User.js with comprehensive auth fields)
- `api/helpers/` - Reusable business logic functions
- `api/policies/` - Route middleware (is-authenticated.js, is-guest.js)
- `assets/js/pages/` - Vue page components matching controller actions
- `assets/js/components/` - Reusable Vue components
- `assets/js/layouts/` - Vue layout components
- `config/` - Sails configuration files

### Authentication System
The app includes a complete authentication system:
- Email verification workflow with tokens
- Password reset with expiring tokens
- OAuth integration (Google) with token storage
- Profile management with email change requests
- Session-based authentication with policies

### Data Model
The `User` model includes:
- Basic profile data (fullName, email, initials)
- Email verification states (unverified/verified/change-requested)
- Password reset tokens with expiration
- OAuth provider integration fields
- Custom JSON serialization to hide sensitive data

### Frontend Architecture
- **Inertia.js** bridges Sails backend with Vue frontend
- **Vue 3 Composition API** for components
- **Tailwind CSS** with custom color palette (brand, green, gray, black)
- Components follow input patterns (InputBase, InputEmail, InputPassword, etc.)

## Key Configuration Files

- `config/inertia.js` - Inertia.js configuration
- `config/shipwright.js` - Asset bundling with Vue plugin
- `tailwind.config.js` - Custom color scheme and content paths
- `.sailsrc` - Custom Sails generators configuration

## Testing Approach

Tests use Node.js built-in test runner. Each test file:
1. Creates a new Sails instance in test mode
2. Loads app without shipwright hook (asset building)
3. Tests helpers and business logic
4. Properly tears down the Sails instance

## Database Integration

Uses Waterline ORM with:
- Model lifecycle callbacks (beforeCreate, beforeUpdate) for password hashing and initials generation
- Custom JSON serialization to exclude sensitive fields
- Unique constraints and validations
- Snake_case column names with camelCase attributes

## Email System

Integrated email system using:
- `sails-hook-mail` for email sending
- Email templates in `views/emails/` directory
- Template data passing for dynamic content
- Support for verification and password reset emails
