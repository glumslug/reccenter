import React from "react";
import { useNavigate } from "react-router-dom";
import front from "../images/demo9s.gif";

const FrontPage = () => {
  const navigate = useNavigate();
  return (
    <div className="body">
      <div className="front-title">
        <p>Get together, easy.</p>
      </div>
      <div className="slider">
        <img className="front" src={front} alt="" />
        <div className="blurb">
          <p>
            <span>REC CENTER</span> helps you
            <span> coordinate</span> schedules with your friends.
          </p>
          <p>
            Find time for your favorite
            <span> activities</span>.
          </p>
          <p>
            Less time in group chats, more time <span>having fun</span>.
          </p>
        </div>
      </div>
      <div className="cta">
        <button onClick={() => navigate("/register")}>Get Started</button>
      </div>
    </div>
  );
};

export default FrontPage;
