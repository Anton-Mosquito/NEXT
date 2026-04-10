// src/app/page.tsx
import { Card } from "@/shared/ui";
import Link from "next/link";
import { ROUTES } from "@/shared/constants";

export default function HomePage() {
  const features = [
    {
      icon: "📝",
      title: "Пости",
      desc: "CRUD з RTK Query + optimistic updates",
      href: ROUTES.POSTS,
    },
    {
      icon: "👤",
      title: "Профіль",
      desc: "Auth entity + user data",
      href: ROUTES.PROFILE,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🏗️ FSD + Next.js + Redux Toolkit
        </h1>
        <p className="text-gray-500">
          Feature-Sliced Design архітектура з RTK Query
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map(({ icon, title, desc, href }) => (
          <Link key={href} href={href}>
            <Card hoverable className="h-full">
              <p className="text-3xl mb-2">{icon}</p>
              <h2 className="font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* FSD шари */}
      <Card>
        <h2 className="font-bold text-lg mb-4">🗂️ Архітектура проекту</h2>
        <div className="space-y-2">
          {[
            {
              layer: "app/",
              desc: "Providers, Store, Layout",
              color: "bg-red-100 text-red-700",
            },
            {
              layer: "widgets/",
              desc: "PostFeed, Header, UserProfile",
              color: "bg-orange-100 text-orange-700",
            },
            {
              layer: "features/",
              desc: "like-post, create-post, filter-posts",
              color: "bg-yellow-100 text-yellow-700",
            },
            {
              layer: "entities/",
              desc: "post, user, auth",
              color: "bg-green-100 text-green-700",
            },
            {
              layer: "shared/",
              desc: "UI Kit, lib, config, baseApi",
              color: "bg-blue-100 text-blue-700",
            },
          ].map(({ layer, desc, color }) => (
            <div key={layer} className="flex items-center gap-3">
              <span
                className={`font-mono text-sm px-2 py-1 rounded ${color} w-32 shrink-0`}
              >
                {layer}
              </span>
              <span className="text-sm text-gray-600">{desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
