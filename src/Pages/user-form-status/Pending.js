import React from "react";

const PendingPage = ({ pending }) => {
  return (
    <div>
      {pending.map((pendingReq) => (
        <p className="user-form" key={pendingReq._id}>
          A new request <span className="form-id">#{pendingReq._id}</span> has
          been submitted by you to {pendingReq.approverName} having message "
          {pendingReq.message}"
        </p>
      ))}
      {!pending.length && <h3>No results found</h3>}
    </div>
  );
};

export default PendingPage;
