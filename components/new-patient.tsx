"use client";

import { useUser } from "@clerk/nextjs";
import { Patient } from "@prisma/client";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Form } from "./ui/form";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PatientCreateSchema,
  PatientFormSchema,
  PatientUpdateSchema,
} from "@/lib/schema";
import { z } from "zod";
import { CustomInput } from "./custom-input";
import { GENDER, MARITAL_STATUS, RELATION } from "@/lib";
import { Button } from "./ui/button";
import { createNewPatient, updatePatient } from "@/app/actions/patient";
import { toast } from "sonner";

interface DataProps {
  data?: Patient;
  type: "create" | "update";
}
export const NewPatient = ({ data, type }: DataProps) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [imgURL, setImgURL] = useState<any>();
  const router = useRouter();

  const userData = {
    first_name: user?.firstName || "",
    last_name: user?.lastName || "",
    email: user?.emailAddresses[0].emailAddress || "",
    phone: user?.phoneNumbers?.toString() || "",
  };

  const userId = user?.id;

  const form = useForm<z.infer<typeof PatientFormSchema>>({
    resolver: zodResolver(
      type === "create" ? PatientCreateSchema : PatientUpdateSchema
    ),
    defaultValues: {
      ...userData,
      address: "",
      date_of_birth: new Date(),
      gender: "MALE",
      marital_status: "single",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "mother",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      insurance_number: "",
      insurance_provider: "",
      medical_history: "",
      img: "",
      ...(type === "create" && {
        privacy_consent: false,
        service_consent: false,
        medical_consent: false,
      }),
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PatientFormSchema>> = async (
    values
  ) => {
    setLoading(true);

    const res =
      type === "create"
        ? await createNewPatient(values, userId!)
        : await updatePatient(values, userId!);

    setLoading(false);

    if (res?.success) {
      toast.success(res.msg);
      form.reset();
      router.push("/patient");
    } else {
      console.log(res);
      toast.error("No se pudo crear el paciente");
    }
  };
  useEffect(() => {
    if (type === "create") {
      userData && form.reset({ ...userData });
    } else if (type === "update") {
      data &&
        form.reset({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          date_of_birth: new Date(data.date_of_birth),
          gender: data.gender,
          marital_status: data.marital_status as
            | "married"
            | "single"
            | "divorced"
            | "widowed"
            | "separated",
          address: data.address,
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_number: data.emergency_contact_number,
          relation: data.relation as
            | "mother"
            | "father"
            | "husband"
            | "wife"
            | "other",
          blood_group: data?.blood_group!,
          allergies: data?.allergies! || "",
          medical_conditions: data?.medical_conditions! || "",
          medical_history: data?.medical_history! || "",
          insurance_number: data.insurance_number! || "",
          insurance_provider: data.insurance_provider! || "",
          medical_consent: data.medical_consent,
          privacy_consent: data.privacy_consent,
          service_consent: data.service_consent,
        });
    }
  }, [user]);

  return (
    <Card className="max-w-6xl w-full p-4 ">
      <CardHeader>
        <CardTitle>Registro de pacientes</CardTitle>
        <CardDescription>
          Proporcione toda la información a continuación para ayudarnos a comprender mejor y brindarle un servicio bueno y de calidad.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-5"
          >
            <h3 className="text-lg font-semibold">Información Personal</h3>
            <>
              {/* PROFILE IMAGE */}

              {/* <ImageUploader
          
              /> */}
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="first_name"
                  placeholder="Juan"
                  label="Primer Nombre"
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="last_name"
                  placeholder="Pablo"
                  label="Segundo Nombre"
                />
              </div>
              <CustomInput
                type="input"
                control={form.control}
                name="email"
                placeholder="juan@example.com"
                label="Dirección de correo electrónico"
              />
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="select"
                  control={form.control}
                  name="gender"
                  placeholder="Select gender"
                  label="Género"
                  selectList={GENDER!}
                />
                <CustomInput
                  type="input"
                  control={form.control}
                  name="date_of_birth"
                  placeholder="01-05-2000"
                  label="Fecha de nacimiento"
                  inputType="date"
                />
              </div>
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-x-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="phone"
                  placeholder="9225600735"
                  label="Número de teléfono"
                />
                <CustomInput
                  type="select"
                  control={form.control}
                  name="marital_status"
                  placeholder="Seleccione estado civil"
                  label="Estado civil"
                  selectList={MARITAL_STATUS!}
                />
              </div>
              <CustomInput
                type="input"
                control={form.control}
                name="address"
                placeholder="Calle 1479, Ps"
                label="Dirección"
              />
            </>

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Información familiar</h3>
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_name"
                placeholder="Ana Smith"
                label="Nombre del contacto de emergencia"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_number"
                placeholder="675444467"
                label="Contacto de emergencia"
              />
              <CustomInput
                type="select"
                control={form.control}
                name="relation"
                placeholder="Select relation with contact person"
                label="Relación"
                selectList={RELATION}
              />
            </div>

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Información Personal</h3>

              <CustomInput
                type="input"
                control={form.control}
                name="blood_group"
                placeholder="A+"
                label="Grupo sanguíneo"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="allergies"
                placeholder="Milk"
                label="Alergias"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_conditions"
                placeholder="Medical conditions"
                label="Condiciones médicas"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_history"
                placeholder="Historia médica"
                label="Historia médica"
              />
              <div className="flex flex-col lg:flex-row  gap-y-6 items-center gap-2 md:gap-4">
                <CustomInput
                  type="input"
                  control={form.control}
                  name="insurance_provider"
                  placeholder="Proveedor de seguros"
                  label="Proveedor de seguros"
                />{" "}
                <CustomInput
                  type="input"
                  control={form.control}
                  name="insurance_number"
                  placeholder="Número de seguro"
                  label="Número de seguro"
                />
              </div>
            </div>

            {type !== "update" && (
              <div className="">
                <h3 className="text-lg font-semibold mb-2">Consentimiento</h3>

                <div className="space-y-6">
                  <CustomInput
                    name="privacy_consent"
                    label="Acuerdo de política de privacidad"
                    placeholder="Doy mi consentimiento para la recopilación, el almacenamiento y el uso de mi información personal y de salud según lo descrito en la Política de Privacidad. Entiendo cómo se utilizarán mis datos, con quién se podrán compartir y mis derechos de acceso, corrección y eliminación de mis datos."
                    type="checkbox"
                    control={form.control}
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="service_consent"
                    label="Acuerdo de términos de servicio"
                    placeholder="Acepto los Términos de Servicio, incluidas mis responsabilidades como usuario de este sistema de gestión de atención médica, las limitaciones de responsabilidad y el proceso de resolución de disputas. Entiendo que el uso continuo de este servicio depende de mi cumplimiento de estos términos."
                  />

                  <CustomInput
                    control={form.control}
                    type="checkbox"
                    name="medical_consent"
                    label="Consentimiento informado para el tratamiento médico"
                    placeholder="Doy mi consentimiento informado para recibir tratamiento médico y servicios a través de este sistema de gestión de atención médica. Reconozco que he sido informado sobre la naturaleza, los riesgos, los beneficios y las alternativas de los tratamientos propuestos y que tengo derecho a hacer preguntas y a recibir más información antes de continuar."
                  />
                </div>
              </div>
            )}

            <Button
              disabled={loading}
              type="submit"
              className="w-full md:w-fit px-6"
            >
              {type === "create" ? "Submit" : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};