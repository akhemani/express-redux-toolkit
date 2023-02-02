import { useSelector, useDispatch } from "react-redux";
import {
  fetchOrdersHistory,
  orderNow,
  removeProduct,
  updateQuantity,
} from "../store/productsSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, orderHistory } = useSelector((state) => state.products);
  return (
    <div>
      Cart
      {Object.entries(cart).map(([key, value], index) => {
        return (
          <div key={key}>
            <span>Product Name: {value.products.name}</span>
            --<span>quantity: {value.quantity}</span>
            <button
              onClick={() =>
                dispatch(updateQuantity({ operation: "+", id: value.products._id }))
              }
            >
              +
            </button>
            <button
              onClick={() =>
                dispatch(updateQuantity({ operation: "-", id: value.products._id }))
              }
            >
              -
            </button>
            <button onClick={() => dispatch(removeProduct(value.products._id))}>
              Remove
            </button>
          </div>
        );
      })}
      <div></div>
      <button onClick={() => dispatch(orderNow(cart))}>Order Now</button>
      <div></div>
      <button onClick={() => dispatch(fetchOrdersHistory())}>History</button>
      {orderHistory &&
        Object.keys(orderHistory).length &&
        Object.entries(orderHistory).map(([key, value], index) => {
          return (
            <div key={key}>
              <hr />
              <span>Order ID: {key}</span>
              {value.userOrder.map((userOrder, index) => {
                return (
                  <div key={index}>
                    <span>Username: {userOrder.name}</span>
                    --<span>quantity: {userOrder.quantity}</span>
                  </div>
                );
              })}
              Total: {value.total}
              <hr />
            </div>
          );
        })}
    </div>
  );
};

export default Cart;
