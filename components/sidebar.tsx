import { getRole } from "@/utils/roles";
import {
  Bell,
  LayoutDashboard,
  List,
  ListOrdered,
  Logs,
  LucideIcon,
  Pill,
  Receipt,
  Settings,
  SquareActivity,
  User,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import LogoutButton from "./logout-button";

const ACCESS_LEVELS_ALL = [
  "admin",
  "doctor",
  "nurse",
  "lab technician",
  "patient",
];

const SidebarIcon = ({ icon: Icon }: { icon: LucideIcon }) => {
  return <Icon className="size-6 lg:size-5" />;
};

export const Sidebar = async () => {
  const role = await getRole();

  const SIDEBAR_LINKS = [
    {
      label: "MENU",
      links: [
        {
          name: "Dashboard",
          href: "/",
          access: ACCESS_LEVELS_ALL,
          icon: LayoutDashboard,
        },
        {
          name: "Profile",
          href: "/patient/self",
          access: ["patient"],
          icon: User,
        },
      ],
    },
    {
      label: "Manage",
      links: [
        {
          name: "Usuarios",
          href: "/record/users",
          access: ["admin"],
          icon: Users,
        },
        {
          name: "Doctores",
          href: "/record/doctors",
          access: ["admin"],
          icon: User,
        },
        {
          name: "Personal",
          href: "/record/staffs",
          access: ["admin", "doctor"],
          icon: UserRound,
        },
        {
          name: "Pacientes",
          href: "/record/patients",
          access: ["admin", "doctor", "nurse"],
          icon: UsersRound,
        },
        {
          name: "Citas",
          href: "/record/appointments",
          access: ["admin", "doctor", "nurse"],
          icon: ListOrdered,
        },
        {
          name: "Registros médicos",
          href: "/record/medical-records",
          access: ["admin", "doctor", "nurse"],
          icon: SquareActivity,
        },
        {
          name: "Resumen de facturación",
          href: "/record/billing",
          access: ["admin", "doctor"],
          icon: Receipt,
        },
        {
          name: "Gestión de pacientes",
          href: "/nurse/patient-management",
          access: ["nurse"],
          icon: Users,
        },
        {
          name: "Administrar medicamentos",
          href: "/nurse/administer-medications",
          access: ["admin", "doctor", "nurse"],
          icon: Pill,
        },
        {
          name: "Citas",
          href: "/record/appointments",
          access: ["patient"],
          icon: ListOrdered,
        },
        {
          name: "Archivos",
          href: "/patient/self",
          access: ["patient"],
          icon: List,
        },
        {
          name: "Prescripción",
          href: "#",
          access: ["patient"],
          icon: Pill,
        },
        {
          name: "Facturación",
          href: "/patient/self?cat=payments",
          access: ["patient"],
          icon: Receipt,
        },
      ],
    },
    {
      label: "System",
      links: [
        {
          name: "Notificaciones",
          href: "/notifications",
          access: ACCESS_LEVELS_ALL,
          icon: Bell,
        },
        {
          name: "Registros de auditoría",
          href: "/admin/audit-logs",
          access: ["admin"],
          icon: Logs,
        },
        {
          name: "Ajustes",
          href: "/admin/system-settings",
          access: ["admin"],
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="w-full p-4 flex flex-col justify-between gap-4 bg-white overflow-y-scroll min-h-full">
      <div className="">
        <div className="flex items-center justify-center lg:justify-start gap-2">
          <div className="p-1.5 rounded-md bg-blue-600 text-white">
            <SquareActivity size={22} />
          </div>
          <Link
            href={"/"}
            className="hidden lg:flex text-base 2xl:text-xl font-bold"
          >
            MediSys
          </Link>
        </div>

        <div className="mt-4 text-sm">
          {SIDEBAR_LINKS.map((el) => (
            <div key={el.label} className="flex flex-col gap-2">
              <span className="hidden uppercase lg:block text-gray-400 font-bold my-4">
                {el.label}
              </span>

              {el.links.map((link) => {
                if (link.access.includes(role.toLowerCase())) {
                  return (
                    <Link
                      href={link.href}
                      className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-600/10"
                      key={link.name}
                    >
                      <SidebarIcon icon={link.icon} />
                      <span className="hidden lg:block">{link.name}</span>
                    </Link>
                  );
                }
              })}
            </div>
          ))}
        </div>
      </div>

      <LogoutButton />
    </div>
  );
};