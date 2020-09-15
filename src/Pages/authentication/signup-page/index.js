import React, { useState } from "react";
import makeToast from "../../../Toaster";
import "../style.css";
import { Link, useHistory } from "react-router-dom";
import io from "socket.io-client";
import LoaderModal from "../../../loader-modal/LoaderModal";
import { Axios } from "../../../utils";

const SignupPage = ({ socket }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Department 1");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const registerUser = async () => {
    try {
      setLoading(true);
      const response = await Axios.post("/register", {
        username,
        email,
        password,
        department,
      });
      io("http://localhost:8000", {
        query: {
          username,
          department,
          approverId: response.data.approverId,
        },
      });
      setLoading(false);
      makeToast("success", response.data.message);
      history.push("/login");
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setLoading(false);

        makeToast("error", err.response.data.message);
      }
    }
  };

  return (
    <div className="card">
      <LoaderModal isLoading={loading} />
      <div className="cardHeader">Singup</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            value={username}
            onChange={({ target }) => setUserName(target.value)}
          />
        </div>
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

      <div className="inputGroup">
        <p className="department-label" htmlFor="department">
          Department
        </p>
        <select
          value={department}
          placeholder="select"
          onChange={({ target }) => setDepartment(target.value)}
        >
          {["Department 1", "Department 2"].map((dep) => (
            <option key={dep} value={dep}>
              {dep}
            </option>
          ))}
        </select>
      </div>
      <button onClick={registerUser}>Register</button>
      <Link to="/login">Login Instead</Link>
    </div>
  );
};

export default SignupPage;
