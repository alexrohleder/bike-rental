import Head from "next/head";
import Link from "next/link";

function AdminIndex() {
  return (
    <div>
      <Head>
        <title>Dashboard – BikeRental®</title>
      </Head>
      <h1>Dashboard</h1>
      <nav className="mt-8">
        <ul>
          <li>
            <Link href="/admin/bikes">
              <a>Bikes</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <a>Users</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminIndex;
