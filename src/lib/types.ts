
export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  religion: string;
  caste: string;
  height: string;
  photos: string[];
  videoProfile?: string;
  phone: string;
  email: string;
  bio: string;
  verified: boolean;
  isPriority: boolean;
  lastActive: string;
  interests: string[];
  familyDetails: {
    fatherOccupation: string;
    motherOccupation: string;
    siblings: number;
  };
  preferences: {
    ageRange: [number, number];
    locationPreference: string[];
    educationPreference: string[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  subscription: 'free' | 'silver' | 'gold' | 'platinum';
  profilesViewedToday: number;
  interestsSentThisMonth: number;
  profile: Profile;
  joinDate: string;
  dedicatedManager?: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface Interest {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  sentAt: string;
}

export interface AstroReport {
  id: string;
  title: string;
  description: string;
  compatibility: number;
  details: string;
}
