import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ user, children }) => {
  if (!user || user.role !== "customer") {
    return <NotFound />;
  }
  return children;
};

export default ProtectedRoute;
