import React, { useState } from "react";
import "../style.css";
import { withRouter, Link } from "react-router-dom";
import makeToast from "../../../Toaster";
import LoaderModal from "../../../loader-modal/LoaderModal";
import { Axios } from "../../../utils";

const LoginPage = ({ history, dispatch, setupSocket }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = () => {
    setLoading(true);
    Axios.post("/login", {
      email,
      password,
    })
      .then((response) => {
        makeToast("success", response.data.message);
        console.log(2222, response.data);
        dispatch({
          type: "SET_USER_DATA",
          payload: response.data,
        });
        setLoading(false);

        sessionStorage.setItem("CC_Token", response.data.token);
        history.push("/form");
        setupSocket();
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          setLoading(false);
        makeToast("error", err.response.data.message);
      });
  };

  return (
    <div className="card">
      <LoaderModal isLoading={loading} />
      <div className="cardHeader">Login</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="abc@example.com"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Your Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button onClick={loginUser}>Login</button>
      </div>
      <Link to="/signup">Signup Instead</Link>
    </div>
  );
};

export default withRouter(LoginPage);
