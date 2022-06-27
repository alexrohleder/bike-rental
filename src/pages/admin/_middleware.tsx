import withAuth from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) =>
      token?.role === "USER_ROLE_ADMIN" ||
      token?.role === "USER_ROLE_SUPER_ADMIN",
  },
});
