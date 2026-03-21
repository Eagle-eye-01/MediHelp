"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HealthTrendChart({
  data
}: {
  data: Array<{
    date: string;
    uploads: number;
  }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Document activity over time</CardDescription>
        <CardTitle>HealthTrendChart</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#64748B" />
            <YAxis allowDecimals={false} stroke="#64748B" />
            <Tooltip />
            <Line
              dataKey="uploads"
              stroke="#2563EB"
              strokeWidth={3}
              type="monotone"
              dot={{ fill: "#2563EB", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
