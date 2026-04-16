"use client";

import { ShieldWarningIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PermissionDenied({ message }: { message?: string }) {
  return (
    <Card className="border-destructive/30 max-w-lg">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <ShieldWarningIcon className="text-destructive size-8" aria-hidden />
        <CardTitle className="text-base">Access restricted</CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        {message ??
          "You do not have permission to view this area. Ask an administrator to update your role."}
      </CardContent>
    </Card>
  );
}
