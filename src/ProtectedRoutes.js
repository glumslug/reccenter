import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";

const UserProtected = () => {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/login" />;
};

const BoardProtected = () => {
  const { user } = useContext(AuthContext);
  const board = user?.boards[0] || null;
  console.log(board);

  return board ? <Outlet /> : <Navigate to="/select-activity/no-board" />;
};

const NoBoard = () => {
  const { user } = useContext(AuthContext);
  const board = user?.boards[0] || null;
  console.log(board);

  return board ? <Navigate to="/home" /> : <Outlet />;
};

const ProtectedRoutes = {
  UserProtected,
  BoardProtected,
  NoBoard,
};

export default ProtectedRoutes;
