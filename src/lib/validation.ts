import { z, ZodRawShape } from "zod";

// Make sure all strings are not empty
const string = () => z.string().min(1);

// Convert the HTML checkbox value to a boolean
const checkbox = () =>
  z
    .string()
    .regex(/^(on|off)$/)
    .transform((value) => value === "on");

// Convert the strings with numbers to actual numbers. Useful for query strings.
const numeric = () =>
  z
    .string()
    .regex(/^[\d]+$/)
    .transform((value) => parseInt(value, 10));

const timestamp = () => numeric().transform((value) => new Date(value));

export const v = {
  ...z,
  string,
  numeric,
  timestamp,
  checkbox,
};

export const validate = <T extends ZodRawShape>(data: unknown, schema: T) =>
  v.object(schema).parse(data);
