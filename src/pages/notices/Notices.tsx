import React, { useEffect, useState } from 'react';
import { Box, Stack, Text, Button, Badge, Input } from '@chakra-ui/react';
import { Plus, Edit, Trash2, Bell, Paperclip, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { noticeService } from '../../services/noticeService';
import { type Notice } from '../../types/notice';
import CreateNoticeModal from './CreateNoticeModal';
import EditNoticeModal from './EditNoticeModal';

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

const Notices: React.FC = () => {
  const { user } = useAuth(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [notices, setNotices] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [createNoticeModal, setCreateNoticeModal] = useState(false);
  const [editNoticeModal, setEditNoticeModal] = useState<{ open: boolean; notice: Notice | null }>({ open: false, notice: null });

  const loadNotices = async () => {
    setLoading(true);
    setError(null);
    try {
      const noticesData = await noticeService.getAll();
      setNotices(noticesData);
      setFilteredNotices(noticesData);
    } catch (e: any) {
      setError(e?.message || 'Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // Filter notices based on search term, category, and priority
  useEffect(() => {
    let filtered = notices;

    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(notice => notice.category === categoryFilter);
    }

    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(notice => notice.priority === priorityFilter);
    }

    setFilteredNotices(filtered);
  }, [notices, searchTerm, categoryFilter, priorityFilter]);



  const handleEditNotice = (notice: Notice) => {
    setEditNoticeModal({ open: true, notice });
  };

  const handleDeleteNotice = async (noticeId: number) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    
    try {
      await noticeService.delete(noticeId);
      await loadNotices(); // Reload notices after deletion
    } catch (e: any) {
      alert(e?.message || 'Failed to delete notice');
    }
  };

  const handleNoticeCreated = () => {
    loadNotices();
  };

  const handleNoticeUpdated = () => {
    loadNotices();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'NORMAL': return 'blue';
      case 'LOW': return 'gray';
      default: return 'gray';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ACADEMIC': return 'green';
      case 'ADMINISTRATIVE': return 'blue';
      case 'EVENT': return 'purple';
      case 'GENERAL': return 'gray';
      default: return 'gray';
    }
  };

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  return (
    <Box p={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Box>
          <Text as="h1" fontSize="2xl" fontWeight="bold" color="white">Notices</Text>
          <Text color="gray.400">Important announcements and notifications</Text>
        </Box>
        <Button
          colorPalette="red"
          onClick={() => setCreateNoticeModal(true)}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          Create Notice
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box display="flex" gap={4} mb={6}>
        <Box position="relative" flex="1">
          <Input
            placeholder="Search notices by title or description..."
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
            <option value="ACADEMIC">Academic</option>
            <option value="ADMINISTRATIVE">Administrative</option>
            <option value="EVENT">Event</option>
            <option value="GENERAL">General</option>
          </select>
        </Box>
        <Box w="200px">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              background: '#2D3748',
              border: '1px solid #4A5568',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              width: '100%'
            }}
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </Box>
      </Box>

      {loading && <Text color="gray.400">Loading notices...</Text>}
      {error && <Text color="red.400">{error}</Text>}

      {!loading && filteredNotices.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500" fontSize="lg" mb={2}>No notices found</Text>
          <Text color="gray.400" fontSize="sm">
            {searchTerm || categoryFilter !== 'ALL' || priorityFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first notice to get started'
            }
          </Text>
        </Box>
      )}

      {/* Notices List */}
      <Stack gap={4}>
        {filteredNotices.map((notice) => (
          <Box key={notice.id} bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
            <Box display="flex" justifyContent="space-between" alignItems="start" mb={4}>
              <Box flex="1">
                <Box display="flex" alignItems="center" gap={3} mb={2}>
                  <Bell size={16} color="#9CA3AF" />
                  <Text fontSize="xl" fontWeight="bold" color="white">
                    {notice.title}
                  </Text>
                  <Badge colorPalette={getPriorityColor(notice.priority)} variant="subtle">
                    {notice.priority}
                  </Badge>
                  <Badge colorPalette={getCategoryColor(notice.category)} variant="outline">
                    {notice.category}
                  </Badge>
                  {isExpired(notice.validUntil) && (
                    <Badge colorPalette="red" variant="subtle">
                      Expired
                    </Badge>
                  )}
                </Box>

                {notice.description && (
                  <Text color="gray.300" fontSize="sm" mb={3}>
                    {notice.description}
                  </Text>
                )}

                <Box display="flex" alignItems="center" gap={4} mb={3} color="gray.400" fontSize="sm">
                  {notice.validUntil && (
                    <Text>
                      Valid until: {formatDateTime(notice.validUntil)}
                    </Text>
                  )}
                  {notice.attachmentUrl && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Paperclip size={14} />
                      <a
                        href={notice.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#60A5FA', textDecoration: 'underline' }}
                      >
                        Attachment
                      </a>
                    </Box>
                  )}
                </Box>

                <Box display="flex" alignItems="center" gap={2} color="gray.500" fontSize="xs">
                  <Text>Posted by: {notice.postedByName || 'Unknown'}</Text>
                  <Text>•</Text>
                  <Text>Created: {formatDateTime(notice.createdTimestamp)}</Text>
                  <Text>•</Text>
                  <Text>Status: {notice.status}</Text>
                </Box>
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                size="sm"
                variant="outline"
                colorPalette="blue"
                onClick={() => handleEditNotice(notice)}
              >
                <Edit size={14} style={{ marginRight: '6px' }} />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorPalette="red"
                onClick={() => handleDeleteNotice(notice.id)}
              >
                <Trash2 size={14} style={{ marginRight: '6px' }} />
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Stack>

      {/* Create Notice Modal */}
      <CreateNoticeModal
        isOpen={createNoticeModal}
        onClose={() => setCreateNoticeModal(false)}
        onNoticeCreated={handleNoticeCreated}
      />

      {/* Edit Notice Modal */}
      <EditNoticeModal
        isOpen={editNoticeModal.open}
        onClose={() => setEditNoticeModal({ open: false, notice: null })}
        onNoticeUpdated={handleNoticeUpdated}
        notice={editNoticeModal.notice!}
      />
    </Box>
  );
};

export default Notices;