import React from 'react';
import {
  Box,
  Text,
  Button,
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle
} from '@chakra-ui/react';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TestModal: React.FC<TestModalProps> = ({ isOpen, onClose }) => {
  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxW="lg" bg="gray.900" borderColor="gray.700">
          <DialogHeader>
            <DialogTitle color="white">Test Modal</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text color="white">This is a test modal to check if basic dialog works.</Text>
          </DialogBody>

          <DialogFooter>
            <Button onClick={onClose} colorPalette="gray">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default TestModal;