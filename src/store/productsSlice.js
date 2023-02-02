import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

const BASE_URL = "http://127.0.0.1:8080/api/v1/";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    // await new Promise((res) => setTimeout(() => res(), 4000));
    // const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const response = await fetch(BASE_URL + "products");
    const products = await response.json();
    return products;
  }
);

export const fetchStats = createAsyncThunk("stats/fetchStats", async () => {
  const response = await fetch(BASE_URL + "filterStats");
  const users = await response.json();
  return users;
});

export const fetchFilteredUsers = createAsyncThunk(
  "filter/fetchProducts",
  async (queryParams) => {
    const response = await fetch(BASE_URL + "products/filter?" + queryParams);
    const users = await response.json();
    return users;
  }
);

export const fetchOrdersHistory = createAsyncThunk(
  "fetch/ordersHistory",
  async () => {
    const response = await fetch(BASE_URL + "orders");
    const users = await response.json();
    return users;
  }
);

export const orderNow = createAsyncThunk("create/order", async (data = {}) => {
  const productId = [];
  const quantity = [];
  let total = 0;
  Object.entries(data).forEach(([key, value], index) => {
    productId.push(value.products._id);
    quantity.push(value.quantity);
    total += value.products.price;
  });
  const carObj = {
    productId,
    quantity,
    total,
  };
  const response = await fetch(BASE_URL + "orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(carObj),
  });
  const users = await response.json();
  return users;
});

const initialState = {
  loading: false,
  cart: {},
  products: [],
  stats: {},
  orderHistory: [],
};

const removeProductHandler = ({ cart }, _id) => {
  let myCart = { ...cart };
  delete myCart[_id];
  return myCart;
};

const updateQuantityHandler = ({ cart }, { operation, id }) => {
  let myCart = { ...cart };
  if (operation === "+") {
    myCart[id] = {
      ...myCart[id],
      quantity: myCart[id].quantity + 1,
    };
  } else if (operation === "-") {
    myCart[id] = {
      ...myCart[id],
      quantity: myCart[id].quantity - 1,
    };
    if (myCart[id].quantity < 1) {
      delete myCart[id];
    }
  }
  return myCart;
};

const addProductHandler = ({ products, cart }, _id) => {
  let myCart = { ...cart };
  if (myCart[_id]) {
    myCart[_id] = {
      ...myCart[_id],
      quantity: myCart[_id].quantity + 1,
    };
  } else {
    myCart[_id] = {
      products: products.filter((product) => product._id === _id)[0],
      quantity: 1,
    };
  }
  return myCart;
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) =>
      void (state.cart = addProductHandler(current(state), action.payload)),
    removeProduct: (state, action) =>
      void (state.cart = removeProductHandler(current(state), action.payload)),
    updateQuantity: (state, action) =>
      void (state.cart = updateQuantityHandler(current(state), action.payload)),
  },
  extraReducers: {
    [fetchProducts.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    },
    [fetchProducts.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchStats.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchStats.fulfilled]: (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    },
    [fetchStats.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchFilteredUsers.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchFilteredUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    },
    [fetchFilteredUsers.rejected]: (state, action) => {
      state.loading = false;
    },
    [fetchOrdersHistory.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchOrdersHistory.fulfilled]: (state, action) => {
      state.loading = false;
      state.orderHistory = action.payload.data;
    },
    [fetchOrdersHistory.rejected]: (state, action) => {
      state.loading = false;
    },
    [orderNow.pending]: (state, action) => {
      state.loading = true;
    },
    [orderNow.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.message === "created order") {
        state.cart = {};
      }
    },
    [orderNow.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { addProduct, removeProduct, updateQuantity } =
  productsSlice.actions;

export default productsSlice.reducer;
