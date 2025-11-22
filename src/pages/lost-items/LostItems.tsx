import React, { useEffect, useState } from 'react';
import { Box, Stack, Text, Button, Badge, Input } from '@chakra-ui/react';
import { Plus, Edit, Trash2, Search, MapPin, DollarSign, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { lostItemService } from '../../services/lostItemService';
import { type LostItem } from '../../types/lostItem';
import CreateLostItemModalFixed from './CreateLostItemModalFixed';
import EditLostItemModalFixed from './EditLostItemModalFixed';

const formatDateTime = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const LostItems: React.FC = () => {
  const { user } = useAuth(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [filteredLostItems, setFilteredLostItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [createLostItemModal, setCreateLostItemModal] = useState(false);
  const [editLostItemModal, setEditLostItemModal] = useState<{ open: boolean; lostItem: LostItem | null }>({ open: false, lostItem: null });

  const loadLostItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const lostItemsData = await lostItemService.getAll();
      setLostItems(lostItemsData);
      setFilteredLostItems(lostItemsData);
    } catch (e: any) {
      setError(e?.message || 'Failed to load lost items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLostItems();
  }, []);

  // Filter lost items based on search term, category, and status
  useEffect(() => {
    let filtered = lostItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredLostItems(filtered);
  }, [lostItems, searchTerm, categoryFilter, statusFilter]);



  const handleEditLostItem = (lostItem: LostItem) => {
    setEditLostItemModal({ open: true, lostItem });
  };

  const handleDeleteLostItem = async (lostItemId: number) => {
    if (!confirm('Are you sure you want to delete this lost item?')) return;
    
    try {
      await lostItemService.delete(lostItemId);
      await loadLostItems(); // Reload lost items after deletion
    } catch (e: any) {
      alert(e?.message || 'Failed to delete lost item');
    }
  };

  const handleLostItemCreated = () => {
    loadLostItems();
  };

  const handleLostItemUpdated = () => {
    loadLostItems();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'yellow';
      case 'SEARCHING': return 'blue';
      case 'FOUND': return 'green';
      case 'CLAIMED': return 'purple';
      case 'CLOSED': return 'gray';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ELECTRONICS': return 'blue';
      case 'DOCUMENTS': return 'orange';
      case 'CLOTHING': return 'green';
      case 'ACCESSORIES': return 'purple';
      case 'BOOKS': return 'teal';
      case 'OTHER': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Text as="h1" fontSize="2xl" fontWeight="bold" color="white">Lost Items</Text>
          <Text color="gray.400">Report and track lost items on campus</Text>
        </Box>
        <Button
          colorPalette="red"
          onClick={() => setCreateLostItemModal(true)}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          Report Lost Item
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box display="flex" gap={4} mb={6}>
        <Box position="relative" flex="1">
          <Input
            placeholder="Search lost items by name, description, or location..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              background: '#2D3748',
              border: '1px solid #4A5568',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              width: '100%'
            }}
          >
            <option value="ALL">All Categories</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="DOCUMENTS">Documents</option>
            <option value="CLOTHING">Clothing</option>
            <option value="ACCESSORIES">Accessories</option>
            <option value="BOOKS">Books</option>
            <option value="OTHER">Other</option>
          </select>
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
            <option value="PENDING">Pending</option>
            <option value="SEARCHING">Searching</option>
            <option value="FOUND">Found</option>
            <option value="CLAIMED">Claimed</option>
            <option value="CLOSED">Closed</option>
          </select>
        </Box>
      </Box>

      {loading && <Text color="gray.400">Loading lost items...</Text>}
      {error && <Text color="red.400">{error}</Text>}

      {!loading && filteredLostItems.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500" fontSize="lg" mb={2}>No lost items found</Text>
          <Text color="gray.400" fontSize="sm">
            {searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria'
              : 'Report your first lost item to get started'
            }
          </Text>
        </Box>
      )}

      {/* Lost Items Grid */}
      <Stack gap={4}>
        {filteredLostItems.map((item) => (
          <Box key={item.id} bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={4}>
              <Box flex="1">
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    {item.itemName}
                  </Text>
                  <Badge colorPalette={getStatusColor(item.status)} variant="subtle">
                    {item.status}
                  </Badge>
                  <Badge colorPalette={getCategoryColor(item.category)} variant="outline">
                    {item.category}
                  </Badge>
                  {item.urgent && (
                    <Badge colorPalette="red" variant="solid">
                      URGENT
                    </Badge>
                  )}
                </Box>

                {item.description && (
                  <Text color="gray.300" fontSize="sm" mb={3}>
                    {item.description}
                  </Text>
                )}

                <Box display="flex" alignItems="center" gap={4} mb={3} color="gray.400" fontSize="sm">
                  {item.location && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <MapPin size={14} />
                      <Text>Lost at: {item.location}</Text>
                    </Box>
                  )}
                  {item.lostDate && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Clock size={14} />
                      <Text>Lost on: {formatDateTime(item.lostDate)}</Text>
                    </Box>
                  )}
                  {item.rewardAmount && item.rewardAmount > 0 && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <DollarSign size={14} />
                      <Text color="green.400" fontWeight="semibold">
                        Reward: ₹{item.rewardAmount}
                      </Text>
                    </Box>
                  )}
                </Box>

                <Box display="flex" alignItems="center" gap={2} color="gray.500" fontSize="xs">
                  <Text>Reported by: {item.userName || 'Anonymous'}</Text>
                  <Text>•</Text>
                  <Text>Created: {formatDateTime(item.createdTimestamp)}</Text>
                  {item.contactInfo && !item.isAnonymous && (
                    <>
                      <Text>•</Text>
                      <Text>Contact: {item.contactInfo}</Text>
                    </>
                  )}
                </Box>
              </Box>

              {item.imageUrl && (
                <Box ml={4}>
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
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
                onClick={() => handleEditLostItem(item)}
              >
                <Edit size={14} style={{ marginRight: '6px' }} />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => handleDeleteLostItem(item.id)}
              >
                <Trash2 size={14} style={{ marginRight: '6px' }} />
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Create Lost Item Modal */}
      <CreateLostItemModalFixed
        isOpen={createLostItemModal}
        onClose={() => setCreateLostItemModal(false)}
        onLostItemCreated={handleLostItemCreated}
      />

      {/* Edit Lost Item Modal */}
      <EditLostItemModalFixed
        isOpen={editLostItemModal.open}
        onClose={() => setEditLostItemModal({ open: false, lostItem: null })}
        onLostItemUpdated={handleLostItemUpdated}
        lostItem={editLostItemModal.lostItem!}
      />
    </Box>
  );
};

export default LostItems;