"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { userApi } from "@/services/api";
import { formatDate } from "@/utils/format";

export function UsersView() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["users", search], queryFn: () => userApi.list({ search, limit: 50 }) });
  const users = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="User Management"
        description="Admin controls for operators, viewers, access roles, and account status."
        action={
          <Button>
            <UserPlus size={17} /> Add user
          </Button>
        }
      />
      <Card>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={17} />
          <Input className="pl-10" placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading users...</p> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 font-medium">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge tone={user.role === "admin" ? "blue" : user.role === "operator" ? "green" : "neutral"}>{user.role}</Badge>
                  </td>
                  <td>{user.status}</td>
                  <td>{user.lastActiveAt ? formatDate(user.lastActiveAt) : "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

