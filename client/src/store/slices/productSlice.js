import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    error: null,
    message: null,
    products: [],
    product: null,
    isEditing: false,
    editData: {},
  },
  reducers: {
    addProductRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addProductSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.product = action.payload.product;
    },
    addProductFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProductRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteProductSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    deleteProductFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getProductByIdRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getProductByIdSuccess(state, action) {
      state.loading = false;
      state.product = action.payload;
      state.editData = action.payload;
    },
    getProductByIdFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getMultipleProductsByIdRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getMultipleProductsByIdSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    getMultipleProductsByIdFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    editProductRequest(state) {
      state.loading = true;
      state.error = null;
    },
    editProductSuccess(state, action) {
      state.loading = false;
      state.product = action.payload;
      state.message = action.payload.message;
      state.isEditing = false;
    },
    editProductFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    setEditing(state, action) {
      state.isEditing = action.payload;
      state.editData = action.payload ? { ...state.product } : {};
    },
    cancelEditing(state) {
      state.isEditing = false;
      state.editData = {};
    },
    updateEditData(state, action) {
      // console.log("action.payload", action.payload);
      state.editData = { ...state.editData, ...action.payload };
      // console.log("state.editData", state.editData);
      // console.log(state.editData.name);
    },

    getProductsByCategoryRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getProductsByCategorySuccess(state, action) {
      state.loading = false;
      state.products = action.payload.products;
    },
    getProductsByCategoryFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addReviewRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addReviewSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.product = action.payload.product;
    },
    addReviewFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteReviewRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteReviewSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    deleteReviewFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addToCartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.product = action.payload.product;
    },
    addToCartFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    removeFromCartSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    removeFromCartFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getCartRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getCartSuccess(state, action) {
      state.loading = false;
      state.products = action.payload.products;
    },
    getCartFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    addToWishListRequest(state) {
      state.loading = true;
      state.error = null;
    },
    addToWishListSuccess(state, action) {
      state.loading = false;
      state.message = action.payload.message;
      state.product = action.payload.product;
    },
    addToWishListFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromWishListRequest(state) {
      state.loading = true;
      state.error = null;
    },
    removeFromWishListSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    removeFromWishListFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    getWishListRequest(state) {
      state.loading = true;
      state.error = null;
    },
    getWishListSuccess(state, action) {
      state.loading = false;
      state.products = action.payload.products;
    },
    getWishListFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    searchRequest(state) {
      state.loading = true;
      state.error = null;
    },
    searchSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
    },
    searchFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    resetProductSlice: (state) => {
      state.message = null;
      state.error = null;
    },
  },
});

export const addProduct = (data) => async (dispatch) => {
  dispatch(productSlice.actions.addProductRequest());
  await axios
    .post(`${BACKEND_URL}/product/admin/add`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(productSlice.actions.addProductSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.addProductFailed(error.response.data.message)
      );
    });
};

export const deleteProduct = (id) => async (dispatch) => {
  dispatch(productSlice.actions.deleteProductRequest());
  await axios
    .delete(`${BACKEND_URL}/product/admin/delete/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.deleteProductSuccess(res.data.message));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.deleteProductFailed(error.response.data.message)
      );
    });
};

export const getProductById = (id) => async (dispatch) => {
  dispatch(productSlice.actions.getProductByIdRequest());
  await axios
    .get(`${BACKEND_URL}/product/${id}`)
    .then((res) => {
      dispatch(productSlice.actions.getProductByIdSuccess(res.data.product));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.getProductByIdFailed(
          error.response?.data?.message || "Failed to fetch product"
        )
      );
    });
};

export const getMultipleProductsById = (ids) => async (dispatch) => {
  dispatch(productSlice.actions.getMultipleProductsByIdRequest());
  try {
    const res = await axios.post(`${BACKEND_URL}/product/get-multiple`, {
      ids,
    });
    dispatch(
      productSlice.actions.getMultipleProductsByIdSuccess(res.data.products)
    );
  } catch (error) {
    dispatch(
      productSlice.actions.getMultipleProductsByIdFailed(
        error.response?.data?.message || "Failed to fetch multiple products"
      )
    );
  }
};

export const editProduct = (id, updatedData) => async (dispatch) => {
  dispatch(productSlice.actions.editProductRequest());
  await axios
    .put(`${BACKEND_URL}/product/${id}`, updatedData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(productSlice.actions.editProductSuccess(res.data.product));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.editProductFailed(
          error.response?.data?.message || "Failed to update product"
        )
      );
    });
};

export const getProductsByCategory = (category) => async (dispatch) => {
  dispatch(productSlice.actions.getProductsByCategoryRequest());
  await axios
    .get(`${BACKEND_URL}/product/${category}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.getProductsByCategorySuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.getProductsByCategoryFailed(
          error.response.data.message
        )
      );
    });
};

