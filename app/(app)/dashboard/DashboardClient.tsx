"use client";

import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import OnboardingModal from "@/components/onboarding-modal";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { Activity, ArrowUpRight, CreditCard, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const { data: history } = useSWR<{ history: LedgerEntry[] }>('/api/credits/history', fetcher, {
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
        <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
          {shouldShowStatSkeleton
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="space-y-3 p-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </CardContent>
                </Card>
              ))
            : statItems.map((stat) => (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatNumberID(stat.value)}
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                  </CardContent>
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
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
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
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="font-medium">{project.title}</div>
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
                        <Button asChild size="sm">
                          <Link href={`/editor/${project.id}`}>Open</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {(isLoadingMore || (isProjectsValidating && projects.length === 0)) &&
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`project-skeleton-${index}`}>
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
            {!isReachingEnd && projects.length > 0 && (
              <div className="mt-4 flex justify-center">
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
          <CardContent className="grid gap-8">
            {history?.history.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>
                    {entry.change > 0 ? "UP" : "DN"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {entry.reason}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {entry.change > 0 ? "+" : ""}{entry.change}
                </div>
              </div>
            ))}
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
