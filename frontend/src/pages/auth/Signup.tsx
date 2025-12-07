import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { UserRole } from '../../types';

export default function Signup() {
    const [step, setStep] = useState<'details' | 'verification' | 'pending'>('details');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '' as UserRole,
    });
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await authService.register({
                fullName: formData.name,
                email: formData.email,
                role: formData.role,
                password: formData.password
            });
            setStep('verification');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.verifyEmail(formData.email, otp);
            setStep('pending');
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-blue-900">
                        {step === 'verification' ? 'Verify Email' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 'verification'
                            ? `Enter the code sent to ${formData.email}`
                            : 'Join PM-AJAY Dashboard'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'details' && (
                        <form onSubmit={handleSignup} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone</label>
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Role</label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="StateNodalOfficer">State Nodal Officer</SelectItem>
                                        <SelectItem value="DistrictOfficer">District Officer</SelectItem>
                                        <SelectItem value="AgencyAdmin">Agency Manager</SelectItem>
                                        <SelectItem value="Inspector">Inspector</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Password</label>
                                    <Input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Confirm</label>
                                    <Input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Continue'}
                            </Button>
                        </form>
                    )}

                    {step === 'verification' && (
                        <form onSubmit={handleVerify} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Verification Code</label>
                                <Input
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="text-center text-2xl tracking-widest"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full !bg-green-600 hover:!bg-green-700 !text-white" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify Email'}
                            </Button>
                        </form>
                    )}

                    {step === 'pending' && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Email Verified!</h3>
                            <p className="text-gray-600">
                                Your email is verified. Your account is now <strong>pending Admin approval</strong>. You will be able to login once approved.
                            </p>
                            <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                                Back to Login
                            </Button>
                        </div>
                    )}
                </CardContent>
                {step === 'details' && (
                    <div className="p-6 pt-0 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    );
}
