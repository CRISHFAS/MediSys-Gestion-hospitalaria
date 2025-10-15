"use server";

import {
  ReviewFormValues,
  reviewSchema,
} from "@/components/dialogs/review-form";
import db from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export async function deleteDataById(
  id: string,

  deleteType: "doctor" | "staff" | "patient" | "payment" | "bill"
) {
  let dbDeleteSuccess = false;
  try {
    switch (deleteType) {
      case "doctor":
        await db.doctor.delete({ where: { id: id } });
        dbDeleteSuccess = true;
        break;
      case "staff":
        await db.staff.delete({ where: { id: id } });
        break;
      case "patient":
        await db.patient.delete({ where: { id: id } });
        break;
      case "payment":
        await db.payment.delete({ where: { id: Number(id) } });
        break;
    }

    if (
      deleteType === "staff" ||
      deleteType === "patient" ||
      deleteType === "doctor"
    ) {
      try {
        const client = await clerkClient();
        await client.users.deleteUser(id);
      } catch (clerkError) {
        console.log("Error de eliminación de usuario de Clerk:", clerkError);
      }
    }

    return {
      success: true,
      message: "Datos eliminados exitosamente",
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error Interno del Servidor",
      status: 500,
    };
  }
}

export async function createReview(values: ReviewFormValues) {
  try {
    const validatedFields = reviewSchema.parse(values);

    await db.rating.create({
      data: {
        ...validatedFields,
      },
    });

    return {
      success: true,
      message: "Revisión creada exitosamente",
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Error Interno del Servidor",
      status: 500,
    };
  }
}