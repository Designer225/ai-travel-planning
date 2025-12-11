import Button from '@mui/material/Button';

interface TripsListHeaderProps {
    activeTab: 'upcoming' | 'past' | 'saved',
    onSetActiveTab: (state: 'upcoming' | 'past' | 'saved') => void;
}

export function TripsListHeader({ activeTab, onSetActiveTab } : TripsListHeaderProps) {
    return <>
        <div className="flex gap-2 border-b border-gray-200">
            <Button
                onClick={() => onSetActiveTab('upcoming')}
                variant={activeTab === 'upcoming' ? 'contained' : 'outlined'}
                className={activeTab === 'upcoming' ? 'gradient-button' : undefined}
                sx={activeTab === 'upcoming' ? {} : {
                    border: 'none'
                }}
                aria-label="Upcoming">
            Upcoming
            </Button>
            <Button
                onClick={() => onSetActiveTab('past')}
                variant={activeTab === 'past' ? 'contained' : 'outlined'}
                className={activeTab === 'past' ? 'gradient-button' : undefined}
                sx={activeTab === 'past' ? {} : {
                    border: 'none'
                }}
                aria-label="Past">
            Past
            </Button>
            <Button
                onClick={() => onSetActiveTab('saved')}
                variant={activeTab === 'saved' ? 'contained' : 'outlined'}
                className={activeTab === 'saved' ? 'gradient-button' : undefined}
                sx={activeTab === 'saved' ? {} : {
                    border: 'none'
                }}
                aria-label="Saved">
            Saved
            </Button>
        </div>
    </>;
}