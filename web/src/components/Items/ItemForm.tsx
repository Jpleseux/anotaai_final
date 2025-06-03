import React from 'react';
import { useForm } from 'react-hook-form';
import { CreateItemRequest, UpdateItemRequest } from '../../types/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { ListPlus } from 'lucide-react';

interface ItemFormProps {
  onSubmit: (data: Omit<CreateItemRequest, 'listId'>) => void;
  defaultValues?: {
    name: string;
  };
  isLoading?: boolean;
  buttonText?: string;
}

const ItemForm: React.FC<ItemFormProps> = ({
  onSubmit,
  defaultValues = { name: '' },
  isLoading = false,
  buttonText = 'Adicionar'
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Omit<CreateItemRequest, 'listId'>>({
    defaultValues
  });

  const handleFormSubmit = (data: Omit<CreateItemRequest, 'listId'>) => {
    onSubmit(data);
    reset({ name: '' });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        placeholder="Adicionar novo item..."
        leftIcon={<ListPlus size={18} />}
        error={errors.name?.message}
        {...register('name', {
          required: 'O nome do item é obrigatório',
          minLength: {
            value: 2,
            message: 'O nome deve ter pelo menos 2 caracteres'
          },
          maxLength: {
            value: 100,
            message: 'O nome deve ter no máximo 100 caracteres'
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

export default ItemForm;