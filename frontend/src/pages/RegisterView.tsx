import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Github } from 'lucide-react';
import { registerSchema, RegisterFormData } from '@/schemas/auth.schema';
import { useSignup } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function RegisterView() {
  const signup = useSignup();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await signup.mutateAsync(data);
    } catch (error: any) {
      if (error.errors) {
        Object.entries(error.errors).forEach(([key, value]) => {
          setError(key as keyof RegisterFormData, {
            type: 'manual',
            message: value as string
          });
        });
      }
    }
  };

  return (
    <section className="min-h-screen bg-gradient-default py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <Card>
              <CardBody className="px-8 py-10">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-secondary-800">Create Account</h2>
                  <p className="text-secondary-600 text-sm mt-2">
                    Sign up with credentials
                  </p>
                </div>

                <div className="mb-6 text-center">
                  <p className="text-sm text-secondary-500 mb-3">Sign up with</p>
                  <div className="flex justify-center space-x-3">
                    <Button variant="neutral" size="sm">
                      <Github size={16} className="mr-2" />
                      Github
                    </Button>
                    <Button variant="neutral" size="sm">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-secondary-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-secondary-500">Or</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    {...register('name')}
                    type="text"
                    placeholder="Name"
                    leftIcon={<User size={20} />}
                    error={errors.name?.message}
                  />

                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Email"
                    leftIcon={<Mail size={20} />}
                    error={errors.email?.message}
                  />

                  <Input
                    {...register('password')}
                    type="password"
                    placeholder="Password"
                    leftIcon={<Lock size={20} />}
                    error={errors.password?.message}
                  />

                  <div className="text-sm text-secondary-600">
                    <span className="font-medium">Password strength:</span>{' '}
                    <span className="text-success font-semibold">strong</span>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="agree"
                      className="h-4 w-4 text-primary focus:ring-primary border-secondary-300 rounded mt-1"
                    />
                    <label htmlFor="agree" className="ml-2 block text-sm text-secondary-700">
                      I agree with the{' '}
                      <Link to="#" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    isLoading={signup.isPending}
                  >
                    Create Account
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-secondary-600">Already have an account? </span>
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}