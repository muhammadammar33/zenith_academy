import { redirect } from "next/navigation";
import AdminLoginForm from "../../../components/admin/AdminLoginForm";
import { getAdminSession } from "../../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <p className="eyebrow">Secure administration</p>
        <h1>Sign in to Zenith Academy.</h1>
        <p>Manage courses, domains, registrations, media, and site settings.</p>
        <AdminLoginForm />
      </section>
    </main>
  );
}
