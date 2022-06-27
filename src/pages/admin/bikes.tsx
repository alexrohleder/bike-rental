import { Bike } from "@prisma/client";
import { toast } from "react-toastify";
import useSWRInfinite from "swr/infinite";
import EmptyForm from "../../components/EmptyForm";
import useSet from "../../hooks/useSet";
import repeat from "../../lib/repeat";
import { request } from "../../lib/web";

function AdminBikes() {
  const res = useSWRInfinite<Bike[]>((offset) => `/api/bikes?offset=${offset}`);
  const { data, isValidating, mutate: refetch, size, setSize } = res;

  // We use this to keep track of which buttons we need to disable
  const runningRequests = useSet();

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;

    runningRequests.add("create");

    toast
      .promise(
        request("post", "/api/bikes", {
          model: form.model.value,
          color: form.color.value,
          location: form.location.value,
          available: form.available.checked,
        }),
        {
          pending: "Creating bike...",
          success: "Bike created!",
          error: "Error creating bike 😢",
        }
      )
      .then(() => {
        refetch();
      })
      .then(() => {
        form.reset();
        form.model.focus();
      })
      .finally(() => {
        runningRequests.remove("create");
      });
  };

  const handleUpdate = (
    bike: Bike,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const form = event.currentTarget;

    runningRequests.add(bike.id);

    toast
      .promise(
        request("put", "/api/bikes", {
          id: bike.id,
          model: form.model.value,
          color: form.color.value,
          location: form.location.value,
          available: form.available.checked,
        }),
        {
          pending: "Updating bike...",
          success: "Bike updated!",
          error: "Error updating bike 😢",
        }
      )
      .then(() => {
        refetch();
      })
      .finally(() => {
        runningRequests.remove(bike.id);
      });
  };

  const handleDelete = (bike: Bike) => {
    runningRequests.add(bike.id);

    toast
      .promise(
        request("delete", "/api/bikes", {
          id: bike.id,
        }),
        {
          pending: "Deleting bike...",
          success: "Bike deleted!",
          error: "Error deleting bike 😢",
        }
      )
      .then(() => {
        refetch();
      })
      .finally(() => {
        runningRequests.remove(bike.id);
      });
  };

  return (
    <div>
      <h1>Bikes</h1>
      <div className="mt-8 table-wrapper">
        <table className="table-fixed">
          <thead>
            <tr>
              <th>Model</th>
              <th>Color</th>
              <th>Location</th>
              <th>Available</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-blue-50">
              <td>
                <input
                  type="text"
                  name="model"
                  form="form-create-bike"
                  placeholder="Kawasaki Ninja H2"
                  required
                  autoFocus
                />
              </td>
              <td>
                <input
                  type="text"
                  name="color"
                  form="form-create-bike"
                  placeholder="Black"
                  required
                />
              </td>
              <td>
                <input
                  type="text"
                  name="location"
                  form="form-create-bike"
                  placeholder="Grilstadvegen 3"
                  required
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  name="available"
                  form="form-create-bike"
                  defaultChecked
                />
              </td>
              <td tabIndex={-1} className="focus-within:outline-none">
                <button
                  type="submit"
                  form="form-create-bike"
                  className="btn-sm btn-blue"
                  disabled={runningRequests.includes("create")}
                >
                  Create
                </button>
              </td>

              <EmptyForm id="form-create-bike" onSubmit={handleCreate} />
            </tr>

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
                  <td tabIndex={-1} className="focus-within:outline-none">
                    <fieldset disabled={runningRequests.includes(bike.id)}>
                      <button
                        type="submit"
                        form={formId}
                        className="mr-1 btn-sm"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn-sm btn-red"
                        onClick={() => handleDelete(bike)}
                      >
                        Delete
                      </button>
                    </fieldset>
                  </td>

                  <EmptyForm
                    id={formId}
                    onSubmit={(event) => handleUpdate(bike, event)}
                  />
                </tr>
              );
            })}

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
}

export default AdminBikes;
