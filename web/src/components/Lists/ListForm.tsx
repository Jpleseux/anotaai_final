import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateListRequest, UpdateListRequest } from '../../types/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { List } from 'lucide-react';

interface ListFormProps {
  onSubmit: (data: CreateListRequest | UpdateListRequest) => void;
  defaultValues?: {
    name: string;
  };
  isLoading?: boolean;
  buttonText?: string;
}

const ListForm: React.FC<ListFormProps> = ({
  onSubmit,
  defaultValues = { name: '' },
  isLoading = false,
  buttonText = 'Salvar'
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateListRequest | UpdateListRequest>({
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome da Lista"
        placeholder="Ex: Lista de Compras, Tarefas, etc."
        leftIcon={<List size={18} />}
        error={errors.name?.message}
        {...register('name', {
          required: 'O nome da lista é obrigatório',
          minLength: {
            value: 3,
            message: 'O nome deve ter pelo menos 3 caracteres'
          },
          maxLength: {
            value: 50,
            message: 'O nome deve ter no máximo 50 caracteres'
          }
        })}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
};

export default ListForm;