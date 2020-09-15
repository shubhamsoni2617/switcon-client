import React from "react";
import "./style.css";
import { NavLink, withRouter } from "react-router-dom";

const TopNav = ({ history }) => {
  return (
    <div className="topnav">
      <div className="left-nav">
        <NavLink to="/form">Form</NavLink>
        <NavLink to="/pending">Pending</NavLink>
        <NavLink to="/approved">Approved</NavLink>
        <NavLink to="/rejected">Rejected</NavLink>
        <NavLink to="/request">Request(for Approval)</NavLink>
      </div>
      <div className="right-nav">
        <NavLink to="/notifications">
          <img
            src={`${process.env.PUBLIC_URL}/bell.svg`}
            alt="notification-icon"
          />
        </NavLink>
        {history.location.pathname === "/signup" ||
        history.location.pathname === "/login" ? (
          <>
            {history.location.pathname === "/login" && (
              <NavLink className="auth" to="/signup">
                Signup
              </NavLink>
            )}
            {history.location.pathname === "/signup" && (
              <NavLink className="auth" to="/login">
                Login
              </NavLink>
            )}
          </>
        ) : (
          <span
            onClick={() => {
              sessionStorage.clear();
              history.push("/login");
            }}
          >
            Logout
          </span>
        )}
      </div>
    </div>
  );
};

export default withRouter(TopNav);
