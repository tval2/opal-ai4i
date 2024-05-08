// src/app/pages.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  ChakraProvider,
  Flex,
  Button,
  Text,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import AudioRecorderCard from '../components/AudioRecorderCard';
import InputField from '../components/client/InputField';
import CategoricalField from '../components/client/CategoricalField';

function HomePage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formValues, setFormValues] = useState({
    patient_name: "",
    patient_age: "",
    patient_weight: "",
    patient_chief_complaint: "",
    patient_signs_symptoms: "",
    patient_medications: "",
    patient_dob: "",
    patient_date: "",
    evacuation_location: "",
    time_onset: "",
    time_dispatched: "",
    time_en_route: "",
    time_on_scene: "",
    time_depart_ref: "",
    time_arrive_rec: "",
    time_available: "",
    eye_opening: "",
    verbal:"",
    motor: "",
    type: "",
    sex: ""
  });

  const handleFieldChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const Navbar = () => {
    return (
      <Flex bg="red.500" color="white" p={3} justifyContent="space-between" alignItems="center">
        <Text fontSize="lg" fontWeight="bold">Opal - AI Agents for Emergency Response</Text>
        <Button colorScheme="gray">Login</Button> {/* Example button */}
      </Flex>
    );
  };

  return (
    
    <ChakraProvider>
    <Navbar />
    <Flex h="calc(100vh - 48px)" p={4}>
      <AudioRecorderCard />
    </Flex>
  </ChakraProvider>
  );
}

export default HomePage;
