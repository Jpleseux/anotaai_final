import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Header from '@/components/common/Header';
import ItemCard from '@/components/items/ItemCard';
import CreateItemModal from '@/components/items/CreateItemModal';
import EmptyState from '@/components/ui/EmptyState';
import { getList } from '@/services/lists';
import { 
  getItemsByList, 
  createItem, 
  updateItem, 
  deleteItem,
  Item
} from '@/services/items';

export default function ListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listName, setListName] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // Fetch list details and items
  useEffect(() => {
    if (!id) {
      router.back();
      return;
    }
    
    fetchListDetails();
    fetchItems();
  }, [id]);

  // Fetch list details
  const fetchListDetails = async () => {
    try {
      const list = await getList(id);
      setListName(list.name);
    } catch (error: any) {
      setError(error.message || 'Failed to load list details');
      console.error('Error fetching list details:', error);
    }
  };

  // Fetch items
  const fetchItems = async () => {
    try {
      setError(null);
      const response = await getItemsByList(id);
      setItems(response);
    } catch (error: any) {
      setError(error.message || 'Failed to load items');
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchItems();
  };

  // Open create item modal
  const handleAddItem = () => {
    setIsCreateModalVisible(true);
  };

  // Open edit item modal
  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalVisible(true);
  };

  // Create a new item
  const handleCreateItem = async (data: { name: string; description: string; value: number }) => {
    setIsSubmitting(true);
    try {
      await createItem({ 
        name: data.name, 
        description: data.description, 
        value: data.value,
        listId: id 
      });
      setIsCreateModalVisible(false);
      fetchItems();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing item
  const handleUpdateItem = async (data: { name: string; description: string; value: number }) => {
    if (!selectedItem) return;
    
    setIsSubmitting(true);
    try {
      await updateItem(selectedItem.uuid, { 
        name: data.name,
        description: data.description,
        value: data.value
      });
      setIsEditModalVisible(false);
      setSelectedItem(null);
      fetchItems();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update item');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete an item
  const handleDeleteItem = (item: Item) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.uuid);
              fetchItems();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header 
          title="Loading..." 
          showBackButton 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header 
        title={listName} 
        showBackButton 
        onAddButtonPress={handleAddItem}
      />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => (
            <ItemCard
              item={item}
              onEdit={() => handleEditItem(item)}
              onDelete={() => handleDeleteItem(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#3B82F6']}
              tintColor="#3B82F6"
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Items Yet"
              description={`Add items to your "${listName}" list`}
              buttonTitle="Add Item"
              onPress={handleAddItem}
            />
          }
        />
      )}

      {/* Create Item Modal */}
      <CreateItemModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateItem}
        isLoading={isSubmitting}
      />

      {/* Edit Item Modal */}
      <CreateItemModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedItem(null);
        }}
        onSubmit={handleUpdateItem}
        isLoading={isSubmitting}
        initialValue={selectedItem ? {
          name: selectedItem.name,
          description: selectedItem.description,
          value: selectedItem.value
        } : undefined}
        isEditing
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  errorText: {
    color: '#EF4444',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});