export const addReview = (productId, data) => async (dispatch) => {
  dispatch(productSlice.actions.addReviewRequest());
  await axios
    .post(`${BACKEND_URL}/product/review/add/${productId}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((res) => {
      dispatch(productSlice.actions.addReviewSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.addReviewFailed(error.response.data.message)
      );
    });
};

export const deleteReview = (productId, reviewId) => async (dispatch) => {
  dispatch(productSlice.actions.deleteReviewRequest());
  await axios
    .delete(`${BACKEND_URL}/product/review/delete/${productId}/${reviewId}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.deleteReviewSuccess(res.data.message));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.deleteReviewFailed(error.response.data.message)
      );
    });
};

export const fetchSearchedProducts = (keyword) => async (dispatch) => {
  dispatch(productSlice.actions.searchRequest());
  await axios
    .get(`${BACKEND_URL}/product/search?keyword=${keyword}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.searchSuccess(res.data.products));
    })
    .catch((error) => {
      dispatch(productSlice.actions.searchFailed(error.response.data.message));
    });
};

export const addToCart = (id) => async (dispatch) => {
  dispatch(productSlice.actions.addToCartRequest());
  await axios
    .post(
      `${BACKEND_URL}/product/add-cart/${id}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      dispatch(productSlice.actions.addToCartSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.addToCartFailed(error.response.data.message)
      );
    });
};

export const removeFromCart = (id) => async (dispatch) => {
  dispatch(productSlice.actions.removeFromCartRequest());
  await axios
    .delete(`${BACKEND_URL}/product/remove-cart/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.removeFromCartSuccess(res.data.message));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.removeFromCartFailed(error.response.data.message)
      );
    });
};

export const getCart = () => async (dispatch) => {
  dispatch(productSlice.actions.getCartRequest());
  await axios
    .get(`${BACKEND_URL}/product/cart`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.getCartSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.getCartFailed(
          error.response?.data?.message || "Failed to fetch product"
        )
      );
    });
};

export const addToWishList = (id) => async (dispatch) => {
  dispatch(productSlice.actions.addToWishListRequest());
  await axios
    .post(
      `${BACKEND_URL}/product/add-wishlist/${id}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((res) => {
      dispatch(productSlice.actions.addToWishListSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.addToWishListFailed(error.response.data.message)
      );
    });
};

export const removeFromWishList = (id) => async (dispatch) => {
  dispatch(productSlice.actions.removeFromWishListRequest());
  await axios
    .delete(`${BACKEND_URL}/product/remove-wishlist/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(
        productSlice.actions.removeFromWishListSuccess(res.data.message)
      );
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.removeFromWishListFailed(
          error.response.data.message
        )
      );
    });
};

export const getWishList = () => async (dispatch) => {
  dispatch(productSlice.actions.getWishListRequest());
  await axios
    .get(`${BACKEND_URL}/product/wishlist`, {
      withCredentials: true,
    })
    .then((res) => {
      dispatch(productSlice.actions.getWishListSuccess(res.data));
    })
    .catch((error) => {
      dispatch(
        productSlice.actions.getWishListFailed(
          error.response?.data?.message || "Failed to fetch product"
        )
      );
    });
};

export const { setEditing, cancelEditing, updateEditData, resetProductSlice } =
  productSlice.actions;
export default productSlice.reducer;
