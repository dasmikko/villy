# Villy

A simple wrapper for Axios, that uses the same syntax as the vue [villus graphql](https://villus.dev/) library. Written in TypeScript

## Features

* Simple syntax
* Reactive
* Refetching on mutation
* Composition API support
* Written in TypeScript

## Why?

I wanted to have a simple way to query and mutate data in my Vue applications, and I really liked the syntax of the [villus graphql](https://villus.dev/) library. So I decided to create a similar library for REST APIs.

## Future
I'm planning to switch to fetch to make it more lightweight, but for now, it's just a wrapper for Axios.

## Installation

```bash
npm install villy
pnpm install villy
yarn install villy
```

## Usage

```javascript
import { createClient } from 'villy';

// Setup the global client
createClient({
  url: 'https://api.example.com/',
});

// Query
const { data, error, isFetching, execute } = useQuery({
  path: 'getCaseById',
  tags: ['getCases'],
  variables: {},
})

// Mutation
const { data, error, isFetching, execute } = useMutation('createCase', {
  refetchTags: ['getCases'],
})

```

## Todo

* [ ] Add fetch support
* [ ] Add add support for setting client per query/mutation
* [ ] Add tests
* [ ] Add more examples
* [ ] Add more documentation