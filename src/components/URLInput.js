import React, { useState } from "react";

function URLInput({ fetchBrandFilters }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchBrandFilters(url);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ textAlign: "center", padding: "20px" }}
    >
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter brand URL"
        style={{ width: "60%", padding: "10px" }}
      />
      <button
        type="submit"
        style={{ marginLeft: "10px", padding: "10px 20px" }}
      >
        Fetch Filters
      </button>
    </form>
  );
}

export default URLInput;
