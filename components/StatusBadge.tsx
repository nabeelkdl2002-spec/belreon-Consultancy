
import React from 'react';
import { ProjectStatus, UserStatus } from '../types';

interface StatusBadgeProps {
  status: ProjectStatus | UserStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full inline-block';
  let specificClasses = '';

  switch (status) {
    case ProjectStatus.Completed:
    case UserStatus.Active:
      specificClasses = 'bg-green-100 text-green-700';
      break;
    case ProjectStatus.InProgress:
      specificClasses = 'bg-blue-100 text-blue-700';
      break;
    case ProjectStatus.PendingApproval:
        specificClasses = 'bg-purple-100 text-purple-700';
        break;
    case ProjectStatus.New:
        specificClasses = 'bg-slate-100 text-slate-700';
        break;
    case ProjectStatus.Rejected:
    case UserStatus.Disabled:
      specificClasses = 'bg-red-100 text-red-700';
      break;
    default:
      specificClasses = 'bg-slate-100 text-slate-700';
  }

  return <span className={`${baseClasses} ${specificClasses}`}>{status}</span>;
};

export default StatusBadge;