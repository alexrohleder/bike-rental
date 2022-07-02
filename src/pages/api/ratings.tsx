import api from "../../lib/api";
import prisma from "../../lib/prisma";
import { v, validate } from "../../lib/validation";

export default api()
  .get(async (req, res) => {
    const query = validate(req.query, {
      bikeId: v.string(),
      userId: v.string(),
    });

    res.json(
      await prisma.bikeRating.findFirst({
        where: {
          bikeId: query.bikeId,
          userId: query.userId, // todo: use the session instead
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );
  })
  .post(async (req, res) => {
    const data = validate(req.body, {
      userId: v.string(),
      bikeId: v.string(),
      rating: v.number(),
    });

    const previousReservation = await prisma.bikeRating.findFirst({
      where: {
        bikeId: data.bikeId,
        rating: data.rating,
      },
    });

    if (previousReservation) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }

    res.json(
      await prisma.bikeRating.create({
        data: {
          bikeId: data.bikeId,
          rating: data.rating,
          userId: data.userId, // todo: use the session instead
        },
      })
    );
  });
