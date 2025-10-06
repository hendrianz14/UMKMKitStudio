"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateID, formatNumberID } from "@/lib/format";
import { cn } from "@/lib/utils";

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
  const PlanCapitalize = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "";

  if (loading) {
    return (
      <Card className="relative overflow-hidden border border-border bg-card shadow-lg">
        <CardContent className="flex flex-col gap-6 p-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-48" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground shadow-xl">
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <CardContent className="relative flex flex-col gap-6 p-6">
        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Kredit aktif</p>
            <p className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {formatNumberID(balance)}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              "h-9 rounded-full px-4 text-sm font-semibold uppercase tracking-wide",
              "bg-secondary text-secondary-foreground"
            )}
          >
            Paket {PlanCapitalize}
          </Badge>
        </div>

        {planExpiresAt && (
          <div className="flex flex-col gap-1 rounded-xl border border-border bg-secondary p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <span className="text-muted-foreground">Kedaluwarsa</span>
            <span className="font-medium text-foreground">
              {formatDateID(planExpiresAt)}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditActiveCard;
