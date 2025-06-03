import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/common/Header';
import ListCard from '@/components/lists/ListCard';
import CreateListModal from '@/components/lists/CreateListModal';
import EmptyState from '@/components/ui/EmptyState';
import { 
  getLists, 
  createList, 
  updateList, 
  deleteList,
  List
} from '@/services/lists';

export default function HomeScreen() {
  const { user } = useAuth();
  const [lists, setLists] = useState<List[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  // Fetch lists when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchLists();
    }, [])
  );

  // Fetch lists from API
  const fetchLists = async () => {
    try {
      setError(null);
      const response = await getLists();
      setLists(response);
    } catch (error: any) {
      setError(error.message || 'Failed to load lists');
      console.error('Error fetching lists:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLists();
  };

  // Open create list modal
  const handleAddList = () => {
    setIsCreateModalVisible(true);
  };

  // Open edit list modal
  const handleEditList = (list: List) => {
    setSelectedList(list);
    setIsEditModalVisible(true);
  };

  // Create a new list
  const handleCreateList = async (name: string) => {
    setIsSubmitting(true);
    try {
      await createList({ name });
      setIsCreateModalVisible(false);
      fetchLists();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create list');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update an existing list
  const handleUpdateList = async (name: string) => {
    if (!selectedList) return;
    
    setIsSubmitting(true);
    try {
      await updateList(selectedList.id, { name });
      setIsEditModalVisible(false);
      setSelectedList(null);
      fetchLists();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update list');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a list
  const handleDeleteList = (list: List) => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"? This will also delete all items in this list.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteList(list.id);
              fetchLists();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete list');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="My Lists" onAddButtonPress={handleAddList} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Lists" onAddButtonPress={handleAddList} />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              list={item}
              onEdit={() => handleEditList(item)}
              onDelete={() => handleDeleteList(item)}
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
              title="No Lists Yet"
              description="Create your first list to get started"
              buttonTitle="Create List"
              onPress={handleAddList}
            />
          }
        />
      )}

      {/* Create List Modal */}
      <CreateListModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateList}
        isLoading={isSubmitting}
      />

      {/* Edit List Modal */}
      <CreateListModal
        visible={isEditModalVisible}
        onClose={() => {
          setIsEditModalVisible(false);
          setSelectedList(null);
        }}
        onSubmit={handleUpdateList}
        isLoading={isSubmitting}
        initialValue={selectedList?.name || ''}
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