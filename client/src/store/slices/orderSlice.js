import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    message: null,
    orders: [],
    order: null,
    isEditing: false,
    editData: null,
  },
  reducers: {
    addOrderRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addOrderSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.order = action.payload.order;
    },
    addOrderFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    cancelOrderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    cancelOrderSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    cancelOrderFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getOrderByIdRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getOrderByIdSuccess(state, action) {
      state.loading = false;
      state.order = action.payload;
      state.editData = action.payload;
    },
    getOrderByIdFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getMyOrderRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getMyOrderSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload.orders;
    },
    getMyOrderFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getAllOrderesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getAllOrderesSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload.orders;
    },
    getAllOrderesFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getSellerOrderesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getSellerOrderesSuccess(state, action) {
      state.loading = false;
      state.orders = action.payload.orders;
    },
    getSellerOrderesFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    resetOrderSlice: (state) => {
      state.message = null;
      state.error = null;
    },
  },
});

export const addOrder =
  ({ id, data }) =>
  async (dispatch) => {
    dispatch(orderSlice.actions.addOrderRequest());
    await axios
      .post(`${BACKEND_URL}/order/add-order/${id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        dispatch(orderSlice.actions.addOrderSuccess(res.data));
      })
      .catch((error) => {
        dispatch(
          orderSlice.actions.addOrderFailed(error.response.data.message)
        );
      });
  };

export const cancelOrder = (id) => async (dispatch) => {
  dispatch(orderSlice.actions.cancelOrderRequest());
  await axios
    .put(
      `${BACKEND_URL}/order/cancel/${id}`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      dispatch(orderSlice.actions.cancelOrderSuccess(res.data.message));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.cancelOrderFailed(error.response.data.message)
      );
    });
};

export const getOrderById = (id) => async (dispatch) => {
  dispatch(orderSlice.actions.getOrderByIdRequest());
  await axios
    .get(`${BACKEND_URL}/order/${id}`)
    .then((res) => {
      dispatch(orderSlice.actions.getOrderByIdSuccess(res.data.order));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.getOrderByIdFailed(
          error.response?.data?.message || "Failed to fetch order"
        )
      );
    });
};

export const getMyOrder = () => async (dispatch) => {
  dispatch(orderSlice.actions.getMyOrderRequest());
  await axios
    .get(`${BACKEND_URL}/order/my-orders`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.getMyOrderSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.getMyOrderFailed(error.response.data.message)
      );
    });
};

export const getAllOrderes = () => async (dispatch) => {
  dispatch(orderSlice.actions.getAllOrderesRequest());
  await axios
    .get(`${BACKEND_URL}/order/all`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.getAllOrderesSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.getAllOrderesFailed(error.response.data.message)
      );
    });
};

export const getSellerOrderes = () => async (dispatch) => {
  dispatch(orderSlice.actions.getSellerOrderesRequest());
  await axios
    .get(`${BACKEND_URL}/order/seller/all`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(orderSlice.actions.getSellerOrderesSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        orderSlice.actions.getSellerOrderesFailed(error.response.data.message)
      );
    });
};

export const { resetOrderSlice } = orderSlice.actions;
export default orderSlice.reducer;
