import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation data
const translations = {
  en: {
    // App Name
    appName: 'Kheticulture',
    appTagline: 'Connect farmers with local workers',
    
    // Navigation
    home: 'Home',
    myJobs: 'My Jobs',
    postJob: 'Post Job',
    profile: 'Profile',
    
    // Authentication
    login: 'Login',
    signUp: 'Sign Up',
    createAccount: 'Create Account',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    contactNumber: 'Contact Number',
    location: 'Location',
    dateOfBirth: 'Date of Birth',
    iAm: 'I am a:',
    farmer: 'Farmer',
    worker: 'Worker',
    postJobs: 'Post jobs',
    findJobs: 'Find jobs',
    enterEmail: 'Enter your email',
    enterPassword: 'Enter your password',
    enterFullName: 'Enter your full name',
    createStrongPassword: 'Create a strong password',
    villageTownDistrict: 'Village/Town, District',
    mustBe16: 'You must be at least 16 years old to register as a worker',
    
    // Home Page
    welcomeBack: 'Welcome back',
    hello: 'Hello',
    readyToFind: 'Ready to find skilled workers for your farm?',
    discoverOpportunities: 'Discover new farming opportunities today',
    activeJobs: 'Active Jobs',
    workersHired: 'Workers Hired',
    availableJobs: 'Available Jobs',
    jobsCompleted: 'Jobs Completed',
    searchJobs: 'Search jobs...',
    searchYourJobs: 'Search your jobs...',
    filters: 'Filters',
    
    // Job Related
    jobTitle: 'Job Title',
    jobDescription: 'Job Description',
    workersNeeded: 'Workers Needed',
    howmany: 'How many workers for this job?',
    preferredStartDate: 'Preferred Start Date',
    dailyHourlyWage: 'Daily/Hourly Wage (NPR.)',
    expectedDuration: 'Expected Duration',
    hour: 'Hour',
    day: 'Day',
    hours: 'hours',
    days: 'days',
    duration: 'duration',
    perDay: 'per day',
    perHour: 'per hour',
    startDate: 'start date',
    applyNow: 'Apply Now',
    viewApplicants: 'View Applicants',
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    open: 'Open',
    filled: 'Filled',
    inProgress: 'In Progress',
    completed: 'Completed',
    
    // Job Status Messages
    jobCompleted: 'Job Completed',
    applicationSubmitted: 'Application submitted successfully!',
    alreadyApplied: 'You have already applied to this job!',
    applicationAccepted: 'Your application has already been accepted!',
    positionsFilled: 'All positions for this job have been filled!',
    
    // Profile
    profilePicture: 'Profile Picture',
    workingPicture: 'Working Picture',
    weight: 'Weight (kg)',
    height: 'Height (cm)',
    accountType: 'Account Type',
    memberSince: 'Member Since',
    activitySummary: 'Activity Summary',
    applicationsCount: 'Applications',
    totalHires: 'Total Hires',
    jobsPosted: 'Jobs Posted',
    logout: 'Logout',
    loggingOut: 'Logging out...',
    
    // Common Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    saveChanges: 'Save Changes',
    loading: 'Loading...',
    loadingJobs: 'Loading jobs...',
    pleaseWait: 'Please wait...',
    
    // Form Validation
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required',
    contactRequired: 'Contact number is required',
    locationRequired: 'Location is required for workers',
    dobRequired: 'Date of birth is required for workers',
    
    // Errors
    somethingWentWrong: 'Something went wrong',
    tryAgain: 'Try Again',
    noJobsYet: 'No jobs posted yet',
    noApplicationsYet: 'No applications yet',
    noJobsAvailable: 'No jobs available',
    
    // Languages
    english: 'English',
    nepali: 'नेपाली',
    language: 'Language',
    
    // Post Job Page
    postAJob: 'Post a Job',
    enterJobTitle: 'e.g., Wheat Harvesting, Irrigation Setup',
    describeWork: 'Describe the work to be done, skills required, and any special instructions...',
    enterAmountPer: 'Enter amount per',
    wageImportant: 'Important: Once workers apply, you cannot change the wage amount. Set it carefully!',
    enterDuration: 'Enter duration',
    enterLocation: 'Village/Town, District',
    postingJob: 'Posting Job...',
    
    // My Jobs Page
    manageJobs: 'Manage your job postings and applicants',
    trackApplications: 'Track your job applications',
    noJobsPosted: 'No jobs posted yet',
    noApplications: 'No applications yet',
    createFirstJob: 'Create your first job post to start finding workers',
    browseJobs: 'Browse available jobs and start applying',
    browseAvailableJobs: 'Browse Jobs',
    applicationStatus: 'Application Status',
    canReapplyNow: 'You can reapply to this job now',
    jobStatus: 'Job Status',
    editJob: 'Edit job',
    deleteJob: 'Delete job',
    wageLocked: 'Wage Locked',
    cannotChangeWage: 'Cannot change wage - workers have applied based on',
    minimumWorkers: 'Minimum workers (already accepted)',
    jobHasApplications: 'This job has applications. Wage and worker count cannot be reduced to protect applicant expectations.',
    scrollToSeeMore: 'Scroll up/down to see more jobs',
    applications: 'applications',
    jobClosed: 'Job Closed',
    
    // Job Actions
    markCompleted: 'Mark Job as Completed',
    viewProfile: 'View Profile',
    acceptWorker: 'Accept',
    rejectWorker: 'Reject',
    deleteJobConfirm: 'Delete Job',
    deleteJobMessage: 'Are you sure you want to delete this job? This action cannot be undone.',
    deleteJobWarning: 'This job has applications. Deleting will also remove all applications.',
    
    // Form Labels
    required: 'required',
    optional: 'optional',
    perWorker: 'per worker',
    maxWage: 'Max Wage (NPR.)',
    durationType: 'Duration Type',
    all: 'All',
    
    // Validation Messages
    fillRequiredFields: 'Please fill in all required fields',
    validWage: 'Please enter a valid wage amount (minimum NPR.1)',
    wageReasonable: 'Wage amount seems too high. Please enter a reasonable amount.',
    validDuration: 'Please enter a valid duration',
    validWorkers: 'Please enter a valid number of workers needed',
    jobCreated: 'Job created successfully!',
    failedToCreate: 'Failed to create job. Please try again.',
    
    // Status Messages  
    canReapplyIn: 'Can reapply in',
    hoursLeft: 'hours',
    appliedOn: 'Applied on',
    pendingApplications: 'Pending Applications',
    acceptedWorkers: 'Accepted Workers',
    rejectedApplications: 'Rejected Applications',
    noApplicants: 'No applications yet',
    workersWillAppear: 'Workers will appear here when they apply to your job'
  },
  ne: {
    // App Name
    appName: 'खेतीकल्चर',
    appTagline: 'किसानहरूलाई स्थानीय कामदारहरूसँग जोड्नुहोस्',
    
    // Navigation
    home: 'घर',
    myJobs: 'मेरा कामहरू',
    postJob: 'काम पोस्ट गर्नुहोस्',
    profile: 'प्रोफाइल',
    
    // Authentication
    login: 'लग इन',
    signUp: 'साइन अप',
    createAccount: 'खाता सिर्जना गर्नुहोस्',
    email: 'इमेल',
    password: 'पासवर्ड',
    fullName: 'पूरा नाम',
    contactNumber: 'सम्पर्क नम्बर',
    location: 'स्थान',
    dateOfBirth: 'जन्म मिति',
    iAm: 'म हुँ:',
    farmer: 'किसान',
    worker: 'कामदार',
    postJobs: 'काम पोस्ट गर्नुहोस्',
    findJobs: 'काम खोज्नुहोस्',
    enterEmail: 'आफ्नो इमेल प्रविष्ट गर्नुहोस्',
    enterPassword: 'आफ्नो पासवर्ड प्रविष्ट गर्नुहोस्',
    enterFullName: 'आफ्नो पूरा नाम प्रविष्ट गर्नुहोस्',
    createStrongPassword: 'बलियो पासवर्ड सिर्जना गर्नुहोस्',
    villageTownDistrict: 'गाउँ/शहर, जिल्ला',
    mustBe16: 'कामदारको रूपमा दर्ता गर्न तपाईं कम्तिमा १६ वर्षको हुनुपर्छ',
    
    // Home Page
    welcomeBack: 'फिर्ता स्वागत छ',
    hello: 'नमस्कार',
    readyToFind: 'आफ्नो खेतको लागि दक्ष कामदारहरू खोज्न तयार हुनुहुन्छ?',
    discoverOpportunities: 'आज नयाँ खेती अवसरहरू पत्ता लगाउनुहोस्',
    activeJobs: 'सक्रिय कामहरू',
    workersHired: 'काममा लगाइएका कामदारहरू',
    availableJobs: 'उपलब्ध कामहरू',
    jobsCompleted: 'सम्पन्न कामहरू',
    searchJobs: 'कामहरू खोज्नुहोस्...',
    searchYourJobs: 'आफ्ना कामहरू खोज्नुहोस्...',
    filters: 'फिल्टरहरू',
    
    // Job Related
    jobTitle: 'कामको शीर्षक',
    jobDescription: 'कामको विवरण',
    workersNeeded: 'कामदार सङ्ख्या',
    howmany: 'यो कामको लागि कति जना कामदारहरू चाहनुहुन्छ?',
    preferredStartDate: 'रुचाइएको सुरु मिति',
    dailyHourlyWage: 'दैनिक/घण्टाको ज्याला (रु.)',
    expectedDuration: 'अपेक्षित अवधि',
    hour: 'घण्टा',
    day: 'दिन',
    hours: 'घण्टा',
    days: 'दिन',
    duration: 'अवधि',
    perDay: 'प्रति दिन',
    perHour: 'प्रति घण्टा',
    startDate: 'सुरु मिति',
    applyNow: 'अहिले आवेदन दिनुहोस्',
    viewApplicants: 'आवेदकहरू हेर्नुहोस्',
    pending: 'पेन्डिङ',
    accepted: 'स्वीकृत',
    rejected: 'अस्वीकृत',
    open: 'खुला',
    filled: 'भरिएको',
    inProgress: 'प्रगतिमा',
    completed: 'सम्पन्न',
    
    // Job Status Messages
    jobCompleted: 'काम सम्पन्न',
    applicationSubmitted: 'आवेदन सफलतापूर्वक पेश गरियो!',
    alreadyApplied: 'तपाईंले यो कामको लागि पहिले नै आवेदन दिनुभएको छ!',
    applicationAccepted: 'तपाईंको आवेदन पहिले नै स्वीकार गरिएको छ!',
    positionsFilled: 'यो कामका सबै स्थानहरू भरिएका छन्!',
    
    // Profile
    profilePicture: 'प्रोफाइल तस्बिर',
    workingPicture: 'काम गरेको तस्बिर',
    weight: 'तौल (के.जी.)',
    height: 'उचाइ (से.मी.)',
    accountType: 'खाताको प्रकार',
    memberSince: 'सदस्य भएदेखि',
    activitySummary: 'गतिविधि सारांश',
    applicationsCount: 'आवेदनहरू',
    totalHires: 'कुल भर्ना',
    jobsPosted: 'पोस्ट गरिएका कामहरू',
    logout: 'लग आउट',
    loggingOut: 'लग आउट गर्दै...',
    
    // Common Actions
    save: 'सेभ गर्नुहोस्',
    cancel: 'रद्द गर्नुहोस्',
    edit: 'सम्पादन गर्नुहोस्',
    delete: 'मेटाउनुहोस्',
    saveChanges: 'परिवर्तनहरू सेभ गर्नुहोस्',
    loading: 'लोड हुँदै...',
    loadingJobs: 'कामहरू लोड हुँदै...',
    pleaseWait: 'कृपया पर्खनुहोस्...',
    
    // Form Validation
    nameRequired: 'नाम आवश्यक छ',
    emailRequired: 'इमेल आवश्यक छ',
    passwordRequired: 'पासवर्ड आवश्यक छ',
    contactRequired: 'सम्पर्क नम्बर आवश्यक छ',
    locationRequired: 'कामदारहरूको लागि स्थान आवश्यक छ',
    dobRequired: 'कामदारहरूको लागि जन्म मिति आवश्यक छ',
    
    // Errors
    somethingWentWrong: 'केही गलत भयो',
    tryAgain: 'फेरि प्रयास गर्नुहोस्',
    noJobsYet: 'अहिलेसम्म कुनै काम पोस्ट गरिएको छैन',
    noApplicationsYet: 'अहिलेसम्म कुनै आवेदन छैन',
    noJobsAvailable: 'कुनै काम उपलब्ध छैन',
    
    // Languages
    english: 'English',
    nepali: 'नेपाली',
    language: 'भाषा',
    
    // Post Job Page
    postAJob: 'काम पोस्ट गर्नुहोस्',
    enterJobTitle: 'जस्तै, गहुँ काट्ने, सिँचाइ व्यवस्था',
    describeWork: 'गर्नुपर्ने काम, आवश्यक सीप, र कुनै विशेष निर्देशनहरू वर्णन गर्नुहोस्...',
    enterAmountPer: 'प्रति रकम प्रविष्ट गर्नुहोस्',
    wageImportant: 'महत्वपूर्ण: एकपटक कामदारहरूले आवेदन दिएपछि, तपाईं ज्यालाको रकम परिवर्तन गर्न सक्नुहुन्न। ध्यानपूर्वक सेट गर्नुहोस्!',
    enterDuration: 'अवधि प्रविष्ट गर्नुहोस्',
    enterLocation: 'गाउँ/शहर, जिल्ला',
    postingJob: 'काम पोस्ट गर्दै...',
    
    // My Jobs Page
    manageJobs: 'आफ्ना कामका पोस्टहरू र आवेदकहरू व्यवस्थापन गर्नुहोस्',
    trackApplications: 'आफ्ना काम आवेदनहरू ट्र्याक गर्नुहोस्',
    noJobsPosted: 'अहिलेसम्म कुनै काम पोस्ट गरिएको छैन',
    noApplications: 'अहिलेसम्म कुनै आवेदन छैन',
    createFirstJob: 'कामदारहरू खोज्न सुरु गर्न आफ्नो पहिलो काम पोस्ट सिर्जना गर्नुहोस्',
    browseJobs: 'उपलब्ध कामहरू ब्राउज गर्नुहोस् र आवेदन दिन सुरु गर्नुहोस्',
    browseAvailableJobs: 'कामहरू ब्राउज गर्नुहोस्',
    applicationStatus: 'आवेदनको स्थिति',
    canReapplyNow: 'तपाईं अहिले यो कामको लागि पुनः आवेदन दिन सक्नुहुन्छ',
    jobStatus: 'कामको स्थिति',
    editJob: 'काम सम्पादन गर्नुहोस्',
    deleteJob: 'काम मेटाउनुहोस्',
    wageLocked: 'ज्याला लक गरिएको',
    cannotChangeWage: 'ज्याला परिवर्तन गर्न सकिँदैन - कामदारहरूले आधारमा आवेदन दिएका छन्',
    minimumWorkers: 'न्यूनतम कामदारहरू (पहिले नै स्वीकृत)',
    jobHasApplications: 'यो कामका आवेदनहरू छन्। आवेदकहरूको अपेक्षा सुरक्षित गर्न ज्याला र कामदार संख्या घटाउन सकिँदैन।',
    scrollToSeeMore: 'थप कामहरू हेर्न माथि/तल स्क्रोल गर्नुहोस्',
    applications: 'आवेदनहरू',
    jobClosed: 'काम बन्द',
    
    // Job Actions
    markCompleted: 'काम सम्पन्न भएको चिन्ह लगाउनुहोस्',
    viewProfile: 'प्रोफाइल हेर्नुहोस्',
    acceptWorker: 'स्वीकार गर्नुहोस्',
    rejectWorker: 'अस्वीकार गर्नुहोस्',
    deleteJobConfirm: 'काम मेटाउनुहोस्',
    deleteJobMessage: 'के तपाईं यो काम मेटाउन निश्चित हुनुहुन्छ? यो कार्य पूर्ववत गर्न सकिँदैन।',
    deleteJobWarning: 'यो कामका आवेदनहरू छन्। मेटाउँदा सबै आवेदनहरू पनि हटाइनेछ।',
    
    // Form Labels
    required: 'आवश्यक',
    optional: 'वैकल्पिक',
    perWorker: 'प्रति कामदार',
    maxWage: 'अधिकतम ज्याला (रु.)',
    durationType: 'अवधि प्रकार',
    all: 'सबै',
    
    // Validation Messages
    fillRequiredFields: 'कृपया सबै आवश्यक फिल्डहरू भर्नुहोस्',
    validWage: 'कृपया वैध ज्याला रकम प्रविष्ट गर्नुहोस् (न्यूनतम रु.१)',
    wageReasonable: 'ज्यालाको रकम धेरै उच्च देखिन्छ। कृपया उचित रकम प्रविष्ट गर्नुहोस्।',
    validDuration: 'कृपया वैध अवधि प्रविष्ट गर्नुहोस्',
    validWorkers: 'कृपया आवश्यक कामदारहरूको वैध संख्या प्रविष्ट गर्नुहोस्',
    jobCreated: 'काम सफलतापूर्वक सिर्जना गरियो!',
    failedToCreate: 'काम सिर्जना गर्न असफल। कृपया फेरि प्रयास गर्नुहोस्।',
    
    // Status Messages
    canReapplyIn: 'पुनः आवेदन दिन सकिन्छ',
    hoursLeft: 'घण्टामा',
    appliedOn: 'आवेदन दिएको मिति',
    pendingApplications: 'पेन्डिङ आवेदनहरू',
    acceptedWorkers: 'स्वीकृत कामदारहरू',
    rejectedApplications: 'अस्वीकृत आवेदनहरू',
    noApplicants: 'अहिलेसम्म कुनै आवेदन छैन',
    workersWillAppear: 'कामदारहरूले तपाईंको कामको लागि आवेदन दिएपछि यहाँ देखा पर्नेछन्'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ne'); // Default to Nepali

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('kheticulture_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ne')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kheticulture_language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language][key as keyof typeof translations['en']];
    if (!translation) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`);
      return translations['en'][key as keyof typeof translations['en']] || key;
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}