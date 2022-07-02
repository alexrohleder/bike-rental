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
      await prisma.bikeReservation.findMany({
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
      date: v.timestamp(),
    });

    const previousReservation = await prisma.bikeReservation.findFirst({
      where: {
        bikeId: data.bikeId,
        date: data.date,
      },
    });

    if (previousReservation) {
      return res.status(400).json({
        status: 400,
        message: "Bad Request",
      });
    }

    res.json(
      await prisma.bikeReservation.create({
        data: {
          bikeId: data.bikeId,
          date: data.date,
          userId: data.userId, // todo: use the session instead
        },
      })
    );
  })
  .delete(async (req, res) => {
    const data = validate(req.body, {
      userId: v.string(),
      bikeId: v.string(),
      date: v.timestamp(),
    });

    const reservation = await prisma.bikeReservation.findFirst({
      where: {
        bikeId: data.bikeId,
        date: data.date,
        userId: data.userId, // todo: use the session instead
      },
    });

    if (!reservation) {
      return res.status(404).json({
        status: 404,
        message: "Not Found",
      });
    }

    res.json(
      await prisma.bikeReservation.delete({
        where: {
          id: reservation.id,
        },
      })
    );
  });
