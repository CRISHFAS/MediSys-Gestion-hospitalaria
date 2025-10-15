"use server";

import db from "@/lib/db";
import { PatientFormSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

export async function updatePatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        msg: "Proporcione todos los campos obligatorios",
      };
    }

    const patientData = validateData.data;

    const client = await clerkClient();
    await client.users.updateUser(pid, {
      firstName: patientData.first_name,
      lastName: patientData.last_name,
    });

    await db.patient.update({
      data: {
        ...patientData,
      },
      where: { id: pid },
    });

    return {
      success: true,
      error: false,
      msg: "Información del paciente actualizada exitosamente",
    };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, msg: error?.message };
  }
}
export async function createNewPatient(data: any, pid: string) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        msg: "Proporcione todos los campos obligatorios",
      };
    }

    const patientData = validateData.data;
    let patient_id = pid;

    const client = await clerkClient();
    if (pid === "new-patient") {
      const user = await client.users.createUser({
        emailAddress: [patientData.email],
        password: patientData.phone,
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        publicMetadata: { role: "patient" },
      });

      patient_id = user?.id;
    } else {
      await client.users.updateUser(pid, {
        publicMetadata: { role: "patient" },
      });
    }

    await db.patient.create({
      data: {
        ...patientData,
        id: patient_id,
        privacy_consent: patientData.privacy_consent ?? false,
        service_consent: patientData.service_consent ?? false,
        medical_consent: patientData.medical_consent ?? false,
      },
    });

    return { success: true, error: false, msg: "Patient created successfully" };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: true, msg: error?.message };
  }
}

export async function createPatientFromForm(data: any) {
  try {
    const validateData = PatientFormSchema.safeParse(data);

    if (!validateData.success) {
      return {
        success: false,
        error: true,
        message: "Por favor proporcione todos los campos obligatorios",
      };
    }

    const patientData = validateData.data;

    const client = await clerkClient();

    if (!patientData.email || !patientData.phone) {
      return {
        success: false,
        error: true,
        message: "Se requieren correo electrónico y número de teléfono.",
      };
    }

    const password = `${patientData.phone}@123`; 

    try {
      const existingUser = await client.users.getUserList({
        emailAddress: [patientData.email],
      });

      if (existingUser.data.length > 0) {
        return {
          success: false,
          error: true,
          message: "Ya existe un usuario con este correo electrónico",
        };
      }
    } catch (error) {
      console.log("Error al verificar el usuario existente:", error);
    }

    const user = await client.users.createUser({
      emailAddress: [patientData.email],
      password: password,
      firstName: patientData.first_name,
      lastName: patientData.last_name,
      publicMetadata: { role: "patient" },
    });

    await db.patient.create({
      data: {
        ...patientData,
        id: user.id,
        privacy_consent: patientData.privacy_consent ?? false,
        service_consent: patientData.service_consent ?? false,
        medical_consent: patientData.medical_consent ?? false,
      },
    });

    return {
      success: true,
      error: false,
      message: "Paciente creado con éxito",
    };
  } catch (error: any) {
    console.log("Detalles del error del empleado:", error);

    if (error && typeof error === "object" && "errors" in error) {
      console.log("Validation errors:", error.errors);

      if (Array.isArray(error.errors)) {
        for (const err of error.errors) {
          // Handle password validation errors
          if (err.code === "violación_de_la_política_de_contraseñas_del_formulario") {
            return {
              error: true,
              success: false,
              message: "La contraseña debe cumplir con los requisitos de seguridad",
            };
          }

          if (err.code === "el_identificador_de_formulario_existe") {
            return {
              error: true,
              success: false,
              message: "Ya existe un usuario con este correo electrónico",
            };
          }

          if (err.code === "identificador_de_formulario_no_válido") {
            return {
              error: true,
              success: false,
              message: "Por favor, introduce una dirección de correo electrónico válida",
            };
          }

          if (
            err.code === "parámetro_de_formulario_no_válido" &&
            err.meta?.paramName === "firstName"
          ) {
            return {
              error: true,
              success: false,
              message:
                "El nombre es obligatorio y debe tener al menos 2 caracteres.",
            };
          }

          if (
            err.code === "parámetro_de_formulario_no_válido" &&
            err.meta?.paramName === "lastName"
          ) {
            return {
              error: true,
              success: false,
              message:
                "El apellido es obligatorio y debe tener al menos 2 caracteres.",
            };
          }
        }

        if (error.errors.length > 0) {
          return {
            error: true,
            success: false,
            message: error.errors[0].message || "Validation error occurred",
          };
        }
      }
    }

    return {
      success: false,
      error: true,
      message: error?.message || "algo salió mal",
    };
  }
}