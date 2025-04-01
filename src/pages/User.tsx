import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/api'; // Import only the necessary API
import Button from '../components/Button';
import { ArrowLeft, Package } from 'lucide-react'; // Import only necessary icons
import type { User } from '../types';

export default function User() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<User | null>(null); // State for user details
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await auth.getUser(); // Fetch user details
        setUserDetails({
          id: userResponse.id, // Include the id property
          username: userResponse.username,
          email: userResponse.email,
          phoneNumber: userResponse.phone_number, // Map phone_number to phoneNumber
          dateOfBirth: userResponse.date_of_birth, // Map date_of_birth to dateOfBirth
        });
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-2 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)} // Navigate back to the previous page
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Account</h1>
        </div>

        <div className="space-y-8">
          {/* User Details */}
          {userDetails && (
            <div className="bg-secondary/10 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">User Details</h2>
              <p className="text-sm">
                <span className="font-medium">Username:</span> {userDetails.username}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {userDetails.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Phone:</span>{' '}
                {userDetails.phoneNumber || 'Not provided'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Date of Birth:</span>{' '}
                {userDetails.dateOfBirth
                  ? new Date(userDetails.dateOfBirth).toLocaleDateString() // Format the date
                  : 'Not provided'}
              </p>
            </div>
          )}

          {/* Navigate to Order History */}
          <div className="bg-secondary/10 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order History
            </h2>
            <Button
              variant="primary"
              onClick={() => navigate('/order/history')} // Navigate to the Order History page
            >
              View Order History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}