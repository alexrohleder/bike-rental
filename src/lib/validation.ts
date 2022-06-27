import { z, ZodRawShape } from "zod";

// Make sure all strings are not empty
const string = () => z.string().min(1);

// Convert the HTML checkbox value to a boolean
const checkbox = () =>
  z
    .string()
    .regex(/^(on|off)$/)
    .transform((value) => value === "on");

export const v = {
  ...z,
  string,
  checkbox,
};

export const validate = <T extends ZodRawShape>(data: unknown, schema: T) =>
  v.object(schema).parse(data);
