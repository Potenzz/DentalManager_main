import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type ColorKey = "primary" | "secondary" | "success" | "warning" | "blue" | "teal" | "green" | "orange" | "rose" | "violet";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: ColorKey;
}

const colorMap: Record<ColorKey, { bg: string; text: string; iconBg: string }> = {
  primary: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
  secondary: { bg: "bg-teal-50", text: "text-teal-600", iconBg: "bg-teal-100" },
  success: { bg: "bg-green-50", text: "text-green-600", iconBg: "bg-green-100" },
  warning: { bg: "bg-orange-50", text: "text-orange-600", iconBg: "bg-orange-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", iconBg: "bg-teal-100" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", iconBg: "bg-orange-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", iconBg: "bg-rose-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", iconBg: "bg-violet-100" },
};

export function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const { text, iconBg } = colorMap[color] ?? colorMap.primary;

  return (
    <Card className="shadow-sm border-0 bg-white">
      <CardContent className="p-5 flex items-center space-x-4">
        <div className={`rounded-xl p-3 ${iconBg} ${text}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
