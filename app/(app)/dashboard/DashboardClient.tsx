"use client";

import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import OnboardingModal from "@/components/onboarding-modal";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { Activity, ArrowDownLeft, ArrowUpRight, Clock, CreditCard, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreditActiveCard from "./_components/CreditActiveCard";
import { formatNumberID } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Wallet = Database['public']['Tables']['credits_wallet']['Row'];
type LedgerEntry = Database['public']['Tables']['credits_ledger']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

type ProjectsResponse = {
  projects: Project[];
  nextCursor: string | null;
};

const PROJECTS_PAGE_SIZE = 12;

interface DashboardSummary {
  wallet: Wallet | null;
  jobs_this_week: number;
  credits_used_this_week: number;
  free_pack: { credits: number; days_left: number };
}

interface DashboardClientProps {
  user: User;
  profile: Profile | null;
  needsOnboarding: boolean;
  saveOnboarding: (formData: FormData) => Promise<{ error: string } | undefined>;
  initialSummary: DashboardSummary | null;
  initialProjects: Project[];
  initialHistory: LedgerEntry[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardClient({
  user,
  profile,
  needsOnboarding,
  saveOnboarding,
  initialSummary,
  initialProjects,
  initialHistory,
}: DashboardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(needsOnboarding);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setIsModalOpen(needsOnboarding);
  }, [needsOnboarding]);

  const { data: summary, isValidating: isSummaryValidating } = useSWR<DashboardSummary>('/api/dashboard/summary', fetcher, {
    fallbackData: initialSummary ?? undefined,
    revalidateOnMount: true,
  });

  const { data: history, isValidating: isHistoryValidating } = useSWR<{ history: LedgerEntry[] }>('/api/credits/history', fetcher, {
    fallbackData: { history: initialHistory },
    revalidateOnMount: true,
  });

  const {
    data: projectPages,
    setSize: setProjectPageCount,
    isValidating: isProjectsValidating,
  } = useSWRInfinite<ProjectsResponse>(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.nextCursor) {
        return null;
      }

      const cursor = index === 0 ? null : previousPageData?.nextCursor ?? null;

      const searchParams = new URLSearchParams({ limit: PROJECTS_PAGE_SIZE.toString() });
      if (cursor) {
        searchParams.set('cursor', cursor);
      }

      return `/api/projects?${searchParams.toString()}`;
    },
    fetcher,
    {
      fallbackData: [
        {
          projects: initialProjects,
          nextCursor:
            initialProjects.length === PROJECTS_PAGE_SIZE
              ? initialProjects[initialProjects.length - 1]?.updated_at ?? null
              : null,
        },
      ],
      revalidateOnMount: true,
    }
  );

  const projects = useMemo(() => {
    if (!projectPages) {
      return initialProjects;
    }

    const projectMap = new Map<string, Project>();

    for (const page of projectPages) {
      for (const project of page.projects) {
        if (!projectMap.has(project.id)) {
          projectMap.set(project.id, project);
        }
      }
    }

    return Array.from(projectMap.values());
  }, [projectPages, initialProjects]);

  const lastPage = projectPages ? projectPages[projectPages.length - 1] : undefined;
  const isReachingEnd = !!lastPage && !lastPage.nextCursor;

  const handleLoadMore = async () => {
    if (isLoadingMore || isReachingEnd) {
      return;
    }

    setIsLoadingMore(true);
    try {
      await setProjectPageCount((current) => current + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const shouldShowStatSkeleton = !summary && isSummaryValidating;
  const historyEntries = history?.history ?? [];
  const hasHistoryEntries = historyEntries.length > 0;
  const historySkeletonCount = hasHistoryEntries ? Math.min(historyEntries.length, 3) : 3;

  const statItems = [
    {
      label: "Jobs This Week",
      value: summary?.jobs_this_week ?? 0,
      icon: Users,
      subtitle: "Updated just now",
    },
    {
      label: "Credits Used",
      value: summary?.credits_used_this_week ?? 0,
      icon: CreditCard,
      subtitle: "Updated just now",
    },
    {
      label: "Free Pack",
      value: summary?.free_pack?.credits ?? 0,
      icon: Activity,
      subtitle:
        summary?.free_pack?.days_left != null
          ? `${summary?.free_pack?.days_left} days remaining`
          : "Updated just now",
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-6 xl:gap-8">
        <CreditActiveCard
          balance={summary?.wallet?.balance ?? 0}
          plan={summary?.wallet?.plan ?? "free"}
          planExpiresAt={summary?.wallet?.expires_at ?? undefined}
          loading={!summary && isSummaryValidating}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {shouldShowStatSkeleton
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="border border-border bg-card shadow-sm">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))
            : statItems.map((stat) => (
                <Card key={stat.label} className="border border-border bg-card shadow-sm">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5">
                    <div className="space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-semibold text-foreground">
                        {formatNumberID(stat.value)}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <stat.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </CardHeader>
                </Card>
              ))}
        </div>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Recent projects from your account.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/projects">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Project</TableHead>
                    <TableHead className="hidden xl:table-column">
                      Status
                    </TableHead>
                    <TableHead className="hidden xl:table-column">
                      Date
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length > 0 &&
                    projects.map((project) => (
                      <TableRow key={project.id} className="border-border/60">
                        <TableCell>
                          <div className="font-medium text-foreground">{project.title}</div>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {new Date(project.updated_at).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Badge className="text-xs" variant="outline">
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                          {new Date(project.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/editor/${project.id}`}>Open</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {(isLoadingMore || (isProjectsValidating && projects.length === 0)) &&
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={`project-skeleton-${index}`} className="border-border/60">
                        <TableCell>
                          <Skeleton className="h-5 w-40" />
                        </TableCell>
                        <TableCell className="hidden xl:table-column">
                          <Skeleton className="h-5 w-20" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="ml-auto h-8 w-16" />
                        </TableCell>
                      </TableRow>
                    ))}
                  {projects.length === 0 && !isLoadingMore && !isProjectsValidating && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div>
                            <p className="text-sm font-medium">You don&apos;t have any projects yet.</p>
                            <p className="text-sm text-muted-foreground">
                              Start your first project to see it appear in this list.
                            </p>
                          </div>
                          <Button asChild size="sm">
                            <Link href="/generate">Create your first project</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {!isReachingEnd && projects.length > 0 && (
              <div className="flex justify-center">
                <Button onClick={handleLoadMore} disabled={isLoadingMore} variant="outline">
                  {isLoadingMore ? "Loading..." : "Load more projects"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Credit History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isHistoryValidating && (
              <div className="grid gap-3">
                {Array.from({ length: historySkeletonCount }).map((_, index) => (
                  <div
                    key={`history-skeleton-${index}`}
                    className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {hasHistoryEntries ? (
              <div className="grid gap-3">
                {historyEntries.map((entry) => {
                  const isCredit = entry.change > 0;
                  const amount = `${isCredit ? "+" : "-"}${formatNumberID(Math.abs(entry.change))}`;

                  return (
                    <div
                      key={entry.id}
                      className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full",
                              isCredit
                                ? "bg-emerald-600/15 text-emerald-400"
                                : "bg-rose-600/15 text-rose-400"
                            )}
                          >
                            {isCredit ? (
                              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <ArrowDownLeft className="h-5 w-5" aria-hidden="true" />
                            )}
                          </span>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                              {entry.reason ?? "Transaction"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(entry.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3 sm:text-right">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              isCredit
                                ? "border-emerald-500 text-emerald-300"
                                : "border-rose-500 text-rose-300"
                            )}
                          >
                            {isCredit ? "Credit" : "Debit"}
                          </Badge>
                          <span
                            className={cn(
                              "text-base font-semibold",
                              isCredit ? "text-emerald-300" : "text-rose-300"
                            )}
                          >
                            {amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : !isHistoryValidating ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <Clock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">No credit activity yet</p>
                  <p className="text-sm text-muted-foreground">
                    Credits you spend or add will show up here for quick tracking.
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
      <OnboardingModal
        needsOnboarding={isModalOpen}
        initialName={profile?.name ?? ""}
        initialRole={profile?.user_type ?? ""}
        action={saveOnboarding}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
