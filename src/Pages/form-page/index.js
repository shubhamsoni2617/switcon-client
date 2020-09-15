import React, { useState } from "react";
import "./style.css";
import makeToast from "../../Toaster";
import { getToken, Axios } from "../../utils";
import { useHistory } from "react-router-dom";
import LoaderModal from "../../loader-modal/LoaderModal";

const FormPage = ({ state, dispatch, socket }) => {
  const { user = {}, departments = [], usersOfOtherDepartment = [] } = state;
  const [assignTo, setAssignTo] = useState("Select");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const handleValidation = () => {
    if (assignTo === "Select") return setValidationError(true);
    if (!message) return setValidationError(true);
    setValidationError(false);
    return true;
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const response = await Axios.post(
        "/form",
        {
          message,
          department: departments.find(
            (department) => department !== user.department
          ),

          approverId: assignTo,
          approverName: usersOfOtherDepartment.find(
            (user) => user.approverId === assignTo
          ).username,
        },
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      socket.emit("formSubmit", {
        response: response.data.formData,
      });
      dispatch({
        type: "UPDATE_PENDING_REQUESTS",
        payload: response.data.formData,
      });
      setMessage("");
      setAssignTo("Select");
      setLoading(false);

      makeToast("success", response.data.message);
      history.push("/pending");
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
    <div className="card form">
      <LoaderModal isLoading={loading} />
      <div className="cardHeader">Form</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="name">Created By</label>
          {user.username && (
            <input
              name="name"
              value={user.username}
              disabled
              placeholder="John Doe"
            />
          )}
        </div>
        <div className="inputGroup">
          <label htmlFor="department">Department To Assign</label>
          {user.department && (
            <input
              name="department"
              value={departments.find(
                (department) => department !== user.department
              )}
              disabled
              placeholder="John Doe"
            />
          )}
        </div>

        <div className="select">
          <label htmlFor="department">Assign To</label>
          <select
            value={assignTo}
            placeholder="select"
            onChange={({ target }) => setAssignTo(target.value)}
          >
            <option disabled>Select</option>
            {usersOfOtherDepartment.map((user) => (
              <option key={user.approverId} value={user.approverId}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="inputGroup">
          <label>Message</label>
          <textarea
            onChange={({ target }) => setMessage(target.value)}
            value={message}
            placeholder="Type your message here..."
          />
        </div>
        {validationError && <p className="error">All fields are required</p>}
        <button
          onClick={() => {
            handleValidation() && onSubmit();
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FormPage;
