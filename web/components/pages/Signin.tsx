'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSigninMutation } from '@/store/authSlice';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/userSlice';
import { useIonRouter } from '@ionic/react';
import { APP_LABELS } from '@/utils/labels';

export const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signin, { isLoading: isCreating, error }] = useSigninMutation();
  const [apiError, setApiError] = useState('');
  const router = useIonRouter(); // Use IonRouter for navigation

  const dispatch = useDispatch();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resData = await signin({
        email,
        password,
      }).unwrap();
      // Redirect to the protected route
      if (resData.token) {
        dispatch(setUser({ token: resData.token, user: resData.user }));
        router.push('/');
      } else setApiError('something went wrong');
    } catch (e: any) {
      setApiError(e.data.message as string);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  md:bg-primary bg-transparent">
      <Card className="w-full max-w-sm mx-5 shadow-none border-none md:shadow md:border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder={APP_LABELS.emailPlaceholder}
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
            {apiError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full">
              {isCreating ? APP_LABELS.loadingLabel : APP_LABELS.signinLabel}
            </Button>
          </form>

          {/* Divider with "or" */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-2 text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="text-center">
            <span className="text-black">Don&#39;t have an account ? </span>

            <Link to="/signup" className="text-blue-500 hover:underline">
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
