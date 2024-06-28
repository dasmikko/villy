# Villy

A simple wrapper for Axios, that uses the same syntax as the [villus graphql](https://villus.dev/) library.

## Installation

```bash
npm install villy
pnpm install villy
yarn install villy
```

## Usage

```javascript
import { createClient } from 'villy';

createClient({
  url: 'https://api.example.com/graphql',
});
```