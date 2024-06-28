# Villy

A simple wrapper for Axios, that uses the same syntax as the vue [villus graphql](https://villus.dev/) library.

It's still based on using Graphql and Postgraphile, but instead of the client having all the queries, it's the backend that has them.

I'm not sure if this makes the whole thing more or less complicated, but I like the idea of having the backend handle the queries.

This might just be super stupid...

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
  query: 'getCaseById',
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