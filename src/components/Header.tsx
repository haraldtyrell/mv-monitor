import { CounterStats } from '@/lib/types';

interface HeaderProps {
  stats: CounterStats;
}

export function Header({ stats }: HeaderProps) {
  return (
    <div className="bg-[#0a0a0a] border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">⬡</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg flex items-center gap-3">
              Critical Minerals Monitor
              <span className="bg-green-900/50 text-green-400 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
            </h1>
            <p className="text-gray-500 text-sm">DOI 2025 Critical Minerals List</p>
          </div>
        </div>
        
        {/* Right side - Counters */}
        <div className="flex items-center gap-6">
          <Counter icon="⚠" label="CRIT" value={stats.crit} color="text-red-500" />
          <Counter icon="↗" label="HIGH" value={stats.high} color="text-orange-500" />
          <Counter icon="⊕" label="LOC" value={stats.loc} color="text-cyan-500" />
          <Counter icon="◆" label="MIN" value={stats.min} color="text-purple-500" />
          <Counter icon="📅" label="MAR" value={new Date().getDate()} color="text-gray-400" />
        </div>
      </div>
    </div>
  );
}

function Counter({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <span className="text-white font-semibold">{value}</span>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}
