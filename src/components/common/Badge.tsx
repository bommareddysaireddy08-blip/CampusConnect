import React from 'react';
import { QuestionStatus, AppointmentStatus } from '../../types/index.ts';

interface BadgeProps {
  status: QuestionStatus | AppointmentStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  const getBadgeClass = (s: string) => {
    switch (s) {
      case 'Instant Help Available':
        return 'badge-instant';
      case 'Sent to Faculty':
      case 'Submitted':
      case 'In Review':
      case 'Pending':
        return 'badge-sent';
      case 'Answered':
      case 'Confirmed':
        return 'badge-answered';
      case 'Resolved':
        return 'badge-resolved';
      case 'Meeting Suggested':
        return 'badge-instant';
      case 'Cancelled':
      case 'Rejected':
        return 'badge-sent';
      default:
        return 'badge-sent';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)} ${className}`}>
      <span style={{ 
        width: 6, 
        height: 6, 
        borderRadius: '50%', 
        backgroundColor: 'currentColor' 
      }}></span>
      {status}
    </span>
  );
};
