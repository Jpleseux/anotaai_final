import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListStore } from '../store/listStore';
import ListCard from '../components/Lists/ListCard';
import { PlusCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { lists, isLoading, error, fetchLists } = useListStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const createNewList = () => {
    navigate('/new-list');
  };

  if (isLoading && lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Ops! Algo deu errado</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => fetchLists()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma lista encontrada</h2>
          <p className="text-gray-600 mb-6">Crie sua primeira lista para começar a organizar seus itens.</p>
          <Button 
            onClick={createNewList}
            leftIcon={<PlusCircle size={18} />}
          >
            Criar nova lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Suas Listas</h1>
        <Button 
          onClick={createNewList}
          leftIcon={<PlusCircle size={18} />}
        >
          Nova Lista
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => (
          <ListCard key={list.id} list={list} />
        ))}
      </div>
    </div>
  );
};

export default Home;