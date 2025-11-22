import React, { useEffect, useState } from 'react';
import { Box, Stack, Text, Button, Badge, Input } from '@chakra-ui/react';
import { Plus, Edit, Trash2, Search, MapPin, Package, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { foundItemService } from '../../services/foundItemService';
import { type FoundItem } from '../../types/foundItem';
import CreateFoundItemModalFixed from './CreateFoundItemModalFixed';
import EditFoundItemModalFixed from './EditFoundItemModalFixed';

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

const FoundItems: React.FC = () => {
  const { user } = useAuth(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [filteredFoundItems, setFilteredFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [createFoundItemModal, setCreateFoundItemModal] = useState(false);
  const [editFoundItemModal, setEditFoundItemModal] = useState<{ open: boolean; foundItem: FoundItem | null }>({ open: false, foundItem: null });

  const loadFoundItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const foundItemsData = await foundItemService.getAll();
      setFoundItems(foundItemsData);
      setFilteredFoundItems(foundItemsData);
    } catch (e: any) {
      setError(e?.message || 'Failed to load found items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoundItems();
  }, []);

  // Filter found items based on search term, category, and status
  useEffect(() => {
    let filtered = foundItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.distinctiveFeatures?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredFoundItems(filtered);
  }, [foundItems, searchTerm, categoryFilter, statusFilter]);



  const handleEditFoundItem = (foundItem: FoundItem) => {
    setEditFoundItemModal({ open: true, foundItem });
  };

  const handleDeleteFoundItem = async (foundItemId: number) => {
    if (!confirm('Are you sure you want to delete this found item?')) return;
    
    try {
      await foundItemService.delete(foundItemId);
      await loadFoundItems(); // Reload found items after deletion
    } catch (e: any) {
      alert(e?.message || 'Failed to delete found item');
    }
  };

  const handleFoundItemCreated = () => {
    loadFoundItems();
  };

  const handleFoundItemUpdated = () => {
    loadFoundItems();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'green';
      case 'CLAIMED': return 'blue';
      case 'VERIFIED': return 'purple';
      case 'EXPIRED': return 'gray';
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
          <Text as="h1" fontSize="2xl" fontWeight="bold" color="white">Found Items</Text>
          <Text color="gray.400">Help reunite lost items with their owners</Text>
        </Box>
        <Button
          colorPalette="red"
          onClick={() => setCreateFoundItemModal(true)}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          Report Found Item
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box display="flex" gap={4} mb={6}>
        <Box position="relative" flex="1">
          <Input
            placeholder="Search found items by name, description, location, or features..."
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
            <option value="AVAILABLE">Available</option>
            <option value="CLAIMED">Claimed</option>
            <option value="VERIFIED">Verified</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </Box>
      </Box>

      {loading && <Text color="gray.400">Loading found items...</Text>}
      {error && <Text color="red.400">{error}</Text>}

      {!loading && filteredFoundItems.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500" fontSize="lg" mb={2}>No found items</Text>
          <Text color="gray.400" fontSize="sm">
            {searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria'
              : 'Report your first found item to help others'
            }
          </Text>
        </Box>
      )}

      {/* Found Items Grid */}
      <Stack gap={4}>
        {filteredFoundItems.map((item) => (
          <Box key={item.id} bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={4}>
              <Box flex="1">
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                  <Package size={16} color="#9CA3AF" />
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    {item.itemName}
                  </Text>
                  <Badge colorPalette={getStatusColor(item.status)} variant="subtle">
                    {item.status}
                  </Badge>
                  <Badge colorPalette={getCategoryColor(item.category)} variant="outline">
                    {item.category}
                  </Badge>
                  {item.verificationRequired && (
                    <Badge colorPalette="yellow" variant="outline">
                      Verification Required
                    </Badge>
                  )}
                </Box>

                {item.description && (
                  <Text color="gray.300" fontSize="sm" mb={3}>
                    {item.description}
                  </Text>
                )}

                {item.distinctiveFeatures && (
                  <Box mb={3}>
                    <Text color="gray.400" fontSize="xs" mb={1}>Distinctive Features:</Text>
                    <Text color="gray.300" fontSize="sm">
                      {item.distinctiveFeatures}
                    </Text>
                  </Box>
                )}

                <Box display="flex" alignItems="center" gap={4} mb={3} color="gray.400" fontSize="sm">
                  {item.location && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <MapPin size={14} />
                      <Text>Found at: {item.location}</Text>
                    </Box>
                  )}
                  {item.foundDate && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Clock size={14} />
                      <Text>Found on: {formatDateTime(item.foundDate)}</Text>
                    </Box>
                  )}
                  {item.handoverLocation && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Package size={14} />
                      <Text>Handover at: {item.handoverLocation}</Text>
                    </Box>
                  )}
                </Box>

                {item.claimedByNames && item.claimedByNames.length > 0 && (
                  <Box mb={3}>
                    <Text color="gray.400" fontSize="xs" mb={1}>Claimed by:</Text>
                    <Text color="blue.300" fontSize="sm">
                      {item.claimedByNames.join(', ')}
                      {item.claimedAt && ` on ${formatDateTime(item.claimedAt)}`}
                    </Text>
                  </Box>
                )}

                <Box display="flex" alignItems="center" gap={2} color="gray.500" fontSize="xs">
                  <Text>Reported by: {item.reportedByName || 'Anonymous'}</Text>
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

              {item.photoUrl && (
                <Box ml={4}>
                  <img
                    src={item.photoUrl}
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
                onClick={() => handleEditFoundItem(item)}
              >
                <Edit size={14} style={{ marginRight: '6px' }} />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => handleDeleteFoundItem(item.id)}
              >
                <Trash2 size={14} style={{ marginRight: '6px' }} />
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Create Found Item Modal */}
      <CreateFoundItemModalFixed
        isOpen={createFoundItemModal}
        onClose={() => setCreateFoundItemModal(false)}
        onFoundItemCreated={handleFoundItemCreated}
      />

      {/* Edit Found Item Modal */}
      <EditFoundItemModalFixed
        isOpen={editFoundItemModal.open}
        onClose={() => setEditFoundItemModal({ open: false, foundItem: null })}
        onFoundItemUpdated={handleFoundItemUpdated}
        foundItem={editFoundItemModal.foundItem!}
      />
    </Box>
  );
};

export default FoundItems;