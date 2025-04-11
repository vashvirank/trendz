import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: [],
    loading: false,
  },
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.user = action.payload;
    },
    fetchAllUsersFail(state) {
      state.loading = false;
    },
  },
});

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  await axios
    .get(`${BACKEND_URL}/auth/me`, { withCredentials: true })
    .then((res) => {
      dispatch(userSlice.actions.fetchAllUsersSuccess(res.data.users));
    })
    .catch((error) => {
      dispatch(
        userSlice.actions.fetchAllUsersFail(error.response.data.message)
      );
    });
};
