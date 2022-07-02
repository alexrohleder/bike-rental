import { User } from "@prisma/client";
import { toast } from "react-toastify";
import useSWRInfinite from "swr/infinite";
import DetachedForm from "../../components/DetachedForm";
import useSet from "../../hooks/useSet";
import repeat from "../../lib/repeat";
import { request } from "../../lib/web";

function AdminUsers() {
  const res = useSWRInfinite<User[]>((offset) => `/api/users?offset=${offset}`);
  const { data, isValidating, mutate: refetch, size, setSize } = res;

  // We use this to keep track of which buttons we need to disable
  const runningRequests = useSet();

  const handleUpdate = (
    user: User,
    event: React.FormEvent<HTMLFormElement>
  ) => {
    const form = event.currentTarget;

    runningRequests.add(user.id);

    toast
      .promise(
        request("put", "/api/users", {
          id: user.id,
          name: form.displayName.value,
          email: form.email.value,
          role: form.role.value,
        }),
        {
          pending: "Updating user...",
          success: "User updated!",
          error: "Error updating user 😢",
        }
      )
      .then(() => {
        refetch();
      })
      .finally(() => {
        runningRequests.remove(user.id);
      });
  };

  const handleDelete = (user: User) => {
    runningRequests.add(user.id);

    toast
      .promise(
        request("delete", "/api/users", {
          id: user.id,
        }),
        {
          pending: "Deleting user...",
          success: "User deleted!",
          error: "Error deleting user 😢",
        }
      )
      .then(() => {
        refetch();
      })
      .finally(() => {
        runningRequests.remove(user.id);
      });
  };

  return (
    <div>
      <h1>
        <span className="text-gray-500">Dashboard ·</span> Users
      </h1>
      <div className="mt-8 table-wrapper">
        <table className="table-fixed">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.flat(2).map((user) => {
              const formId = `form-${user.id}`;

              return (
                <tr key={user.id}>
                  <td>
                    <input
                      type="text"
                      name="displayName"
                      form={formId}
                      defaultValue={user.name || ""}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      form={formId}
                      defaultValue={user.email || ""}
                    />
                  </td>
                  <td>
                    <select name="role" defaultValue={user.role} required>
                      <option value="USER_ROLE_ADMIN">Admin</option>
                      <option value="USER_ROLE_CLIENT">Client</option>
                    </select>
                  </td>
                  <td tabIndex={-1} className="focus-within:outline-0">
                    <fieldset disabled={runningRequests.includes(user.id)}>
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
                        onClick={() => handleDelete(user)}
                      >
                        Delete
                      </button>
                    </fieldset>
                  </td>

                  <DetachedForm
                    id={formId}
                    onSubmit={(event) => handleUpdate(user, event)}
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

export default AdminUsers;
