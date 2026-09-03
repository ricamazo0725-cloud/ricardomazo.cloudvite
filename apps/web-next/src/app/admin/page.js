import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboardScreen from "@/screens/AdminDashboardScreen";

export const metadata = {
  title: "Panel admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminDashboardScreen />
    </ProtectedRoute>
  );
}
