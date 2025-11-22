import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Input,
  Stack,
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { foundItemService } from '../../services/foundItemService';
import type { FoundItemRequest } from '../../types/foundItem';
import type { CreateFoundItemModalProps } from '../../types/foundItem';

const CreateFoundItemModalSimple: React.FC<CreateFoundItemModalProps> = ({
  isOpen,
  onClose,
  onFoundItemCreated
}) => {
  const { user } = useAuth();
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName) {
      setError('Please enter item name');
      return;
    }

    const userId = (user as any)?.memberId ?? (user as any)?.memberID ?? (user as any)?.id ?? 1;

    setLoading(true);
    setError(null);

    try {
      const formData: FoundItemRequest = {
        itemName,
        description: '',
        location: '',
        foundDate: new Date().toISOString(),
        status: 'AVAILABLE',
        category: 'OTHER',
        handoverLocation: '',
        verificationRequired: true,
        distinctiveFeatures: '',
        contactInfo: '',
        photoUrl: '',
        additionalImages: '',
        reportedById: userId
      };

      await foundItemService.create(formData);
      onFoundItemCreated();
      handleClose();
    } catch (err: any) {
      console.error('Create found item error:', err);
      setError(err.message || 'Failed to create found item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setItemName('');
    setError(null);
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => !details.open && handleClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxW="md" bg="gray.900" borderColor="gray.700">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle color="white">Report Found Item (Simple)</DialogTitle>
            </DialogHeader>

            <DialogBody>
              {error && (
                <Box bg="red.500/10" border="1px solid" borderColor="red.500" rounded="md" p={3} mb={4}>
                  <Text color="red.400" fontSize="sm">{error}</Text>
                </Box>
              )}

              <Stack gap={4}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Item Name *
                  </Text>
                  <Input
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                  />
                </Box>
              </Stack>
            </DialogBody>

            <DialogFooter gap={3}>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                colorPalette="gray"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                colorPalette="red"
                disabled={!itemName || loading}
              >
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateFoundItemModalSimple;