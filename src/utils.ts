import styles from "./styles";

export function getFormattedDateTime(): string {
  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  return `${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export function formatNumber(number: number) {
  return styles.yellow.open + number + styles.blue.close;
}

const { whiteBright, green, yellow, blue, red, magenta, cyan, reset, gray } =
  styles;

function getValueType(
  value: any
):
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "null"
  | "array"
  | "nan" {
  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  if (typeof value === "number" && isNaN(value)) {
    return "nan";
  }

  return typeof value;
}

export function formatJSON(obj: any, indent = 1): string {
  let jsonStr = "";

  const colorStyles: Record<string, string> = {
    key: whiteBright.open,
    string: green.open,
    number: yellow.open,
    punctuation: red.open,
    boolean: cyan.open,
    null: cyan.open,
    nan: cyan.open,
    undefined: gray.open,
    reset: reset.open,
  };

  function colorize(type: any, text: any) {
    return `${colorStyles[type]}${text}${colorStyles.reset}`;
  }

  function handleValue(type: any, value: any) {
    return `${colorize(type, JSON.stringify(value))},\n`;
  }

  const type = getValueType(obj);

  const indents = "  ".repeat(indent);
  if (Array.isArray(obj)) {
    jsonStr += "[\n";
    for (let v of obj) {
      jsonStr += indents + handleValue(getValueType(v), v);
    }
    jsonStr = jsonStr.slice(0, -2) + "\n" + indents.slice(0, -2) + "]";
  } else if (type !== "object" && type !== "array") {
    jsonStr += colorize(type, obj);
  } else {
    jsonStr += "{\n";
    for (let k in obj) {
      let v = obj[k];
      let type = getValueType(v);
      let key = /^[a-z$_][a-z0-9$_]*$/i.test(k) ? k : JSON.stringify(k);
      jsonStr += indents + colorize("key", key) + ": ";
      if (type === "object" || type === "array")
        // recurse nested object/array
        jsonStr += formatJSON(v, indent + 1) + ",\n";
      else jsonStr += handleValue(type, v);
    }
    jsonStr = jsonStr.slice(0, -2) + "\n" + indents.slice(0, -2) + "}";
  }

  return jsonStr;
}
