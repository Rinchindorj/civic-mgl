"use client";

import { useAppState } from "@/context/AppStateContext";
import { Page } from "@/components/ui";
import { Notice, RequestForm } from "@/components/RequestForm";

export default function IaacReportPage() {
  const { state } = useAppState();
  const u = state.sampleUser;
  return (
    <Page title="АТГ-т хандах">
      <RequestForm
        kind="АТГ-т хандсан мэдээлэл"
        titleFrom={(v) => `АТГ: ${v.category}`}
        notice={
          <Notice>
            Авлига, ашиг сонирхлын зөрчлийн талаарх мэдээллийг нууцлалтайгаар илгээнэ. Нэрээ нууцлах сонголт хийвэл таны мэдээлэл
            хүлээн авагчид харагдахгүй. (Демо орчин — мэдээлэл хаашаа ч илгээгдэхгүй.)
          </Notice>
        }
        fields={[
          { name: "category", label: "Мэдээллийн төрөл", type: "select", options: ["Авлигын гэмт хэрэг", "Ашиг сонирхлын зөрчил", "Хөрөнгө орлогын мэдүүлэг", "Бусад"], required: true },
          { name: "anon", label: "Нэрээ нууцлах эсэх", type: "select", options: ["Үгүй, нэрээ нээлттэй илгээнэ", "Тийм, нэрээ нууцална"] },
          { name: "name", label: "Овог нэр", readOnly: true, defaultValue: `${u.lastName} ${u.firstName}` },
          { name: "phone", label: "Холбоо барих утас", type: "tel", defaultValue: u.phone, required: true },
          { name: "org", label: "Холбогдох байгууллага, албан тушаалтан", required: true, placeholder: "Байгууллагын нэр" },
          { name: "date", label: "Үйл явдал болсон огноо", type: "date" },
          { name: "description", label: "Дэлгэрэнгүй мэдээлэл", type: "textarea", required: true },
          { name: "file", label: "Нотлох баримт", type: "file" },
        ]}
      />
    </Page>
  );
}
