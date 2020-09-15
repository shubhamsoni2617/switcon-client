import React from "react";

const Notifications = ({ notifications, username }) => {
  return (
    <div>
      {notifications.map((notification) => {
        return notification.state === "pending" ? (
          <p className="user-form" key={notification.formId}>
            A new request{" "}
            <span className="form-id">#{notification.formId}</span> has been
            submitted by{" "}
            {notification.requestor === username
              ? `you`
              : notification.requestor}{" "}
            to{" "}
            {notification.approverName === username
              ? `you`
              : notification.approverName}{" "}
            having message "{notification.message}"
          </p>
        ) : (
          <p className="user-form" key={notification.formId}>
            The request <span className="form-id">#{notification.formId}</span>{" "}
            from{" "}
            {notification.requestor === username
              ? `you`
              : notification.requestor}{" "}
            has been {notification.state} by{" "}
            {notification.approverName === username
              ? `you`
              : notification.approverName}{" "}
            having message "{notification.message}"
          </p>
        );
      })}
      {!notifications.length && <h3>No results found</h3>}
    </div>
  );
};

export default Notifications;
