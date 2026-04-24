import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import type React from "react";
import { BiUndo } from "react-icons/bi";

interface IProps {
  isOpen: boolean;
  isLoading: boolean;
  title: string;
  children: React.ReactNode;
  okText: {
    icon?: React.ReactNode;
    text: string;
  };
  onClose: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ModalDialog = ({
  isOpen,
  isLoading,
  okText,
  title,
  onSave,
  onClose,
  onCancel,
  children
}: IProps) => {
  return (
    <Dialog.Root
      placement={"center"}
      open={isOpen}
      onOpenChange={onClose}
      onInteractOutside={onClose}
      size={"xl"}
    >
      <Dialog.Backdrop />
      <Portal>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {children}
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={onCancel}>
                  <BiUndo size={17} />
                  Cancel
                </Button>
              </Dialog.ActionTrigger>
              <Button
                variant="solid"
                colorPalette={"blue"}
                mr={3}
                loading={isLoading}
                onClick={onSave}
              >
                {okText?.icon}
                {okText.text}
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm"/>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ModalDialog;
