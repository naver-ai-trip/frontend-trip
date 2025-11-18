import React from "react"
import { Map, Languages, AlertCircle, Train, Wifi } from "lucide-react"
import Link from "next/link"

interface ToolkitItem {
  icon: React.ReactNode
  title: string
  color: string
  href?: string
}

const toolkitItems: ToolkitItem[] = [
  {
    icon: <Map className="w-8 h-8" />,
    title: "Map & Directions",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: <Languages className="w-8 h-8" />,
    title: "Menu Translator",
    color: "from-orange-500 to-red-500",
    href: "/translator",
  },
  {
    icon: <AlertCircle className="w-8 h-8" />,
    title: "S.O.S. Phrasebook",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: <Train className="w-8 h-8" />,
    title: "Subway Guide",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: <Wifi className="w-8 h-8" />,
    title: "Wi-Fi Hotspots",
    color: "from-pink-500 to-purple-500",
  },
]

export const Toolkit = () => {
  return (
    <section className="my-10">
      <div className="">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            Your Travel Toolkit
          </h2>
          <p className="text-base text-muted-foreground">
            Essential tools to help you navigate South Korea with ease.
          </p>
        </div>

        {/* Toolkit Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {toolkitItems.map((item, index) => (
            <Link
              href={item.href || "#"}
              key={index}
              className="group relative gap-6 flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-transparent hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Hover Background Gradient */}
              {/* <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} /> */}

              {/* Icon Container */}
              {/* <div className={`relative w-16 h-16 mb-4 flex items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}> */}
              {item.icon}
              {/* </div> */}

              {/* Title */}
              <h3 className="relative text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                {item.title}
              </h3>

              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                style={{ padding: "2px" }}>
                <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-800" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
