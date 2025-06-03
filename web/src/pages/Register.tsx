import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, Lock, User } from 'lucide-react';

import { register as registerUser } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { RegisterRequest } from '../types/api';
import AuthLayout from '../components/Layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterRequest>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    
    try {
      await registerUser(data);
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Criar uma conta"
      subtitle="Comece a organizar suas listas agora mesmo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Nome"
          placeholder="Seu nome"
          leftIcon={<User size={18} />}
          error={errors.name?.message}
          {...register('name', {
            required: 'O nome é obrigatório',
            minLength: {
              value: 2,
              message: 'O nome deve ter pelo menos 2 caracteres'
            }
          })}
        />

        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'O email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password', {
            required: 'A senha é obrigatória',
            minLength: {
              value: 6,
              message: 'A senha deve ter pelo menos 6 caracteres'
            }
          })}
        />

        <div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Criar conta
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Já tem uma conta?
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/login">
            <Button
              variant="outline"
              className="w-full"
            >
              Fazer login
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;