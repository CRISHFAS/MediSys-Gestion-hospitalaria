import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "@/utils/roles";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const medicalRecordId = parseInt(id);

    let clinicalNotes;
    try {
      clinicalNotes = await db.$queryRaw`
        SELECT 
          cnv.id,
          cnv.notes,
          cnv.version_number,
          cnv.change_reason,
          cnv.is_current,
          cnv.created_at,
          d.name as doctor_name,
          d.specialization as doctor_specialization
        FROM "ClinicalNotesVersion" cnv
        LEFT JOIN "Doctor" d ON cnv.doctor_id = d.id
        WHERE cnv.medical_record_id = ${medicalRecordId}
        ORDER BY cnv.version_number DESC
      `;
    } catch (error) {
      console.log(
        "ClinicalNotesVersion table not found, returning empty array"
      );
      clinicalNotes = [];
    }

    return NextResponse.json({
      success: true,
      data: clinicalNotes,
    });
  } catch (error) {
    console.error("Error al obtener notas clínicas:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener las notas clínicas" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isDoctor = await checkRole("DOCTOR");
    if (!isDoctor) {
      return NextResponse.json(
        { error: "Sólo los médicos pueden editar notas clínicas" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const medicalRecordId = parseInt(id);
    const { notes, change_reason } = await request.json();

    if (!notes) {
      return NextResponse.json(
        { error: "Se requieren notas" },
        { status: 400 }
      );
    }

    const medicalRecord = await db.medicalRecords.findUnique({
      where: { id: medicalRecordId },
      select: { doctor_id: true },
    });

    if (!medicalRecord) {
      return NextResponse.json(
        { error: "Historial médico no encontrado" },
        { status: 404 }
      );
    }

    let latestVersionResult: any[] = [];
    try {
      latestVersionResult = (await db.$queryRaw`
        SELECT version_number 
        FROM "ClinicalNotesVersion" 
        WHERE medical_record_id = ${medicalRecordId}
        ORDER BY version_number DESC 
        LIMIT 1
      `) as any[];
    } catch (error) {
      console.log(
        "ClinicalNotesVersion table not found, starting with version 1"
      );
      latestVersionResult = [];
    }

    const latestVersion = latestVersionResult[0] as
      | { version_number: number }
      | undefined;
    const newVersionNumber = (latestVersion?.version_number || 0) + 1;

    try {
      await db.$executeRaw`
        UPDATE "ClinicalNotesVersion" 
        SET is_current = false 
        WHERE medical_record_id = ${medicalRecordId}
      `;
    } catch (error) {
      console.log("No existen versiones para actualizar");
    }

    let newVersionResult: any[] = [];
    try {
      newVersionResult = (await db.$queryRaw`
        INSERT INTO "ClinicalNotesVersion" (
          medical_record_id, 
          doctor_id, 
          notes, 
          version_number, 
          change_reason, 
          is_current, 
          created_at, 
          updated_at
        ) VALUES (
          ${medicalRecordId}, 
          ${medicalRecord.doctor_id}, 
          ${notes}, 
          ${newVersionNumber}, 
          ${change_reason || null}, 
          true, 
          NOW(), 
          NOW()
        ) RETURNING *
      `) as any[];
    } catch (error) {
      console.error("No se pudo crear la versión de notas clínicas:", error);
      return NextResponse.json(
        {
          error:
            "No se pudo crear la versión de notas clínicas - es posible que la tabla no exista",
        },
        { status: 500 }
      );
    }

    const newVersion = newVersionResult[0] as any;

    await db.medicalRecords.update({
      where: { id: medicalRecordId },
      data: { notes },
    });

    return NextResponse.json({
      success: true,
      data: newVersion,
    });
  } catch (error) {
    console.error("Error al crear la versión de notas clínicas:", error);
    return NextResponse.json(
      { error: "No se pudo crear la versión de notas clínicas" },
      { status: 500 }
    );
  }
}