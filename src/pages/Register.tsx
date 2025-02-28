import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import Button from '../components/Button';
import Input from '../components/Input';
import { UserPlus } from 'lucide-react';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  date_of_birth: z.string().refine((date) => {
    const age = Math.floor((Date.now() - new Date(date).getTime()) / 31557600000);
    return age >= 18;
  }, 'You must be at least 18 years old'),
  phone_number: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await auth.register(data);
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      setError('root', { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary-hover"
            >
              Sign in
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Username"
              {...register('username')}
              error={errors.username?.message}
              placeholder="johndoe"
            />
            <Input
              label="Email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="john@example.com"
            />
            <Input
              label="Password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
            />
            <Input
              label="Date of Birth"
              type="date"
              {...register('date_of_birth')}
              error={errors.date_of_birth?.message}
            />
            <Input
              label="Phone Number"
              {...register('phone_number')}
              error={errors.phone_number?.message}
              placeholder="1234567890"
            />
          </div>

          {errors.root && (
            <p className="text-sm text-error text-center">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}