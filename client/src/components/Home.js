import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../redux/actions/productActions";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";

import MetaData from "./layouts/MetaData";
import Product from "./product/product";
import Loader from "./layouts/loader";

import Pagination from "react-js-pagination";
import "rc-slider/assets/index.css";
const Slider = require("rc-slider");
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 1000]);

  const alert = useAlert();
  const dispatch = useDispatch();
  const params = useParams();
  const keyword = params.keyword;

  const { loading, products, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      return alert.error(error);
    }
    dispatch(getProducts(keyword, currentPage, price));
  }, [dispatch, error, alert, currentPage, keyword, price]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"Buy best product online"} />
          <h1 id="products_heading">Latest Products</h1>

          <section id="products" className="container mt-5">
            {keyword && (
              <div className="col-6 col-md-3 mt-5 mb-5">
                <div className="px-5">
                  <Range
                    marks={{
                      1: `$1`,
                      1000: `$1000`,
                    }}
                    min={1}
                    max={1000}
                    defaultValue={[1, 1000]}
                  />
                </div>
              </div>
            )}
            <div className="row">
              {products ? (
                products.map((product) => (
                  <Product product={product} key={product._id} />
                ))
              ) : (
                <h1>No product found</h1>
              )}
            </div>
          </section>
          <div className="d-flex justify-content-center mt-5">
            <Pagination
              totalItemsCount={productsCount}
              activePage={currentPage}
              itemsCountPerPage={resPerPage}
              onChange={setCurrentPageNo}
              nextPageText={"Next"}
              prevPageText={"prev"}
              firstPageText={"First"}
              lastPageText={"Last"}
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </>
      )}
    </>
  );
}

export default Home;
