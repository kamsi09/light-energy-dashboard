import { Box, Button, useToast, useTheme } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import type { EnergyData } from '../types/energy';
import { UI_CONFIG } from '../constants/ui';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

interface FileUploadProps {
  onDataLoaded: (data: EnergyData[]) => void;
}

const FileUpload = ({ onDataLoaded }: FileUploadProps) => {
  const theme = useTheme();
  const toast = useToast();

  // Validates each row of the CSV file
  const validateRow = (row: string[]): { isValid: boolean; error?: string } => {
    if (row.length !== 5) {
      return { 
        isValid: false, 
        error: `Expected 5 columns, got ${row.length}. Columns: ${row.join(' | ')}` 
      };
    }

    const [datetime, duration, unit, consumption, generation] = row;
    
    // Check datetime format (accepts both ISO and simple date formats)
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2})?$/;
    if (!dateRegex.test(datetime)) {
      return { 
        isValid: false, 
        error: `Invalid datetime format: ${datetime}. Expected format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss±HH:mm` 
      };
    }
    
    // Validate numeric fields
    const durationNum = parseFloat(duration);
    const consumptionNum = parseFloat(consumption);
    const generationNum = parseFloat(generation);
    
    if (isNaN(durationNum) || isNaN(consumptionNum) || isNaN(generationNum)) {
      return { 
        isValid: false, 
        error: `Invalid number format in row: ${row.join(' | ')}` 
      };
    }
    
    if (durationNum <= 0) {
      return { 
        isValid: false, 
        error: `Duration must be positive, got: ${durationNum}` 
      };
    }
    
    if (consumptionNum < 0 || generationNum < 0) {
      return { 
        isValid: false, 
        error: `Consumption and generation must be non-negative` 
      };
    }
    
    // Check unit format
    if (unit.toLowerCase() !== 'wh') {
      return { 
        isValid: false, 
        error: `Invalid unit: ${unit}. Expected: wh` 
      };
    }
    
    return { isValid: true };
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n');
          
          // Skip any empty lines at the start of the file
          let startIndex = 0;
          while (startIndex < lines.length && !lines[startIndex].trim()) {
            startIndex++;
          }
          
          if (startIndex >= lines.length) {
            throw new Error('File is empty or contains only empty lines');
          }

          const rows = lines.slice(startIndex + 1); // Skip header row
          const data: EnergyData[] = [];
          const errors: string[] = [];

          rows.forEach((row, index) => {
            if (!row.trim()) return; // Skip empty rows
            
            // Parse CSV row
            const columns = row.split(',').map(col => col.trim());
            console.log(`Row ${index + 2}:`, columns); // Log for debugging
            
            const validation = validateRow(columns);
            
            if (!validation.isValid) {
              errors.push(`Row ${index + 2}: ${validation.error}`);
              return;
            }

            const [datetime, duration, unit, consumption, generation] = columns;
            data.push({
              datetime,
              duration: parseFloat(duration),
              unit,
              consumption: parseFloat(consumption),
              generation: parseFloat(generation),
            });
          });

          if (errors.length > 0) {
            throw new Error(`Validation errors:\n${errors.join('\n')}`);
          }

          if (data.length === 0) {
            throw new Error('No valid data found in file');
          }

          onDataLoaded(data);
          toast({
            title: 'Success!',
            description: 'Energy data loaded successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
            containerStyle: {
              background: theme.colors.brand.primary,
              color: theme.colors.brand.white,
              borderRadius: UI_CONFIG.borderRadius.button,
            },
          });
        } catch (error) {
          console.error('Error processing file:', error);
          toast({
            title: 'Error',
            description: error instanceof Error ? error.message : 'Failed to process file',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top',
            containerStyle: {
              background: theme.colors.brand.gray[700],
              color: theme.colors.brand.white,
              borderRadius: UI_CONFIG.borderRadius.button,
            },
          });
        }
      };

      reader.readAsText(file);
    }
  }, [onDataLoaded, toast, theme.colors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      p={8}
      border="2px dashed"
      borderColor={isDragActive ? "brand.primary" : "brand.gray.200"}
      borderRadius={UI_CONFIG.borderRadius.default}
      bg="brand.white"
      cursor="pointer"
      transition={UI_CONFIG.transitions.default}
      animation={`${pulse} 2s infinite ease-in-out`}
      _hover={{
        borderColor: "brand.primary",
        transform: "translateY(-2px)",
        boxShadow: UI_CONFIG.shadows.hover,
      }}
    >
      <input {...getInputProps()} />
      <Button
        w="full"
        h="full"
        variant="ghost"
        color="brand.primary"
        fontSize="lg"
        fontWeight="600"
        letterSpacing="-0.5px"
        transition={UI_CONFIG.transitions.hover}
        border="none"
        boxShadow="none"
        _hover={{
          transform: 'translateY(-1px)',
          bg: 'transparent',
          boxShadow: 'none',
        }}
      >
        {isDragActive
          ? "Drop your CSV file here"
          : "Upload Energy Data (CSV)"}
      </Button>
    </Box>
  );
};

export default FileUpload; 