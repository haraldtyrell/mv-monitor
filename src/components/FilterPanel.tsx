'use client';

import { FilterState, EventCategory, Severity, MineralGroup } from '@/lib/types';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const EVENT_TYPES: { value: EventCategory; label: string; color: string }[] = [
  { value: 'SUPPLY_CHAIN', label: 'Supply Chain', color: 'bg-orange-500' },
  { value: 'TRADE_POLICY', label: 'Trade Policy', color: 'bg-blue-500' },
  { value: 'MINING', label: 'Mining', color: 'bg-green-500' },
  { value: 'MARKET', label: 'Market', color: 'bg-blue-500' },
  { value: 'ENVIRONMENTAL', label: 'Environmental', color: 'bg-green-500' },
  { value: 'CONFLICT', label: 'Conflict', color: 'bg-red-500' },
];

const SEVERITIES: { value: Severity; label: string }[] = [
  { value: 1, label: 'S1' },
  { value: 2, label: 'S2' },
  { value: 3, label: 'S3' },
  { value: 4, label: 'S4' },
];

const MINERAL_GROUPS: { value: MineralGroup; label: string }[] = [
  { value: 'REE', label: 'Rare Earths (REE)' },
  { value: 'BATTERY', label: 'Battery Metals' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
  { value: 'PRECIOUS', label: 'Precious' },
  { value: 'STRATEGIC', label: 'Strategic' },
];

const TIME_HORIZONS: { value: FilterState['timeHorizon']; label: string }[] = [
  { value: '12h', label: '12 Hours' },
  { value: '48h', label: '48 Hours' },
  { value: '7d', label: '7 Days' },
];

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const toggleEventType = (type: EventCategory) => {
    const newTypes = filters.eventTypes.includes(type)
      ? filters.eventTypes.filter(t => t !== type)
      : [...filters.eventTypes, type];
    onChange({ ...filters, eventTypes: newTypes });
  };

  const toggleSeverity = (severity: Severity) => {
    const newSeverities = filters.severities.includes(severity)
      ? filters.severities.filter(s => s !== severity)
      : [...filters.severities, severity];
    onChange({ ...filters, severities: newSeverities });
  };

  const toggleMineralGroup = (group: MineralGroup) => {
    const newGroups = filters.mineralGroups.includes(group)
      ? filters.mineralGroups.filter(g => g !== group)
      : [...filters.mineralGroups, group];
    onChange({ ...filters, mineralGroups: newGroups });
  };

  const setTimeHorizon = (horizon: FilterState['timeHorizon']) => {
    onChange({ ...filters, timeHorizon: horizon });
  };

  const clearAll = () => {
    onChange({
      timeHorizon: '7d',
      eventTypes: [],
      severities: [],
      mineralGroups: [],
    });
  };

  const selectAll = () => {
    onChange({
      timeHorizon: filters.timeHorizon,
      eventTypes: EVENT_TYPES.map(e => e.value),
      severities: SEVERITIES.map(s => s.value),
      mineralGroups: MINERAL_GROUPS.map(m => m.value),
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Quick actions */}
      <div className="flex gap-2">
        <button
          onClick={selectAll}
          className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Time Horizon */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Time Horizon</h3>
        <div className="flex gap-2">
          {TIME_HORIZONS.map(horizon => (
            <button
              key={horizon.value}
              onClick={() => setTimeHorizon(horizon.value)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                filters.timeHorizon === horizon.value
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {horizon.label}
            </button>
          ))}
        </div>
      </div>

      {/* Event Types */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Event Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {EVENT_TYPES.map(type => (
            <label
              key={type.value}
              className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${
                filters.eventTypes.includes(type.value)
                  ? 'bg-gray-700'
                  : 'bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              <input
                type="checkbox"
                checked={filters.eventTypes.includes(type.value)}
                onChange={() => toggleEventType(type.value)}
                className="hidden"
              />
              <span className={`w-2 h-2 rounded-full ${type.color}`}></span>
              <span className="text-sm text-gray-300">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Severity */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Severity</h3>
        <div className="flex gap-2">
          {SEVERITIES.map(severity => (
            <label
              key={severity.value}
              className={`flex items-center justify-center w-12 h-10 rounded cursor-pointer transition-colors ${
                filters.severities.includes(severity.value)
                  ? getSeverityBg(severity.value)
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
            >
              <input
                type="checkbox"
                checked={filters.severities.includes(severity.value)}
                onChange={() => toggleSeverity(severity.value)}
                className="hidden"
              />
              <span className="text-sm font-semibold">{severity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Mineral Groups */}
      <div>
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Mineral Group</h3>
        <div className="flex flex-col gap-2">
          {MINERAL_GROUPS.map(group => (
            <label
              key={group.value}
              className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer transition-colors ${
                filters.mineralGroups.includes(group.value)
                  ? 'bg-gray-700'
                  : 'bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              <input
                type="checkbox"
                checked={filters.mineralGroups.includes(group.value)}
                onChange={() => toggleMineralGroup(group.value)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
              />
              <span className="text-sm text-gray-300">{group.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSeverityBg(severity: Severity): string {
  switch (severity) {
    case 1: return 'bg-gray-600 text-gray-200';
    case 2: return 'bg-blue-900 text-blue-300';
    case 3: return 'bg-orange-900 text-orange-300';
    case 4: return 'bg-red-900 text-red-300';
    default: return 'bg-gray-600 text-gray-200';
  }
}
