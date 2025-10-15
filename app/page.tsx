import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing-header";
import { getRole } from "@/utils/roles";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Calendar,
  FileText,
  Mail,
  MapPin,
  Phone,
  Shield,
  Stethoscope,
  Users,
} from "lucide-react";

export default async function Home() {
  const { userId } = await auth();
  const role = await getRole();

  if (userId && role) {
    redirect(`/${role}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Bienvenido a {""}
              <span className="text-blue-600">MediSys</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Optimice las operaciones de su hospital con nuestro completo Sistema de Gestión Hospitalaria. Gestione pacientes, citas, historiales médicos y más fácilmente.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {userId ? (
              <>
                <Link href={`/${role}`}>
                  <Button className=" cursor-pointer">Ir al panel</Button>
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href={"/sign-up"}>
                  <Button className=" cursor-pointer">Nuevo Paciente</Button>
                </Link>

                <Link href={"/sign-in"}>
                  <Button
                    variant="outline"
                    className=" md:text-base underline  cursor-pointer hover:text-blue-600"
                  >
                    Iniciar sesión en la cuenta
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200">
            {/* Dashboard Image */}
            <img
              src="/dashboard-preview.png"
              alt="CareplusHMS Doctor Dashboard Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Acerca de MediSys
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un moderno sistema de gestión hospitalaria basado en la nube, diseñado para mejorar la prestación de servicios de salud y la eficiencia operativa.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Transformando la gestión sanitaria
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                MediSys está diseñado pensando en los profesionales de la salud. Nuestro sistema ofrece herramientas integrales para gestionar la atención al paciente, las citas, los historiales médicos y las tareas administrativas, todo en una plataforma integrada.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Con funciones de seguridad avanzadas y un diseño intuitivo, ayudamos a los proveedores de atención médica a centrarse en lo que más importa - la atención al paciente.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Atención al paciente</h4>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Citas</h4>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">
                    Registros médicos
                  </h4>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Seguridad</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funciones potentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todo lo que necesita para gestionar eficientemente las operaciones de su hospital
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Gestión de pacientes
              </h3>
              <p className="text-gray-600">
                Perfiles completos de pacientes, historial médico y planes de tratamiento, todo en un solo lugar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Programación de citas
              </h3>
              <p className="text-gray-600">
                Sistema de programación inteligente con recordatorios automáticos y detección de conflictos.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Registros médicos
              </h3>
              <p className="text-gray-600">
                Historiales médicos seguros que cumplen con la HIPAA, con control de versiones y registros de auditoría.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Análisis e informes
              </h3>
              <p className="text-gray-600">
                Información valiosa sobre el rendimiento del hospital, los resultados de los pacientes y las métricas operativas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Seguridad y cumplimiento
              </h3>
              <p className="text-gray-600">
                Seguridad de nivel empresarial con control de acceso basado en roles y registro de auditoría.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Soporte multi-rol
              </h3>
              <p className="text-gray-600">
                Interfaces dedicadas para médicos, enfermeras, administradores y pacientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ponte en contacto
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ¿Tienes alguna pregunta? Nos encantaría saber de ti. Envíanos un mensaje y te responderemos lo antes posible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Información del contacto
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">support@medisys.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <p className="text-gray-600">+234 8071527058</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Dirección</p>
                    <p className="text-gray-600">
                      123 Calle Principal, Ciudad, País
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Envíanos un mensaje
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu mensaje..."
                  ></textarea>
                </div>

                <Button className="w-full">Enviar Mensaje</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">MediSys</h3>
              </div>
              <p className="text-gray-400">
                Transformando la gestión sanitaria con soluciones tecnológicas innovadoras.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Características
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-white transition-colors"
                  >
                    Acerca de
                  </a>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="hover:text-white transition-colors"
                  >
                    Empezar
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#contact"
                    className="hover:text-white transition-colors"
                  >
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de ayuda
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    política de privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Términos de servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cumplimiento de HIPAA
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} MediSys. Reservados todos los derechos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}