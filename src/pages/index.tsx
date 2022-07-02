import { Bike } from "@prisma/client";
import type { NextPage } from "next";
import useSWRInfinite from "swr/infinite";
import repeat from "../lib/repeat";

const Home: NextPage = () => {
  const res = useSWRInfinite<Bike[]>((offset) => `/api/bikes?offset=${offset}`);
  const { data, isValidating, size, setSize } = res;

  return (
    <div>
      <div className="mt-8 table-wrapper">
        <table className="table-fixed">
          <thead>
            <tr>
              <th>Model</th>
              <th>Color</th>
              <th>Location</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {data?.flat(2).map((bike) => {
              const formId = `form-${bike.id}`;

              return (
                <tr key={bike.id}>
                  <td>
                    <input
                      type="text"
                      name="model"
                      form={formId}
                      defaultValue={bike.model}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="color"
                      form={formId}
                      defaultValue={bike.color}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="location"
                      form={formId}
                      defaultValue={bike.location}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      name="available"
                      form={formId}
                      defaultChecked={bike.available}
                    />
                  </td>
                </tr>
              );
            })}

            {!data &&
              isValidating &&
              repeat(
                10,
                <tr>
                  {repeat(
                    4,
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
