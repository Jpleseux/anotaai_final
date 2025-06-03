import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Item } from '@/services/items';
import { CircleCheck as CheckCircle, Circle, Pencil, Trash } from 'lucide-react-native';

interface ItemCardProps {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete?: () => void;
  isCompleted?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleComplete,
  isCompleted = false,
}) => {
  // Format date to readable format
  const formattedDate = new Date(item.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      {onToggleComplete && (
        <TouchableOpacity 
          style={styles.checkContainer}
          onPress={onToggleComplete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          {isCompleted ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#D1D5DB" />
          )}
        </TouchableOpacity>
      )}
      
      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            isCompleted && styles.completedTitle
          ]} 
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={styles.date}>Added on {formattedDate}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onEdit}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Pencil size={18} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Trash size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  checkContainer: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default ItemCard;