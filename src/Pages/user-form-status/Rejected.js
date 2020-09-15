import React from "react";

const RejectedPage = ({ rejected }) => {
  return (
    <div>
      {rejected.map((rejectedReq) => (
        <p className="user-form" key={rejectedReq._id}>
          The request <span className="form-id">#{rejectedReq._id}</span> from
          you has been rejected by {rejectedReq.approverName} having message "
          {rejectedReq.message}"
        </p>
      ))}
      {!rejected.length && <h3>No results found</h3>}
    </div>
  );
};

export default RejectedPage;
