import React from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';
import { Info, Users, Target, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Box p={6}>
      <Box mb={6}>
        <Text as="h1" fontSize="2xl" fontWeight="bold" color="white" mb={2}>
          About Campus Connect
        </Text>
        <Text color="gray.400" fontSize="lg">
          Your all-in-one campus community platform
        </Text>
      </Box>

      <Stack gap={6}>
        {/* Introduction Card */}
        <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box p={2} bg="red.600" rounded="md">
                <Info size={20} color="white" />
              </Box>
              <Text fontSize="xl" fontWeight="semibold" color="white">
                What is Campus Connect?
              </Text>
            </Box>
          </Box>
          <Box>
            <Text color="gray.300" lineHeight="tall" mb={4}>
              Campus Connect is a comprehensive campus community platform designed to enhance 
              student life and campus engagement. Our platform provides tools for managing 
              campus events, posting notices, and helping students recover lost items through 
              our lost and found system.
            </Text>
            <Text color="gray.300" lineHeight="tall">
              Built with modern technology and user-centric design principles, Campus Connect 
              empowers students and campus organizations to stay connected, informed, and 
              organized throughout their academic journey.
            </Text>
          </Box>
        </Box>

        {/* Mission Card */}
        <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box p={2} bg="blue.600" rounded="md">
                <Target size={20} color="white" />
              </Box>
              <Text fontSize="xl" fontWeight="semibold" color="white">
                Our Mission
              </Text>
            </Box>
          </Box>
          <Box>
            <Text color="gray.300" lineHeight="tall">
              To create a vibrant, connected campus community by providing intuitive digital 
              tools that facilitate communication, event management, and student collaboration. 
              We believe that a well-connected campus community enhances the overall student 
              experience, and our mission is to make campus life more organized, engaging, 
              and accessible for everyone.
            </Text>
          </Box>
        </Box>

        {/* Features Grid */}
        <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box p={2} bg="green.600" rounded="md">
                <Award size={20} color="white" />
              </Box>
              <Text fontSize="xl" fontWeight="semibold" color="white">
                Key Features
              </Text>
            </Box>
          </Box>
          <Box>
            <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <Box p={4} bg="gray.800" rounded="lg">
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={2}>
                  Event Management
                </Text>
                <Text color="gray.300" fontSize="sm">
                  Discover and manage campus events with our comprehensive event 
                  calendar and registration system.
                </Text>
              </Box>
              <Box p={4} bg="gray.800" rounded="lg">
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={2}>
                  Lost & Found
                </Text>
                <Text color="gray.300" fontSize="sm">
                  Report lost items and help others find their belongings through 
                  our dedicated lost and found tracking system.
                </Text>
              </Box>
              <Box p={4} bg="gray.800" rounded="lg">
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={2}>
                  Campus Notices
                </Text>
                <Text color="gray.300" fontSize="sm">
                  Stay updated with important campus announcements, news, and 
                  official notices in one centralized location.
                </Text>
              </Box>
              <Box p={4} bg="gray.800" rounded="lg">
                <Text fontSize="lg" fontWeight="semibold" color="white" mb={2}>
                  User Feedback
                </Text>
                <Text color="gray.300" fontSize="sm">
                  Share your thoughts and suggestions to help us continuously 
                  improve the platform for the campus community.
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Version Info */}
        <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={6}>
          <Box mb={4}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box p={2} bg="purple.600" rounded="md">
                <Users size={20} color="white" />
              </Box>
              <Text fontSize="xl" fontWeight="semibold" color="white">
                System Information
              </Text>
            </Box>
          </Box>
          <Box>
            <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              <Box>
                <Text color="gray.400" fontSize="sm" fontWeight="medium">
                  Version
                </Text>
                <Text color="white" fontSize="lg" fontWeight="semibold">
                  1.0.0
                </Text>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm" fontWeight="medium">
                  Last Updated
                </Text>
                <Text color="white" fontSize="lg" fontWeight="semibold">
                  November 2024
                </Text>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm" fontWeight="medium">
                  Status
                </Text>
                <Text color="green.400" fontSize="lg" fontWeight="semibold">
                  Active
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default About;