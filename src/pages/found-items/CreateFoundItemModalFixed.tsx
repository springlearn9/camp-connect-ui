import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Input,
  Textarea,
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

const CreateFoundItemModalFixed: React.FC<CreateFoundItemModalProps> = ({
  isOpen,
  onClose,
  onFoundItemCreated
}) => {
  console.log('CreateFoundItemModalFixed rendered, isOpen:', isOpen);
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<FoundItemRequest>>({
    itemName: '',
    description: '',
    location: '',
    foundDate: '',
    status: 'AVAILABLE',
    category: 'OTHER',
    contactInfo: '',
    photoUrl: '',
    distinctiveFeatures: '',
    handoverLocation: '',
    verificationRequired: true,
    reportedById: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      const userId = (user as any)?.memberId ?? (user as any)?.memberID ?? (user as any)?.id ?? 0;
      setFormData(prev => ({ ...prev, reportedById: userId }));
    }
  }, [user, isOpen]);

  const handleInputChange = (field: keyof FoundItemRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleCheckboxChange = (field: keyof FoundItemRequest, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.reportedById) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await foundItemService.create(formData as FoundItemRequest);
      onFoundItemCreated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create found item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      itemName: '',
      description: '',
      location: '',
      foundDate: '',
      status: 'AVAILABLE',
      category: 'OTHER',
      contactInfo: '',
      photoUrl: '',
      distinctiveFeatures: '',
      handoverLocation: '',
      verificationRequired: true,
      reportedById: 0
    });
    setError(null);
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => !details.open && handleClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxW="lg" bg="gray.900" borderColor="gray.700">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle color="white">Report Found Item</DialogTitle>
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
                    value={formData.itemName || ''}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Description
                  </Text>
                  <Textarea
                    placeholder="Describe the found item"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                    rows={3}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Location Found
                  </Text>
                  <Input
                    placeholder="Where did you find it?"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"  
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Contact Information
                  </Text>
                  <Input
                    placeholder="Phone or email"
                    value={formData.contactInfo || ''}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
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
                rounded="full"
                bg="gray.700"
                color="gray.300"
                borderColor="gray.600"
                _hover={{ bg: 'gray.600', color: 'white', borderColor: 'gray.500' }}
                transition="all 0.2s"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                colorPalette="gray"
                variant="outline"
                rounded="full"
                bg="gray.600"
                color="white"
                borderColor="gray.500"
                _hover={{ bg: 'white', color: 'black', borderColor: 'gray.400' }}
                transition="all 0.2s"
                disabled={!formData.itemName || loading}
              >
                {loading ? 'Reporting...' : 'Report Found Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateFoundItemModalFixed;