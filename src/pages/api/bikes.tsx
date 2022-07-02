import api from "../../lib/api";
import prisma from "../../lib/prisma";
import { v, validate } from "../../lib/validation";

export default api()
  .get(async (req, res) => {
    const query = validate(req.query, {
      model: v.string().optional(),
      color: v.string().optional(),
      location: v.string().optional(),
      availability: v.timestamp().optional(),
      rating: v.numeric().optional(),
    });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    res.json(
      await prisma.bike.findMany({
        skip: Number(req.query.offset) * 10,
        take: 10,
        where: {
          model: query.model,
          color: query.color,
          location: query.location,
          reservations: query.availability
            ? {
                some: {
                  date: {
                    equals: query.availability,
                  },
                },
              }
            : undefined,
        },
        include: {
          reservations: {
            select: {
              date: true,
            },
            where: {
              date: {
                equals: today,
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );
  })
  .post(async (req, res) => {
    const data = validate(req.body, {
      model: v.string(),
      color: v.string(),
      location: v.string(),
      available: v.boolean(),
    });

    res.json(await prisma.bike.create({ data }));
  })
  .put(async (req, res) => {
    const data = validate(req.body, {
      id: v.string(),
      model: v.string(),
      color: v.string(),
      location: v.string(),
      available: v.boolean(),
    });

    res.json(await prisma.bike.update({ where: { id: data.id }, data }));
  })
  .delete(async (req, res) => {
    const data = validate(req.body, {
      id: v.string(),
    });

    res.json(await prisma.bike.delete({ where: { id: data.id } }));
  });
