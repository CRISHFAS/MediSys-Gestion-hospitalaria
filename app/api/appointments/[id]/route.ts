import { NextRequest, NextResponse } from "next/server";
import { getAppointmentById } from "@/utils/services/appointment";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getAppointmentById(parseInt(id));

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 404 });
    }
  } catch (error) {
    console.error("Error de API de citas:", error);
    return NextResponse.json(
      { success: false, message: "Error Interno del Servidor" },
      { status: 500 }
    );
  }
}