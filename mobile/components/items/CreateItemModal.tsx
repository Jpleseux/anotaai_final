import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { X } from 'lucide-react-native';

interface CreateItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; value: number }) => void;
  isLoading: boolean;
  initialValue?: {
    name?: string;
    description?: string;
    value?: number;
  };
  isEditing?: boolean;
}

const CreateItemModal: React.FC<CreateItemModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isLoading,
  initialValue = { name: '', description: '', value: 0 },
  isEditing = false
}) => {
  const [name, setName] = useState(initialValue?.name ?? '');
  const [description, setDescription] = useState(initialValue?.description ?? '');
  const [value, setValue] = useState((initialValue?.value ?? 0).toString());
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    value?: string;
  }>({});

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!value.trim()) {
      newErrors.value = 'Value is required';
    } else {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        newErrors.value = 'Value must be a number';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      value: parseFloat(value)
    });
  };

  const handleClose = () => {
    setName(initialValue?.name ?? '');
    setDescription(initialValue?.description ?? '');
    setValue((initialValue?.value ?? 0).toString());
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Item' : 'Add New Item'}
              </Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Input
                label="Item Name"
                placeholder="Enter item name"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoFocus
              />
              
              <Input
                label="Description"
                placeholder="Enter item description"
                value={description}
                onChangeText={setDescription}
                error={errors.description}
                multiline
                numberOfLines={3}
                style={styles.descriptionInput}
              />
              
              <Input
                label="Value"
                placeholder="Enter item value"
                value={value}
                onChangeText={setValue}
                error={errors.value}
                keyboardType="numeric"
              />
              
              <View style={styles.buttonContainer}>
                <Button
                  title="Cancel"
                  onPress={handleClose}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title={isEditing ? 'Update' : 'Add'}
                  onPress={handleSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.submitButton}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  descriptionInput: {
    marginVertical: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 12,
  },
  submitButton: {
    minWidth: 100,
  },
});

export default CreateItemModal;