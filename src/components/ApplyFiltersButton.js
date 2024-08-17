import React from "react";

function ApplyFiltersButton({ applyFilters }) {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button onClick={applyFilters} style={{ padding: "10px 20px" }}>
        Apply Filters
      </button>
    </div>
  );
}

export default ApplyFiltersButton;
