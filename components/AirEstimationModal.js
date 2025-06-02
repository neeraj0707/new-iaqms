

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Pressable
} from 'react-native';

// Constants for calculations
const CO2_PER_PERSON_Litre = 12; // litre of CO2 per person per hour
// const KG_TO_PPM_CONVERSION = 0.509; // Conversion factor from kg to ppm for CO2 in air


const AirEstimationModal = ({ visible, onClose, onSubmit }) => {
  const [length, setLength] = useState('');
  const [breadth, setBreadth] = useState('');
  const [height, setHeight] = useState('');
  const [persons, setPersons] = useState('1');
  const [hours, setHours] = useState('1');
  const [results, setResults] = useState(null);

  // const calculateResults = () => {
  //   const l = parseFloat(length);
  //   const b = parseFloat(breadth);
  //   const h = parseFloat(height);
  //   const p = parseInt(persons) || 1;
  //   const hrs = parseInt(hours) || 1;

  const handleSubmit = () => {
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const h = parseFloat(height);
    const p = parseInt(persons) || 1;
    const hrs = parseInt(hours) || 1;
    
    if (l && b && h) {
      const volume = l * b * h; //in m3
      const volumeLitres = volume * 1000; // Convert m³ to litres
      const totalCO2 = p * hrs * CO2_PER_PERSON_Litre;  //in litres
      // const co2Ppm = (co2Kg * KG_TO_PPM_CONVERSION) / (volume * AIR_DENSITY);
      
    // Calculate CO₂ concentration in ppm
    const co2Ppm = ((totalCO2 / volumeLitres) * 1_000_000) + 430; // No need for conversion factor


    const calculatedResults = {
      volume: volume.toFixed(2),
    //   co2Kg: co2Kg.toFixed(2),
      co2Litres: totalCO2.toFixed(2),
      co2Ppm: co2Ppm.toFixed(2),
      persons: p,
      hours: hrs
    };
  

      setResults({
        volume: volume.toFixed(2),
        // co2Kg: co2Kg.toFixed(2),
        co2Litres: totalCO2.toFixed(2),
        co2Ppm: co2Ppm.toFixed(2),
        persons: p,
        hours: hrs
      });
    } else {
      setResults(null);
    }
  };

//   const handleSubmit = () => {
//     calculateResults();
//     if (results) {
//       onSubmit && onSubmit(results);
//     }
//   };

  const resetForm = () => {
    setLength('');
    setBreadth('');
    setHeight('');
    setPersons('1');
    setHours('1');
    setResults(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetForm}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Air Quality Calculator</Text>
            {/* <Text style={styles.subtitle}>Enter room dimensions and occupancy details</Text> */}
            
            {/* Room Dimensions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Room Dimensions (meters)</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Length</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={length}
                    onChangeText={setLength}
                    placeholder="0"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Breadth</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={breadth}
                    onChangeText={setBreadth}
                    placeholder="0"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Height</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={height}
                    onChangeText={setHeight}
                    placeholder="0"
                  />
                </View>
              </View>
            </View>

            {/* Occupancy Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Occupancy Details</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Persons</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={persons}
                    onChangeText={setPersons}
                    placeholder="0"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Hours</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="number-pad"
                    value={hours}
                    onChangeText={setHours}
                    placeholder="0"
                  />
                </View>
              </View>
            </View>

            {/* Results */}
            {results && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}> Output</Text>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Air Volume:</Text>
                  <Text style={styles.resultValue}>{results.volume} m³</Text>
                </View>
                
                {/* <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>CO2 Produced:</Text>
                  <Text style={styles.resultValue}>{results.co2Kg} kg</Text>
                </View> */}
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>CO2 Concentration:</Text>
                  <Text style={styles.resultValue}>{results.co2Ppm} ppm</Text>
                </View>
                
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>For:</Text>
                  <Text style={styles.resultValue}>
                    {results.persons} person(s) over {results.hours} hour(s)
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              {/* <TouchableOpacity 
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
                disabled={!length || !breadth || !height}
              >
                <Text style={styles.buttonText}>Calculate</Text>
              </TouchableOpacity> */}

              
<Pressable
  onPress={handleSubmit}
  disabled={!length || !breadth || !height}
  style={({ pressed }) => [
    styles.button,
    styles.submitButton,
    pressed && { backgroundColor: '#2d74f8' }, // blue on press
  ]}
>
{({ pressed }) => (
          <Text style={[styles.buttonText, { color: pressed ? 'white' : 'black' }]}>
            Calculate
          </Text>
        )}
</Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#f6fdff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // backgroundColor: '#B9D9EB',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 500,
    marginBottom: 55,
    textAlign: 'center',
    // color: '#333',
    color: 'black',

  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
    
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    // color: '#444',
    textAlign:'center',
    color: 'black',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 14,
    // color: '#555',
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#303131', 
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#e3e9f5',
  },
  resultContainer: {
    marginVertical: 15,
    padding: 15,
    // backgroundColor: '#AFDBF5',
    borderRadius: 8,
  }, 
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    // color: '#2a52be',
    color: 'black',
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 15,
    color: '#333',
    // color: 'white',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 15,
    color: '#2a52be',
    // color: 'white',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderColor: 'black',
    borderWidth: 1,
  },
  // submitButton: {
  //   backgroundColor: 'white',
  //   borderWidth: 1,
  //   borderColor: '#2d74f8',
  // },
  // buttonText: {
  //   fontSize: 16,
  //   fontWeight: 500,
  //   color: 'black',
  // },
  submitButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#2d74f8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  
});

export default AirEstimationModal;