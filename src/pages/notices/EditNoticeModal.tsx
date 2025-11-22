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
import { noticeService } from '../../services/noticeService';
import type { NoticeRequest } from '../../types/notice';
import type { EditNoticeModalProps } from '../../types/notice';

const EditNoticeModal: React.FC<EditNoticeModalProps> = ({
  isOpen,
  onClose,
  onNoticeUpdated,
  notice
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<NoticeRequest>>({
    title: '',
    description: '',
    priority: 'NORMAL',
    category: 'GENERAL',
    validUntil: '',
    status: 'ACTIVE',
    attachmentUrl: '',
    postedById: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (notice && isOpen) {
      setFormData({
        title: notice.title,
        description: notice.description || '',
        priority: notice.priority,
        category: notice.category,
        validUntil: notice.validUntil || '',
        status: notice.status,
        attachmentUrl: notice.attachmentUrl || '',
        postedById: notice.postedById
      });
    }
  }, [notice, isOpen]);

  const handleInputChange = (field: keyof NoticeRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.postedById || !notice) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await noticeService.update(notice.id, formData as NoticeRequest);
      onNoticeUpdated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update notice');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'NORMAL',
      category: 'GENERAL',
      validUntil: '',
      status: 'ACTIVE',
      attachmentUrl: '',
      postedById: 0
    });
    setError(null);
    onClose();
  };

  if (!notice) return null;

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => !details.open && handleClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent maxW="lg" bg="gray.900" borderColor="gray.700">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle color="white">Edit Notice</DialogTitle>
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
                    Notice Title *
                  </Text>
                  <Input
                    placeholder="Enter notice title"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
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
                    placeholder="Enter notice description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    bg="gray.800"
                    border="1px solid"
                    borderColor="gray.600"
                    _focus={{ borderColor: 'blue.400' }}
                    color="white"
                    _placeholder={{ color: 'gray.400' }}
                    rows={4}
                  />
                </Box>

                <Box display="flex" gap={4}>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                      Priority
                    </Text>
                    <Box>
                      <select
                        value={formData.priority || 'NORMAL'}
                        onChange={(e) => handleInputChange('priority', e.target.value)}
                        style={{
                          background: '#2D3748',
                          border: '1px solid #4A5568',
                          color: 'white',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          width: '100%'
                        }}
                      >
                        <option value="HIGH">High</option>
                        <option value="NORMAL">Normal</option>
                        <option value="LOW">Low</option>
                      </select>
                    </Box>
                  </Box>

                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                      Category
                    </Text>
                    <Box>
                      <select
                        value={formData.category || 'GENERAL'}
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
                        <option value="ACADEMIC">Academic</option>
                        <option value="ADMINISTRATIVE">Administrative</option>
                        <option value="EVENT">Event</option>
                        <option value="GENERAL">General</option>
                      </select>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Valid Until
                  </Text>
                  <Input
                    type="datetime-local"
                    value={formData.validUntil ? new Date(formData.validUntil).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (dateValue) {
                        handleInputChange('validUntil', new Date(dateValue).toISOString());
                      } else {
                        handleInputChange('validUntil', '');
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
                    Attachment URL
                  </Text>
                  <Input
                    placeholder="Enter attachment URL (optional)"
                    value={formData.attachmentUrl || ''}
                    onChange={(e) => handleInputChange('attachmentUrl', e.target.value)}
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
                    Status
                  </Text>
                  <Box>
                    <select
                      value={formData.status || 'ACTIVE'}
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
                      <option value="ACTIVE">Active</option>
                      <option value="ARCHIVED">Archived</option>
                      <option value="DRAFT">Draft</option>
                    </select>
                  </Box>
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
                disabled={!formData.title || loading}
              >
                {loading ? 'Updating...' : 'Update Notice'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default EditNoticeModal;
