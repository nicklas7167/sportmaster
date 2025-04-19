import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { UserRole } from "@shared/schema";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  requireRole?: UserRole;
}

export function ProtectedRoute({
  path,
  component: Component,
  requireRole,
}: ProtectedRouteProps) {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-accent-400" />
        </div>
      </Route>
    );
  }

  // If not logged in, redirect to auth page
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If specific role is required, check it
  if (requireRole && user.role !== requireRole) {
    // Special case for admin pages - only admins can access
    if (requireRole === "admin" && !isAdmin) {
      return (
        <Route path={path}>
          <Redirect to="/" />
        </Route>
      );
    }
    
    // For premium required pages, redirect to profile to upgrade
    if (requireRole === "premium" && user.role === "free") {
      return (
        <Route path={path}>
          <Redirect to="/profile" />
        </Route>
      );
    }
  }

  return <Route path={path} component={Component} />;
}
