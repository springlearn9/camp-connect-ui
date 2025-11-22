import React from 'react';
import { Box, Stack, Heading, Text } from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box p={6}>
      <Stack gap={{ base: 4, sm: 6 }}>
        <Box>
          <Heading size={{ base: 'lg', sm: 'xl' }} color="white" mb={2}>
            Welcome back, {user?.username || 'User'}!
          </Heading>
          <Text color="gray.400" fontSize={{ base: 'sm', sm: 'md' }}>
            Campus Connect Portal
          </Text>
        </Box>

        <Box bg="gray.900" borderColor="gray.800" borderWidth="1px" rounded="lg" p={{ base: 4, sm: 5 }}>
          <Text color="white" fontSize={{ base: 'md', sm: 'lg' }}>
            Welcome to Campus Connect Portal! Navigate using the sidebar to explore different features.
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default Dashboard;