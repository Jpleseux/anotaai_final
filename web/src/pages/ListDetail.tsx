import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListStore } from '../store/listStore';
import { useItemStore } from '../store/itemStore';
import { CreateItemRequest, UpdateListRequest } from '../types/api';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Trash2, 
  Edit, 
  Check, 
  X,
  Clipboard
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ItemForm from '../components/Items/ItemForm';
import ItemList from '../components/Items/ItemList';

const ListDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { currentList, isLoading: listLoading, fetchList, updateList, deleteList } = useListStore();
  const { 
    items, 
    isLoading: itemsLoading, 
    fetchItems, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useItemStore();

  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (uuid) {
      fetchList(uuid);
    }
  }, [uuid, fetchList]);

  useEffect(() => {
    if (uuid) {
      fetchItems(uuid);
    }
  }, [uuid, fetchItems]);

  useEffect(() => {
    if (currentList) {
      setListName(currentList.name);
    }
  }, [currentList]);

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    if (currentList) {
      setListName(currentList.name);
    }
  };

  const handleSaveEditing = async () => {
    if (!uuid || !listName.trim()) return;

    try {
      await updateList(uuid, { name: listName });
      setIsEditing(false);
      toast.success('Lista atualizada com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar lista');
    }
  };

  const handleDeleteList = async () => {
    if (!uuid) return;

    try {
      await deleteList(uuid);
      toast.success('Lista excluída com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir lista');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddItem = async (data: Omit<CreateItemRequest, 'listId'>) => {
    if (!uuid) return;

    try {
      await createItem({
        ...data,
        listId: uuid
      });
      toast.success('Item adicionado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteItem(itemId);
      toast.success('Item removido com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao remover item');
    }
  };

  const handleEditItem = async (itemId: string, name: string) => {
    if (!uuid) return;

    try {
      await updateItem(itemId, {
        name,
        listId: uuid
      });
      toast.success('Item atualizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao atualizar item');
    }
  };

  if (listLoading && !currentList) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-40 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentList) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <Clipboard size={24} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Lista não encontrada</h2>
        <p className="text-gray-600 mb-6">Esta lista não existe ou foi removida.</p>
        <Button onClick={() => navigate('/')}>Voltar para a página inicial</Button>
      </div>
    );
  }

  return (
    <div>
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        leftIcon={<ArrowLeft size={18} />}
        className="mb-4"
      >
        Voltar
      </Button>

      <div className="flex justify-between items-start mb-6">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="font-bold text-xl"
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSaveEditing}
                leftIcon={<Check size={16} />}
              >
                Salvar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancelEditing}
                leftIcon={<X size={16} />}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <h1 className="text-2xl font-bold text-gray-900">{currentList.name}</h1>
        )}

        {!isEditing && (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleStartEditing}
              leftIcon={<Edit size={16} />}
            >
              Editar
            </Button>
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Confirmar?</span>
                <Button 
                  size="sm" 
                  variant="danger" 
                  onClick={handleDeleteList}
                  leftIcon={<Check size={16} />}
                >
                  Sim
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsDeleting(false)}
                  leftIcon={<X size={16} />}
                >
                  Não
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => setIsDeleting(true)}
                leftIcon={<Trash2 size={16} />}
              >
                Excluir
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Adicionar Item</h2>
        <ItemForm 
          onSubmit={handleAddItem} 
          isLoading={itemsLoading}
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Itens da Lista</h2>
        <ItemList 
          items={items} 
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItem}
          isLoading={itemsLoading}
        />
      </div>
    </div>
  );
};

export default ListDetail;