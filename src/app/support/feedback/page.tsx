"use client";

import { useAppState } from "@/context/AppStateContext";
import { Page } from "@/components/ui";
import { Notice, RequestForm } from "@/components/RequestForm";

export default function FeedbackPage() {
  const { state } = useAppState();
  return (
    <Page title="Санал хүсэлт">
      <RequestForm
        kind="Аппын санал хүсэлт"
        logHistory={false}
        titleFrom={(v) => `Санал: ${v.topic}`}
        notice={<Notice>Civic MGL-ийг сайжруулах санал, алдааны мэдээллээ бидэнд илгээнэ үү. Таны санал бүр бидэнд чухал.</Notice>}
        fields={[
          { name: "topic", label: "Сэдэв", type: "select", options: ["Шинэ санаа", "Алдаа мэдээлэх", "Үйлчилгээний чанар", "Бусад"], required: true },
          { name: "rating", label: "Үнэлгээ", type: "select", options: ["★★★★★ Маш сайн", "★★★★ Сайн", "★★★ Дунд", "★★ Муу", "★ Маш муу"] },
          { name: "email", label: "Хариу авах и-мэйл", type: "email", defaultValue: state.sampleUser.email },
          { name: "message", label: "Санал хүсэлт", type: "textarea", required: true },
          { name: "file", label: "Дэлгэцийн зураг", type: "file" },
        ]}
      />
    </Page>
  );
}
