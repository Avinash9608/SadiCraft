
import type { Profile, User, Interest, AstroReport } from '@/lib/types';

export const sampleProfiles: Profile[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 26,
    location: 'Mumbai, Maharashtra',
    profession: 'Software Engineer',
    education: 'B.Tech Computer Science',
    religion: 'Hindu',
    caste: 'Brahmin',
    height: "5'4\"",
    photos: ['https://placehold.co/300x400.png'],
    phone: '+91 9876543210',
    email: 'priya.sharma@email.com',
    bio: 'Looking for a compatible life partner who shares similar values and interests.',
    verified: true,
    isPriority: true,
    lastActive: '2 hours ago',
    interests: ['Reading', 'Cooking', 'Travel'],
    familyDetails: {
      fatherOccupation: 'Business',
      motherOccupation: 'Teacher',
      siblings: 1
    },
    preferences: {
      ageRange: [26, 32],
      locationPreference: ['Mumbai', 'Delhi', 'Bangalore'],
      educationPreference: ['Engineering', 'MBA', 'Medicine']
    }
  },
  {
    id: '2',
    name: 'Rohit Patel',
    age: 29,
    location: 'Ahmedabad, Gujarat',
    profession: 'Doctor',
    education: 'MBBS, MD',
    religion: 'Hindu',
    caste: 'Patel',
    height: "5'8\"",
    photos: ['https://placehold.co/300x400.png'],
    videoProfile: 'video-profile-2.mp4',
    phone: '+91 9876543211',
    email: 'rohit.patel@email.com',
    bio: 'Family-oriented doctor looking for a caring and understanding life partner.',
    verified: true,
    isPriority: false,
    lastActive: '1 day ago',
    interests: ['Music', 'Sports', 'Medicine'],
    familyDetails: {
      fatherOccupation: 'Farmer',
      motherOccupation: 'Homemaker',
      siblings: 2
    },
    preferences: {
      ageRange: [24, 28],
      locationPreference: ['Gujarat', 'Rajasthan', 'Mumbai'],
      educationPreference: ['Graduate', 'Post Graduate']
    }
  },
  {
    id: '3',
    name: 'Sneha Iyer',
    age: 24,
    location: 'Chennai, Tamil Nadu',
    profession: 'Teacher',
    education: 'M.Ed',
    religion: 'Hindu',
    caste: 'Iyer',
    height: "5'2\"",
    photos: ['https://placehold.co/300x400.png'],
    phone: '+91 9876543212',
    email: 'sneha.iyer@email.com',
    bio: 'Traditional values with modern outlook. Love teaching and nurturing young minds.',
    verified: false,
    isPriority: true,
    lastActive: '3 hours ago',
    interests: ['Teaching', 'Classical Music', 'Yoga'],
    familyDetails: {
      fatherOccupation: 'Engineer',
      motherOccupation: 'Doctor',
      siblings: 0
    },
    preferences: {
      ageRange: [26, 30],
      locationPreference: ['Chennai', 'Bangalore', 'Hyderabad'],
      educationPreference: ['Engineering', 'Medicine', 'Teaching']
    }
  }
];

export const sampleUser: User = {
  id: 'user1',
  name: 'Amit Kumar',
  email: 'amit.kumar@email.com',
  subscription: 'free',
  profilesViewedToday: 2,
  interestsSentThisMonth: 1,
  joinDate: '2025-01-15',
  profile: {
    id: 'user1',
    name: 'Amit Kumar',
    age: 28,
    location: 'Delhi, India',
    profession: 'Marketing Manager',
    education: 'MBA',
    religion: 'Hindu',
    caste: 'Sharma',
    height: "5'10\"",
    photos: ['https://placehold.co/300x400.png'],
    phone: '+91 9876543213',
    email: 'amit.kumar@email.com',
    bio: 'Looking for a life partner who values family and career equally.',
    verified: false,
    isPriority: false,
    lastActive: 'Online now',
    interests: ['Photography', 'Travel', 'Movies'],
    familyDetails: {
      fatherOccupation: 'Government Service',
      motherOccupation: 'Homemaker',
      siblings: 1
    },
    preferences: {
      ageRange: [24, 30],
      locationPreference: ['Delhi', 'Mumbai', 'Gurgaon'],
      educationPreference: ['Graduate', 'Post Graduate']
    }
  }
};

export const astroReports: AstroReport[] = [
  {
    id: '1',
    title: 'Compatibility Report with Priya Sharma',
    description: 'Detailed astrological compatibility analysis',
    compatibility: 85,
    details: 'Strong planetary alignment suggests excellent compatibility. Mars and Venus positions indicate harmonious relationship.'
  },
  {
    id: '2',
    title: 'Marriage Timing Prediction',
    description: 'Best time for marriage based on your horoscope',
    compatibility: 92,
    details: 'Jupiter transit suggests favorable period for marriage between March-June 2025.'
  }
];
