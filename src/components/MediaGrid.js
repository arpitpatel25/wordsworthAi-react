// import React from "react";
// import { Box, Grid } from "@chakra-ui/react";

// function MediaGrid({ mediaItems }) {
//   if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
//     return <Box>No images/videos found for this filter combination.</Box>;
//   }

//   return (
//     <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
//       {mediaItems.map((item) =>
//         item.type === "https" && item.media_type === "image" ? (
//           <img key={item._id} src={item.media_url} alt="" className="media-item" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//         ) : (
//           <video key={item._id} controls className="media-item" style={{ width: "100%", height: "100%", objectFit: "cover" }}>
//             <source src={item.media_url} type="video/mp4" />
//           </video>
//         )
//       )}
//     </Grid>
//   );
// }

// export default MediaGrid;

import React from "react";
import { Box, Grid, Center, Text, Image } from "@chakra-ui/react";
import image_icon_grey from './image_icon_grey.png'; 

function MediaGrid({ mediaItems, initialLoad }) {
  if (initialLoad) {
    return (
      <Center height="40%">
        <Image src={image_icon_grey} alt="placeholder" boxSize="300px" opacity={0.5} />
      </Center>
    );
  }

  if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
    return (
      <Center height="40%">
        <Box textAlign="center">
        <Text mt={4} fontSize="xl" color="black">No images/videos found for this filter combination.</Text>

          {/* <Image src={image_icon_grey} alt="no media" boxSize="300px" opacity={0.5} /> */}
        </Box>
      </Center>
    );
  }

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
      {mediaItems.map((item) =>
        item.type === "https" && item.media_type === "image" ? (
          <img key={item._id} src={item.media_url} alt="" className="media-item" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <video key={item._id} controls className="media-item" style={{ width: "100%", height: "100%", objectFit: "cover" }}>
            <source src={item.media_url} type="video/mp4" />
          </video>
        )
      )}
    </Grid>
  );
}

export default MediaGrid;
