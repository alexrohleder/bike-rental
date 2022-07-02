import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

function PageHeader() {
  return (
    <header className="flex justify-between py-4 custom-container">
      <Link href="/">
        <a>
          <b>BikeRental®</b>
        </a>
      </Link>
      <nav className="flex gap-4">
        <PageHeaderLinks />
      </nav>
    </header>
  );
}

function PageHeaderLinks() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return null;
  }

  if (session.status === "unauthenticated") {
    return (
      <>
        <Link href={`/api/auth/signin?callbackUrl=${router.asPath}`}>
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
      <Link href={`/api/auth/signout?callbackUrl=${router.asPath}`}>
        <a>Sign Out</a>
      </Link>
    </>
  );
}

export default PageHeader;
