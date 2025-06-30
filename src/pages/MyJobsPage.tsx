import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { JobCard } from '../components/JobCard';
import { Job, Application, User } from '../types';
import { jobStorage, applicationStorage } from '../utils/storage';
import { JobStatusManager } from '../utils/jobStatusManager';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, Edit2, Trash2, DollarSign, X, Save, Users, User as UserIcon, Mail, MapPin, Calendar, Camera, Phone } from 'lucide-react';
import { WageValidator } from '../utils/wageValidation';

export function MyJobsPage() {
  const { user, getUserProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<User | null>(null);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [editData, setEditData] = useState({
    wage: '',
    requiredWorkers: '',
    status: 'open' as 'open' | 'filled' | 'in-progress' | 'completed'
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    // Always update all job statuses first to ensure accurate status display
    const updatedJobs = await JobStatusManager.updateAllJobStatuses();

    if (user.userType === 'farmer') {
      setJobs(updatedJobs.filter((job: Job) => job.farmerId === user.id));
    } else {
      const allApplications = await applicationStorage.getApplications();
      const userApplications = allApplications.filter((app: Application) => app.workerId === user.id);
      setApplications(userApplications);

      // Filter jobs to only include those that still exist AND have user applications
      const appliedJobs = updatedJobs.filter((job: Job) => 
        userApplications.some((app: Application) => app.jobId === job.id)
      );
      setJobs(appliedJobs);
      setApplications(userApplications);
    }
  };

  const getJobApplications = (jobId: string): Application[] => {
    return applications.filter((app: Application) => app.jobId === jobId);
  };

  const hasApplications = (jobId: string): boolean => {
    return getJobApplications(jobId).length > 0;
  };

  const getAcceptedApplicationsCount = (jobId: string): number => {
    return applications.filter((app: Application) => app.jobId === jobId && app.status === 'accepted').length;
  };

  const handleViewFarmerProfile = async (farmerId: string) => {
    try {
      const farmerProfile = await getUserProfile(farmerId);
      if (farmerProfile) {
        setSelectedFarmer(farmerProfile);
        setShowFarmerModal(true);
      } else {
        alert('Farmer profile not found');
      }
    } catch (error) {
      console.error('Error loading farmer profile:', error);
      alert('Failed to load farmer profile');
    }
  };

  const handleEditJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Prevent editing of completed jobs
    if (job.status === 'completed') {
      alert('सम्पन्न कामहरू सम्पादन गर्न सकिँदैन। काम बन्द गरिएको छ।');
      return;
    }

    setEditData({
      wage: job.wage?.toString() || '',
      requiredWorkers: job.requiredWorkers?.toString() || '',
      status: job.status
    });
    setEditingJob(jobId);
  };

  const handleSaveEdit = () => {
    if (!editingJob) return;

    const job = jobs.find(j => j.id === editingJob);
    if (!job) return;

    // Double-check that we're not editing a completed job
    if (job.status === 'completed') {
      alert('सम्पन्न कामहरू सम्पादन गर्न सकिँदैन। काम बन्द गरिएको छ।');
      setEditingJob(null);
      return;
    }

    const jobApplications = getJobApplications(editingJob);
    const hasAnyApplications = jobApplications.length > 0;
    const acceptedCount = getAcceptedApplicationsCount(editingJob);

    // Validate wage
    const newWage = parseFloat(editData.wage);
    if (isNaN(newWage) || newWage <= 0) {
      alert('कृपया वैध ज्यालाको रकम प्रविष्ट गर्नुहोस्');
      return;
    }

    // Strict wage validation - prevent any wage changes if applications exist
    if (hasAnyApplications && newWage !== job.wage) {
      alert(`रु.${job.wage} बाट रु.${newWage} मा ज्याला परिवर्तन गर्न सकिँदैन। ${jobApplications.length} कामदार${jobApplications.length !== 1 ? 'हरूले' : 'ले'} मूल ज्यालाको आधारमा आवेदन दिइसकेका छन्।`);
      return;
    }

    // Validate required workers
    const newRequiredWorkers = parseInt(editData.requiredWorkers);
    if (isNaN(newRequiredWorkers) || newRequiredWorkers <= 0) {
      alert('कृपया कामदारहरूको वैध संख्या प्रविष्ट गर्नुहोस्');
      return;
    }

    // Use WageValidator for comprehensive wage validation
    const wageValidation = WageValidator.validateWageChange(
      job.wage,
      newWage,
      hasAnyApplications,
      acceptedCount
    );

    if (!wageValidation.canModify && newWage !== job.wage) {
      const errorMessage = WageValidator.getWageErrorMessage(
        job.wage,
        newWage,
        hasAnyApplications,
        jobApplications.length
      );
      alert(errorMessage || wageValidation.reason);
      return;
    }

    // Cannot reduce below accepted workers (existing logic)
    if (newRequiredWorkers < acceptedCount) {
      alert(`तपाईंले पहिले नै ${acceptedCount} कामदार${acceptedCount !== 1 ? 'हरूलाई' : 'लाई'} स्वीकार गर्नुभएकोले ${acceptedCount} भन्दा कम कामदार राख्न सकिँदैन`);
      return;
    }
    
    // Cannot reduce required workers when there are applications (new strict rule)
    if (hasAnyApplications && newRequiredWorkers < job.requiredWorkers) {
      alert(`आवेदनहरू हुँदा आवश्यक कामदारहरूको संख्या ${job.requiredWorkers} बाट ${newRequiredWorkers} मा घटाउन सकिँदैन। कामदारहरूले मूल काम आवश्यकताहरूको आधारमा आवेदन दिएका छन्।`);
      return;
    }

    // Update job
    jobStorage.updateJob(editingJob, {
      wage: newWage,
      requiredWorkers: newRequiredWorkers,
      status: editData.status
    });

    // Check if status should auto-update after manual changes and reload
    JobStatusManager.checkStatusAfterWorkerAccepted(editingJob).then(() => {
      loadData(); // Reload to get updated status
    });

    setEditingJob(null);
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditData({ wage: '', requiredWorkers: '', status: 'open' });
  };

  const handleDeleteJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job?.status === 'completed') {
      alert('सम्पन्न कामहरू मेटाउन सकिँदैन। काम बन्द गरिएको छ र अब ऐतिहासिक रेकर्डको भाग हो।');
      return;
    }
    setShowDeleteConfirm(jobId);
  };

  const confirmDeleteJob = async () => {
    if (!showDeleteConfirm) return;

    // Get all jobs and filter out the one to delete
    const allJobs = await jobStorage.getJobs();
    const updatedJobs = allJobs.filter(job => job.id !== showDeleteConfirm);
    localStorage.setItem('kheticulture_jobs', JSON.stringify(updatedJobs));

    // Also delete all applications for this job
    const allApplications = await applicationStorage.getApplications();
    const updatedApplications = allApplications.filter(app => app.jobId !== showDeleteConfirm);
    localStorage.setItem('kheticulture_applications', JSON.stringify(updatedApplications));

    setShowDeleteConfirm(null);
    loadData();
  };

  const getApplicationStatus = (jobId: string) => {
    return applications.find(app => app.jobId === jobId)?.status || 'pending';
  };

  const canReapply = (jobId: string): boolean => {
    const application = applications.find(app => app.jobId === jobId);
    if (!application || application.status !== 'rejected' || !application.rejectedAt) {
      return false;
    }
    
    const rejectedTime = new Date(application.rejectedAt).getTime();
    const now = new Date().getTime();
    const hoursPassed = (now - rejectedTime) / (1000 * 60 * 60);
    return hoursPassed >= 24;
  };

  const getTimeUntilReapply = (jobId: string): string => {
    const application = applications.find(app => app.jobId === jobId);
    if (!application || application.status !== 'rejected' || !application.rejectedAt) {
      return '';
    }
    
    const rejectedTime = new Date(application.rejectedAt).getTime();
    const now = new Date().getTime();
    const hoursPassed = (now - rejectedTime) / (1000 * 60 * 60);
    const hoursLeft = Math.ceil(24 - hoursPassed);
    
    if (hoursLeft <= 0) return '';
    return `Can reapply in ${hoursLeft} hours`;
  };

  const handleViewApplicants = (jobId: string) => {
    navigate(`/applicants/${jobId}`);
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDisplayContactNumber = (contactNumber: string): string => {
    if (contactNumber.length === 10) {
      return `${contactNumber.slice(0, 3)}-${contactNumber.slice(3, 6)}-${contactNumber.slice(6)}`;
    }
    return contactNumber;
  };

  if (!user) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'filled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'filled':
        return 'Filled';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm) return null;
    const job = jobs.find(j => j.id === showDeleteConfirm);
    const jobApplications = getJobApplications(showDeleteConfirm);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('deleteJobConfirm')}</h3>
          <p className="text-gray-600 mb-4">
            के तपाईं "{job?.title}" मेटाउन निश्चित हुनुहुन्छ? {t('deleteJobMessage')}
          </p>
          
          {jobApplications.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">
                  {t('deleteJobWarning')}
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={confirmDeleteJob}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              {t('deleteJobConfirm')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FarmerProfileModal = () => {
    if (!selectedFarmer || !showFarmerModal) return null;
    const farmerJobs = jobs.length > 0 ? jobs.filter((job: Job) => job.farmerId === selectedFarmer.id) : [];
    const workersHired = farmerJobs.reduce((total: number, job: Job) => total + (job.acceptedWorkerIds?.length || 0), 0);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                  {selectedFarmer.profilePicture ? (
                    <img 
                      src={selectedFarmer.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={32} className="text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedFarmer.name}</h2>
                  <div className="flex items-center text-green-100">
                    <span className="capitalize">{selectedFarmer.userType}</span>
                    {selectedFarmer.dateOfBirth && (
                      <span className="ml-2">• {calculateAge(selectedFarmer.dateOfBirth)} years old</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowFarmerModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center py-2">
                <Mail size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-900">{selectedFarmer.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <div className="flex items-center py-2">
                <Phone size={16} className="text-gray-400 mr-3" />
                <span className="text-gray-900">{formatDisplayContactNumber(selectedFarmer.contactNumber)}</span>
              </div>
            </div>

            {selectedFarmer.location && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Home Location</label>
                <div className="flex items-center py-2">
                  <MapPin size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-900">{selectedFarmer.location}</span>
                </div>
              </div>
            )}

            {selectedFarmer.dateOfBirth && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="flex items-center py-2">
                  <Calendar size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-900">
                    {formatDate(selectedFarmer.dateOfBirth)} ({calculateAge(selectedFarmer.dateOfBirth)} years old)
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
              <div className="flex items-center py-2">
                <span className="text-gray-900">
                  {formatDate(selectedFarmer.createdAt)}
                </span>
              </div>
            </div>

            {/* Farmer's Job Statistics */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Farmer Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {farmerJobs.length}
                  </div>
                  <div className="text-xs text-gray-600">Jobs Posted</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {workersHired}
                  </div>
                  <div className="text-xs text-gray-600">Workers Hired</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      {/* Header Box with distinct background */}
      <div className={`${user.userType === 'farmer' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-blue-500 to-indigo-600'} rounded-2xl p-6 mb-6 shadow-lg`}>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
            <Briefcase size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t('myJobs')}</h1>
            <p className="text-white opacity-90 text-sm">
              {user.userType === 'farmer' 
                ? t('manageJobs')
                : t('trackApplications')
              }
            </p>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Briefcase size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {user.userType === 'farmer' ? t('noJobsPosted') : t('noApplications')}
          </h3>
          <p className="text-gray-600 mb-4">
            {user.userType === 'farmer' 
              ? t('createFirstJob')
              : t('browseJobs')
            }
          </p>
          <button
            onClick={() => navigate(user.userType === 'farmer' ? '/post-job' : '/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {user.userType === 'farmer' ? t('postJob') : t('browseAvailableJobs')}
          </button>
        </div>
      ) : (
        <div>
          {user.userType === 'farmer' && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-green-600">
                  {jobs.filter((job: Job) => job.status === 'open').length}
                </div>
                <div className="text-xs text-green-700">{t('open')}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {jobs.filter((job: Job) => job.status === 'filled').length}
                </div>
                <div className="text-xs text-blue-700">{t('filled')}</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-yellow-600">
                  {jobs.filter((job: Job) => job.status === 'in-progress').length}
                </div>
                <div className="text-xs text-yellow-700">{t('inProgress')}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-gray-600">
                  {jobs.filter((job: Job) => job.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-700">{t('completed')}</div>
              </div>
            </div>
          )}

          {/* Vertical Scroller Container */}
          <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2">
              {jobs.map((job: Job) => (
                <div key={job.id}>
                  {user.userType === 'worker' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{t('applicationStatus')}:</span>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          getStatusColor(getApplicationStatus(job.id))
                        }`}>
                          {getStatusIcon(getApplicationStatus(job.id))}
                          <span className="ml-1 capitalize">{getApplicationStatus(job.id)}</span>
                        </div>
                      </div>
                      
                      {getApplicationStatus(job.id) === 'rejected' && !canReapply(job.id) && (
                        <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          <AlertCircle size={14} className="mr-1" />
                          {getTimeUntilReapply(job.id)}
                        </div>
                      )}
                      
                      {getApplicationStatus(job.id) === 'rejected' && canReapply(job.id) && (
                        <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          <CheckCircle size={14} className="mr-1" />
                          {t('canReapplyNow')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {user.userType === 'farmer' && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">{t('jobStatus')}:</span>
                          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            getJobStatusColor(job.status)
                          }`}>
                            <span>{getJobStatusText(job.status)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditJob(job.id)}
                            disabled={job.status === 'completed'}
                            className={`p-2 transition-colors ${
                              job.status === 'completed' 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                            } rounded-lg`}
                            title={t('editJob')}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            disabled={job.status === 'completed'}
                            className={`p-2 transition-colors ${
                              job.status === 'completed' 
                                ? 'text-gray-300 cursor-not-allowed' 
                                : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                            } rounded-lg`}
                            title={t('deleteJob')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Edit Form */}
                      {editingJob === job.id && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-3">
                          <h4 className="font-medium text-gray-900 mb-3">{t('editJob')}</h4>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('dailyHourlyWage')}
                              </label>
                              {getJobApplications(job.id).length > 0 && (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                                  <div className="flex items-center">
                                    <div className="text-amber-600 mr-2">🔒</div>
                                    <div>
                                      <div className="text-sm font-medium text-amber-800">{t('wageLocked')}</div>
                                      <div className="text-xs text-amber-700">
                                        {t('cannotChangeWage')} रु.{job.wage} - {getJobApplications(job.id).length} कामदार{getJobApplications(job.id).length !== 1 ? 'हरूले' : 'ले'} आवेदन दिएका छन्
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">रु.</span>
                                <input
                                  type="number"
                                  value={editData.wage}
                                  onChange={(e) => setEditData({ ...editData, wage: e.target.value })}
                                  className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors ${
                                    getJobApplications(job.id).length > 0
                                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                      : 'border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent'
                                  }`}
                                  placeholder="500"
                                  min="1"
                                  disabled={getJobApplications(job.id).length > 0}
                                  step="1"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('workersNeeded')}
                              </label>
                              <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                  type="number"
                                  value={editData.requiredWorkers}
                                  onChange={(e) => setEditData({ ...editData, requiredWorkers: e.target.value })}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  placeholder="1"
                                  min={getJobApplications(job.id).length > 0 ? job.requiredWorkers.toString() : "1"}
                                  max="50"
                                />
                              </div>
                              {getJobApplications(job.id).length > 0 ? (
                                <p className="text-xs text-blue-600 mt-1">
                                  आवेदनहरू हुँदा {job.requiredWorkers} कामदार भन्दा कम राख्न सकिँदैन। हालको न्यूनतम: {Math.max(getAcceptedApplicationsCount(job.id), job.requiredWorkers)} कामदार।
                                </p>
                              ) : getAcceptedApplicationsCount(job.id) > 0 && (
                                <p className="text-xs text-blue-600 mt-1">
                                  {t('minimumWorkers')}: {getAcceptedApplicationsCount(job.id)} कामदार{getAcceptedApplicationsCount(job.id) !== 1 ? 'हरू' : ''} (पहिले नै स्वीकृत)
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('jobStatus')}
                              </label>
                              {getJobApplications(job.id).length > 0 && (
                                <p className="text-xs text-amber-600 mb-2 bg-amber-50 p-2 rounded border border-amber-200">
                                  ⚠️ {t('jobHasApplications')}
                                </p>
                              )}
                              <select
                                value={editData.status}
                                onChange={(e) => setEditData({ ...editData, status: e.target.value as 'open' | 'filled' | 'in-progress' | 'completed' })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              >
                                <option value="open">{t('open')}</option>
                                <option value="filled">{t('filled')}</option>
                                <option value="in-progress">{t('inProgress')}</option>
                                <option value="completed">{t('completed')}</option>
                              </select>
                            </div>

                            <div className="flex space-x-2">
                              <button
                                onClick={handleSaveEdit}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                              >
                                <Save size={16} className="mr-1" />
                                {t('save')}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
                              >
                                <X size={16} className="mr-1" />
                                {t('cancel')}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Application count info */}
                      <div className="text-xs text-gray-500 mb-2">
                        {getJobApplications(job.id).length} {t('applications')}
                        {job.status === 'completed' && (
                          <span className="ml-2 text-green-600 font-medium">• {t('jobClosed')}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <JobCard
                    job={job}
                    onViewApplicants={handleViewApplicants}
                    onViewFarmerProfile={handleViewFarmerProfile}
                    showActions={user.userType === 'farmer' && job.status !== 'completed'}
                    isOwner={user.userType === 'farmer'}
                  />
                </div>
              ))}
          </div>
          
          {/* Scroll indicator */}
          {jobs.length > 1 && (
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">{t('scrollToSeeMore')}</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal />

      {/* Farmer Profile Modal */}
      <FarmerProfileModal />
    </div>
  );
}