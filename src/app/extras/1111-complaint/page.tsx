"use client";

import { useAppState } from "@/context/AppStateContext";
import { Page } from "@/components/ui";
import { Notice, RequestForm } from "@/components/RequestForm";

export default function ComplaintPage() {
  const { state } = useAppState();
  const u = state.sampleUser;
  return (
    <Page title="11-11 төвд өргөдөл, гомдол илгээх">
      <RequestForm
        kind="11-11 өргөдөл, гомдол"
        titleFrom={(v) => v.type}
        notice={
          <Notice>
            Иргэн та зөвхөн Засгийн газрын харьяа байгууллагуудтай холбоотой өргөдөл, гомдол, санал хүсэлтийг эндээс илгээх боломжтой.
            Өргөдөл, гомдлын шийдвэрлэлтийн явцын мэдээллийг Профайл → Өргөдөл, гомдол цэсээс харна уу. (Демо)
          </Notice>
        }
        fields={[
          { name: "type", label: "Хүсэлтийн төрөл", type: "select", options: ["11-11 төвд өргөдөл, гомдол илгээх", "Санал хүсэлт", "Талархал", "Шүүмжлэл"], required: true },
          { name: "lastName", label: "Овог", readOnly: true, defaultValue: u.lastName, required: true },
          { name: "firstName", label: "Нэр", readOnly: true, defaultValue: u.firstName.toUpperCase(), required: true },
          { name: "reg", label: "Регистрийн дугаар (демо)", readOnly: true, defaultValue: u.sampleReg, required: true },
          { name: "email", label: "Цахим шуудан", type: "email", defaultValue: u.email, required: true },
          { name: "phone", label: "Утасны дугаар", type: "tel", defaultValue: u.phone, required: true },
          { name: "org", label: "Холбогдох байгууллага", type: "select", options: ["Сонгоогүй", "Нийслэлийн Засаг даргын тамгын газар", "Эрүүл мэндийн байгууллага", "Боловсролын байгууллага", "Нийгмийн хамгааллын байгууллага"] },
          { name: "content", label: "Өргөдөл, гомдлын агуулга", type: "textarea", required: true, placeholder: "Асуудлаа дэлгэрэнгүй бичнэ үү" },
          { name: "file", label: "Хавсралт", type: "file" },
        ]}
      />
    </Page>
  );
}
