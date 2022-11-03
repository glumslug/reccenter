import React from "react";
import "./styles/style.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//pages & components
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UpdateAccount from "./pages/UpdateAccount";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UpdateBoard from "./pages/UpdateBoard";
import ManageGroups from "./pages/ManageGroups";
import ProtectedRoutes from "./ProtectedRoutes";
import EditGroup from "./pages/EditGroup";
import CreateGroup from "./pages/CreateGroup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SelectActivity from "./pages/SelectActivity";
import Friends from "./pages/Friends";
import FrontPage from "./pages/FrontPage";

function App() {
  const { UserProtected, BoardProtected, NoBoard } = ProtectedRoutes;

  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Unprotected Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<FrontPage />} />
          {/* Protected Routes */}
          <Route element={<UserProtected />}>
            <Route path="/select-activity" element={<SelectActivity />} />
            <Route path="/update-account" element={<UpdateAccount />} />
            {/* Only available if there ISN"T a board */}
            <Route element={<NoBoard />}>
              <Route
                path="/select-activity/:message"
                element={<SelectActivity />}
              />
            </Route>
            {/* Only accessible if there is a board */}
            <Route element={<BoardProtected />}>
              <Route path="/home" element={<Home />} />
              <Route path="/update-board/:boardId" element={<UpdateBoard />} />
              <Route path="/manage-groups/" element={<ManageGroups />} />
              <Route path="/friends/" element={<Friends />} />
              <Route path="/create-group/" element={<CreateGroup />} />
              <Route path="/edit-group/:groupId/" element={<EditGroup />} />
              <Route
                path="/edit-group/:groupId/:success"
                element={<EditGroup />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
      <footer>
        {" "}
        <small>&copy; Copyright 2022, Eli Ferster</small>{" "}
      </footer>
    </div>
  );
}

export default App;
