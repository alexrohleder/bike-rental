export const request = (
  method: "post" | "delete" | "put" | "get",
  url: string,
  body?: Record<string, any>
) =>
  fetch(url, {
    method,
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return { data, error: null };
    }

    const error = await res.json();
    throw new Error(error.message);
  });
