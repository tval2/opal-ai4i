// src/app/pages.tsx
"use client";

import React, { useState } from "react";
import {
  ChakraProvider,
  Flex,
  Button,
  Text,
  VStack,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import AudioRecorderCard from "../components/AudioRecorderCard";

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
    verbal: "",
    motor: "",
    type: "",
    sex: "",
  });

  const Navbar = () => {
    return (
      <Flex
        bg="red.500"
        color="white"
        p={3}
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="lg" fontWeight="bold">
          Opal - AI Agents for Emergency Response
        </Text>
        <Button colorScheme="gray">Login</Button> {/* Example button */}
      </Flex>
    );
  };

  return (
    <ChakraProvider>
      <Navbar />
      <VStack spacing={4} align="stretch" h="calc(100vh - 48px)" p={4}>
        <AudioRecorderCard />
        <Spacer />
        <Button
          colorScheme="blue"
          size="lg"
          mb={4} // Added bottom margin to the button
          onClick={() => console.log("Export to ePCR")}
          style={{ marginBottom: "20px" }} // Alternatively, directly apply style for bottom margin
        >
          Export to ePCR PDF format
        </Button>
      </VStack>
    </ChakraProvider>
  );
}

export default HomePage;
