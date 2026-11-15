"use client";

import { useAppState } from "@/context/AppStateContext";
import { Page } from "@/components/ui";
import { Notice, RequestForm } from "@/components/RequestForm";
import { SampleQr, SampleWatermark } from "@/components/Sample";
import { dateKey } from "@/lib/utils";

const CITIES = ["Улаанбаатар", "Дархан", "Эрдэнэт", "Чойр", "Сайншанд", "Замын-Үүд", "Сүхбаатар", "Хархорин"];

export default function TransitTicketsPage() {
  const { state } = useAppState();
  const u = state.sampleUser;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <Page title="Нийтийн тээврийн тасалбар">
      <RequestForm
        kind="Тээврийн тасалбар"
        logPetition={false}
        submitLabel="Тасалбар захиалах (демо)"
        resultTitle="Тасалбар захиалагдлаа"
        titleFrom={(v) => `Тасалбар: ${v.from} → ${v.to}`}
        notice={<Notice title="Анхааруулга">Хот хоорондын автобус, галт тэрэгний суудал захиалах демо. Бодит төлбөр, тасалбар үүсэхгүй.</Notice>}
        fields={[
          { name: "mode", label: "Тээврийн төрөл", type: "select", options: ["Хот хоорондын автобус", "Галт тэрэг"], required: true },
          { name: "from", label: "Хаанаас", type: "select", options: CITIES, required: true },
          { name: "to", label: "Хаашаа", type: "select", options: CITIES.slice(1), required: true },
          { name: "date", label: "Явах огноо", type: "date", defaultValue: dateKey(tomorrow), required: true },
          { name: "time", label: "Цаг", type: "select", options: ["08:00", "11:30", "15:00", "19:45"] },
          { name: "passengers", label: "Зорчигчийн тоо", type: "number", defaultValue: "1", required: true },
          { name: "name", label: "Зорчигч", readOnly: true, defaultValue: `${u.lastName} ${u.firstName}` },
        ]}
        renderResult={(v, ref) => (
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-dashed border-brand/50 bg-white p-4 text-left text-[#1B2433]">
            <SampleWatermark />
            <p className="text-[12px] font-bold uppercase tracking-wider text-slate-500">{v.mode}</p>
            <p className="mt-1 text-[20px] font-black">
              {v.from} → {v.to}
            </p>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-[13px]">
                <p>Огноо: <b>{v.date} {v.time}</b></p>
                <p>Зорчигч: <b>{v.passengers}</b></p>
                <p>Суудал: <b>{(ref.charCodeAt(ref.length - 1) % 40) + 1}</b></p>
              </div>
              <SampleQr seed={ref} className="size-20" />
            </div>
          </div>
        )}
      />
    </Page>
  );
}
