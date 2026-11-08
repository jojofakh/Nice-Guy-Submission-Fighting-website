import type { ReactNode } from "react";
import { usePathname } from "@/lib/router";
import SiteLayout from "@/pages/site/SiteLayout";
import HomePage from "@/pages/site/HomePage";
import ClassesPage from "@/pages/site/ClassesPage";
import SchedulePage from "@/pages/site/SchedulePage";
import PricingPage from "@/pages/site/PricingPage";
import ContactPage from "@/pages/site/ContactPage";
import CheckoutPage from "@/pages/site/CheckoutPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import MemberLayout from "@/pages/member/MemberLayout";
import DashboardPage from "@/pages/member/DashboardPage";
import MemberSchedulePage from "@/pages/member/MemberSchedulePage";
import MemberAnnouncementsPage from "@/pages/member/MemberAnnouncementsPage";
import MyAttendancePage from "@/pages/member/MyAttendancePage";
import MyProfilePage from "@/pages/member/MyProfilePage";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminOverviewPage from "@/pages/admin/AdminOverviewPage";
import ManageClassesPage from "@/pages/admin/ManageClassesPage";
import NewClassPage from "@/pages/admin/NewClassPage";
import EditClassPage from "@/pages/admin/EditClassPage";
import ManageAnnouncementsPage from "@/pages/admin/ManageAnnouncementsPage";
import RecordAttendancePage from "@/pages/admin/RecordAttendancePage";
import NotFoundPage from "@/pages/NotFoundPage";

/** Public marketing pages, wrapped in the site header and footer. */
const sitePages: Record<string, () => ReactNode> = {
  "/": HomePage,
  "/classes": ClassesPage,
  "/schedule": SchedulePage,
  "/pricing": PricingPage,
  "/contact": ContactPage,
  "/checkout": CheckoutPage,
};

/** Sign-in screens: full-page split layout, no header. */
const authPages: Record<string, () => ReactNode> = {
  "/login": LoginPage,
  "/register": RegisterPage,
  "/forgot-password": ForgotPasswordPage,
  "/reset-password": ResetPasswordPage,
};

/** Member portal, behind <RequireUser>. */
const memberPages: Record<string, () => ReactNode> = {
  "/dashboard": DashboardPage,
  "/dashboard/schedule": MemberSchedulePage,
  "/dashboard/announcements": MemberAnnouncementsPage,
  "/dashboard/attendance": MyAttendancePage,
  "/dashboard/profile": MyProfilePage,
};

/** Admin portal, behind <RequireAdmin>. */
const adminPages: Record<string, () => ReactNode> = {
  "/admin": AdminOverviewPage,
  "/admin/classes": ManageClassesPage,
  "/admin/classes/new": NewClassPage,
  "/admin/announcements": ManageAnnouncementsPage,
  "/admin/attendance": RecordAttendancePage,
};

/**
 * Picks the screen for the current path (conditional rendering on router
 * state). The `key` on each page resets its local state when the path changes.
 */
export default function App() {
  const pathname = usePathname().replace(/(.)\/$/, "$1");

  const SitePage = sitePages[pathname];
  if (SitePage) return <SiteLayout><SitePage key={pathname} /></SiteLayout>;

  const AuthPage = authPages[pathname];
  if (AuthPage) return <AuthPage key={pathname} />;

  const MemberPage = memberPages[pathname];
  if (MemberPage) return <MemberLayout><MemberPage key={pathname} /></MemberLayout>;

  const AdminPage = adminPages[pathname];
  if (AdminPage) return <AdminLayout><AdminPage key={pathname} /></AdminLayout>;

  const editClass = pathname.match(/^\/admin\/classes\/([\w-]+)$/);
  if (editClass) return <AdminLayout><EditClassPage key={pathname} id={editClass[1]} /></AdminLayout>;

  return <NotFoundPage />;
}
