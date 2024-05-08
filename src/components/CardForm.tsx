import React from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import InputField from './client/InputField';
import CategoricalField from './client/CategoricalField';

const fields = [
  { label: 'Patient Name:', name: 'patient_name' },
  { label: 'Patient Age:', name: 'patient_age' },
  { label: 'Patient Weight:', name: 'patient_weight' },
  { label: 'Chief Complaint:', name: 'patient_chief_complaint' },
  { label: 'Signs & Symptoms:', name: 'patient_signs_symptoms' },
  { label: 'Medications:', name: 'patient_medications' },
  { label: 'Date of Birth:', name: 'patient_dob' },
  { label: 'Date of Incident:', name: 'patient_date' },
  { label: 'Evacuation Location:', name: 'evacuation_location' },
  { label: 'Time of Onset:', name: 'time_onset' },
  { label: 'Time Dispatched:', name: 'time_dispatched' },
  { label: 'Time En Route:', name: 'time_en_route' },
  { label: 'Time On Scene:', name: 'time_on_scene' },
  { label: 'Time Departed to Referral:', name: 'time_depart_ref' },
  { label: 'Time Arrived at Rec:', name: 'time_arrive_rec' },
  { label: 'Time Available:', name: 'time_available' },
  { label: 'Eye Opening:', name: 'eye_opening' },
  { label: 'Verbal Response:', name: 'verbal' },
  { label: 'Motor Response:', name: 'motor' },
  // Add CategoricalField separately if needed
];

const CardForm = ({ formValues, onChange }) => {
  return (
    <Box border="1px" borderColor="gray.200" p={4} borderRadius="lg" boxShadow="md" bg="white">
      <Grid templateColumns="repeat(6, 1fr)" gap={4}>
        {fields.map(field => (
          <GridItem key={field.name}>
            <Box border="1px" borderColor="gray.200" p={4} borderRadius="lg" boxShadow="md" bg="white">
                <InputField
                label={field.label}
                name={field.name}
                value={formValues[field.name]}
                onChange={onChange}
                />
            </Box>
          </GridItem>
        ))}
        <GridItem colSpan={5}>
          <CategoricalField
            label="Sex:"
            name="sex"
            options={["male", "female"]}
            value={formValues.sex}
            onChange={(name, value) => onChange(name, value)}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CardForm;
