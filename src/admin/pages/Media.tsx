import { Box, Heading } from "@chakra-ui/react";
import MediaList from "../common/Components/MediaList";

const Media = () => {
  return (
    <Box position={"relative"}>
      <Heading as="h1" size={"xl"} my={4}>
        Media
      </Heading>
      <MediaList />
    </Box>
  );
};

export default Media;
