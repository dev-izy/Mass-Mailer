// pages/auth/SignupPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import {Button} from '../../components/ui/Button';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);

    try {
      await signUp(data.email.trim(), data.password, data.fullName.trim());
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error?.message || 'Unable to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">Mass Mailer</span>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create your account</h2>
        <p className="text-gray-500 text-sm mb-8">Start sending smarter emails today</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Alex Johnson"
            icon={<User className="w-4 h-4" />}
            error={errors.fullName?.message}
            disabled={loading}
            {...register('fullName')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            disabled={loading}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password?.message}
            disabled={loading}
            {...register('password')}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={loading}
            disabled={loading}
            iconRight={<ArrowRight className="w-4 h-4" />}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}