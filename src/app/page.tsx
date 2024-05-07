// src/app/pages.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  useColorModeValue,
  VStack,
  Text,
  useToken
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  // Using useToken to ensure that color tokens are correctly used in styles
  const [buttonBgColor, hoverBgColor, activeBgColor, borderColor] = useToken('colors', [
    useColorModeValue('blue.500', 'blue.200'),
    useColorModeValue('blue.600', 'blue.300'),
    useColorModeValue('blue.700', 'blue.400'),
    useColorModeValue('gray.200', 'gray.600')
  ]);

  return (
    <Container maxW="container.xl" p={5} centerContent>
      <Box bg={useColorModeValue('gray.100', 'gray.800')} color={useColorModeValue('gray.700', 'white')} p={6} textAlign="center" borderRadius="2xl" shadow="2xl" w="full">
        <Heading size="xl" mb={4} fontFamily="'Avenir Next', sans-serif">Opal - AI Agents for Emergency Response</Heading>
        <Text mb={6} fontSize="lg" fontFamily="'Avenir Next', sans-serif">Enhancing emergency response with cutting-edge AI technology.</Text>
        <VStack spacing={4}>
          <Button
            bg={buttonBgColor}
            size="lg"
            p={7}
            borderRadius="full"
            border="2px solid"
            borderColor={borderColor}
            _hover={{ bg: hoverBgColor, transform: 'scale(1.05)', boxShadow: 'xl' }}
            _active={{ bg: activeBgColor, transform: 'scale(0.95)', boxShadow: 'inner' }}
            transition="all 0.3s ease-in-out"
            onClick={() => router.push('/form')}
          >
            Live Transcription
          </Button>
          <Button
            bg={buttonBgColor}
            size="lg"
            p={7}
            borderRadius="full"
            border="2px solid"
            borderColor={borderColor}
            _hover={{ bg: hoverBgColor, transform: 'scale(1.05)', boxShadow: 'xl' }}
            _active={{ bg: activeBgColor, transform: 'scale(0.95)', boxShadow: 'inner' }}
            transition="all 0.3s ease-in-out"
            onClick={() => router.push('/form/reports')}
          >
            Incident Report
          </Button>
          <Button
            bg={buttonBgColor}
            size="lg"
            p={7}
            borderRadius="full"
            border="2px solid"
            borderColor={borderColor}
            _hover={{ bg: hoverBgColor, transform: 'scale(1.05)', boxShadow: 'xl' }}
            _active={{ bg: activeBgColor, transform: 'scale(0.95)', boxShadow: 'inner' }}
            transition="all 0.3s ease-in-out"
            onClick={() => router.push('/form/settings')}
          >
            Settings
          </Button>
        </VStack>
      </Box>

      <Box p={4} bg={useColorModeValue('gray.900', 'gray.700')} color="white" mt={5} borderRadius="xl" shadow="md">
        <Heading textAlign="center" size="sm">© 2024 Emergency Tech Solutions. All rights reserved.</Heading>
      </Box>
    </Container>
  );
}
