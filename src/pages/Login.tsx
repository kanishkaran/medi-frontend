import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/Button';
import Input from '../components/Input';
import { LogIn } from 'lucide-react';
import GoogleLoginButton from '../components/GoogleLoginButton'; // Import GoogleLoginButton

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();
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
      const response = await auth.login(data);
      console.log('Login response:', response); // Debugging
      if (response && response.access_token) {
        setToken(response.access_token); // Save token to store
        navigate('/chat'); // Redirect to chat page
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error); // Debugging
      const message = error.response?.data?.message || 'Invalid email or password';
      setError('root', { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary-hover"
            >
              Sign up
            </button>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
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
            Sign in
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative flex items-center justify-center">
            <span className="absolute bg-background px-2 text-sm text-foreground/70">
              Or login with
            </span>
            <div className="w-full border-t border-secondary/20"></div>
          </div>
          <div className="mt-4">
            <GoogleLoginButton /> {/* Add GoogleLoginButton */}
          </div>
        </div>
      </div>
    </div>
  );
}