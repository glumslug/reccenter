import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import userAuth from "../hooks/userAuth";

const Login = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email!");
      return;
    }
    if (!password) {
      toast.error("Please enter a password!");
      return;
    }

    const userData = {
      email,
      password,
    };
    const login = await userAuth.login(userData);

    if (login.code === "ERR_BAD_REQUEST") {
      toast.error(login.response.data);
      return;
    }
    dispatch({ type: "LOGIN", payload: login });
  };

  return (
    <div className="body">
      <div className="form">
        <div className="title">Login</div>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
          />
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter a password"
          />
          <div className="forgot-password">
            <p onClick={() => navigate("/forgot-password")}>Forgot password</p>{" "}
          </div>

          <input type="submit" value="Go" id="submit" />
        </form>
      </div>
      <div className="form">
        <form action="">
          <div className="title">Don't have an account?</div>
          <button
            style={{ backgroundColor: "pink" }}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
