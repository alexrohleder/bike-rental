import api from "../../lib/api";
import prisma from "../../lib/prisma";
import { v, validate } from "../../lib/validation";

export default api().post(async (req, res) => {
  const data = validate(req.body, {
    userId: v.string(),
    bikeId: v.string(),
    date: v.timestamp(),
  });

  res.json(
    await prisma.bikeReservation.create({
      data: {
        date: data.date,
        bikeId: data.bikeId,
        userId: data.userId, // todo: use the session instead
      },
    })
  );
});
