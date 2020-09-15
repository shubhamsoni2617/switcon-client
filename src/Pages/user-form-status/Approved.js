import React from "react";

const ApprovedPage = ({ approved }) => {
  return (
    <div>
      {approved.map((approvedReq) => (
        <p className="user-form" key={approvedReq._id}>
          The request <span className="form-id">#{approvedReq._id}</span> from
          you has been approved by {approvedReq.approverName} having message "
          {approvedReq.message}"
        </p>
      ))}
      {!approved.length && <h3>No results found</h3>}
    </div>
  );
};

export default ApprovedPage;
