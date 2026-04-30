import {
  useDeleteDashboardMediaMutation,
  useGetDashboardMediaQuery,
} from "@/app/services/media";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { IThumbnail } from "@/interfaces";
import AlertDialog from "@/shared/AlertDialog";
import {
  AbsoluteCenter,
  ActionBar,
  Box,
  Button,
  Checkbox,
  Grid,
  HStack,
  Image,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";

const MediaList = () => {
  const [selection, setSelection] = useState<number[]>([]);
  const { isLoading, data, error } = useGetDashboardMediaQuery({ page: 1 });
  const [
    deleteSelectedMedia,
    { isLoading: isDeleting, isSuccess: isSuccessDeleting },
  ] = useDeleteDashboardMediaMutation();
  const { open, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    if (isSuccessDeleting) {
      onClose();
    }
  }, [isSuccessDeleting, onClose]);

  const onDeleteHandler = () => {
    if (selection.length)
      return selection.forEach((id) => deleteSelectedMedia(id));
    return;
  };

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length === data.length;

  if (isLoading) return "Loading...";
  if (error) return "No Data Found";

  return (
    <>
      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner zIndex={2}>
            <ActionBar.Content bg={bg} color={color}>
              <ActionBar.SelectionTrigger borderColor={color}>
                {selection.length} selected
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button
                variant="outline"
                size="sm"
                colorPalette={"red"}
                onClick={onOpen}
              >
                Delete <BsTrash size={17} />
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
      <AlertDialog
        isOpen={open}
        onClose={onClose}
        description={
          "This action cannot be undone. This will permanently remove selected images."
        }
        title={"Are you sure to remove selected images?"}
        okText={{ icon: <BsTrash size={17} />, text: "Delete" }}
        onDeleteHandler={onDeleteHandler}
        isLoading={isDeleting}
      />
      <HStack position={"absolute"} top={5} right={2}>
        {hasSelection && (
          <Checkbox.Root
            className="checkbox-wrapper-4"
            size="sm"
            left="2"
            aria-label="Select all rows"
            checked={indeterminate}
            onCheckedChange={(changes) => {
              setSelection(
                changes.checked ? data.map((img: IThumbnail) => img.id) : [],
              );
            }}
          >
            <Checkbox.HiddenInput className="inp-cbx" />
            <Checkbox.Control className="cbx">
              <Checkbox.Label>
                <svg width="12px" height="10px">
                  <use xlinkHref="#check-4"></use>
                </svg>
              </Checkbox.Label>
            </Checkbox.Control>
            <Text fontWeight={"medium"}>Select All</Text>
            <svg className="inline-svg">
              <symbol id="check-4" viewBox="0 0 12 10">
                <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
              </symbol>
            </svg>
          </Checkbox.Root>
        )}
      </HStack>
      <Grid
        py={5}
        templateColumns={"repeat(auto-fit, minmax(200px, 200px))"}
        gap="2"
      >
        {data?.map((img: IThumbnail) => (
          <Box
            key={img.id}
            height="200px"
            bg={bg}
            rounded={"sm"}
            position={"relative"}
          >
            <Checkbox.Root
              className="checkbox-wrapper-4"
              size="sm"
              top="2"
              left="2"
              zIndex={2}
              aria-label="Select all rows"
              checked={selection.includes(img.id)}
              onCheckedChange={(changes) => {
                setSelection((prev) =>
                  changes.checked
                    ? [...prev, img.id]
                    : [...prev.filter((unSelect) => unSelect !== img.id)],
                );
              }}
            >
              <Checkbox.HiddenInput className="inp-cbx" />
              <Checkbox.Control className="cbx">
                {/* <label> */}
                <Checkbox.Label>
                  {/* <FaCheck /> */}
                  <svg width="12px" height="10px">
                    <use xlinkHref="#check-4"></use>
                  </svg>
                </Checkbox.Label>
                {/* </label> */}
              </Checkbox.Control>
              <svg className="inline-svg">
                <symbol id="check-4" viewBox="0 0 12 10">
                  <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                </symbol>
              </svg>
            </Checkbox.Root>
            <AbsoluteCenter boxSize={"full"} p={1}>
              <Image
                objectFit={"contain"}
                boxSize={"full"}
                src={`${import.meta.env.VITE_SERVER_URL}${img?.url}`}
                alt={img.alternativeText}
              />
            </AbsoluteCenter>
          </Box>
        ))}
      </Grid>
    </>
  );
};

export default MediaList;
