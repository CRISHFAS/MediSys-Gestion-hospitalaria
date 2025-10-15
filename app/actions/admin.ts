"use server";
import db from "@/lib/db";
import { DoctorSchema, WorkingDaysSchema, StaffSchema } from "@/lib/schema";
import { createClerkUser, validatePassword } from "@/lib/clerk-utils";

export async function createNewDoctor(data: any) {
  try {
    const values = DoctorSchema.safeParse(data);

    const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

    if (!values.success || !workingDaysValues.success) {
      return {
        success: false,
        errors: true,
        message: "Proporcione toda la información requerida",
      };
    }

    const validatedValues = values.data;
    const workingDayData = workingDaysValues.data!;

    
    const nameParts = validatedValues.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!validatedValues.email || !validatedValues.password) {
      return {
        success: false,
        error: true,
        message: "Email and password are required",
      };
    }

    const passwordValidation = validatePassword(validatedValues.password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: true,
        message: passwordValidation.message,
      };
    }

    const clerkResult = await createClerkUser({
      email: validatedValues.email,
      password: validatedValues.password,
      firstName,
      lastName,
      role: "doctor",
    });

    if (!clerkResult.success) {
      return {
        success: false,
        error: true,
        message: clerkResult.message,
      };
    }

    const user = clerkResult.user;

    if (!user) {
      return {
        success: false,
        error: true,
        message: "No se pudo crear la cuenta de usuario",
      };
    }

    const { password, ...doctorData } = validatedValues;

    const doctor = await db.doctor.create({
      data: {
        ...doctorData,
        id: user.id,
      },
    });

    await Promise.all(
      workingDayData?.map((el) =>
        db.workingDays.create({
          data: { ...el, doctor_id: doctor.id },
        })
      )
    );

    return {
      success: true,
      message: "Doctor agregado con éxito",
      error: false,
    };
  } catch (error) {
    console.error("Error al crear doctor:", error);
    return { error: true, success: false, message: "No se pudo crear el doctor" };
  }
}

export async function createNewStaff(data: any) {
  try {
    const values = StaffSchema.safeParse(data);

    if (!values.success) {
      return {
        success: false,
        errors: true,
        message: "Proporcione toda la información requerida",
      };
    }

    const validatedValues = values.data;

    
    const nameParts = validatedValues.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    if (!validatedValues.email || !validatedValues.password) {
      return {
        success: false,
        error: true,
        message: "Se requieren correo electrónico y contraseña",
      };
    }

    const passwordValidation = validatePassword(validatedValues.password);
    if (!passwordValidation.valid) {
      return {
        success: false,
        error: true,
        message: passwordValidation.message,
      };
    }

    const clerkResult = await createClerkUser({
      email: validatedValues.email,
      password: validatedValues.password,
      firstName,
      lastName,
      role: "staff",
    });

    if (!clerkResult.success) {
      return {
        success: false,
        error: true,
        message: clerkResult.message,
      };
    }

    const user = clerkResult.user;

    if (!user) {
      return {
        success: false,
        error: true,
        message: "No se pudo crear la cuenta de usuario",
      };
    }

    const { password, ...staffData } = validatedValues;

    const staff = await db.staff.create({
      data: {
        ...staffData,
        id: user.id,
      },
    });

    return {
      success: true,
      message: "Personal agregado con éxito",
      error: false,
    };
  } catch (error) {
    console.error("Error al crear personal:", error);
    return { error: true, success: false, message: "No se pudo crear personal" };
  }
}