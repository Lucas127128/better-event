# better-event

![testing](https://github.com/Lucas127128/better-event/workflows/testing/badge.svg)
![publish](https://github.com/Lucas127128/better-event/workflows/publish/badge.svg)

An isomorphic event emitter with type safety! (Inspired by [emittery](https://github.com/sindresorhus/emittery))

## installation

```bash
npm install better-event
```
## Quick example

```ts
import { createEventEmitter } from "better-event";

const emitter = createEventEmitter({
  on: {
    event: { handler: async (data:string) => {console.log(data)} },
  },
});
await emitter.emit('event', 'hello world');
```

## features

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
        event: { handler: async (data:string) => {console.log(data)} },
      },
    });
    ```

- debug: (optional) a name for the event to be console.log() when event is emitted

  - `debug?: {name: string}`
  - Example:
    ```ts
    const emitter = createEventEmitter({
      on: {
        event: {
          handler: async (data: string) => {
            console.log(data);
          },
          debug: { name: 'event' },
        },
      },
    });
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
