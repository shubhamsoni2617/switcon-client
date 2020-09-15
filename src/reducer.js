export const initialState = {
  user: {},
  departments: [],
  usersOfOtherDepartment: [],
  pending: [],
  approved: [],
  rejected: [],
  approvalRequest: [],
  notifications: [],
};

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_USER_DATA":
      return {
        user: payload.user,
        departments: payload.departments,
        usersOfOtherDepartment: payload.usersOfOtherDepartment,
        pending: payload.userForms.pending,
        approved: payload.userForms.approved,
        rejected: payload.userForms.rejected,
        approvalRequest: payload.approvalRequest,
        notifications: payload.notifications,
      };
    case "UPDATE_PENDING_REQUESTS":
      return {
        ...state,
        pending: [...state.pending, payload],
      };
    case "UPDATE_APPROVAL_REQUESTS":
      return {
        ...state,
        approvalRequest: [...state.approvalRequest, payload],
      };
    case "UPDATE_REQUEST":
      return {
        ...state,
        approvalRequest: state.approvalRequest.filter(
          (request) => request._id !== payload
        ),
      };
    case "UPDATE_USER_FORMS":
      const updatedFormData = state.pending.find(
        (form) => form._id === payload._id
      );
      if (!updatedFormData) return state;
      updatedFormData.state = payload.state;
      return {
        ...state,
        [payload.state]: [...state[payload.state], updatedFormData],
        pending: state.pending.filter((form) => form._id !== payload._id),
      };

    case "UPDATE_NOTIFICATIONS":
      return {
        ...state,
        notifications: [...state.notifications, payload],
      };
    case "UPDATE_OTHER_DEPARTMENT_USER":
      return {
        ...state,
        usersOfOtherDepartment: [...state.usersOfOtherDepartment, payload],
      };
    default:
      return state;
  }
};
