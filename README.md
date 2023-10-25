# @logstream/logstream

This is a TypeScript client library for logstream. It allows you to log information from your JavaScript applications to your logstream server directly.

## Installation

```bash
npm install @logstream/logstream
```

## Importing Logstream

Firstly, you would need to import the `Logstream` from the `@logstream/logstream-js` library.

```typescript
import { Logstream } from "@logstream/logstream";
```

## Initializing Logstream

To initialize logstream, create a new instance of `Logstream`. As an argument, you need to pass the URL to your logstream server.

```typescript
const logstream = new Logstream("http://localhost:8080/v1/stdin?token=123");
```

## Creating a Log Channel

Next, create a new Log Channel using the `channel` method of the `logstream` object and passing in the channel name.

```typescript
const channel = logstream.channel("Test log");
```

## Logging Data

The log data can be of any data type including objects and arrays.

```typescript
channel.log({
  address: {
    street: "123 Main St",
    city: "Exampleville",
  },
});
```

## Logging Errors

To log errors, use the built-in functions: `warn`, `error`, and `critical`.

```typescript
channel.warn(new Error("This is a warning message"));
channel.error(new Error("This is an error message"));
channel.critical(new Error("This is a critical message"));
```

The `warn`, `error`, and `critical` functions each represent different levels of esception and they work similarly to the `log` function.