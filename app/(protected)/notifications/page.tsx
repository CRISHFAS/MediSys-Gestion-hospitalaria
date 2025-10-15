import { currentUser } from "@clerk/nextjs/server";
import { Bell, CheckCircle, Clock, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockNotifications = [
  {
    id: 1,
    type: "appointment",
    title: "Solicitud de nueva cita",
    message:
      "El paciente Juan Doe solicitó una cita para mañana a las 2:00 PM",
    timestamp: "hace 2 horas",
    isRead: false,
    priority: "alta",
  },
  {
    id: 2,
    type: "lab_result",
    title: "Resultados de laboratorio disponibles",
    message: "Los resultados del análisis de sangre de la paciente Jane Smith están listos para su revisión.",
    timestamp: "hace 4 horas",
    isRead: false,
    priority: "media",
  },
  {
    id: 3,
    type: "reminder",
    title: "Recordatorio de seguimiento",
    message:
      "El paciente Mike Johnson tendrá una cita de seguimiento la próxima semana.",
    timestamp: "Hace 1 día",
    isRead: true,
    priority: "baja",
  },
  {
    id: 4,
    type: "system",
    title: "Mantenimiento del sistema",
    message: "El mantenimiento programado se realizará esta noche a las 2:00 AM.",
    timestamp: "Hace 2 días",
    isRead: true,
    priority: "baja",
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <Clock className="h-5 w-5 text-blue-600" />;
    case "lab_result":
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case "reminder":
      return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    case "system":
      return <Info className="h-5 w-5 text-gray-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

export default async function NotificationsPage() {
  const user = await currentUser();
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notificaciones</h1>
          <p className="text-gray-600">
            Manténgase actualizado con sus últimas actividades
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {unreadCount} no leído
          </Badge>
          <Button variant="outline" size="sm">
            Marcar todo como leído
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {mockNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={`transition-all hover:shadow-md ${
              !notification.isRead
                ? "border-l-4 border-l-blue-500 bg-blue-50/50"
                : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {notification.message}
                  </p>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 px-3"
                    >
                      Ver Detalles
                    </Button>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-8 px-3 text-blue-600 hover:text-blue-700"
                      >
                        Marcar como leído
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {mockNotifications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay nuevas notificaciones
            </h3>
            <p className="text-gray-600">
              Ya estás al día! Todas tus notificaciones estarán aquí cuando lleguen.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}