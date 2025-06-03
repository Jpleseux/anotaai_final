import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CreditCard as Edit, Trash2, MoveVertical as MoreVertical } from 'lucide-react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMoreOptions?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onPress,
  onEdit,
  onDelete,
  onMoreOptions,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onEdit}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Edit size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDelete}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        )}
        
        {onMoreOptions && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onMoreOptions}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MoreVertical size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
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

export default ListItem;