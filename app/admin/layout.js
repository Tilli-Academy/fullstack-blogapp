import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-[calc(100vh-57px)]">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
