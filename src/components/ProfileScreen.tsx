import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Edit3, Save, X, LogOut } from 'lucide-react';
import { syncService } from '@/lib/sync-service';
import { useToast } from '@/hooks/use-toast';

const ProfileScreen: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    interests: currentUser?.interests || [],
  });

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleSave = async () => {
    const profileData = {
      id: currentUser.id,
      name: editForm.name,
      bio: editForm.bio,
      interests: editForm.interests
    };

    try {
      if (!navigator.onLine) {
        // Queue for background sync
        syncService.addAction('profile', 'update', profileData);
        toast({
          title: "Queued for sync",
          description: "Your profile will update when you're back online",
        });
      } else {
        // In production, this would call your API
        syncService.addAction('profile', 'update', profileData);
        toast({
          title: "Profile updated",
          description: "Your changes have been saved",
        });
      }
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      toast({
        title: "Error",
        description: "Failed to save profile changes",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: currentUser.name,
      bio: currentUser.bio,
      interests: currentUser.interests,
    });
    setIsEditing(false);
  };


  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </Button>
      </div>

      <div className="flex-1">
        <Card className="p-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="text-2xl">
                {currentUser.name[0]}
              </AvatarFallback>
            </Avatar>
            
            {isEditing ? (
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="text-center text-xl font-bold mb-2 max-w-xs"
                placeholder="Your name"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {currentUser.name}
              </h2>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Online
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  className="resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {currentUser.bio}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <p className="text-xs text-gray-500 mt-2">
                  Interest editing coming soon!
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">0</p>
                <p className="text-sm text-gray-600">Connections</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">0</p>
                <p className="text-sm text-gray-600">Meetings</p>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Privacy Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Discoverable</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Show distance</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Auto-accept from friends</span>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </Card>
        
        {/* Logout Button */}
        <Card className="p-4 mt-4">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </Card>

      </div>
    </div>
  );
};

export default ProfileScreen;