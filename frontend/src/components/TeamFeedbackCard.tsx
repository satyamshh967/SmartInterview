import React from 'react';
import { Star, MoreHorizontal } from 'lucide-react';

export const TeamFeedbackCard: React.FC = () => {
  const reviewers = [
    {
      name: 'Leslie Alexander',
      role: 'Human Resource',
      rating: '4.0',
      stars: 4,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: 'Guy Hawkins',
      role: 'Chief Executive Officer',
      rating: '4.0',
      stars: 4,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: 'Kristin Watson',
      role: 'Project Manager Lead',
      rating: '5.0',
      stars: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl p-5 border border-slate-200/80 dark:border-white/5 shadow-soft flex flex-col justify-between transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Feedback</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">See the team feedback result</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {reviewers.map((rev, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {rev.name}
                </h4>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{rev.role}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          i < rev.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {rev.rating} <span className="text-[9px] text-slate-400 font-normal">Average</span>
                  </span>
                </div>
              </div>
            </div>

            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
