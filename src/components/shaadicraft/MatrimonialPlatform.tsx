
"use client";

import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AuthContext, type Plan } from '@/lib/AuthContext';
import { 
  User as UserIcon, 
  Heart, 
  Search, 
  Star, 
  Video, 
  MessageCircle, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Crown,
  Zap,
  Bell,
  Filter,
  Eye,
  Send,
  Award,
  Infinity as InfinityIcon
} from 'lucide-react';
import type { Profile, User, Interest, AstroReport } from '@/lib/types';
import { sampleProfiles, sampleUser, astroReports } from '@/lib/sample-data';
import { Button } from '@/components/ui/button';

const MatrimonialPlatform: React.FC = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User>(sampleUser);
  const [profiles, setProfiles] = useState<Profile[]>(sampleProfiles);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'interests' | 'profile' | 'premium' | 'astro'>('browse');
  const [searchFilters, setSearchFilters] = useState({
    ageRange: [18, 40] as [number, number],
    location: '',
    profession: '',
    education: '',
    religion: ''
  });
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [interestMessage, setInterestMessage] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (authContext?.user) {
      setCurrentUser(prevUser => ({
        ...prevUser,
        id: authContext.user!.uid,
        name: authContext.user!.displayName || 'User',
        email: authContext.user!.email || '',
        subscription: authContext.subscription?.plan || 'free',
        profilesViewedToday: authContext.usage?.profilesViewed || 0,
        interestsSentThisMonth: authContext.usage?.interestsSent || 0,
      }));
    }
  }, [authContext]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const canViewProfile = () => {
    if (authContext?.features?.unlimitedViews) return true;
    return (authContext?.usage?.profilesViewed || 0) < 5;
  };

  const canSendInterest = () => {
    if (authContext?.features?.unlimitedInterests) return true;
    return (authContext?.usage?.interestsSent || 0) < 3;
  };

  const canViewContact = () => {
    return authContext?.features?.contactAccess ?? false;
  };

  const hasAdvancedFilters = () => {
    return authContext?.features?.advancedFilters ?? false;
  }

  const handleProfileView = (profile: Profile) => {
    if (!canViewProfile()) {
      setShowUpgradeModal(true);
      return;
    }
    
    setSelectedProfile(profile);
    // In a real app, this would be an API call to increment the view count
    setCurrentUser(prev => ({
      ...prev,
      profilesViewedToday: prev.profilesViewedToday + 1
    }));
  };

  const handleSendInterest = () => {
    if (!canSendInterest()) {
      setShowUpgradeModal(true);
      return;
    }

    if (!selectedProfile) return;

    const newInterest: Interest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: selectedProfile.id,
      message: interestMessage,
      status: 'pending',
      sentAt: new Date().toISOString()
    };

    setInterests(prev => [...prev, newInterest]);
    // In a real app, this would be an API call to increment the interest count
    setCurrentUser(prev => ({
      ...prev,
      interestsSentThisMonth: prev.interestsSentThisMonth + 1
    }));
    
    setInterestMessage('');
    setSelectedProfile(null);
    addNotification('Interest sent successfully!');
  };

  const handleUpgradeSubscription = (plan: Plan) => {
    router.push(`/checkout?plan=${plan}`);
    setShowUpgradeModal(false);
  };

  const filteredProfiles = profiles.filter(profile => {
    return (
      profile.age >= searchFilters.ageRange[0] &&
      profile.age <= searchFilters.ageRange[1] &&
      (searchFilters.location === '' || profile.location.toLowerCase().includes(searchFilters.location.toLowerCase())) &&
      (searchFilters.profession === '' || profile.profession.toLowerCase().includes(searchFilters.profession.toLowerCase())) &&
      (searchFilters.education === '' || profile.education.toLowerCase().includes(searchFilters.education.toLowerCase())) &&
      (searchFilters.religion === '' || profile.religion.toLowerCase().includes(searchFilters.religion.toLowerCase()))
    );
  });

  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    if (authContext?.features?.priorityListing) {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
    }
    return 0;
  });

  const PricingCard = ({ 
    title, 
    price, 
    period, 
    features, 
    isPopular, 
    planType, 
    onSelect 
  }: {
    title: string;
    price: string;
    period?: string;
    features: string[];
    isPopular?: boolean;
    planType: Plan;
    onSelect: () => void;
  }) => (
    <div className={`relative border rounded-lg p-6 ${isPopular ? 'border-primary bg-primary/10' : 'border-border'}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-3xl font-extrabold text-primary">{price}</span>
          {period && <span className="text-muted-foreground">/{period}</span>}
        </div>
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Star className="w-4 h-4 text-green-500 mr-2 shrink-0" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button
        onClick={onSelect}
        className="w-full"
        variant={isPopular ? 'default' : 'outline'}
        disabled={currentUser.subscription === planType}
      >
        {currentUser.subscription === planType ? 'Current Plan' : `Choose ${title}`}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30 text-foreground">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-primary">ShaadiCraft</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {notifications.length > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-muted-foreground" />
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </div>
              )}
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                currentUser.subscription === 'free' ? 'bg-muted text-muted-foreground' :
                currentUser.subscription === 'silver' ? 'bg-gray-300 text-gray-900' :
                currentUser.subscription === 'gold' ? 'bg-yellow-400 text-yellow-900' :
                'bg-purple-500 text-white'
              }`}>
                {currentUser.subscription}
                {currentUser.subscription === 'platinum' && <Crown className="w-4 h-4 inline ml-1" />}
              </div>
              
              <div className="flex items-center space-x-2">
                <Image 
                  data-ai-hint="profile avatar"
                  src={currentUser.profile.photos[0]} 
                  alt={currentUser.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{currentUser.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div key={index} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-down">
              {notification}
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'browse', label: 'Browse Profiles', icon: Search },
              { id: 'interests', label: 'My Interests', icon: Heart },
              { id: 'profile', label: 'My Profile', icon: UserIcon },
              { id: 'premium', label: 'Premium Plans', icon: Crown },
              { id: 'astro', label: 'Astro Reports', icon: Star }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Browse Profiles</h2>
              
              <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">
                        Profiles viewed today: {currentUser.profilesViewedToday} / {currentUser.subscription === 'free' ? '5' : <InfinityIcon className="w-4 h-4 inline" />}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        Interests sent this month: {currentUser.interestsSentThisMonth} / {currentUser.subscription === 'free' ? '3' : <InfinityIcon className="w-4 h-4 inline" />}
                      </span>
                    </div>
                  </div>
                  
                  {currentUser.subscription !== 'platinum' && (
                    <Button onClick={() => setShowUpgradeModal(true)}><Zap className="w-4 h-4 mr-2" /> Upgrade</Button>
                  )}
                </div>
              </div>
              
              {hasAdvancedFilters() ? (
                <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
                   <div className="flex items-center space-x-2 mb-4">
                    <Filter className="w-4 h-4" />
                    <h3 className="font-medium">Advanced Search Filters</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Filter controls */}
                  </div>
                </div>
              ) : (
                <div className="bg-card p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
                    <p className="text-muted-foreground">Upgrade to Silver or higher to use advanced search filters.</p>
                    <Button onClick={() => setShowUpgradeModal(true)}>Upgrade</Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProfiles.map((profile) => (
                <div key={profile.id} className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <Image
                      data-ai-hint="profile portrait" 
                      src={profile.photos[0]} 
                      alt={profile.name}
                      width={300}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                    {authContext?.features?.priorityListing && profile.isPriority && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">Priority</div>
                    )}
                    {profile.verified && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full"><Shield className="w-4 h-4" /></div>
                    )}
                     {profile.videoProfile && authContext?.features?.videoProfile && (
                      <div className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-1 rounded-full"><Video className="w-4 h-4" /></div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{profile.name}</h3>
                      <span className="text-sm text-muted-foreground">{profile.age} years</span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /><span>{profile.location}</span></div>
                      <div className="flex items-center"><Briefcase className="w-4 h-4 mr-1" /><span>{profile.profession}</span></div>
                      <div className="flex items-center"><GraduationCap className="w-4 h-4 mr-1" /><span>{profile.education}</span></div>
                    </div>
                    <Button onClick={() => handleProfileView(profile)} className="w-full">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'interests' && (
            <div>
            <h2 className="text-2xl font-bold mb-6">My Interests</h2>
            {interests.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg"><Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-muted-foreground">No interests sent yet</p></div>
            ) : (
                <div className="space-y-4">
                {interests.map((interest) => {
                    const profile = profiles.find(p => p.id === interest.toUserId);
                    return (
                    <div key={interest.id} className="bg-card p-4 rounded-lg shadow-sm flex items-center space-x-4">
                        <Image data-ai-hint="profile avatar" src={profile?.photos[0] || ''} alt={profile?.name || ''} width={64} height={64} className="w-16 h-16 rounded-full object-cover"/>
                        <div className="flex-1">
                        <h3 className="font-semibold">{profile?.name}</h3>
                        <p className="text-sm text-muted-foreground">{interest.message}</p>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
            </div>
        )}
        
        {activeTab === 'profile' && (
            <div className="bg-card p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                {/* Profile editing form would go here */}
                <p>This is where the user can view and edit their own profile details.</p>
                {canViewContact() && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-2">Contact Information</h4>
                       <div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-blue-500" /><span>{currentUser.profile.phone}</span></div>
                       <div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-blue-500" /><span>{currentUser.profile.email}</span></div>
                    </div>
                  )}
            </div>
        )}

        {activeTab === 'premium' && (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Premium Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PricingCard title="Free" price="₹0" features={['Basic Profile', '5 Views/Day', '3 Interests/Month']} planType="free" onSelect={() => {}}/>
                <PricingCard title="Silver" price="₹999" period="year" isPopular={true} features={['Unlimited Views & Interests', 'Contact Access', 'Advanced Filters', 'Ad-Free']} planType="silver" onSelect={() => handleUpgradeSubscription('silver')}/>
                <PricingCard title="Gold" price="₹2,499" period="year" features={['All Silver Features', 'Priority Listing', 'Video Profile', 'Astro Reports']} planType="gold" onSelect={() => handleUpgradeSubscription('gold')}/>
                <PricingCard title="Platinum" price="₹4,999" period="one-time" features={['All Gold Features', 'Lifetime Validity', 'Profile Boosts', 'Dedicated Manager']} planType="platinum" onSelect={() => handleUpgradeSubscription('platinum')}/>
                </div>
            </div>
        )}

         {activeTab === 'astro' && (
            <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">Astrology Reports</h2>
            {(authContext?.features?.astroReports ?? 0) > 0 ? (
              <div className="space-y-6">
                {defaultAstroReports.map((report) => (
                  <div key={report.id} className="bg-card p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold">{report.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Unlock Astrology Reports</h3>
                <p className="text-muted-foreground mb-6">Upgrade to Gold or Platinum to get detailed compatibility reports.</p>
                <Button onClick={() => handleUpgradeSubscription('gold')}>Upgrade to Gold</Button>
              </div>
            )}
            </div>
        )}

      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                <button onClick={() => setSelectedProfile(null)} className="text-muted-foreground hover:text-foreground text-2xl">×</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <Image data-ai-hint="profile portrait" src={selectedProfile.photos[0]} alt={selectedProfile.name} width={400} height={500} className="w-full h-80 object-cover rounded-lg mb-4"/>
                  {authContext?.features?.videoProfile && selectedProfile.videoProfile && (
                    <div className="bg-blue-50 p-4 rounded-lg"><div className="flex items-center space-x-2 mb-2"><Video className="w-4 h-4 text-blue-500" /><span className="font-medium">Video Profile</span></div><Button>Watch Video</Button></div>
                  )}
                 </div>
                 <div className="space-y-4">
                  {canViewContact() ? (
                    <div className="bg-green-50 p-4 rounded-lg"><h4 className="font-medium mb-2">Contact Information</h4><div className="space-y-2"><div className="flex items-center space-x-2"><Phone className="w-4 h-4 text-green-500" /><span>{selectedProfile.phone}</span></div><div className="flex items-center space-x-2"><Mail className="w-4 h-4 text-green-500" /><span>{selectedProfile.email}</span></div></div></div>
                  ) : (
                    <div className="bg-gray-100 p-4 rounded-lg text-center"><p className="text-sm text-gray-600">Upgrade to view contact details.</p><Button size="sm" className="mt-2" onClick={() => { setSelectedProfile(null); setShowUpgradeModal(true); }}>Upgrade</Button></div>
                  )}
                 </div>
              </div>
               <div className="mt-6 border-t pt-6">
                <h4 className="font-medium mb-3">Send Interest</h4>
                <textarea value={interestMessage} onChange={(e) => setInterestMessage(e.target.value)} placeholder="Write a message..." className="w-full px-3 py-2 border rounded-lg h-20 mb-4 bg-background"/>
                <div className="flex space-x-4">
                  <Button onClick={handleSendInterest} disabled={!canSendInterest()} variant={canSendInterest() ? 'default' : 'secondary'}><Heart className="w-4 h-4 inline mr-2" />Send Interest</Button>
                  <Button onClick={() => setSelectedProfile(null)} variant="outline">Close</Button>
                </div>
                 {!canSendInterest() && (<p className="text-sm text-destructive mt-2">You've reached your interest limit. Upgrade to send more.</p>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
             <div className="p-6">
               <div className="flex justify-between items-start mb-6"><h2 className="text-2xl font-bold">Upgrade Your Plan</h2><button onClick={() => setShowUpgradeModal(false)} className="text-muted-foreground hover:text-foreground text-2xl">×</button></div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PricingCard title="Silver" price="₹999" period="year" isPopular={true} features={['Unlimited Views & Interests','Contact Access','Advanced Filters','Ad-Free Experience']} planType="silver" onSelect={() => handleUpgradeSubscription('silver')}/>
                <PricingCard title="Gold" price="₹2,499" period="year" features={['All Silver Features','Priority Listing','Video Profile','5 Astro Reports']} planType="gold" onSelect={() => handleUpgradeSubscription('gold')}/>
                <PricingCard title="Platinum" price="₹4,999" period="one-time" features={['All Gold Features','Lifetime Validity','Profile Boosts','Dedicated Manager']} planType="platinum" onSelect={() => handleUpgradeSubscription('platinum')}/>
               </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MatrimonialPlatform;
