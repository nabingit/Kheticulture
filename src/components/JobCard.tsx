import React from 'react';
import { Calendar, Clock, MapPin, DollarSign, User, Users, Eye, ChevronRight, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onViewApplicants?: (jobId: string) => void;
  onViewFarmerProfile?: (farmerId: string) => void;
  showActions?: boolean;
  isOwner?: boolean;
  canApply?: boolean;
  applicationStatus?: 'pending' | 'accepted' | 'rejected' | null;
}

export function JobCard({ 
  job, 
  onApply, 
  onViewApplicants, 
  onViewFarmerProfile,
  showActions = true, 
  isOwner = false,
  canApply = true,
  applicationStatus = null
}: JobCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          textColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100',
          icon: CheckCircle2,
          label: 'Open'
        };
      case 'filled':
        return {
          textColor: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-100',
          icon: Users,
          label: 'Filled'
        };
      case 'in-progress':
        return {
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100',
          icon: Clock,
          label: 'In Progress'
        };
      case 'completed':
        return {
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: CheckCircle2,
          label: 'Completed'
        };
      default:
        return {
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: AlertCircle,
          label: status
        };
    }
  };

  const getApplicationStatusConfig = (status: string) => {
    switch (status) {
      case 'accepted':
        return {
          textColor: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-100',
          icon: CheckCircle2,
          label: 'Accepted'
        };
      case 'rejected':
        return {
          textColor: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100',
          icon: XCircle,
          label: 'Rejected'
        };
      case 'pending':
        return {
          textColor: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100',
          icon: Clock,
          label: 'Pending'
        };
      default:
        return {
          textColor: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: AlertCircle,
          label: status
        };
    }
  };

  const canApplyToJob = () => {
    if (!canApply || applicationStatus) return false;
    return job.status === 'open';
  };

  const getApplyButtonText = () => {
    if (applicationStatus === 'pending') return 'Pending';
    if (applicationStatus === 'accepted') return 'Accepted';
    if (applicationStatus === 'rejected') return 'Rejected';
    if (job.status === 'completed') return 'Completed';
    if (job.status === 'filled') return 'Filled';
    if (job.status === 'in-progress') return 'In Progress';
    if ((job.acceptedWorkerIds?.length ?? 0) >= job.requiredWorkers) return 'Filled';
    return 'Apply Now';
  };

  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;
  
  const applicationConfig = applicationStatus ? getApplicationStatusConfig(applicationStatus) : null;
  const ApplicationIcon = applicationConfig?.icon;

  // Calculate worker progress
  const workerProgress = ((job.acceptedWorkerIds?.length ?? 0) / job.requiredWorkers) * 100;

  return (
    <div className="group bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all duration-300 ease-out">
      {/* Compact header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 mr-3">
          <h3 className="text-lg font-medium text-gray-900 mb-2 leading-tight line-clamp-2">
            {job.title}
          </h3>
          <div className="flex items-center gap-2">
            <div className={`flex items-center px-2 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
              <StatusIcon size={12} className={`mr-1 ${statusConfig.textColor}`} />
              <span className={`text-xs ${statusConfig.textColor}`}>
                {statusConfig.label}
              </span>
            </div>
            {applicationStatus && (
              <div className={`flex items-center px-2 py-1 rounded-full ${applicationConfig?.bgColor} ${applicationConfig?.borderColor} border`}>
                {ApplicationIcon && <ApplicationIcon size={12} className={`mr-1 ${applicationConfig?.textColor}`} />}
                <span className={`text-xs ${applicationConfig?.textColor}`}>
                  {applicationConfig?.label}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Compact description */}
      <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{job.description}</p>
      
      {/* Inline farmer info */}
      <div className="flex items-center justify-between mb-4 py-2 px-3 bg-gray-50 rounded-lg">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
            <User size={14} className="text-gray-600" />
          </div>
          <div>
            <p className="text-gray-900 font-medium text-sm">{job.farmerName}</p>
            <p className="text-gray-500 text-xs">Farm Owner</p>
          </div>
        </div>
        {!isOwner && onViewFarmerProfile && (
          <button
            onClick={() => onViewFarmerProfile(job.farmerId)}
            className="text-gray-500 hover:text-gray-700 text-xs transition-colors"
          >
            <Eye size={14} />
          </button>
        )}
      </div>

      {/* Compact job details grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center">
          <DollarSign size={16} className="mr-2 text-gray-400" />
          <div>
            <p className="text-gray-900 font-medium">NPR.{job.wage.toLocaleString()}</p>
            <p className="text-gray-500 text-xs">per {job.durationType.slice(0, -1)}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Clock size={16} className="mr-2 text-gray-400" />
          <div>
            <p className="text-gray-900 font-medium">{job.duration} {job.durationType}</p>
            <p className="text-gray-500 text-xs">duration</p>
          </div>
        </div>

        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-gray-400" />
          <div>
            <p className="text-gray-900 font-medium">{formatDate(job.preferredDate)}</p>
            <p className="text-gray-500 text-xs">start date</p>
          </div>
        </div>

        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-gray-400" />
          <div>
            <p className="text-gray-900 font-medium truncate">{job.location}</p>
            <p className="text-gray-500 text-xs">location</p>
          </div>
        </div>
      </div>

      {/* Compact worker progress */}
      <div className="mb-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center text-gray-600 text-sm">
            <Users size={16} className="mr-2 text-gray-400" />
            <span>Workers</span>
          </div>
          <span className="text-gray-900 font-medium text-sm">
            {job.acceptedWorkerIds?.length ?? 0}/{job.requiredWorkers}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(workerProgress, 4)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Compact action button */}
      {showActions && (
        <div>
          {isOwner ? (
            <>
              {job.status !== 'completed' ? (
                <button
                  onClick={() => onViewApplicants?.(job.id)}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center group text-sm"
                >
                  View Applicants
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              ) : (
                <div className="w-full bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium text-center border border-gray-200 text-sm">
                  Job Completed
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => onApply?.(job.id)}
              disabled={!canApplyToJob()}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm ${
                canApplyToJob()
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
              }`}
            >
              {getApplyButtonText()}
              {canApplyToJob() && <ChevronRight size={16} className="ml-1" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}