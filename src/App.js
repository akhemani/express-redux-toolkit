import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./components/cart";
import { Navbar } from "./components/navbar";
import ProductList from "./components/productList";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/*" element={<>Not Found</>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
