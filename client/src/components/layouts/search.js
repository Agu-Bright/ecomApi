import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Search() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword) {
      const newKeyword = keyword.trim();
      navigate(`search/${newKeyword}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };
  const handleChange = (e) => {
    setKeyword(e.target.value);
  };
  return (
    <form onSubmit={handleSearchSubmit}>
      <div className="input-group">
        <input
          type="text"
          name="keyword"
          value={keyword}
          onChange={handleChange}
          id="search_field"
          className="form-control"
          placeholder="Enter Product Name ..."
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn">
            <i className="fa fa-search" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </form>
  );
}

export default Search;
