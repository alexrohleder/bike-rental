import { UserRole } from "@prisma/client";
import api from "../../lib/api";
import prisma from "../../lib/prisma";
import { v, validate } from "../../lib/validation";

export default api()
  .get(async (req, res) => {
    res.json(
      await prisma.user.findMany({
        skip: Number(req.query.offset) * 10,
        take: 10,
      })
    );
  })
  .post(async (req, res) => {
    const data = validate(req.body, {
      name: v.string(),
      email: v.string(),
      role: v.nativeEnum(UserRole),
    });

    res.json(await prisma.user.create({ data }));
  })
  .put(async (req, res) => {
    const data = validate(req.body, {
      id: v.string(),
      name: v.string(),
      email: v.string(),
      role: v.nativeEnum(UserRole),
    });

    res.json(await prisma.user.update({ where: { id: data.id }, data }));
  })
  .delete(async (req, res) => {
    const data = validate(req.body, {
      id: v.string(),
    });

    res.json(await prisma.user.delete({ where: { id: data.id } }));
  });
