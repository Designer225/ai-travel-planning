import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="text-center" role="listitem">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
        <Icon className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-2xl mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
