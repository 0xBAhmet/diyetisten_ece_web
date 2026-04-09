import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-anthracite-900 mb-6">Admin Paneli</h1>
      <p className="text-lg text-anthracite-600">
        Sitenizin dinamik kısımlarını yönetmek için sol menüyü kullanabilirsiniz.
      </p>
    </div>
  );
}
