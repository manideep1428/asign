import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { InvestmentSummary } from "@/components/investment-summary"
import { PerformanceMetrics } from "@/components/performance-metrics"
import { PortfolioComposition } from "@/components/portfolio-composition"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        {/* name comes from DB here   */}
        <DashboardHeader name="Manideep" subtitle="Evaluate Your Investment Performance" />

        <InvestmentSummary />

        <Tabs defaultValue="performance" className="mt-8">
          <div className="border-b border-gray-800">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger
                value="performance"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-white text-gray-400 px-4 py-2 rounded-none bg-transparent h-auto relative transition-all"
              >
                Performance Metrics
              </TabsTrigger>
              <TabsTrigger
                value="composition"
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-white text-gray-400 px-4 py-2 rounded-none bg-transparent h-auto relative transition-all"
              >
                Portfolio Composition
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="performance" className="mt-6">
            <PerformanceMetrics />
          </TabsContent>

          <TabsContent value="composition" className="mt-6">
            <PortfolioComposition />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

