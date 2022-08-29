import React, { useEffect } from "react";
import MetaData from "./layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/actions/productActions";
import Product from "./product/product";
import Loader from "./layouts/loader";
function Home() {
  const dispatch = useDispatch();
  const { loading, products, error, productsCount } = useSelector(
    (state) => state.products
  );
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"Buy best product online"} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            <div className="row">
              {products &&
                products.map((product) => (
                  <Product product={product} key={product._id} />
                ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Home;
