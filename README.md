# better-event

[![npm version](https://img.shields.io/npm/v/better-event)](https://www.npmjs.com/package/better-event)
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
    hello: (data: string) => {
      console.log('hello', data);
    },
  },
});
await emitter.emit('hello', 'world');
// => hello world
```

## Features

- register event listeners when initializing
- disable event listeners with disable()
- timeout support for event handlers
- abort event listeners with AbortSignal
- type-safe event listener registration and emission

> [!IMPORTANT]
> This project is currently in its early stages.
> Breaking changes may happen in every version without notice until `v1.0.0`.

## Quick start

- Step 1: Initialize the event emitter

  ```ts
  import { createEventEmitter } from 'better-event';

  const emitter = createEventEmitter();
  ```

- Step 2: Add callback function with custom event key

  ```ts
  import { createEventEmitter } from 'better-event';

  const emitter = createEventEmitter({
    on: {
      // 'hello' is the event key
      hello: () => {
        console.log('hello');
      },
    },
  });
  ```

- Step 3 (optional): pass the data to the event callback function

  ```ts
  import { createEventEmitter } from 'better-event';

  const emitter = createEventEmitter({
    on: {
      hello: (name: string) => {
        console.log('hello', name);
      },
    },
  });
  ```

- Step 4: Emit the event:

  ```ts
  import { createEventEmitter } from 'better-event';

  const emitter = createEventEmitter({
    on: {
      hello: () => {
        console.log('hello');
      },
    },
  });
  await emitter.emit('hello');
  // => hello
  ```

## Usage

create an event emitter:

### createEventEmitter(options)

### options

#### on

- handler: the event handler function to call when the event is emitted
  - `handler: (data: T) => Promise<void> | void`

    Example:

    ```ts
    const emitter = createEventEmitter({
      on: {
        hello: (data: string) => {
          console.log('hello', data);
        },
      },
    });
    ```

- signal: (optional) an AbortSignal to abort the event listener
  - `signal?: AbortSignal`
    Example:

    ```ts
    const controller = new AbortController();
    const signal = controller.signal;
    const emitter = createEventEmitter({
      on: {
        hello: {
          handler: async (data: string) => {
            console.log('hello', data);
          },
          signal,
        },
      },
    });

    controller.abort();
    await emitter.emit('hello', 'world'); // nothing happens
    ```

- timeout: (optional) the maximum time in milliseconds to wait for the event handler to complete
  - `timeout?: number`
    Throws `TimeoutError` if the handler does not complete within the specified time.

    Example:

    ```ts
    import { createEventEmitter, TimeoutError } from 'better-event';

    const emitter = createEventEmitter({
      on: {
        hello: {
          handler: async (data: string) => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('hello', data);
          },
          timeout: 100,
        },
      },
    });

    try {
      await emitter.emit('hello', 'world');
    } catch (error) {
      console.error(error.message);
      // => Event hello timed out
    }
    ```

#### debug

(optional) a name for the event to be console.log() when event is emitted

- `debug?: {name: string}`
  - Example:

    ```ts
    const emitter = createEventEmitter({
      on: {
        hello: (data: string) => {
          console.log('hello', data);
        },
      },
      debug: { name: 'hello' },
    });

    await emitter.emit('hello', 'world');
    // => hello world
    // => {
    //      time: "6/6/2026, 2:23:27 PM",
    //      name: "hello",
    //      eventKey: "hello",
    //      data: "world",
    //     }
    ```

### const emitter = createEventEmitter(options)

#### `emitter.emit(eventKey)`

#### `emitter.emit(eventKey, data)`

Emit an event with the key and optional data. The `data` argument can be omitted if the handler takes no parameters.

Error: `TimeoutError` with properties:

- `.timeout` — the configured timeout duration in milliseconds
- `.eventKey` — the key of the event that timed out

Example:

```ts
const emitter = createEventEmitter({
  on: {
    hello: () => {
      console.log('hello world');
    },
  },
});

await emitter.emit('hello');
// => hello world
```

#### `emitter.disable(eventKey)`

Disable an event listener. After disabling, emitting the event does nothing.

Example:

```ts
const emitter = createEventEmitter({
  on: {
    hello: () => {
      console.log('hello world');
    },
  },
});
await emitter.emit('hello');
// => hello world

emitter.disable('hello');
await emitter.emit('hello');
// nothing happens
```

## Star history

## Star History

 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=Lucas127128/better-event&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=Lucas127128/better-event&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=Lucas127128/better-event&type=date&legend=top-left" />
 </picture>

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
