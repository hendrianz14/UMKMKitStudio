"use client";

import React from 'react';
import { formatNumberID, formatDateID } from '@/lib/format';
import { cn } from '@/lib/utils'; // Assuming cn is a utility for class merging, common in Next.js/Tailwind projects

interface CreditActiveCardProps {
  balance: number;
  plan: string;
  planExpiresAt?: string | null;
  loading?: boolean;
  error?: string;
}

const CreditActiveCard: React.FC<CreditActiveCardProps> = ({
  balance,
  plan,
  planExpiresAt,
  loading = false,
  error,
}) => {
  const PlanCapitalize = plan.charAt(0).toUpperCase() + plan.slice(1);

  if (loading) {
    return (
      <div className="relative p-5 sm:p-6 bg-[#121A2A] border border-[#FFFFFF14] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,.35)] hover:translate-y-[-2px] hover:shadow-[0_16px_44px_rgba(0,0,0,.45)] transition-all duration-200 ease-in-out">
        <div className="flex flex-col gap-4">
          {/* Title Skeleton */}
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
          {/* Balance Skeleton */}
          <div className="h-12 w-48 bg-gray-700 rounded animate-pulse"></div>
        </div>
        {/* Plan Pill Skeleton */}
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 h-10 w-32 bg-gray-700 rounded-full animate-pulse"></div>
        {/* Bottom Bar Skeleton */}
        <div className="mt-6 h-14 w-full bg-gray-700 rounded-[16px] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative p-5 sm:p-6 bg-[#121A2A] border border-[#FFFFFF14] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,.35)] hover:translate-y-[-2px] hover:shadow-[0_16px_44px_rgba(0,0,0,.45)] transition-all duration-200 ease-in-out">
      {error && (
        <div className="absolute top-0 left-0 right-0 p-2 text-center text-red-300 bg-[#7F1D1D33] border border-[#EF444422] rounded-t-[20px] text-sm">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h3 className="text-[#9AA7B5] text-[14px] leading-[20px]">Kredit aktif</h3>
        <p className="text-[#E7ECF2] text-[48px] sm:text-[56px] font-extrabold tracking-[-0.5px] leading-none">
          {formatNumberID(balance)}
        </p>
      </div>

      <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
        <div
          className={cn(
            "h-10 px-4 rounded-full flex items-center justify-center",
            "bg-[#0F1C33] border border-[#1F2A3D]",
            "relative overflow-hidden"
          )}
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(59, 130, 246, 0.06) 0%, rgba(99, 102, 241, 0.03) 100%)",
          }}
        >
          <span className="text-[#E7ECF2] text-[15px] leading-[22px] font-semibold whitespace-nowrap">
            Paket {PlanCapitalize}
          </span>
        </div>
      </div>

      {planExpiresAt && (
        <div className="relative mt-6 h-14 px-[18px] flex items-center justify-center bg-[#0F172A] border border-[#0F1B2E] rounded-[16px] overflow-hidden">
          <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] rounded-[16px]"></div>
          {/* Decorative curved line */}
          <svg
            className="absolute bottom-0 left-0"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 36C19.8823 36 36 19.8823 36 0L36 36H0Z"
              fill="#0C1322"
            />
          </svg>
          <span className="text-[#9AA7B5] text-[14px] text-center">
            Kedaluwarsa pada {formatDateID(planExpiresAt)}
          </span>
        </div>
      )}
    </div>
  );
};

export default CreditActiveCard;
