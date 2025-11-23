import React from 'react';
import { Box, Stack, Button, Text } from '@chakra-ui/react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box as="header" bg="gray.900" borderBottomWidth="1px" borderColor="gray.800" px={6} py={5} backdropFilter="auto" backdropBlur="sm">
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        {/* Right side */}
        <Stack direction="row" align="center" gap={3}>
          {/* User Display */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={8} h={8} rounded="full" bg="gray.700" borderWidth="2px" borderColor="red.500" display="flex" alignItems="center" justifyContent="center">
              <Text color="white" fontWeight="bold" fontSize="sm">{(user?.username || 'U').charAt(0).toUpperCase()}</Text>
            </Box>
            <Box display={{ base: 'none', sm: 'block' }}>
              <Text color="white" fontSize="sm" fontWeight="medium">{user?.username}</Text>
              <Text color="gray.400" fontSize="xs">{user?.email}</Text>
            </Box>
          </Box>

          {/* Logout Button */}
          <Button 
            variant="ghost" 
            color="red.400" 
            _hover={{ color: 'red.300', bg: 'red.500/10' }} 
            aria-label="Logout"
            onClick={logout}
          >
            <LogOut size={20} />
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Header;