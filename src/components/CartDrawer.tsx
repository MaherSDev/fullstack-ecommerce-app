import {
  onCloseCartDrawerAction,
  selectGlobal,
} from "@/app/features/globalSlice";
import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

export const CartDrawer = () => {
  const { isOpenCartDrawer } = useSelector(selectGlobal);
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(onCloseCartDrawerAction());
  };

  return (
    <Drawer.Root
      open={isOpenCartDrawer}
      placement="end"
      onInteractOutside={onClose}
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Drawer Title</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body></Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onClick={() => {}}>
                Clear All
              </Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" onClick={onClose} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
};
