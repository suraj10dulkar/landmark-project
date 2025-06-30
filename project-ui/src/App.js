import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const App = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const debounceTimeout = useRef(null);

  const fetchProducts = async (pageNum = 1, searchTerm = "") => {
    const res = await axios.get("http://localhost:5000/api/products", {
      params: { page: pageNum, search: searchTerm },
    });
    setProducts(res.data.products);
    setTotalItems(res.data.total);
    setPage(res.data.page);
  };

  const fetchSuggestions = async (val) => {
    const res = await axios.get("http://localhost:5000/api/search-suggestions", {
      params: { q: val },
    });
    setSuggestions(res.data);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (val.length > 1) {
        fetchSuggestions(val);
        fetchProducts(1, val); // fetch filtered products on search
      } else {
        setSuggestions([]);
        fetchProducts(1, ""); // reset if cleared
      }
    }, 400); // debounce delay
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    setSuggestions([]);
    fetchProducts(1, suggestion);
  };

  const totalPages = Math.ceil(totalItems / 10);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Product Catalog</h2>

      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search products..."
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      {suggestions.length > 0 && (
        <ul style={{ border: "1px solid #ccc", listStyle: "none", padding: "5px", margin: 0 }}>
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              style={{ cursor: "pointer", padding: "5px" }}
              onClick={() => handleSuggestionClick(sug)}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li key={p.id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <strong>{p.name}</strong> - ${p.price}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <button disabled={page === 1} onClick={() => fetchProducts(page - 1, search)}>
          &lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => fetchProducts(i + 1, search)}
            style={{
              margin: "0 5px",
              backgroundColor: i + 1 === page ? "lightblue" : "",
            }}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={page === totalPages} onClick={() => fetchProducts(page + 1, search)}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default App;
