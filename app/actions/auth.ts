"use server";

import { getCurrentUser } from "@/lib/clerk-utils";
import db from "@/lib/db";

export async function syncUserWithDatabase() {
  try {
    const userResult = await getCurrentUser();

    if (!userResult.success) {
      return userResult;
    }

    const { user } = userResult;
    
    if (!user) {
      return { success: false, message: "Datos de usuario no encontrado" };
    }
    
    const userRole = user.role;

    if (!userRole) {
      return { success: false, message: "Rol de usuario no encontrado" };
    }

    let existingUser = null;

    switch (userRole) {
      case "doctor":
        existingUser = await db.doctor.findUnique({
          where: { id: user.id },
        });
        break;
      case "patient":
        existingUser = await db.patient.findUnique({
          where: { id: user.id },
        });
        break;
      case "staff":
        existingUser = await db.staff.findUnique({
          where: { id: user.id },
        });
        break;
      default:
        return { success: false, message: "Rol de usuario no válido" };
    }

    if (existingUser) {
      return { success: true, message: "El usuario ya existe en la base de datos." };
    }

    switch (userRole) {
      case "doctor":
        await db.doctor.create({
          data: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email || "",
            phone: "", 
            specialization: "", 
            address: "", 
            type: "FULL",
            department: "", 
            license_number: "", 
            colorCode: `#${Math.floor(Math.random() * 16777215).toString(16)}`, 
          },
        });
        break;
      case "patient":
        await db.patient.create({
          data: {
            id: user.id,
            first_name: user.firstName || "",
            last_name: user.lastName || "",
            email: user.email || "",
            phone: "", 
            address: "", 
            date_of_birth: new Date(), 
            gender: "MALE", 
            marital_status: "single", 
            emergency_contact_name: "", 
            emergency_contact_number: "", 
            relation: "other", 
            colorCode: `#${Math.floor(Math.random() * 16777215).toString(16)}`, 
            privacy_consent: false,
            service_consent: false,
            medical_consent: false,
          },
        });
        break;
      case "staff":
        await db.staff.create({
          data: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email || "",
            phone: "", 
            address: "", 
            role: "NURSE", 
            department: "", 
            license_number: "", 
            colorCode: `#${Math.floor(Math.random() * 16777215).toString(16)}`, 
          },
        });
        break;
    }

    return { success: true, message: "El usuario se sincronizó con la base de datos correctamente" };
  } catch (error) {
    console.error("Error al sincronizar el usuario con la base de datos:", error);
    return { success: false, message: "No se pudo sincronizar el usuario con la base de datos" };
  }
}