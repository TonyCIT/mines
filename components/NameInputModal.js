import React, { useState } from 'react'; // Importing React and useState hook from 'react' library
import { Modal, View, TextInput, Button, Text } from 'react-native'; // Importing necessary components from 'react-native' library

// Functional component called NameInputModal which takes visible and onSave as props
const NameInputModal = ({ visible, onSave }) => {
  // useState hook to manage the state of 'name'
  const [name, setName] = useState('');

  // Function to handle saving the name
  const handleSave = () => {
    // Call the onSave function passed as a prop and pass the current value of 'name' to it
    onSave(name);
    // Clear the 'name' state
    setName('');
  };

  // Component rendering
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Button title="Save" onPress={handleSave} /> {/* Button to save the name */}
        </View>
      </View>
    </Modal>
  );
};

export default NameInputModal; // Exporting the NameInputModal component
