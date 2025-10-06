import React from 'react';

interface CreditActiveCardProps {
  balance: number;
  plan: 'free' | 'pro' | 'professional' | string;
  expiresAt: string | Date;
  freeCredits?: number;
  daysLeft?: number;
  onTopup?: () => void;
}

const CreditActiveCard: React.FC<CreditActiveCardProps> = ({
  balance,
  plan,
  expiresAt,
  freeCredits = 0,
  daysLeft,
}) => {
  const calculateDaysLeft = (expiryDate: string | Date): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatExpiresAt = (expiryDate: string | Date): string => {
    const date = new Date(expiryDate);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const actualDaysLeft = daysLeft !== undefined ? daysLeft : calculateDaysLeft(expiresAt);

  const getPlanTitle = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'free':
        return 'Paket Gratis';
      case 'pro':
        return 'Paket Pro';
      case 'professional':
        return 'Paket Profesional';
      default:
        return planType;
    }
  };

  return (
    <div className="relative p-6 bg-zinc-900 rounded-[2rem] border border-zinc-800 shadow-lg max-w-sm mx-auto">
      {/* Soft shadow */}
      <div className="absolute inset-0 rounded-[2rem] shadow-xl opacity-20" style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)' }}></div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-gray-400 text-sm">Kredit aktif</p>
          <p className="text-white text-5xl font-bold">{balance}</p>
        </div>
        {/* Badge Paket */}
        <div className="bg-primary text-primary-foreground text-right px-4 py-2 rounded-full text-sm">
          <p className="font-semibold">{getPlanTitle(plan)}</p>
          <p className="text-xs text-white/80">Kedaluwarsa pada {formatExpiresAt(expiresAt)}</p>
        </div>
      </div>

      {/* Inset Panel */}
      <div className="relative p-4 bg-gray-900 rounded-xl shadow-inner" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.6)' }}>
        <div className="flex justify-between items-center">
          {/* Free Credits Pill */}
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 mr-2">
            <span className="text-yellow-400 mr-2">✨</span>
            <div>
              <p className="text-xs text-gray-400">FREE CREDITS</p>
              <p className="text-white font-bold">{freeCredits} CREDITS</p>
            </div>
          </div>
          {/* Days Left Pill */}
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2">
            <p className="text-white text-2xl font-bold mr-1">{actualDaysLeft}</p>
            <p className="text-gray-400 text-xs leading-none">Days<br />Left</p>
          </div>
        </div>
        {/* Decorative line/curve (optional) */}
        <div className="absolute bottom-0 left-0 w-1/4 h-1 bg-gradient-to-r from-primary/60 to-transparent rounded-br-xl"></div>
      </div>
    </div>
  );
};

export default CreditActiveCard;
