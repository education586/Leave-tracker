import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, User, Camera } from 'lucide-react';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (settings: UserProfile) => void;
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="bg-white rounded-[10px] shadow-sm border border-[#e2e8f0]">
      <div className="p-6 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-3">
          <div className="bg-[#0e2a47] p-2 rounded-lg text-white">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0e2a47]">User Profile</h2>
            <p className="text-sm text-slate-500">Update your profile information and picture.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img src={formData.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-slate-100" />
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm text-slate-600 hover:text-[#0e2a47]"
              onClick={() => {
                const url = prompt("Enter new image URL:");
                if (url) setFormData({ ...formData, avatarUrl: url });
              }}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Profile Picture</h3>
            <p className="text-xs text-slate-500">Click the camera icon to update your picture URL.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0e2a47] focus:border-[#0e2a47] outline-none transition-all"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Role / Job Title</label>
            <input
              type="text"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0e2a47] focus:border-[#0e2a47] outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          {successMessage ? (
            <p className="text-sm font-medium text-green-600">Profile updated successfully!</p>
          ) : (
            <div></div> // Spacer
          )}
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0e2a47] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a4066] transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
