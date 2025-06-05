import { HStack, Switch, Text } from '@chakra-ui/react';

interface UnitToggleProps {
  showCost: boolean;
  onToggle: () => void;
}

const UnitToggle = ({ showCost, onToggle }: UnitToggleProps) => {
  return (
    <HStack 
      spacing={4} 
      justify="center" 
      p={4}
      bg="brand.white"
      borderRadius="xl"
      boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
      transition="all 0.3s ease"
      _hover={{
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Text 
        color={!showCost ? "brand.blue" : "brand.gray"} 
        fontWeight={!showCost ? "600" : "400"}
        transition="all 0.2s"
      >
        kWh
      </Text>
      <Switch
        isChecked={showCost}
        onChange={onToggle}
        colorScheme="blue"
        size="lg"
        sx={{
          'span.chakra-switch__track': {
            bg: showCost ? 'brand.blue' : 'brand.gray',
            _checked: {
              bg: 'brand.blue',
            },
          },
          'span.chakra-switch__thumb': {
            bg: 'brand.white',
            _checked: {
              bg: 'brand.white',
            },
          },
        }}
      />
      <Text 
        color={showCost ? "brand.blue" : "brand.gray"} 
        fontWeight={showCost ? "600" : "400"}
        transition="all 0.2s"
      >
        Cost
      </Text>
    </HStack>
  );
};

export default UnitToggle; 