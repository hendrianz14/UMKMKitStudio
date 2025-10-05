"use client";

import { User } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import OnboardingModal from "@/components/onboarding-modal";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

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

  useEffect(() => {
    setIsModalOpen(needsOnboarding);
  }, [needsOnboarding]);

  const { data: summary } = useSWR<DashboardSummary>('/api/dashboard/summary', fetcher, {
    fallbackData: initialSummary ?? undefined,
    revalidateOnMount: true,
  });

  const { data: history } = useSWR<{ history: LedgerEntry[] }>('/api/credits/history', fetcher, {
    fallbackData: { history: initialHistory },
    revalidateOnMount: true,
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Credit Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.wallet?.balance ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Jobs This Week
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.jobs_this_week ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.credits_used_this_week ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Free Pack</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.free_pack?.credits ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              {summary?.free_pack?.days_left ?? 0} days left
            </p>
          </CardContent>
        </Card>
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
                {initialProjects.map((project) => (
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
              </TableBody>
            </Table>
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
