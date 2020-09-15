import React, { useState } from "react";
import "./style.css";
import makeToast from "../../Toaster";
import { getToken, Axios } from "../../utils";
import LoaderModal from "../../loader-modal/LoaderModal";

const ApprovalRequest = ({ approvalRequest, userId, socket, dispatch }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async (payload) => {
    try {
      setLoading(true);

      const response = await Axios.patch(
        "/form",
        {
          payload,
        },
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      );

      socket.emit("stateUpdate", {
        response: { payload },
      });
      setLoading(false);

      dispatch({
        type: "UPDATE_REQUEST",
        payload: payload._id,
      });
      makeToast("success", response.data.message);
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
    <div>
      <LoaderModal isLoading={loading} />
      {approvalRequest.map((request) => (
        <div className="user-form" key={request._id}>
          <p>
            A new request <span className="form-id">#{request._id}</span> has
            been submitted by {request.requestor} to{" "}
            {request.approverId === userId ? "you" : request.approverName}{" "}
            having message "{request.message}"
          </p>
          {request.approverId === userId && (
            <div className="approval-button">
              <button
                onClick={() => {
                  const payload = { ...request, state: "approved" };
                  onClick(payload);
                }}
              >
                Approve
              </button>
              <button
                onClick={() => {
                  const payload = { ...request, state: "rejected" };
                  onClick(payload);
                }}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
      {!approvalRequest.length && <h3>No results found</h3>}
    </div>
  );
};

export default ApprovalRequest;
