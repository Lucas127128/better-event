# better-event

![license](https://img.shields.io/github/license/Lucas127128/better-event)
![testing](https://github.com/Lucas127128/better-event/workflows/testing/badge.svg)
![publish](https://github.com/Lucas127128/better-event/workflows/publish/badge.svg)
![check](https://github.com/Lucas127128/better-event/workflows/static-check/badge.svg)

An isomorphic event emitter with type safety! (Inspired by [emittery](https://github.com/sindresorhus/emittery))

## Installation

```bash
npm install better-event
```

## Quick example

```ts
import { createEventEmitter } from 'better-event';

const emitter = createEventEmitter({
  on: {
    event: {
      handler: async (data: string) => {
        console.log(data);
      },
    },
  },
});
await emitter.emit('event', 'hello world');
```

## Features

- create an event emitter with createEventEmitter()
- register event listeners when initializing
- emit events asynchronously with emit()
- disable event listeners with disable()
- type-safe event listener registration and emission

## Usage

create an event emitter:

### createEventEmitter(options)

### options

#### on

- handler: the event handler function to call when the event is emitted
  - `handler: (data: any) => Promise<void>`

    Example:

    ```ts
    const emitter = createEventEmitter({
      on: {
        event: {
          handler: async (data: string) => {
            console.log(data);
          },
        },
      },
    });
    ```

- signal: (optional) an AbortSignal to abort the event listener
  - `signal?: AbortSignal`
    Example:
    ```ts
    const { signal } = new AbortController();
    const emitter = createEventEmitter({
      on: {
        event: {
          handler: async (data: string) => {
            console.log(data);
          },
          signal,
        },
      },
    });
    ```

#### debug

(optional) a name for the event to be console.log() when event is emitted

- `debug?: {name: string}`
  - Example:
    ```ts
    const emitter = createEventEmitter({
      on: {
        event: {
          handler: async (data: string) => {
            console.log(data);
          },
        },
      },
      debug: { name: 'event' },
    });
    ```

### const emitter = createEventEmitter(options)

#### `emitter.emit(eventKey, data)`

Emit an event with the key and data.

Example:

```ts
const emitter = createEventEmitter({
  on: {
    event: {
      handler: async () => {
        console.log('hello world');
      },
    },
  },
});

await emitter.emit('event', 'data');
```

#### `emitter.disable(eventKey)`

Disable an event listener. After disabling, emitting the event does nothing.

Example:

```ts
const emitter = createEventEmitter({
  on: {
    event: {
      handler: async () => {
        console.log('hello world');
      },
    },
  },
});
emitter.disable('event');
await emitter.emit('event'); // nothing happens
```

## Development

- Install dependencies:

```bash
bun install
```

- Run the unit tests:

```bash
bun run test
```

- Build the library:

```bash
bun run build
```
