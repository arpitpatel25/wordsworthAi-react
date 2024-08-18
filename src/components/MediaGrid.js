import React from "react";

import "../styles/MediaGrid.css"

function MediaGrid({ mediaItems }) {
  if (mediaItems.length === 0) {
    return <div>No images/videos found for this filter combination.</div>;
  }

  return (
    <div className="media-grid">
      {mediaItems.map((item) => (
        item.type === 'https' && item.media_type === 'image' ? (
          <img key={item._id} src={item.media_url} alt="" className="media-item" />
        ) : (
          <video key={item._id} controls className="media-item">
            <source src={item.media_url} type="video/mp4" />
          </video>
        )
      ))}
    </div>
  );
}

export default MediaGrid;
