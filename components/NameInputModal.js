import React, { useState } from 'react';
import { Modal, View, TextInput, Button, Text } from 'react-native';

const NameInputModal = ({ visible, onSave }) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    onSave(name);
    setName('');
  };

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
          <Button title="Save" onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

export default NameInputModal;
