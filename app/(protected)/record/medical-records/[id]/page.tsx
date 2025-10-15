import { ProfileImage } from "@/components/profile-image";
import { ClinicalNotesEditor } from "@/components/clinical-notes-editor";
import { checkRole } from "@/utils/roles";
import { getMedicalRecordById } from "@/utils/services/medical";
import {
  MedicalRecords,
  Patient,
  Doctor,
  Diagnosis,
  VitalSigns,
  Appointment,
} from "@prisma/client";
import { format, differenceInYears, isValid } from "date-fns";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Thermometer,
  Heart,
  Weight,
  Ruler,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface MedicalRecordWithRelations extends MedicalRecords {
  patient: Patient;
  diagnosis: Diagnosis[];
  vital_signs: VitalSigns[];
  appointment: Appointment & {
    doctor: Doctor;
  };
}

interface MedicalRecordPageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicalRecordPage({
  params,
}: MedicalRecordPageProps) {
  const { id } = await params;
  const record = await getMedicalRecordById(parseInt(id));

  if (!record || !record.success || !record.data) {
    notFound();
  }

  const isAdmin = await checkRole("ADMIN");
  const isDoctor = await checkRole("DOCTOR");

  const recordData = record.data as MedicalRecordWithRelations;
  const patient = recordData.patient;
  const doctor = recordData.appointment.doctor;
  const diagnosis = recordData.diagnosis[0]; 
  const vitalSigns = recordData.vital_signs[0]; 
  const appointment = recordData.appointment;

  const patientName = `${patient.first_name} ${patient.last_name}`;
  const doctorName = doctor.name;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/record/medical-records"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Volver a los registros médicos
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold"># Registros médicos{id}</h1>
        </div>
      </div>

      {/* Patient and Doctor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Información del paciente
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <ProfileImage
              url={patient?.img!}
              name={patientName}
              bgColor={patient?.colorCode!}
              textClassName="text-black"
            />
            <div>
              <h3 className="font-medium text-lg">{patientName}</h3>
              <p className="text-gray-600">ID: {patient.id.slice(-6)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Email:</span>
              <p>{patient.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Teléfono:</span>
              <p>{patient.phone}</p>
            </div>
            <div>
              <span className="text-gray-600">Género:</span>
              <p className="capitalize">{patient.gender.toLowerCase()}</p>
            </div>
            <div>
              <span className="text-gray-600">Edad:</span>
              <p>
                {patient.date_of_birth && isValid(new Date(patient.date_of_birth))
                  ? `${differenceInYears(new Date(), new Date(patient.date_of_birth))} years`
                  : "Fecha de nacimiento no especificada"}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} />
            Información médica
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <ProfileImage
              url={doctor?.img!}
              name={doctorName}
              bgColor={doctor?.colorCode!}
              textClassName="text-black"
            />
            <div>
              <h3 className="font-medium text-lg">{doctorName}</h3>
              <p className="text-gray-600">{doctor.specialization}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Departamento:</span>
              <p>{doctor.department}</p>
            </div>
            <div>
              <span className="text-gray-600">Licencia:</span>
              <p>{doctor.license_number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Information */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Información de la cita
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-gray-600 text-sm">Fecha de la cita:</span>
            <p className="font-medium">
              {format(appointment.appointment_date, "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Tiempo:</span>
            <p className="font-medium">{appointment.time}</p>
          </div>
          <div>
            <span className="text-gray-600 text-sm">Type:</span>
            <p className="font-medium capitalize">
              {appointment.type.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Vital Signs Section */}
      {vitalSigns && (
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Thermometer size={20} />
            Signos Vitales
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer size={16} className="text-blue-600" />
                <span className="font-medium text-sm">Temperatura</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {vitalSigns.body_temperature}°C
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-red-600" />
                <span className="font-medium text-sm">Presión arterial</span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {vitalSigns.systolic}/{vitalSigns.diastolic} mmHg
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-green-600" />
                <span className="font-medium text-sm">Frecuencia cardíaca</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {vitalSigns.heartRate}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Weight size={16} className="text-purple-600" />
                <span className="font-medium text-sm">Peso</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {vitalSigns.weight} kg
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {vitalSigns.respiratory_rate && (
              <div className="bg-orange-50 p-4 rounded-lg">
                <span className="font-medium text-sm">Frecuencia respiratoria</span>
                <p className="text-xl font-bold text-orange-600">
                  {vitalSigns.respiratory_rate} bpm
                </p>
              </div>
            )}
            {vitalSigns.oxygen_saturation && (
              <div className="bg-teal-50 p-4 rounded-lg">
                <span className="font-medium text-sm">Saturación 02</span>
                <p className="text-xl font-bold text-teal-600">
                  {vitalSigns.oxygen_saturation}%
                </p>
              </div>
            )}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ruler size={16} className="text-indigo-600" />
                <span className="font-medium text-sm">Altura</span>
              </div>
              <p className="text-xl font-bold text-indigo-600">
                {vitalSigns.height} cm
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Diagnosis Section */}
      {diagnosis && (
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Diagnóstico
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Sintomas</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {diagnosis.symptoms}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Diagnóstico</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {diagnosis.diagnosis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Notes Section */}
      <div className="bg-white rounded-xl p-6 border">
        <ClinicalNotesEditor
          medicalRecordId={recordData.id}
          initialNotes={recordData.notes || ""}
          canEdit={isDoctor}
        />
      </div>

      {/* Treatment Plan Section */}
      {recordData.treatment_plan && (
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={20} />
            Plan de tratamiento
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap">
              {recordData.treatment_plan}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-6 border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} />
          Medicamentos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {diagnosis.prescribed_medications && (
            <div>
              <h3 className="font-medium mb-2">Medicamentos recetados</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {diagnosis.prescribed_medications}
              </p>
            </div>
          )}
          {diagnosis.follow_up_plan && (
            <div>
              <h3 className="font-medium mb-2">Plan de seguimiento</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {diagnosis.follow_up_plan}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Record Metadata */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Creada:</span>
            <p className="font-medium">
              {format(recordData.created_at, "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Última actualización:</span>
            <p className="font-medium">
              {format(recordData.updated_at, "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
          <div>
            <span className="text-gray-600">ID de registro:</span>
            <p className="font-medium">#{recordData.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}