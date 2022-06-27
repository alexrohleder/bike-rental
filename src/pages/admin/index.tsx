import Link from "next/link";

function AdminIndex() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav className="mt-8">
        <ul>
          <li>
            <Link href="/admin/bikes">
              <a>Bikes</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminIndex;
