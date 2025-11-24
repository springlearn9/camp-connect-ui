import React, { useState, useEffect } from 'react';
import { Box, Stack, Heading, Text, Button, Badge } from '@chakra-ui/react';
import { Calendar, Bell, Search, Package, ArrowRight, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { noticeService } from '../services/noticeService';
import { lostItemService } from '../services/lostItemService';
import { foundItemService } from '../services/foundItemService';

interface DashboardStats {
  totalEvents: number;
  totalNotices: number;
  totalLostItems: number;
  totalFoundItems: number;
  upcomingEvents: number;
  highPriorityNotices: number;
  activeLostItems: number;
  availableFoundItems: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalNotices: 0,
    totalLostItems: 0,
    totalFoundItems: 0,
    upcomingEvents: 0,
    highPriorityNotices: 0,
    activeLostItems: 0,
    availableFoundItems: 0,
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [recentNotices, setRecentNotices] = useState<any[]>([]);
  const [recentLostItems, setRecentLostItems] = useState<any[]>([]);
  const [recentFoundItems, setRecentFoundItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch real data, fallback to mock data if API fails
      try {
        const [events, notices, lostItems, foundItems, upcomingEvents] = await Promise.all([
          eventService.getAll().catch(() => []),
          noticeService.getAll().catch(() => []),
          lostItemService.getAll().catch(() => []),
          foundItemService.getAll().catch(() => []),
          eventService.getUpcoming().catch(() => []),
        ]);

        const highPriorityNotices = notices.filter(notice => notice.priority === 'HIGH');
        const activeLostItems = lostItems.filter(item => item.status === 'SEARCHING' || item.status === 'PENDING');
        const availableFoundItems = foundItems.filter(item => item.status === 'AVAILABLE');

        setStats({
          totalEvents: events.length,
          totalNotices: notices.length,
          totalLostItems: lostItems.length,
          totalFoundItems: foundItems.length,
          upcomingEvents: upcomingEvents.length,
          highPriorityNotices: highPriorityNotices.length,
          activeLostItems: activeLostItems.length,
          availableFoundItems: availableFoundItems.length,
        });

        setRecentEvents(events.slice(0, 3));
        setRecentNotices(notices.slice(0, 3));
        setRecentLostItems(lostItems.slice(0, 3));
        setRecentFoundItems(foundItems.slice(0, 3));
      } catch (apiError) {
        // Use mock data when API is not available
        console.log('Using mock data - API not available');
        setStats({
          totalEvents: 15,
          totalNotices: 12,
          totalLostItems: 8,
          totalFoundItems: 5,
          upcomingEvents: 14,
          highPriorityNotices: 6,
          activeLostItems: 6,
          availableFoundItems: 4,
        });

        // Mock recent events
        setRecentEvents([
          {
            id: 1,
            title: "Annual Tech Fest 2025",
            description: "Join us for the biggest technology festival featuring workshops, competitions, and exhibitions from top tech companies.",
            eventDate: "2025-12-23T20:36:00Z",
            location: "Main Auditorium",
            status: "ACTIVE"
          },
          {
            id: 2,
            title: "Career Fair 2025",
            description: "Meet with recruiters from leading companies. Bring your resume and dress professionally.",
            eventDate: "2025-12-08T20:36:00Z",
            location: "Student Center Hall",
            status: "ACTIVE"
          },
          {
            id: 3,
            title: "Cultural Night",
            description: "Showcase your talents! Music, dance, drama, and art performances by students.",
            eventDate: "2025-11-30T20:36:00Z",
            location: "University Theater",
            status: "ACTIVE"
          }
        ]);

        // Mock recent notices
        setRecentNotices([
          {
            id: 1,
            title: "Semester Exam Schedule Released",
            description: "The final examination schedule for the current semester has been released. Students can check their exam dates and timings on the university portal.",
            priority: "HIGH",
            category: "ACADEMIC",
            createdTimestamp: "2025-11-23T08:00:00Z"
          },
          {
            id: 2,
            title: "Library Hours Extended",
            description: "Due to upcoming exams, the library will remain open 24/7 starting next week. Students need to bring their ID cards for entry after 10 P.M.",
            priority: "NORMAL",
            category: "ADMINISTRATIVE",
            createdTimestamp: "2025-11-23T14:30:00Z"
          },
          {
            id: 3,
            title: "New Parking Regulations",
            description: "Please note the new parking regulations effective immediately. All vehicles must display valid parking permits. Unauthorized parking will result in fines.",
            priority: "HIGH",
            category: "ADMINISTRATIVE",
            createdTimestamp: "2025-11-23T16:00:00Z"
          }
        ]);

        // Mock lost items
        setRecentLostItems([
          {
            id: 1,
            itemName: "iPhone 14 Pro",
            description: "Black iPhone 14 Pro with cracked screen protector",
            location: "Main Library",
            lostDate: "2025-11-23T10:00:00Z",
            category: "ELECTRONICS",
            status: "SEARCHING",
            rewardAmount: 500
          },
          {
            id: 2,
            itemName: "Black Backpack",
            description: "Nike black backpack with laptop inside",
            location: "Student Center",
            lostDate: "2025-11-22T15:30:00Z",
            category: "ACCESSORIES",
            status: "PENDING"
          },
          {
            id: 3,
            itemName: "Car Keys",
            description: "Toyota car keys with multiple keychains",
            location: "Parking Lot B",
            lostDate: "2025-11-21T18:00:00Z",
            category: "OTHER",
            status: "SEARCHING"
          }
        ]);

        // Mock found items
        setRecentFoundItems([
          {
            id: 1,
            itemName: "Student ID Card",
            description: "University student ID card found in good condition",
            location: "Library Reading Hall",
            foundDate: "2025-11-23T14:00:00Z",
            category: "DOCUMENTS",
            status: "AVAILABLE"
          },
          {
            id: 2,
            itemName: "Blue Umbrella",
            description: "Large blue umbrella, looks new",
            location: "Cafeteria",
            foundDate: "2025-11-22T12:00:00Z",
            category: "ACCESSORIES",
            status: "AVAILABLE"
          },
          {
            id: 3,
            itemName: "Laptop Charger",
            description: "Dell laptop charger, 65W",
            location: "Computer Lab",
            foundDate: "2025-11-21T16:30:00Z",
            category: "ELECTRONICS",
            status: "AVAILABLE"
          }
        ]);
      }
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box p={6} display="flex" alignItems="center" justifyContent="center" minH="400px">
        <Text color="gray.400">Loading dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Stack gap={6}>
        {/* Header */}
        <Box>
          <Heading size={{ base: 'lg', sm: 'xl' }} color="white" mb={2}>
            Welcome back, {user?.username || 'User'}!
          </Heading>
          <Text color="gray.400" fontSize={{ base: 'sm', sm: 'md' }}>
            Campus Connect Portal Dashboard
          </Text>
        </Box>

        {error && (
          <Box bg="red.900" borderColor="red.600" borderWidth="1px" rounded="lg" p={4}>
            <Text color="red.200">{error}</Text>
            <Button size="sm" mt={2} onClick={fetchDashboardData}>
              Retry
            </Button>
          </Box>
        )}

        {/* Statistics Cards */}
        <Box display="grid" gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
          {/* Events Statistics */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5} cursor="pointer" onClick={() => navigate('/events')} _hover={{ bg: "gray.800" }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Calendar size={24} color="#3B82F6" />
              <Text color="blue.400" fontSize="sm" fontWeight="medium">Events</Text>
            </Box>
            <Text color="white" fontSize="2xl" fontWeight="bold" mb={1}>{stats.totalEvents}</Text>
            <Text color="gray.400" fontSize="xs">
              {stats.upcomingEvents} upcoming
            </Text>
          </Box>

          {/* Notices Statistics */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5} cursor="pointer" onClick={() => navigate('/notices')} _hover={{ bg: "gray.800" }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Bell size={24} color="#F59E0B" />
              <Text color="orange.400" fontSize="sm" fontWeight="medium">Notices</Text>
            </Box>
            <Text color="white" fontSize="2xl" fontWeight="bold" mb={1}>{stats.totalNotices}</Text>
            <Text color="gray.400" fontSize="xs">
              {stats.highPriorityNotices} high priority
            </Text>
          </Box>

          {/* Lost Items Statistics */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5} cursor="pointer" onClick={() => navigate('/lost-items')} _hover={{ bg: "gray.800" }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Search size={24} color="#EF4444" />
              <Text color="red.400" fontSize="sm" fontWeight="medium">Lost Items</Text>
            </Box>
            <Text color="white" fontSize="2xl" fontWeight="bold" mb={1}>{stats.totalLostItems}</Text>
            <Text color="gray.400" fontSize="xs">
              {stats.activeLostItems} active searches
            </Text>
          </Box>

          {/* Found Items Statistics */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5} cursor="pointer" onClick={() => navigate('/found-items')} _hover={{ bg: "gray.800" }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Package size={24} color="#10B981" />
              <Text color="green.400" fontSize="sm" fontWeight="medium">Found Items</Text>
            </Box>
            <Text color="white" fontSize="2xl" fontWeight="bold" mb={1}>{stats.totalFoundItems}</Text>
            <Text color="gray.400" fontSize="xs">
              {stats.availableFoundItems} available
            </Text>
          </Box>
        </Box>

        {/* Recent Items Grid */}
        <Box display="grid" gridTemplateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
          {/* Recent Events */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={1}>Recent Events</Text>
                <Text color="gray.400" fontSize="sm">Latest campus events</Text>
              </Box>
              <Button size="sm" variant="outline" onClick={() => navigate('/events')}>
                View All <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </Button>
            </Box>
            <Stack gap={3}>
              {recentEvents.map((event) => (
                <Box key={event.id} p={3} bg="gray.800" rounded="md" borderLeftWidth="4px" borderLeftColor="blue.400">
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flex="1">
                      <Text color="white" fontWeight="semibold" fontSize="sm" mb={1}>{event.title}</Text>
                      <Box display="flex" alignItems="center" gap={2} color="gray.400" fontSize="xs" mb={2}>
                        <Calendar size={12} />
                        <Text>{formatDate(event.eventDate)}</Text>
                        <MapPin size={12} />
                        <Text>{event.location}</Text>
                      </Box>
                      <Badge size="sm" colorPalette="green" variant="subtle">{event.status}</Badge>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Recent Notices */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={1}>Recent Notices</Text>
                <Text color="gray.400" fontSize="sm">Important announcements</Text>
              </Box>
              <Button size="sm" variant="outline" onClick={() => navigate('/notices')}>
                View All <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </Button>
            </Box>
            <Stack gap={3}>
              {recentNotices.map((notice) => (
                <Box key={notice.id} p={3} bg="gray.800" rounded="md" borderLeftWidth="4px" borderLeftColor="orange.400">
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flex="1">
                      <Text color="white" fontWeight="semibold" fontSize="sm" mb={1}>{notice.title}</Text>
                      <Box display="flex" alignItems="center" gap={2} color="gray.400" fontSize="xs" mb={2}>
                        <Clock size={12} />
                        <Text>{formatDate(notice.createdTimestamp)}</Text>
                      </Box>
                      <Box display="flex" gap={2}>
                        <Badge size="sm" colorPalette={notice.priority === 'HIGH' ? 'red' : 'blue'} variant="subtle">
                          {notice.priority}
                        </Badge>
                        {notice.priority === 'HIGH' && <AlertTriangle size={12} color="#EF4444" />}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Recent Lost Items */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={1}>Recent Lost Items</Text>
                <Text color="gray.400" fontSize="sm">Items reported missing</Text>
              </Box>
              <Button size="sm" variant="outline" onClick={() => navigate('/lost-items')}>
                View All <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </Button>
            </Box>
            <Stack gap={3}>
              {recentLostItems.map((item) => (
                <Box key={item.id} p={3} bg="gray.800" rounded="md" borderLeftWidth="4px" borderLeftColor="red.400">
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flex="1">
                      <Text color="white" fontWeight="semibold" fontSize="sm" mb={1}>{item.itemName}</Text>
                      <Box display="flex" alignItems="center" gap={2} color="gray.400" fontSize="xs" mb={2}>
                        <MapPin size={12} />
                        <Text>Last seen: {item.location}</Text>
                      </Box>
                      <Box display="flex" gap={2} alignItems="center">
                        <Badge size="sm" colorPalette="yellow" variant="subtle">{item.status}</Badge>
                        {item.rewardAmount && (
                          <Text color="green.400" fontSize="xs" fontWeight="semibold">₹{item.rewardAmount}</Text>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Recent Found Items */}
          <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={1}>Recent Found Items</Text>
                <Text color="gray.400" fontSize="sm">Items waiting to be claimed</Text>
              </Box>
              <Button size="sm" variant="outline" onClick={() => navigate('/found-items')}>
                View All <ArrowRight size={16} style={{ marginLeft: '4px' }} />
              </Button>
            </Box>
            <Stack gap={3}>
              {recentFoundItems.map((item) => (
                <Box key={item.id} p={3} bg="gray.800" rounded="md" borderLeftWidth="4px" borderLeftColor="green.400">
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box flex="1">
                      <Text color="white" fontWeight="semibold" fontSize="sm" mb={1}>{item.itemName}</Text>
                      <Box display="flex" alignItems="center" gap={2} color="gray.400" fontSize="xs" mb={2}>
                        <Package size={12} />
                        <Text>Found at: {item.location}</Text>
                      </Box>
                      <Badge size="sm" colorPalette="green" variant="subtle">{item.status}</Badge>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;