import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Alert,
  ScrollView
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/common/Header';
import Button from '@/components/ui/Button';
import { User, Mail, LogOut, Settings, CircleHelp as HelpCircle, Heart, Share2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          onPress: signOut,
          style: 'destructive',
        },
      ]
    );
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Settings functionality will be available in the next update.');
  };

  const handleHelpPress = () => {
    Alert.alert('Help', 'Help and support functionality will be available in the next update.');
  };

  const handleRatePress = () => {
    Alert.alert('Rate Us', 'Rating functionality will be available in the next update.');
  };

  const handleSharePress = () => {
    Alert.alert('Share', 'Sharing functionality will be available in the next update.');
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSettingsPress}
            >
              <View style={styles.menuIconContainer}>
                <Settings size={20} color="#3B82F6" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleHelpPress}
            >
              <View style={styles.menuIconContainer}>
                <HelpCircle size={20} color="#8B5CF6" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleRatePress}
            >
              <View style={styles.menuIconContainer}>
                <Heart size={20} color="#EC4899" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuItemText}>Rate the App</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSharePress}
            >
              <View style={styles.menuIconContainer}>
                <Share2 size={20} color="#10B981" />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuItemText}>Share with Friends</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
          icon={<LogOut size={20} color="#3B82F6" />}
        />
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  signOutButton: {
    marginTop: 8,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
  },
});