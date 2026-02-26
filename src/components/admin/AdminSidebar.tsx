"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/admin",
    label: "Coachs",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "/admin/recruteurs",
    label: "Recruteurs / Annonces",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path
          fillRule="evenodd"
          d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.337 1.17.156 2.113 1.34 2.113 2.6 0 1.06-.474 2.152-1.348 2.652l-.648.416c-.062.04-.124.083-.185.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.185.127l.648.416c.874.5 1.348 1.59 1.348 2.652 0 1.26-.944 2.444-2.113 2.6a49.488 49.488 0 01-2.774.337V19.5a3 3 0 01-3 3h-3a3 3 0 01-3-3v-.337a49.284 49.284 0 01-2.774-.337c-1.17-.156-2.114-1.34-2.114-2.6 0-1.06.475-2.152 1.348-2.652l.648-.416c.061-.044.124-.087.185-.128a2.794 2.794 0 01-1.075-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.06-.044.122-.087.184-.127l-.647-.416a3.501 3.501 0 01-1.348-2.652V5.25zm4.5-1.875a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 2.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 2.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 2.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 2.25a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 2.25a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-primary text-white rounded-r-2xl shadow-soft">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 mb-8">
          <img
            src="/logo.svg"
            alt="Coach-Nection"
            className="h-8 w-8 brightness-0 invert opacity-90"
          />
          <span className="font-bold text-lg">Admin</span>
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors ${
                  isActive ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
