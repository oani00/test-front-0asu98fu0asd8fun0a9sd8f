# Projectangular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.11.

## Overview

Projectangular is a web application built with Angular 17.3, featuring a modular structure for travel and tour management. It includes authentication, navigation, and detail pages for trips and tours.

## Project Structure

- `src/app/components/navbar/`: Navigation bar component
- `src/app/pages/`: Main pages (initial, login, sign-up, menu, detail views)
- `src/app/models/`: Data models (e.g., viagem)
- `src/app/services/`: Services for business logic and API calls
- `src/app/types/`: Type definitions
- `src/environments/`: Environment configs for development and production
- `src/assets/`: Static assets

## Main Features

- User authentication (login, sign-up)
- Navigation menu and routing
- Trip and tour detail pages
- Support page
- Responsive design

## Usage

### Development server

Run `npm start` or `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component <name>` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Dependencies

- Angular 17.3
- RxJS
- Zone.js
- Jasmine, Karma (testing)
- TypeScript

## Configuration

- Environment variables are set in `src/environments/environment.ts` and `environment.development.ts`.
- Routing is configured in `src/app/app.routes.ts` and provided in `app.config.ts`.


## Further help

To get more help on the Angular CLI use `ng help` or check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# TODO list

[] Review all components for missing error handling and validation.
[] Add more unit and e2e tests for critical flows.
[] Document API endpoints and expected responses in the README.
[] Check for unused imports and optimize module imports.

[] Login page
[] CSS
    [] overhall styling
    [] initial-page carrousel
[]