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
import { Upload, X } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      if (error) setError(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted');
    console.log('Form data:', formData);
    console.log('reportedById:', formData.reportedById);
    
    if (!formData.itemName || !formData.reportedById) {
      const errorMsg = 'Please fill in all required fields (Item name is required)';
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Upload image to server and get URL
      // For now, we'll use the preview URL or a placeholder
      const itemData = {
        ...formData,
        photoUrl: imagePreview || formData.photoUrl || ''
      };
      
      console.log('Sending data to API:', itemData);
      const result = await foundItemService.create(itemData as FoundItemRequest);
      console.log('Item created successfully:', result);
      
      alert('Found item reported successfully!');
      onFoundItemCreated();
      handleClose();
    } catch (err: any) {
      console.error('Error creating found item:', err);
      const errorMsg = err.message || 'Failed to create found item';
      setError(errorMsg);
      alert(errorMsg);
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
    setSelectedImage(null);
    setImagePreview(null);
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

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Item Photo
                  </Text>
                  
                  {!imagePreview ? (
                    <Box
                      as="label"
                      htmlFor="image-upload"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      p={6}
                      border="2px dashed"
                      borderColor="gray.600"
                      rounded="lg"
                      cursor="pointer"
                      bg="gray.800"
                      _hover={{ borderColor: 'blue.400', bg: 'gray.750' }}
                      transition="all 0.2s"
                    >
                      <Upload size={32} color="#9CA3AF" style={{ marginBottom: '8px' }} />
                      <Text color="gray.300" fontSize="sm" mb={1}>
                        Click to upload image
                      </Text>
                      <Text color="gray.500" fontSize="xs">
                        PNG, JPG up to 5MB
                      </Text>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        display="none"
                      />
                    </Box>
                  ) : (
                    <Box position="relative" rounded="lg" overflow="hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: '100%',
                          maxHeight: '200px',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <Button
                        position="absolute"
                        top={2}
                        right={2}
                        size="sm"
                        colorPalette="red"
                        onClick={handleRemoveImage}
                        rounded="full"
                      >
                        <X size={16} />
                      </Button>
                    </Box>
                  )}
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
                colorPalette="red"
                bg="red.600"
                color="white"
                _hover={{ bg: 'red.500' }}
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