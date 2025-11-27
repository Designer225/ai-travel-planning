import { Button } from "../ui/button";

interface TripsListHeaderProps {
    activeTab: 'upcoming' | 'past' | 'saved',
    onSetActiveTab: (state: 'upcoming' | 'past' | 'saved') => void;
}

export function TripsListHeader({ activeTab, onSetActiveTab } : TripsListHeaderProps) {
    return <>
        <div className="flex gap-2 border-b border-gray-200">
            <Button
            onClick={() => onSetActiveTab('upcoming')}
            className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'upcoming'
                ? 'border-blue-600 text-white bg-blue-600'
                : 'border-transparent text-gray-600 bg-white/20 hover:text-gray-900 hover:bg-blue-200'
            }`}
            aria-label="Upcoming">
            Upcoming
            </Button>
            <Button
            onClick={() => onSetActiveTab('past')}
            className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'past'
                ? 'border-blue-600 text-white bg-blue-600'
                : 'border-transparent text-gray-600 bg-white/20 hover:text-gray-900 hover:bg-blue-200'
            }`}
            aria-label="Past">
            Past
            </Button>
            <Button
            onClick={() => onSetActiveTab('saved')}
            className={`px-4 py-2 border-b-2 transition-colors ${
                activeTab === 'saved'
                ? 'border-blue-600 text-white bg-blue-600'
                : 'border-transparent text-gray-600 bg-white/20 hover:text-gray-900 hover:bg-blue-200'
            }`}
            aria-label="Saved">
            Saved
            </Button>
        </div>
    </>;
}