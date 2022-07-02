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
        <ul className="list-disc">
          <li>
            <Link href="/admin/bikes">
              <a>Manage Bikes</a>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <a>Manage Users</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminIndex;
