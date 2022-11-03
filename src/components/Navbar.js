import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import userAuth from "../hooks/userAuth";
import io from "socket.io-client";
const socket = io();

function Navbar() {
  const { user, dispatch } = useContext(AuthContext);
  const [notifications, setNotifications] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [menuStyle, setMenuStyle] = useState("header-menu-off");

  const contextRefresh = async () => {
    console.log(user._id);
    const resp = await userAuth.refresh(user._id);
    console.log("This is the new payload: ", resp);
    dispatch({ type: "RESET", payload: resp });
  };

  // socket
  useEffect(() => {
    if (user?.boards) {
      socket.emit("join", user.boards[0]._id);
      user.boards[0].adminGroups.map((group) => {
        socket.emit("join", group._id);
      });
    }

    socket.on("receive-push", (message) => {
      contextRefresh();
      console.log(message.message);
    });
  }, []);
  const onLogout = () => {
    toggleMenu();
    dispatch({ type: "LOGOUT" });
  };
  const toggleMenu = () => {
    console.log(toggle);
    if (!toggle) {
      setMenuStyle("header-menu-on");
    } else {
      setMenuStyle("header-menu-off");
    }
    setToggle(!toggle);
  };
  const toggleOff = () => {
    setMenuStyle("header-menu-off");
    setToggle(false);
  };
  useEffect(() => {
    let count = 0;
    let gCount = 0;
    let fCount = 0;
    let aCount = 0;
    if (user?.boards[0]) {
      fCount = user?.boards[0]?.friendRequests.length;
    }
    if (user?.boards[0]) {
      gCount = user?.boards[0]?.groupInvites.length;
    }
    if (user?.boards[0]) {
      user?.boards[0]?.adminGroups.forEach((group) => {
        aCount = aCount + group.requests.length;
      });
      console.log(aCount);
    }
    count = gCount + fCount + aCount;
    setNotifications({
      count: count,
      invites: gCount + aCount,
      requests: fCount,
    });
  }, [user]);
  return (
    <div className="header">
      {toggle && <div className="backdrop" onClick={() => toggleOff()}></div>}
      <div className="header-main">
        <Link to="/home">
          <h1>Rec Center</h1>
        </Link>

        <div className="hamburger-icon" onClick={() => toggleMenu()}></div>
        {notifications.count !== 0 && (
          <div className="notification">{notifications.count}</div>
        )}
      </div>
      <div className={menuStyle}>
        <ul>
          {user ? (
            <>
              <li>
                <Link to="/home" onClick={() => toggleMenu()}>
                  <p>Home</p>
                </Link>
              </li>
              <li>
                <Link to="/update-account" onClick={() => toggleMenu()}>
                  <p>Account</p>
                </Link>
              </li>
              <li>
                <Link to="/manage-groups" onClick={() => toggleMenu()}>
                  <p>Groups</p>
                </Link>
                {notifications.invites !== 0 && (
                  <div className="gNotification">{notifications.invites}</div>
                )}
              </li>
              <li>
                <Link to="/friends" onClick={() => toggleMenu()}>
                  <p>Friends</p>
                </Link>
                {notifications.requests !== 0 && (
                  <div className="fNotification">{notifications.requests}</div>
                )}
              </li>
              <li>
                <Link to="/select-activity" onClick={() => toggleMenu()}>
                  <p>Activities</p>
                </Link>
              </li>
              <li>
                <p onClick={onLogout}>Logout</p>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/register" onClick={() => toggleMenu()}>
                  <p>Register</p>
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => toggleMenu()}>
                  <p>Login</p>
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => toggleMenu()}>
                  <p>About</p>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
