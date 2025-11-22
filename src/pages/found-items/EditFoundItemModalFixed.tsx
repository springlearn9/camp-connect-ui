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
import type { EditFoundItemModalProps } from '../../types/foundItem';

const EditFoundItemModalFixed: React.FC<EditFoundItemModalProps> = ({
  isOpen,
  onClose,
  onFoundItemUpdated,
  foundItem
}) => {
  console.log('EditFoundItemModalFixed rendered, isOpen:', isOpen, 'foundItem:', foundItem);
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
    if (foundItem && isOpen) {
      setFormData({
        itemName: foundItem.itemName,
        description: foundItem.description || '',
        location: foundItem.location || '',
        foundDate: foundItem.foundDate || '',
        status: foundItem.status,
        category: foundItem.category,
        contactInfo: foundItem.contactInfo || '',
        photoUrl: foundItem.photoUrl || '',
        distinctiveFeatures: foundItem.distinctiveFeatures || '',
        handoverLocation: foundItem.handoverLocation || '',
        verificationRequired: foundItem.verificationRequired ?? true,
        reportedById: foundItem.reportedById
      });
    }
  }, [foundItem, isOpen]);

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
    
    if (!formData.itemName || !formData.reportedById || !foundItem) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await foundItemService.update(foundItem.id, formData as FoundItemRequest);
      onFoundItemUpdated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update found item');
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

  if (!foundItem) return null;

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => !details.open && handleClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxW="lg" bg="gray.900" borderColor="gray.700">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle color="white">Edit Found Item</DialogTitle>
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

                <Box display="flex" gap={4}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                      Category
                    </Text>
                    <Box>
                      <select
                        value={formData.category || 'OTHER'}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        style={{
                          background: '#2D3748',
                          border: '1px solid #4A5568',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          width: '100%'
                        }}
                      >
                        <option value="ELECTRONICS">Electronics</option>
                        <option value="DOCUMENTS">Documents</option>
                        <option value="CLOTHING">Clothing</option>
                        <option value="ACCESSORIES">Accessories</option>
                        <option value="BOOKS">Books</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </Box>
                  </Box>

                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                      Status
                    </Text>
                    <Box>
                      <select
                        value={formData.status || 'AVAILABLE'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        style={{
                          background: '#2D3748',
                          border: '1px solid #4A5568',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          width: '100%'
                        }}
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="CLAIMED">Claimed</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="EXPIRED">Expired</option>
                      </select>
                    </Box>
                  </Box>
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
                    Handover Location
                  </Text>
                  <Input
                    placeholder="Where can the owner collect it?"
                    value={formData.handoverLocation || ''}
                    onChange={(e) => handleInputChange('handoverLocation', e.target.value)}
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
                {loading ? 'Updating...' : 'Update Found Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default EditFoundItemModalFixed;