import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStats, fetchProducts } from "../store/productsSlice";
import { addProduct } from "../store/productsSlice";
import { Filter } from "./filter";

const ProductList = () => {
  const { loading, products, stats } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!products.length) {
      dispatch(fetchProducts());
      dispatch(fetchStats());
    }
  }, []);

  return (
    <div>
      Product List
      <div>
        {loading ? (
          "Loading..."
        ) : (
          <>
            <ol>
              {products &&
                products.length &&
                products.map(({ _id, name, category }, i) => (
                  <li key={i}>
                    <span>{name}</span>
                    --<span>{category}</span>
                    --
                    <span>
                      <button onClick={() => dispatch(addProduct(_id))}>
                        Add
                      </button>
                    </span>
                  </li>
                ))}
            </ol>
            {stats && Object.entries(stats).length && <Filter states={stats} />}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
