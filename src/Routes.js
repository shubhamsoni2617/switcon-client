import React, { useState, useEffect, useReducer } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import io from "socket.io-client";
import makeToast from "./Toaster";
import LoginPage from "./Pages/authentication/login-page";
import FormPage from "./Pages/form-page";
import PrivateRoute from "./PrivateRoute";
import SignupPage from "./Pages/authentication/signup-page";
import { getToken, Axios } from "./utils";
import { reducer, initialState } from "./reducer";
import PendingPage from "./Pages/user-form-status/Pending";
import ApprovedPage from "./Pages/user-form-status/Approved";
import RejectedPage from "./Pages/user-form-status/Rejected";
import ApprovalRequest from "./Pages/approval-request";
import Notifications from "./Pages/notifications";
import LoaderModal from "./loader-modal/LoaderModal";

const Routes = () => {
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);
  const setupSocket = () => {
    if (!socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: getToken(),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        // makeToast("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        // makeToast("success", "Socket Connected!");
      });
      setSocket(newSocket);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!getToken()) return;
      try {
        setLoading(true);
        const response = await Axios.get("/userdata", {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        });

        dispatch({
          type: "SET_USER_DATA",
          payload: response.data,
        });
        setupSocket();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(111, history.location.pathname);
        sessionStorage.clear();
        if (
          history.location.pathname === "/login" ||
          history.location.pathname === "/signup"
        )
          return;
        makeToast("error", "User not authenticated");
        history.push("/login");
      }
    };
    fetchUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("approvalDepartment", (payload) => {
        dispatch({
          type: "UPDATE_APPROVAL_REQUESTS",
          payload,
        });
      });

      socket.on("stateUpdated", (payload) => {
        dispatch({
          type: "UPDATE_USER_FORMS",
          payload,
        });
      });

      socket.on("notification", (payload) => {
        dispatch({
          type: "UPDATE_NOTIFICATIONS",
          payload,
        });
        makeToast("info", "New Notification");
      });

      socket.on("newUser", (payload) => {
        makeToast("info", "New user registered");
        dispatch({
          type: "UPDATE_OTHER_DEPARTMENT_USER",
          payload,
        });
      });
    }
  }, [socket]);
  return (
    <div className="container">
      <LoaderModal isLoading={loading} />
      <Switch>
        <Redirect from="/" to={`/${getToken() ? `form` : `login`}`} exact />
        <Route
          path="/login"
          render={(props) => (
            <LoginPage
              setupSocket={setupSocket}
              dispatch={dispatch}
              {...props}
            />
          )}
          exact
        />
        <Route
          path="/signup"
          render={(props) => <SignupPage {...props} socket={socket} exact />}
        />
        <PrivateRoute
          path="/form"
          component={FormPage}
          compProps={{ state, dispatch, socket }}
          exact
        />
        <PrivateRoute
          path="/pending"
          component={PendingPage}
          compProps={{ pending: state.pending }}
          exact
        />
        <PrivateRoute
          path="/rejected"
          component={RejectedPage}
          compProps={{ rejected: state.rejected }}
          exact
        />
        <PrivateRoute
          path="/approved"
          component={ApprovedPage}
          compProps={{ approved: state.approved }}
          exact
        />
        <PrivateRoute
          path="/request"
          component={ApprovalRequest}
          compProps={{
            approvalRequest: state.approvalRequest,
            userId: state.user._id,
            socket,
            dispatch,
          }}
          exact
        />
        <PrivateRoute
          path="/notifications"
          component={Notifications}
          compProps={{
            notifications: state.notifications,
            username: state.user.username,
          }}
          exact
        />
      </Switch>
    </div>
  );
};

export default Routes;
