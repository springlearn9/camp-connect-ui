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
import { lostItemService } from '../../services/lostItemService';
import type { LostItemRequest } from '../../types/lostItem';
import type { EditLostItemModalProps } from '../../types/lostItem';

const EditLostItemModalFixed: React.FC<EditLostItemModalProps> = ({
  isOpen,
  onClose,
  onLostItemUpdated,
  lostItem
}) => {
  console.log('EditLostItemModalFixed rendered, isOpen:', isOpen, 'lostItem:', lostItem);
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<LostItemRequest>>({
    itemName: '',
    description: '',
    location: '',
    lostDate: '',
    status: 'PENDING',
    category: 'OTHER',
    contactInfo: '',
    imageUrl: '',
    urgent: false,
    isAnonymous: false,
    userId: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lostItem && isOpen) {
      setFormData({
        itemName: lostItem.itemName,
        description: lostItem.description || '',
        location: lostItem.location || '',
        lostDate: lostItem.lostDate || '',
        status: lostItem.status,
        category: lostItem.category,
        contactInfo: lostItem.contactInfo || '',
        imageUrl: lostItem.imageUrl || '',
        urgent: lostItem.urgent || false,
        isAnonymous: lostItem.isAnonymous || false,
        userId: lostItem.userId
      });
    }
  }, [lostItem, isOpen]);

  const handleInputChange = (field: keyof LostItemRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleCheckboxChange = (field: keyof LostItemRequest, value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.userId || !lostItem) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await lostItemService.update(lostItem.id, formData as LostItemRequest);
      onLostItemUpdated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update lost item');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      itemName: '',
      description: '',
      location: '',
      lostDate: '',
      status: 'PENDING',
      category: 'OTHER',
      contactInfo: '',
      imageUrl: '',
      urgent: false,
      isAnonymous: false,
      userId: 0
    });
    setError(null);
    onClose();
  };

  if (!lostItem) return null;

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => !details.open && handleClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxW="lg" bg="gray.900" borderColor="gray.700">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle color="white">Edit Lost Item</DialogTitle>
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
                    placeholder="Describe the lost item"
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
                        value={formData.status || 'PENDING'}
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
                        <option value="PENDING">Pending</option>
                        <option value="SEARCHING">Searching</option>
                        <option value="FOUND">Found</option>
                        <option value="CLAIMED">Claimed</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Location Last Seen
                  </Text>
                  <Input
                    placeholder="Where did you last see it?"
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
                {loading ? 'Updating...' : 'Update Lost Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default EditLostItemModalFixed;