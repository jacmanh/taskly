'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock } from 'lucide-react';
import { Input, Button } from '@taskly/design-system';
import { useAuth } from '@features/auth/hooks/useAuth';
import {
  registerSchema,
  type RegisterFormData,
} from '@features/auth/schemas/register.schema';

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null);

    try {
      await registerUser(data);
    } catch (err) {
      setSubmitError(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {submitError}
                  </h3>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                label="Full name"
                placeholder="Full name (optional)"
                disabled={isLoading || isSubmitting}
                icon={<User size={18} />}
                {...register('name')}
              />
            </div>
            <div>
              <Input
                type="email"
                label="Email address"
                placeholder="Email address"
                disabled={isLoading || isSubmitting}
                required
                icon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
              />
            </div>
            <div>
              <Input
                type="password"
                label="Password"
                placeholder="Password"
                disabled={isLoading || isSubmitting}
                required
                icon={<Lock size={18} />}
                error={errors.password?.message}
                {...register('password')}
              />
            </div>
            <div>
              <Input
                type="password"
                label="Confirm password"
                placeholder="Confirm password"
                disabled={isLoading || isSubmitting}
                required
                icon={<Lock size={18} />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSubmitting || !isValid}
            loading={isLoading || isSubmitting}
            className="w-full"
          >
            {isLoading || isSubmitting
              ? 'Creating account...'
              : 'Create account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
