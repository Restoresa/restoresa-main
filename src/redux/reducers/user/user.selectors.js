import { createSelector } from "reselect";

const selectUserState = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUserState],
  (user) => user.user.data
);

export const selectUserError = createSelector(
  [selectUserState],
  (user) => user.errorModal
);

export const selectIsUserPending = createSelector(
  [selectUserState],
  (user) => user.user.pending
);

export const selectUserAuthentication = createSelector(
  [selectUserState],
  (user) => user.user.isAuthenticated
);

export const selectChangePassword = createSelector(
  [selectUserState],
  (user) => user.changePassword
);

export const selectChangePhoneNumber = createSelector(
  [selectUserState],
  (user) => user.changePhoneNumber
);

export const selectNextRoute = createSelector(
  [selectUserState],
  (user) => user.nextRoute
);
