import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useListStore } from '../store/listStore';
import { CreateListRequest } from '../types/api';
import ListForm from '../components/Lists/ListForm';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NewList: React.FC = () => {
  const { createList, isLoading } = useListStore();
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateListRequest) => {
    try {
      const newList = await createList(data);
      toast.success('Lista criada com sucesso!');
      navigate(`/lists/${newList.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar lista');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft size={18} />}
          className="mb-4"
        >
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Criar Nova Lista</h1>
        <p className="text-gray-600 mt-1">
          Crie uma nova lista para organizar seus itens.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 max-w-md">
        <ListForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          buttonText="Criar Lista"
        />
      </div>
    </div>
  );
};

export default NewList;