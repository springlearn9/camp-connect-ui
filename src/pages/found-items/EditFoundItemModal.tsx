import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Button,
  Input,
  Textarea,
  Stack,
  Checkbox,
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

const EditFoundItemModal: React.FC<EditFoundItemModalProps> = ({
  isOpen,
  onClose,
  onFoundItemUpdated,
  foundItem
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<FoundItemRequest>>({
    itemName: '',
    description: '',
    foundLocation: '',
    foundDate: '',
    category: 'OTHER',
    handoverLocation: '',
    verificationRequired: true,
    distinctive: '',
    contactInfo: '',
    imageUrl: '',
    additionalImages: '',
    userId: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (foundItem && isOpen) {
      setFormData({
        itemName: foundItem.itemName,
        description: foundItem.description || '',
        foundLocation: foundItem.foundLocation || '',
        foundDate: foundItem.foundDate || '',
        category: foundItem.category,
        handoverLocation: foundItem.handoverLocation || '',
        verificationRequired: foundItem.verificationRequired ?? true,
        distinctive: foundItem.distinctive || '',
        contactInfo: foundItem.contactInfo || '',
        imageUrl: foundItem.imageUrl || '',
        additionalImages: foundItem.additionalImages || '',
        userId: foundItem.userId
      });
    }
  }, [foundItem, isOpen]);

  const handleInputChange = (field: keyof FoundItemRequest, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.userId || !foundItem) {
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
      foundLocation: '',
      foundDate: '',
      category: 'OTHER',
      handoverLocation: '',
      verificationRequired: true,
      distinctive: '',
      contactInfo: '',
      imageUrl: '',
      additionalImages: '',
      userId: 0
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
                    placeholder="Describe the found item in detail"
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

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Location Found
                  </Text>
                  <Input
                    placeholder="Where did you find the item?"
                    value={formData.foundLocation || ''}
                    onChange={(e) => handleInputChange('foundLocation', e.target.value)}
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
                    Date Found
                  </Text>
                  <Input
                    type="datetime-local"
                    value={formData.foundDate ? new Date(formData.foundDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (dateValue) {
                        handleInputChange('foundDate', new Date(dateValue).toISOString());
                      } else {
                        handleInputChange('foundDate', '');
                      }
                    }}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Handover Location
                  </Text>
                  <Input
                    placeholder="Where can the owner collect the item?"
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
                    Distinctive Features
                  </Text>
                  <Textarea
                    placeholder="Describe unique features that only the owner would know"
                    value={formData.distinctive || ''}
                    onChange={(e) => handleInputChange('distinctive', e.target.value)}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                    rows={2}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Contact Information
                  </Text>
                  <Input
                    placeholder="Phone, email, or other contact info"
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

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Image URL
                  </Text>
                  <Input
                    placeholder="Enter image URL (optional)"
                    value={formData.imageUrl || ''}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                  />
                </Box>

                <Box>
                  <Checkbox
                    checked={formData.verificationRequired || false}
                    onChange={(e) => handleInputChange('verificationRequired', e.target.checked)}
                    colorPalette="blue"
                  >
                    <Text color="white" fontSize="sm">Require owner verification to claim</Text>
                  </Checkbox>
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

export default EditFoundItemModal;
