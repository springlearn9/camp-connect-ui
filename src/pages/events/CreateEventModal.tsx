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
import { eventService } from '../../services/eventService';
import type { EventRequest } from '../../types/event';
import type { CreateEventModalProps } from '../../types/event';

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<Partial<EventRequest>>({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    imageUrl: '',
    status: 'ACTIVE',
    postedById: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && isOpen) {
      // Set posted by ID from current user
      const userId = (user as any)?.memberId ?? (user as any)?.memberID ?? (user as any)?.id ?? 0;
      setFormData(prev => ({ ...prev, postedById: userId }));
    }
  }, [user, isOpen]);

  const handleInputChange = (field: keyof EventRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.location || !formData.eventDate || !formData.postedById) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await eventService.create(formData as EventRequest);
      onEventCreated();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      location: '',
      imageUrl: '',
      status: 'ACTIVE',
      postedById: 0
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
              <DialogTitle color="white">Create New Event</DialogTitle>
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
                    Event Title *
                  </Text>
                  <Input
                    placeholder="Enter event title"
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
                    placeholder="Enter event description"
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
                    Event Date & Time *
                  </Text>
                  <Input
                    type="datetime-local"
                    value={formData.eventDate ? new Date(formData.eventDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const dateValue = e.target.value;
                      if (dateValue) {
                        handleInputChange('eventDate', new Date(dateValue).toISOString());
                      } else {
                        handleInputChange('eventDate', '');
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
                    Location *
                  </Text>
                  <Input
                    placeholder="Enter event location"
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
                      <option value="CANCELLED">Cancelled</option>
                      <option value="COMPLETED">Completed</option>
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
                disabled={!formData.title || !formData.location || !formData.eventDate || loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
};

export default CreateEventModal;