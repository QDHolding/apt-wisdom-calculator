import { Building, BarChartIcon as ChartBar } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon"
}

export function Logo({ size = "md", variant = "full" }: LogoProps) {
  const sizes = {
    sm: {
      icon: "h-6 w-6",
      text: "text-lg",
      container: "gap-1.5",
    },
    md: {
      icon: "h-8 w-8",
      text: "text-xl",
      container: "gap-2",
    },
    lg: {
      icon: "h-10 w-10",
      text: "text-2xl",
      container: "gap-2.5",
    },
  }

  return (
    <div className={`flex items-center ${sizes[size].container}`}>
      <div className="relative">
        <Building className={`${sizes[size].icon} text-investor-navy`} />
        <ChartBar
          className={`${sizes[size].icon} text-investor-gold absolute -bottom-1 -right-1 transform scale-75 opacity-90`}
        />
      </div>

      {variant === "full" && (
        <div className="font-bold leading-none">
          <span className={`${sizes[size].text} text-investor-navy`}>Apt</span>
          <span className={`${sizes[size].text} text-investor-gold`}>Wisdom</span>
          <span className="text-xs text-investor-slate ml-0.5">.com</span>
        </div>
      )}
    </div>
  )
}

