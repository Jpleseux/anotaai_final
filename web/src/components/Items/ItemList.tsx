import React, { useState } from 'react';
import { Item } from '../../types/api';
import { formatDate } from '../../utils/date';
import Button from '../ui/Button';
import { Trash2, Edit } from 'lucide-react';

interface ItemListProps {
  items: Item[];
  onDeleteItem: (uuid: string) => void;
  onEditItem: (uuid: string, name: string) => void;
  isLoading?: boolean;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  onDeleteItem,
  onEditItem,
  isLoading = false
}) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEditClick = (item: Item) => {
    setEditingItemId(item.uuid);
    setEditingName(item.name);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingName('');
  };

  const handleSaveEdit = (uuid: string) => {
    if (editingName.trim()) {
      onEditItem(uuid, editingName);
      setEditingItemId(null);
      setEditingName('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum item na lista ainda.</p>
        <p className="text-gray-500 text-sm mt-1">Adicione itens usando o formulário acima.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="text-sm font-medium text-gray-500 mb-2">
        {items.length} {items.length === 1 ? 'item' : 'itens'} na lista
      </div>
      
      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
        {items.map((item) => (
          <li 
            key={item.uuid} 
            className="bg-white p-4 hover:bg-gray-50 transition-colors"
          >
            {editingItemId === item.uuid ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleSaveEdit(item.uuid)}
                    isLoading={isLoading}
                  >
                    Salvar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCancelEdit}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">{formatDate(item.createdAt)}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.uuid)}
                    className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemList;