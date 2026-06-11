import { Laptop, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';

const devices = [
  { id: 'desktop', label: 'Desktop', icon: Monitor },
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
];

export default function DeviceSwitcher() {
  const { activeDevice, setActiveDevice } = useBuilderStore();

  return (
    <div className="flex items-center p-1">
      {devices.map((device) => {
        const Icon = device.icon;
        const active = activeDevice === device.id;
        return (
          <button
            key={device.id}
            type="button"
            title={device.label}
            aria-label={device.label}
            onClick={() => setActiveDevice(device.id)}
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
              active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}
