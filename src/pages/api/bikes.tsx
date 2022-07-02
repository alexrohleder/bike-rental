import api from "../../lib/api";
import { formatDate } from "../../lib/date";
import prisma from "../../lib/prisma";
import { v, validate } from "../../lib/validation";

export default api()
  .get(async (req, res) => {
    const query = validate(req.query, {
      offset: v.numeric(),
      model: v.string().optional(),
      color: v.string().optional(),
      location: v.string().optional(),
      available: v.checkbox().optional(),
      availability: v.timestamp().optional(),
      rating: v.numeric().optional(),
    });

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const pageSize = 10;
    const offset = query.offset * pageSize;

    // todo: Not optimal to fetch everything all the time. But it's a demo.
    const bikes = await prisma.bike.findMany({
      where: {
        model: query.model,
        color: query.color,
        location: query.location,
        available: query.available,
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
        ratings: true,
        reservations: {
          where: {
            date: {
              gte: today,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(
      bikes
        .map((bike) => {
          const rating = bike.ratings.length
            ? Math.round(
                bike.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                  bike.ratings.length
              )
            : null;

          let nextAvailability = new Date(today);

          while (
            bike.reservations.some(
              (reservation) =>
                reservation.date.getTime() === nextAvailability.getTime()
            )
          ) {
            nextAvailability.setDate(nextAvailability.getDate() + 1);
          }

          return {
            ...bike,
            ratings: undefined,
            reservations: undefined,
            rating,
            nextAvailability:
              bike.available && nextAvailability
                ? formatDate(nextAvailability)
                : "Unavailable",
          };
        })
        .filter((bike) => {
          if (query.rating) {
            if (bike.rating === null || bike.rating < query.rating) {
              return false;
            }
          }

          return true;
        })
        .splice(offset, pageSize)
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
