import { NextApiRequest, NextApiResponse } from "next";
import connect from "next-connect";
import { ZodError } from "zod";

const api = () => {
  const handler = connect<NextApiRequest, NextApiResponse>({
    onError(err, _req, res) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          message: "Bad Request",
          errors: err.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }

      console.error(err);

      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    },
  });

  handler.use((_req, res, next) => {
    res.json = (body) =>
      res
        .setHeader("Content-Type", "application/json")
        .send(JSON.stringify(body, null, 2));

    next();
  });

  return handler;
};

export default api;
