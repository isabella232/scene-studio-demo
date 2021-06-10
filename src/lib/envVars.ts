export function getBool(name: string, defaultValue?: boolean): boolean {
  return getValue(name, defaultValue, (v) => v === "true");
}

export function getString(name: string, defaultValue?: string): string {
  return getValue(name, defaultValue, (v) => v);
}

export function getInt(name: string, defaultValue?: number): number {
  return getValue(name, defaultValue, (v) => parseInt(v));
}

export function getFloat(name: string, defaultValue?: number): number {
  return getValue(name, defaultValue, (v) => parseFloat(v));
}

export function getValue<T>(
  name: string,
  defaultValue: T | undefined,
  parse: (value: string) => T
): T {
  const value = process.env[name];
  if (value != null) {
    return parse(value);
  } else if (defaultValue != null) {
    return defaultValue;
  } else {
    throw new Error(`Missing environment variable '${name}'`);
  }
}
