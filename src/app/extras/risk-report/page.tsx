"use client";

import { useAppState } from "@/context/AppStateContext";
import { Page } from "@/components/ui";
import { Notice, RequestForm } from "@/components/RequestForm";

export default function RiskReportPage() {
  const { state } = useAppState();
  const u = state.sampleUser;
  return (
    <Page title="Эрсдэл мэдэгдэх">
      <div className="mb-4 rounded-card bg-gradient-to-br from-sky-100 to-indigo-200 p-4 text-[#0B2265]">
        <p className="text-[20px] font-black">ЭРСДЭЛ МЭДЭГДЭХ</p>
        <p className="mt-1 text-[13px] font-medium">Амь нас, эрүүл мэндэд шууд аюултай бол 101, 102, 103 руу нэн даруй залгана уу.</p>
      </div>
      <RequestForm
        kind="Эрсдэлийн мэдэгдэл"
        titleFrom={(v) => `Эрсдэл: ${v.riskType}`}
        notice={<Notice>Таны орчинд илэрсэн эрсдэлтэй нөхцөл байдлыг байршил, зурагтай нь мэдээлнэ үү. Мэдээлэл холбогдох байгууллагад шилжинэ (демо).</Notice>}
        fields={[
          { name: "riskType", label: "Эрсдэлийн төрөл", type: "select", options: ["Зам, гүүрийн эвдрэл", "Задгай худаг, нүх", "Галын аюул", "Үер, усны аюул", "Хүүхдийн тоглоомын талбайн эрсдэл", "Бусад"], required: true },
          { name: "district", label: "Дүүрэг / аймаг", type: "select", options: ["Сүхбаатар", "Чингэлтэй", "Баянгол", "Баянзүрх", "Хан-Уул", "Сонгинохайрхан", "Дархан-Уул", "Орхон"], required: true },
          { name: "location", label: "Тодорхой байршил", required: true, placeholder: "Хороо, гудамж, тэмдэгт газар" },
          { name: "description", label: "Тайлбар", type: "textarea", required: true },
          { name: "photo", label: "Зураг", type: "file" },
          { name: "phone", label: "Холбоо барих утас", type: "tel", defaultValue: u.phone, required: true },
        ]}
      />
    </Page>
  );
}
