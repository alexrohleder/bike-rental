import { Bike } from "@prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { formatDate } from "../../../lib/date";
import nextEncode from "../../../lib/next-encode";
import prisma from "../../../lib/prisma";

type Props = Bike & {
  reservations: Array<{
    user: {
      id: string;
      name?: string;
      email: string;
    };
    id: string;
    start: string;
    end: string;
    createdAt: string;
  }>;
};

function AdminBike(props: Props) {
  return (
    <div>
      <Head>
        <title>Bike – Dashboard – BikeRental®</title>
      </Head>
      <h1>
        <span className="text-gray-500">
          <Link href="/admin">
            <a>Dashboard</a>
          </Link>
          {" · "}
          <Link href="/admin/bikes">
            <a>Bikes</a>
          </Link>
          {" · "}
        </span>
        {props.id}
      </h1>
      <dl className="mt-8">
        <div className="flex gap-2">
          <dt className="font-semibold">Model</dt>
          <dd>{props.model}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">Color</dt>
          <dd>{props.color}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">Location</dt>
          <dd>{props.location}</dd>
        </div>
      </dl>
      <h2 className="mt-8 mb-4">Reservations</h2>
      {props.reservations.length === 0 ? (
        <div>No reservations yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="table-fixed">
            <thead>
              <tr>
                <th>User</th>
                <th>Reserved At</th>
                <th>Reserved From</th>
                <th>Reserved To</th>
              </tr>
            </thead>
            <tbody>
              {props.reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <Link href={`/admin/users/${reservation.user.id}`}>
                      <a className="text-blue-600 hover:underline">
                        {reservation.user.name || reservation.user.email}
                      </a>
                    </Link>
                  </td>
                  <td>{formatDate(reservation.createdAt)}</td>
                  <td>{formatDate(reservation.start)}</td>
                  <td>{formatDate(reservation.end)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const bike = await prisma.bike.findUnique({
    where: {
      id: ctx.params!.id as string,
    },
    include: {
      reservations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (bike === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: nextEncode(bike),
  };
};

export default AdminBike;
