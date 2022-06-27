import api from "../../lib/api";
import prisma from "../../lib/prisma";
import { v, validate } from "../../lib/validation";

export default api()
  .get(async (req, res) => {
    res.json(
      await prisma.bike.findMany({
        skip: Number(req.query.offset) * 10,
        take: 10,
        include: {
          _count: {
            select: {
              reservations: true,
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
