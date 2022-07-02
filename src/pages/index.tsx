import { Bike } from "@prisma/client";
import type { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { formatDate } from "../lib/date";
import repeat from "../lib/repeat";

const Home: NextPage = () => {
  const [search, setSearch] = useState<Record<string, string | void>>({});

  const res = useSWRInfinite<Array<Bike & { reservation?: { end: string } }>>(
    (offset) =>
      `/api/bikes?offset=${offset}&${Object.entries(search)
        .filter(([, value]) => value)
        .map(([key, value]) => `&${key}=${value}`)
        .join("")}`
  );
  const { data, isValidating, size, setSize } = res;

  const handleSearch: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    setSearch({
      model: form.model.value,
      color: form.color.value,
      location: form.location.value,
      availability: form.availability.value
        ? new Date(form.availability.value).getTime().toString()
        : undefined,
      rating: form.rating.value,
    });
  };

  return (
    <div>
      <form className="flex gap-4 mt-8 mb-2" onSubmit={handleSearch}>
        <label className="flex-1">
          Model
          <input type="search" name="model" />
        </label>
        <label className="flex-1">
          Color
          <input type="search" name="color" />
        </label>
        <label className="flex-1">
          Location
          <input type="search" name="location" />
        </label>
        <label className="flex-1">
          Availability
          <input type="datetime-local" name="availability" />
        </label>
        <label className="flex-1">
          Rating
          <select name="rating">
            <option></option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn btn-blue">
            Search
          </button>
        </div>
      </form>
      <div className="mt table-wrapper">
        <table className="table-fixed">
          <thead>
            <tr>
              <th>Model</th>
              <th>Color</th>
              <th>Location</th>
              <th>Available</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data?.flat(2).map((bike) => (
              <tr key={bike.id}>
                <td>{bike.model}</td>
                <td>{bike.color}</td>
                <td>{bike.location}</td>
                <td>
                  {bike.reservation ? formatDate(bike.reservation.end) : "Now"}
                </td>
                <td>5/5</td>
              </tr>
            ))}

            {!data &&
              isValidating &&
              repeat(
                10,
                <tr>
                  {repeat(
                    5,
                    <td>
                      <div className="placeholder" />
                    </td>
                  )}
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-2">
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setSize(size + 1)}
        >
          Load more
        </button>

        {data && isValidating && (
          <p className="text-sm">Loading more data...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
