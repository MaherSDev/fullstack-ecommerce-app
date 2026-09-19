import { Box, Heading } from "@chakra-ui/react";
import MediaList from "../common/components/MediaList";

const Media = () => {
  return (
    <Box position={"relative"}>
      <Heading as="h1" fontSize="2xl" fontWeight="bold" mb={10}>
        Media
      </Heading>
      <MediaList />
    </Box>
  );
};

export default Media;
