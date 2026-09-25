import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  CheckCircle2, 
  Cpu, 
  Sparkles, 
  User, 
  Clock, 
  BellOff, 
  ExternalLink,
  X
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'evaluation' | 'system' | 'ai' | 'candidate';
  linkView?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'AI Assessment Evaluated',
    message: 'Seo Jan Im completed Two Sum assessment with an overall AI score of 85%.',
    time: '5m ago',
    read: false,
    type: 'evaluation',
    linkView: 'analytics'
  },
  {
    id: 'notif-2',
    title: 'C++ Code Engine Active',
    message: 'Process sandbox (:8082) executed 4/4 test cases successfully in 0ms.',
    time: '22m ago',
    read: false,
    type: 'system',
    linkView: 'settings'
  },
  {
    id: 'notif-3',
    title: 'NLP Speech Model Result',
    message: 'Linguistic clarity 78% computed with O(n) algorithmic complexity detection.',
    time: '1h ago',
    read: false,
    type: 'ai',
    linkView: 'analytics'
  },
  {
    id: 'notif-4',
    title: 'Candidate Profile Shortlisted',
    message: 'Arlene McCoy approved with 95/100 score on Algorithms Engineer track.',
    time: '3h ago',
    read: true,
    type: 'candidate',
    linkView: 'candidates'
  }
];

interface NotificationDropdownProps {
  onNavigate?: (view: string) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAsRead = (id: string, linkView?: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (linkView && onNavigate) {
      onNavigate(linkView);
      setIsOpen(false);
    }
  };

  const renderIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'evaluation':
        return (
          <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      case 'system':
        return (
          <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
        );
      case 'ai':
        return (
          <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
      case 'candidate':
        return (
          <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
          isOpen
            ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/40 shadow-sm'
            : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
        }`}
        title="Notifications"
        aria-label="Toggle notifications"
      >
        <Bell className="w-4 h-4" />
        
        {/* Pulsing Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 text-[9px] font-bold text-white items-center justify-center ring-2 ring-white dark:ring-[#111827]">
              {unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-white/5 text-[11px] font-medium flex items-center gap-1 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Read all</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                  <BellOff className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  All caught up!
                </p>
                <p className="text-[11px] text-slate-400">
                  No notifications to display right now.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id, n.linkView)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    n.read
                      ? 'hover:bg-slate-50 dark:hover:bg-white/[0.02] opacity-80'
                      : 'bg-teal-50/40 dark:bg-teal-500/[0.04] hover:bg-teal-50/70 dark:hover:bg-teal-500/[0.08]'
                  }`}
                >
                  {renderIcon(n.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-2.5 h-2.5" />
                        {n.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">
                      {n.message}
                    </p>

                    {n.linkView && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                        <span>View details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-slate-50/60 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">
                {notifications.length} total event{notifications.length > 1 ? 's' : ''}
              </span>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('analytics');
                    setIsOpen(false);
                  }}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  View Scorecards &rarr;
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
