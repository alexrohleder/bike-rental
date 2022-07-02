import { User } from "@prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { formatDate } from "../../../lib/date";
import nextEncode from "../../../lib/next-encode";
import prisma from "../../../lib/prisma";

type Props = User & {
  reservations: Array<{
    bike: {
      id: string;
      model: string;
      location: string;
    };
    id: string;
    date: Date;
    createdAt: Date;
  }>;
};

function AdminUser(props: Props) {
  return (
    <div>
      <Head>
        <title>User – Dashboard – BikeRental®</title>
      </Head>
      <h1>
        <span className="text-gray-500">
          <Link href="/admin">
            <a>Dashboard</a>
          </Link>
          {" · "}
          <Link href="/admin/users">
            <a>Users</a>
          </Link>
          {" · "}
        </span>
        {props.id}
      </h1>
      <dl className="mt-8">
        <div className="flex gap-2">
          <dt className="font-semibold">name</dt>
          <dd>{props.name}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">email</dt>
          <dd>{props.email}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">Role</dt>
          <dd>
            {
              {
                USER_ROLE_ADMIN: "Administrator",
                USER_ROLE_CLIENT: "Client",
                USER_ROLE_SUPER_ADMIN: "Super Administrator",
              }[props.role]
            }
          </dd>
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
                <th>Bike Model</th>
                <th>Bike Location</th>
                <th>Reservation Created At</th>
                <th>Reserved At</th>
              </tr>
            </thead>
            <tbody>
              {props.reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>
                    <Link href={`/admin/bikes/${reservation.bike.id}`}>
                      <a className="text-blue-600 hover:underline">
                        {reservation.bike.model}
                      </a>
                    </Link>
                  </td>
                  <td>{reservation.bike.location}</td>
                  <td>{formatDate(reservation.createdAt)}</td>
                  <td>{formatDate(reservation.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const user = await prisma.user.findUnique({
    where: {
      id: ctx.params!.id as string,
    },
    include: {
      reservations: {
        select: {
          date: true,
          createdAt: true,
        },
        include: {
          bike: {
            select: {
              id: true,
              model: true,
              location: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (user === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: nextEncode(user),
  };
};

export default AdminUser;
