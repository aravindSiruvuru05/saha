// pages/signup.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSignupMutation } from '@/store/apiSlice';
import { useIonRouter } from '@ionic/react';
import { Link } from 'react-router-dom';
import { AlertDialog } from '@/components/ui/commonComponents/AlertDialog';
import { APP_LABELS } from '@/utils/labels';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [signup, { isLoading: isCreating }] = useSignupMutation();
  const router = useIonRouter(); // Use IonRouter for navigation
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await signup({
        name,
        email,
        password,
        confirm_password: confirmPassword,
      }).unwrap();
      setShowSuccessDialog(true);
    } catch (e: any) {
      setApiError((e?.data?.message as string) || 'Something went wrong!');
    }
  };

  const handleActionContinue = () => {
    setShowSuccessDialog(false);
    router.push('/signin');
  };

  return (
    <div className="flex items-center justify-center min-h-screen  md:bg-primary bg-transparent">
      <Card className="w-full max-w-sm mx-5 shadow-none border-none md:shadow md:border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign Up
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder={APP_LABELS.namePlaceholder}
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={APP_LABELS.emailPlaceholder}
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={APP_LABELS.passwordPlaceholder}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={APP_LABELS.confirmPasswordPlaceholder}
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            {(error || apiError) && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error || apiError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? APP_LABELS.loadingLabel : APP_LABELS.signupLabel}
            </Button>
          </form>

          {/* Divider with "or" */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-black">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="text-center">
            <span className="text-black">Already have an account ? </span>
            <Link to="/signin" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        title="Account created 😍"
        description="please login with your details!"
        onAction={handleActionContinue}
        actionLabel="Continue"
        show={showSuccessDialog}
        setShow={setShowSuccessDialog}
      />
    </div>
  );
};
