import { Bike } from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { toast } from "react-toastify";
import nextEncode from "../../lib/next-encode";
import prisma from "../../lib/prisma";
import { request } from "../../lib/web";

type Props = {
  bike: Bike;
};

function Reserve(props: Props) {
  const session = useSession();
  const router = useRouter();
  const [available, setAvailability] = useState(!props.bike.available);

  const handleReserve: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    toast
      .promise(
        request("post", "/api/reserve", {
          userId: session.data!.user.id,
          bikeId: router.query.bikeId,
          date: new Date(event.currentTarget.reservation.value)
            .getTime()
            .toString(),
        }),
        {
          pending: "Reserving bike...",
          success: "Bike reserved!",
          error: "Error reserving bike 😢",
        }
      )
      .then(() => {
        setAvailability(true);
      });
  };

  return (
    <div>
      <dl className="my-8">
        <div className="flex gap-2">
          <dt className="font-semibold">Model</dt>
          <dd>{props.bike.model}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">Color</dt>
          <dd>{props.bike.color}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">Location</dt>
          <dd>{props.bike.location}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-semibold">Available</dt>
          <dd>{props.bike.available ? "Yes" : "No"}</dd>
        </div>
      </dl>
      {session.status === "authenticated" ? (
        <form onSubmit={handleReserve}>
          <fieldset className="flex gap-4" disabled={available}>
            <label>
              Date of Reservation
              <input
                type="date"
                name="reservation"
                defaultValue={new Date().toISOString().substring(0, 10)}
                min={new Date().toISOString().substring(0, 10)}
                autoFocus
              />
            </label>
            <div className="flex items-end">
              <button type="submit" className="btn btn-blue">
                Reserve
              </button>
            </div>
          </fieldset>
          {!props.bike.available && (
            <p className="mt-4">This bike is not available at the moment.</p>
          )}
        </form>
      ) : (
        <div>
          <p>You must be logged in to reserve a bike</p>
          <p>
            <Link href={`/api/auth/signin?callbackUrl=${router.asPath}`}>
              <a className="text-blue-600 hover:underline">
                Sign in or create a new account
              </a>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const bike = await prisma.bike.findUnique({
    where: {
      id: ctx.params!.bikeId as string,
    },
  });

  if (bike === null) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      bike: nextEncode(bike),
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default Reserve;
