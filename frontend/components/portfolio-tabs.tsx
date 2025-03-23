"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceMetrics } from "./performance-metrics";
import { PortfolioComposition } from "./portfolio-composition";

export function PortfolioTabs() {
  return (
    <Tabs defaultValue="performance" className="space-y-4">
      <TabsList>
        <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        <TabsTrigger value="composition">Portfolio Composition</TabsTrigger>
      </TabsList>
      <TabsContent value="performance">
        <PerformanceMetrics />
      </TabsContent>
      <TabsContent value="composition">
        <PortfolioComposition />
      </TabsContent>
    </Tabs>
  );
}