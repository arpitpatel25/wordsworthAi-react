import React from "react";
import { Grid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function MediaGrid({ mediaItems }) {
  const navigate = useNavigate();

  const handleMediaClick = (mediaItem) => {
    // Pause all videos before navigating
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video) => video.pause());

    navigate(`/media/${mediaItem._id}`, {
      state: { mediaItem }
    });
  };

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
      {mediaItems.map((item) =>
        item.media_type === "image" ? (
          <img
            key={item._id}
            src={item.media_url}
            alt=""
            className="media-item"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onClick={() => handleMediaClick(item)}
          />
        ) : (
          <div key={item._id} style={{ position: "relative" }}>
            <video
              controls
              className="media-item"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src={item.media_url} type="video/mp4" />
            </video>
            <button onClick={() => handleMediaClick(item)} style={{ position: "absolute", top: 0, right: 0, zIndex: 1 }}>
              View Details
            </button>
          </div>
        )
      )}
    </Grid>
  );
}

export default MediaGrid;
