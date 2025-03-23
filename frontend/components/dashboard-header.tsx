interface DashboardHeaderProps {
  name: string
  subtitle: string
}

export function DashboardHeader({ name, subtitle }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Good morning, {name}!</h1>
      <p className="text-gray-400">{subtitle}</p>
    </div>
  )
}

