import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import { BiUndo } from "react-icons/bi";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  okText: {
    icon?: React.ReactNode;
    text: string;
  };
}

const AlertDialog = ({
  isOpen,
  onClose,
  description,
  okText,
  title,
}: IProps) => {
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
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text fontWeight={"normal"}>{description}</Text>
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
                {okText?.icon}
                {okText.text}
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
