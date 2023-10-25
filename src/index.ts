import styles from "./styles";
import { formatJSON, formatNumber, getFormattedDateTime } from "./utils";

interface ChannelOpts {
  timestamp?: boolean;
}

class Logstream {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  channel(name: string, opts: ChannelOpts = { timestamp: true }): Channel {
    return new Channel(this, name, opts);
  }
}

class Channel {
  name: string;
  opts: ChannelOpts;
  private logstream: Logstream;
  private writer: WritableStreamDefaultWriter<string>;

  constructor(logstream: Logstream, name: string, opts: ChannelOpts) {
    this.logstream = logstream;
    this.name = name;
    this.opts = opts;

    const writable = new WritableStream<string>({
      write: async (chunk) => {
        await this.send(chunk);
      },
    });

    this.writer = writable.getWriter();
  }

  error(...data: any[]): void {
    for (let value of data) {
      value = value instanceof Error ? value.stack : value;

      this.log(
        ("ERROR " + value)
          .split("\n")
          .map((line) => {
            return styles.red.open + line + styles.red.close;
          })
          .join("\n")
      );
    }
  }

  critical(...data: any[]) {
    for (let value of data) {
      value = value instanceof Error ? value.stack : value;

      this.log(
        ("CRITICAL " + value)
          .split("\n")
          .map((line) => {
            return (
              styles.bgRed.open +
              styles.white.open +
              line +
              styles.white.close +
              styles.bgRed.close
            );
          })
          .join("\n")
      );
    }
  }

  warn(...data: any[]): void {
    for (let value of data) {
      value = value instanceof Error ? value.stack : value;

      this.log(
        ("WARNING " + value)
          .split("\n")
          .map((line) => {
            return styles.bgRed.open + line + styles.bgRed.close;
          })
          .join("\n")
      );
    }
  }

  log(...data: any[]): void {
    const formattedData = data.map((item) => {
      let value = item;

      if (typeof value === "number") {
        value = formatNumber(value);
      }

      if (typeof item === "object") {
        value = formatJSON(value);
      }

      value = String(value);

      if (this.opts.timestamp) {
        value = value
          .split("\n")
          .map((line: string) => {
            return (
              styles.reset.open +
              styles.gray.open +
              getFormattedDateTime() +
              " " +
              styles.gray.close +
              styles.reset.close +
              line
            );
          })
          .join("\n");
      }

      return value;
    });

    this.raw(formattedData.join("\n") + "\n");
  }

  raw(content: string): void {
    this.writer.write(content);
  }

  private async send(content: string): Promise<void> {
    await fetch(this.logstream.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "logstream-js",
      },
      body: JSON.stringify({
        channel: this.name,
        content,
      }),
    });
  }
}

function register(
  url: string,
  opts: { channel: string } = { channel: "My first log" }
) {
  const logstream = new Logstream(url);
  const channel = logstream.channel(opts.channel);

  let orginalConsoleLog = console.log;
  let orginalConsoleError = console.error;

  globalThis.console.log = (...data: any[]) => {
    channel.log(...data);
    orginalConsoleLog.apply(console, data);
  };

  globalThis.console.error = (...data: any[]) => {
    channel.error(...data);
    orginalConsoleError.apply(console, data);
  };
}

export { Logstream, register };
