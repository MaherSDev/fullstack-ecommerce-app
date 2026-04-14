import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import { BsTrash } from "react-icons/bs";
import { BiUndo } from "react-icons/bi";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlertDialog = ({ isOpen, onClose }: IProps) => {
  return (
    <Dialog.Root
      role="alertdialog"
      placement={"center"}
      open={isOpen}
      onOpenChange={onClose}
      onInteractOutside={onClose}
    >
      <Portal>
        <Dialog.Positioner bg={"black"} opacity={0.7}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Are you sure to remove this product?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontWeight={"normal"}>
                This action cannot be undone. This will permanently remove the
                product.
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">
                  <BiUndo size={17} />
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                variant="solid"
                colorPalette={"red"}
                mr={3}
                onClick={() => {}}
              >
                <BsTrash size={17} />
                Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AlertDialog;
