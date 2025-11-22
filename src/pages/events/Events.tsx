import React, { useEffect, useState } from 'react';
import { Box, Stack, Text, Button, Badge, Input } from '@chakra-ui/react';
import { Plus, Edit, Trash2, Calendar, MapPin, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { eventService } from '../../services/eventService';
import { type Event } from '../../types/event';
import CreateEventModal from './CreateEventModal';
import EditEventModal from './EditEventModal';

const formatDateTime = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Events: React.FC = () => {
  const { user } = useAuth(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [createEventModal, setCreateEventModal] = useState(false);
  const [editEventModal, setEditEventModal] = useState<{ open: boolean; event: Event | null }>({ open: false, event: null });

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventsData = await eventService.getAll();
      setEvents(eventsData);
      setFilteredEvents(eventsData);
    } catch (e: any) {
      setError(e?.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Filter events based on search term and status
  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter]);



  const handleEditEvent = (event: Event) => {
    setEditEventModal({ open: true, event });
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.delete(eventId);
      await loadEvents(); // Reload events after deletion
    } catch (e: any) {
      alert(e?.message || 'Failed to delete event');
    }
  };

  const handleEventCreated = () => {
    loadEvents();
  };

  const handleEventUpdated = () => {
    loadEvents();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'CANCELLED': return 'red';
      case 'COMPLETED': return 'blue';
      default: return 'gray';
    }
  };

  const isUpcoming = (eventDate: string) => {
    return new Date(eventDate) > new Date();
  };

  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Text as="h1" fontSize="2xl" fontWeight="bold" color="white">Events</Text>
          <Text color="gray.400">Manage campus events and activities</Text>
        </Box>
        <Button
          colorPalette="red"
          onClick={() => setCreateEventModal(true)}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          Create Event
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box display="flex" gap={4} mb={6}>
        <Box position="relative" flex="1">
          <Input
            placeholder="Search events by title, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="gray.800"
            borderColor="gray.700"
            color="white"
            _placeholder={{ color: 'gray.400' }}
            pl={10}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
        </Box>
        <Box w="200px">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              background: '#2D3748',
              border: '1px solid #4A5568',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              width: '100%'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </Box>
      </Box>

      {loading && <Text color="gray.400">Loading events...</Text>}
      {error && <Text color="red.400">{error}</Text>}

      {!loading && filteredEvents.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500" fontSize="lg" mb={2}>No events found</Text>
          <Text color="gray.400" fontSize="sm">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first event to get started'
            }
          </Text>
        </Box>
      )}

      {/* Events Grid */}
      <Stack gap={4}>
        {filteredEvents.map((event) => (
          <Box key={event.id} bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={4}>
              <Box flex="1">
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    {event.title}
                  </Text>
                  <Badge colorPalette={getStatusColor(event.status)} variant="subtle">
                    {event.status}
                  </Badge>
                  {isUpcoming(event.eventDate) && (
                    <Badge colorPalette="yellow" variant="subtle">
                      Upcoming
                    </Badge>
                  )}
                </Box>

                <Box display="flex" alignItems="center" gap={4} mb={3} color="gray.400">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Calendar size={16} />
                    <Text fontSize="sm">{formatDateTime(event.eventDate)}</Text>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MapPin size={16} />
                    <Text fontSize="sm">{event.location}</Text>
                  </Box>
                </Box>

                {event.description && (
                  <Text color="gray.300" fontSize="sm" mb={3}>
                    {event.description}
                  </Text>
                )}

                <Box display="flex" alignItems="center" gap={2} color="gray.500" fontSize="xs">
                  <Text>Posted by: {event.postedByName || 'Unknown'}</Text>
                  <Text>•</Text>
                  <Text>Created: {formatDateTime(event.createdTimestamp)}</Text>
                </Box>
              </Box>

              {event.imageUrl && (
                <Box ml={4}>
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    style={{
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </Box>
              )}
            </Box>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                size="sm"
                variant="outline"
                colorPalette="blue"
                onClick={() => handleEditEvent(event)}
              >
                <Edit size={14} style={{ marginRight: '6px' }} />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => handleDeleteEvent(event.id)}
              >
                <Trash2 size={14} style={{ marginRight: '6px' }} />
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={createEventModal}
        onClose={() => setCreateEventModal(false)}
        onEventCreated={handleEventCreated}
      />

      {/* Edit Event Modal */}
      <EditEventModal
        isOpen={editEventModal.open}
        onClose={() => setEditEventModal({ open: false, event: null })}
        onEventUpdated={handleEventUpdated}
        event={editEventModal.event!}
      />
    </Box>
  );
};

export default Events;