'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit2, Trash2,ToggleLeft,ToggleRight,Package,} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Resource, ResourceCategory } from '@/lib/types';
import Modal from '@/components/ui/Modal';

export default function ManageResourcesScreen() {
  const router = useRouter();
  const { resources, addResource, updateResource, deleteResource, toggleResourceActive } =
    useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Laptops');
  const [description, setDescription] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(10);
  const [availableQuantity, setAvailableQuantity] = useState(8);
  const [location, setLocation] = useState('IT Lab, 2nd Floor, Room 204');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800'
  );

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('Laptops');
    setTotalQuantity(10);
    setAvailableQuantity(8);
    setLocation('IT Lab, Room 204');
    setEditingResource(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingResource) {
      updateResource(editingResource.id, {
        name,
        category,
        description,
        totalQuantity,
        availableQuantity,
        location,
        image,
      });
      setEditingResource(null);
    } else {
      addResource({
        name,
        category,
        description,
        specifications: ['High Performance', 'Warranty Included', 'Academic Certified'],
        totalQuantity,
        availableQuantity,
        location,
        image,
        rating: 4.8,
        reviewsCount: 1,
        isActive: true,
      });
      setShowAddModal(false);
    }
    resetForm();
  };

  const startEdit = (res: Resource) => {
    setEditingResource(res);
    setName(res.name);
    setCategory(res.category);
    setDescription(res.description);
    setTotalQuantity(res.totalQuantity);
    setAvailableQuantity(res.availableQuantity);
    setLocation(res.location);
    setImage(res.image);
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-5 bg-[#FFF7F1] pb-20">
      {/* Header matching reference Screen 12:
          Back arrow, "Manage Resources", "+ Add Resource" button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white rounded-xl border border-[#F2DED4] text-[#29201D] shadow-sm hover:bg-[#FFF7F1] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base sm:text-lg font-bold text-[#29201D]">Manage Resources</h2>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E77B52] hover:bg-[#D3683E] text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Resource Items List matching reference Screen 12:
          Laptop (12 Available), Projector (3 Available), Camera (5 Available), Meeting Room (2 Available)
          With green toggle switches and action buttons */}
      <div className="space-y-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#F2DED4] shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <img
                src={res.image}
                alt={res.name}
                className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover border border-[#F5E5DC]"
              />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#29201D] leading-snug">
                  {res.name}
                </h4>
                <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">
                  {res.availableQuantity} Available
                </p>
                <p className="text-[10px] text-[#89817D]">{res.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle switch matching reference switch pill */}
              <button
                onClick={() => toggleResourceActive(res.id)}
                title={res.isActive ? 'Active' : 'Inactive'}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  res.isActive ? 'bg-[#22C55E]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    res.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>

              {/* Edit */}
              <button
                onClick={() => startEdit(res)}
                className="p-1.5 text-[#89817D] hover:text-[#E77B52] rounded-lg hover:bg-[#FFF7F1] transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                onClick={() => setDeletingId(res.id)}
                className="p-1.5 text-[#89817D] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Resource Modal */}
      <Modal
        isOpen={showAddModal || !!editingResource}
        onClose={() => {
          setShowAddModal(false);
          setEditingResource(null);
        }}
        title={editingResource ? 'Edit Resource' : 'Add New Equipment'}
      >
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#29201D] mb-1">Resource Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MacBook Pro M3"
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#F2DED4] text-xs font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29201D] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#F2DED4] text-xs font-medium"
            >
              <option value="Laptops">Laptops</option>
              <option value="Projectors">Projectors</option>
              <option value="Cameras">Cameras</option>
              <option value="Lab Equip.">Lab Equip.</option>
              <option value="Meeting Rooms">Meeting Rooms</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#29201D] mb-1">Total Quantity</label>
              <input
                type="number"
                min="1"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#F2DED4] text-xs font-medium"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#29201D] mb-1">Available Quantity</label>
              <input
                type="number"
                min="0"
                max={totalQuantity}
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-[#F2DED4] text-xs font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29201D] mb-1">Location / Lab</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Electronics Lab 2, Room 104"
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#F2DED4] text-xs font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#29201D] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specifications and details..."
              rows={2}
              className="w-full px-3 py-2 bg-white rounded-xl border border-[#F2DED4] text-xs font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setShowAddModal(false);
                setEditingResource(null);
              }}
              className="px-3.5 py-1.5 text-xs text-[#89817D] rounded-xl hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#E77B52] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#D3683E]"
            >
              {editingResource ? 'Save Changes' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Equipment"
        description="Are you sure you want to permanently remove this resource from inventory?"
        confirmText="Delete"
        variant="danger"
        onConfirm={() => {
          if (deletingId) deleteResource(deletingId);
        }}
      />
    </div>
  );
}
