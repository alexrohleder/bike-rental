import { useSession } from "next-auth/react";
import Link from "next/link";

function PageHeader() {
  return (
    <header className="flex justify-between py-4 custom-container">
      <b>BikeRental®</b>
      <nav className="flex gap-4">
        <PageHeaderLinks />
      </nav>
    </header>
  );
}

function PageHeaderLinks() {
  const session = useSession();

  if (session.status === "loading") {
    return null;
  }

  if (session.status === "unauthenticated") {
    return (
      <>
        <Link href="/api/auth/signin">
          <a>Sign In</a>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/admin">
        <a>Dashboard</a>
      </Link>
      <Link href="/api/auth/signout">
        <a>Sign Out</a>
      </Link>
    </>
  );
}

export default PageHeader;
