/* Seed content for the demo. Everything here is fictional sample data. */

export type NotificationType = "general" | "invoice" | "resolution";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  date: string; // YYYY-MM-DD HH:mm
  title: string;
  body: string;
  read: boolean;
}

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "general",
    date: "2026-11-13 14:42",
    title: "Дохио!!! Цаг агаарын аюултай үзэгдлээс сэрэмжлүүлэх мэдээ:",
    body: "13-14-нд шилжих шөнө Сэлэнгийн өмнөд, Төв, Хэнтийн хойд хэсгээр их цас орно. Зорчигчид болон малчдыг урьдчилан сэргийлэх арга хэмжээ авахыг анхааруулж байна.",
    read: false,
  },
  {
    id: "n2",
    type: "general",
    date: "2026-11-13 09:45",
    title: "УЛСЫН ИХ ХУРАЛ",
    body: 'Улсын Их Хурлын гишүүдийн өргөн мэдүүлсэн "ЭРҮҮЛ МЭНДИЙН ТУХАЙ" хуулийн төсөл болон хамт өргөн мэдүүлсэн бусад төслийг хэлэлцүүлэгт оруулж байна. Нээлттэй Парламент хэсгээс санал өгнө үү.',
    read: false,
  },
  {
    id: "n3",
    type: "general",
    date: "2026-11-12 14:55",
    title: "Дохио!!! Цаг агаарын аюултай үзэгдлээс сэрэмжлүүлэх мэдээ:",
    body: "12-13-нд шилжих шөнө Завханы нутаг, Увсын өмнөд болон зүүн, Хөвсгөлийн өмнөд хэсгээр, 13-ны өдөр Архангай, Булган, Орхон аймгуудаар цас орж, цасан шуурга шуурна.",
    read: false,
  },
  {
    id: "n4",
    type: "general",
    date: "2026-11-12 10:22",
    title: "УЛСЫН ИХ ХУРАЛ",
    body: 'Улсын Их Хурлын гишүүдийн өргөн мэдүүлсэн "ТАРИАЛАНГИЙН ИНДЕКСЖҮҮЛСЭН ДААТГАЛЫН ТУХАЙ" хуулийн төслийн талаар санал авч байна.',
    read: true,
  },
  {
    id: "n5",
    type: "invoice",
    date: "2026-08-13 16:43",
    title: "Үйлчилгээний төлбөр",
    body: "Таны SMP260813160830 дугаартай үйлчилгээний төлбөр төлөлт амжилттай боллоо. (ЗАГВАР)",
    read: true,
  },
  {
    id: "n6",
    type: "invoice",
    date: "2026-05-07 23:06",
    title: "Үйлчилгээний төлбөр",
    body: "Таны SMP260507230076 дугаартай үйлчилгээний төлбөр төлөлт амжилттай боллоо. (ЗАГВАР)",
    read: true,
  },
  {
    id: "n7",
    type: "invoice",
    date: "2026-04-16 00:37",
    title: "Үйлчилгээний төлбөр",
    body: "Таны SMP-2604-069372 дугаартай үйлчилгээний төлбөр төлөлт амжилттай боллоо. (ЗАГВАР)",
    read: true,
  },
  {
    id: "n8",
    type: "resolution",
    date: "2026-11-01 09:12",
    title: "Хүсэлт шийдвэрлэгдлээ",
    body: "Таны “Жолоочийн лавлагаа, мэдээлэл” хүсэлт зөвшөөрөгдөж, лавлагаа Үйлчилгээний түүх хэсэгт хадгалагдлаа.",
    read: false,
  },
  {
    id: "n9",
    type: "resolution",
    date: "2026-08-14 11:30",
    title: "Өргөдөл хүлээн авлаа",
    body: "Таны 11-11 төвд илгээсэн өргөдлийг хүлээн авч, холбогдох байгууллагад шилжүүллээ. (ЗАГВАР)",
    read: true,
  },
];

export type HistoryStatus = "Зөвшөөрсөн" | "Илгээсэн" | "Хянагдаж буй" | "Татгалзсан";

export interface HistoryItem {
  id: string;
  ref: string;
  date: string; // YYYY/MM/DD HH:mm
  title: string;
  status: HistoryStatus;
  serviceSlug?: string;
  kind?: "service" | "petition" | "ticket" | "booking";
  details?: Record<string, string>;
}

export const SEED_HISTORY: HistoryItem[] = [
  { id: "h1", ref: "SMP-261114-172045", date: "2026/11/14 17:20", title: "Иргэний үнэмлэхийн лавлагаа", status: "Зөвшөөрсөн", serviceSlug: "citizen-id-reference", kind: "service" },
  { id: "h2", ref: "SMP-261101-090933", date: "2026/11/01 09:09", title: "Жолоочийн лавлагаа, мэдээлэл", status: "Зөвшөөрсөн", serviceSlug: "driver-reference", kind: "service" },
  { id: "h3", ref: "SMP-260813-164311", date: "2026/08/13 16:43", title: "Зөрчлийн торгуулийн төлбөр төлөх (2026.01.10-с хойш)", status: "Илгээсэн", serviceSlug: "traffic-fine-payment", kind: "service" },
  { id: "h4", ref: "SMP-260807-170652", date: "2026/08/07 17:06", title: "Жолоочийн лавлагаа, мэдээлэл", status: "Зөвшөөрсөн", serviceSlug: "driver-reference", kind: "service" },
  { id: "h5", ref: "SMP-260805-091818", date: "2026/08/05 09:18", title: "Жолоочийн лавлагаа, мэдээлэл", status: "Зөвшөөрсөн", serviceSlug: "driver-reference", kind: "service" },
];

export interface MailItem {
  id: string;
  from: string;
  to?: string;
  date: string;
  subject: string;
  body: string;
  read: boolean;
  sent?: boolean;
}

export const SEED_MAIL: MailItem[] = [
  { id: "m1", from: "<noreply@civicmgl.mn>", date: "2026-11-06 20:53:49", subject: "Мэдэгдэл", body: "Таны цахим шуудангийн хайрцаг идэвхтэй байна. Энэ бол Civic MGL-ийн демо мэдэгдэл.", read: false },
  { id: "m2", from: "<noreply@civicmgl.mn>", date: "2026-08-10 11:45:11", subject: "Мэдэгдэл", body: "Таны захиалсан лавлагаа бэлэн боллоо. Профайл → Үйлчилгээний түүх хэсгээс харна уу.", read: false },
  { id: "m3", from: "<noreply@civicmgl.mn>", date: "2026-08-07 17:08:58", subject: "Мэдэгдэл", body: "Таны жолоочийн лавлагаа амжилттай үүслээ (ЗАГВАР).", read: true },
  { id: "m4", from: "<noreply@civicmgl.mn>", date: "2026-08-05 01:04:39", subject: "Мэдэгдэл", body: "Системийн шинэчлэлтийн мэдэгдэл: v5.0.9 хувилбар нэвтэрлээ.", read: true },
  { id: "m5", from: "<noreply@civicmgl.mn>", date: "2026-08-02 17:03:58", subject: "Мэдэгдэл", body: "Таны төлбөрийн баримт хадгалагдлаа.", read: true },
  { id: "m6", from: "<noreply@civicmgl.mn>", date: "2026-07-26 08:12:40", subject: "Мэдэгдэл", body: "Тавтай морил! Civic MGL демо данс нээгдлээ.", read: true },
];

export interface Payment {
  id: string;
  date: string;
  title: string;
  desc: string;
  amount: number;
  status: "Төлөгдсөн" | "Хүлээгдэж буй";
}

export const SEED_PAYMENTS: Payment[] = [
  { id: "p1", date: "2026.08.13 16:42", title: "Үйлчилгээний төлбөр", desc: "SP_QPAY : Зөрчлийн торгуулийн төлбөр төлөх (2026.01.10-с хойш) үйлчилгээний төлбөр SMP260813160830", amount: 400000, status: "Төлөгдсөн" },
  { id: "p2", date: "2026.05.07 23:04", title: "Үйлчилгээний төлбөр", desc: "SP_QPAY : Цахим апостиль гэрчилгээ SMP260507230076", amount: 10000, status: "Төлөгдсөн" },
  { id: "p3", date: "2026.04.16 00:35", title: "Хэрэглээний төлбөр", desc: "Цахилгааны төлбөр (ЗАГВАР нэхэмжлэл)", amount: 48200, status: "Төлөгдсөн" },
];

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time?: string;
  type: "holiday" | "civic" | "personal";
}

/** Public holidays (month-day), repeated every year. */
export const HOLIDAYS: { md: string; title: string }[] = [
  { md: "01-01", title: "Шинэ жил" },
  { md: "03-08", title: "Олон улсын эмэгтэйчүүдийн өдөр" },
  { md: "06-01", title: "Эх үрсийн баяр" },
  { md: "07-11", title: "Үндэсний их баяр наадам" },
  { md: "07-12", title: "Үндэсний их баяр наадам" },
  { md: "07-13", title: "Үндэсний их баяр наадам" },
  { md: "07-14", title: "Үндэсний их баяр наадам" },
  { md: "07-15", title: "Үндэсний их баяр наадам" },
  { md: "11-26", title: "Тусгаар тогтнолын өдөр" },
  { md: "12-29", title: "Үндэсний эрх чөлөө, тусгаар тогтнолоо сэргээсний баярын өдөр" },
];

/** Recurring civic reminders (day of month). */
export const CIVIC_DAYS: { day: number; title: string }[] = [
  { day: 10, title: "НДШ төлөлтийн эцсийн хугацаа" },
  { day: 25, title: "Татварын тайлан илгээх сануулга" },
];

export interface CityWeather {
  id: string;
  name: string;
  tempOffset: number;
}

export const CITIES: CityWeather[] = [
  { id: "ub", name: "Улаанбаатар", tempOffset: 0 },
  { id: "darkhan", name: "Дархан-Уул", tempOffset: -2 },
  { id: "orkhon", name: "Орхон", tempOffset: -3 },
];

export const AQI_STATIONS = [
  { name: "Баруун 4 зам", offset: 8 },
  { name: "Нисэх", offset: -6 },
  { name: "Толгойт", offset: 14 },
  { name: "Зүүн 4 зам", offset: 3 },
  { name: "Баянхошуу", offset: 21 },
];

export interface Poll {
  id: string;
  title: string;
  org: string;
  deadline: string;
  options: string[];
}

export const POLLS: Poll[] = [
  { id: "poll1", title: "Нийтийн тээврийн цахим тасалбарын үйлчилгээнд та сэтгэл хангалуун байна уу?", org: "Civic MGL судалгаа", deadline: "2026-12-31", options: ["Маш их", "Дунд зэрэг", "Сэтгэл хангалуун бус"] },
  { id: "poll2", title: "Аль үйлчилгээг цахимжуулах нь хамгийн чухал вэ?", org: "Civic MGL судалгаа", deadline: "2026-12-15", options: ["Газрын харилцаа", "Эрүүл мэнд", "Боловсрол", "Нийгмийн халамж"] },
];

export const LAWYERS = [
  { id: "l1", name: "Д.Сарангэрэл (жишээ)", field: "Иргэний эрх зүй", exp: 12, rating: 4.9 },
  { id: "l2", name: "Б.Тэмүүлэн (жишээ)", field: "Хөдөлмөрийн эрх зүй", exp: 8, rating: 4.7 },
  { id: "l3", name: "Г.Номин (жишээ)", field: "Гэр бүлийн эрх зүй", exp: 15, rating: 4.8 },
  { id: "l4", name: "Э.Ганбат (жишээ)", field: "Эрүүгийн эрх зүй", exp: 10, rating: 4.6 },
];

export const JOB_PLATFORMS = [
  {
    id: "zangia",
    name: "Zangia.mn",
    desc: "Монголын хамгийн том ажлын байрны платформ. Олон салбарын ажлын байрны зар.",
    url: "https://www.zangia.mn",
    color: "#1D3F8F",
    jobs: [
      { title: "Програм хангамжийн инженер", company: "Демо Технологи ХХК", salary: "4,500,000₮+", place: "Улаанбаатар" },
      { title: "Нягтлан бодогч", company: "Жишээ Групп", salary: "2,800,000₮", place: "Улаанбаатар" },
      { title: "Борлуулалтын менежер", company: "Сорил Трейд", salary: "Тохиролцоно", place: "Дархан" },
    ],
  },
  {
    id: "worki",
    name: "Worki.mn",
    desc: "Монголын анхны сонгон шалгаруулалтын уламжлалт аргыг хялбарчилсан платформ.",
    url: "https://www.worki.mn",
    color: "#4B3F8F",
    jobs: [
      { title: "Харилцагч үйлчилгээний ажилтан", company: "Демо Банк", salary: "1,900,000₮", place: "Улаанбаатар" },
      { title: "Жолооч", company: "Хурд Логистик", salary: "2,200,000₮", place: "Улаанбаатар" },
      { title: "Дизайнер", company: "Креатив Студи", salary: "3,000,000₮", place: "Зайнаас" },
    ],
  },
];

export const HELP_TOPICS = [
  { q: "Civic MGL-д хэрхэн нэвтрэх вэ?", a: "Демо орчинд “Демо хэрэглэгчээр нэвтрэх” товчийг дарж нэвтэрнэ. Бодит нууц үг шаардлагагүй." },
  { q: "Лавлагаа хэрхэн авах вэ?", a: "Үйлчилгээ таб → хүссэн үйлчилгээгээ сонгоод “Үйлчилгээ авах” товч дарна. ЗАГВАР лавлагаа автоматаар үүсч, Үйлчилгээний түүхэнд хадгалагдана." },
  { q: "Төлбөр хэрхэн төлөх вэ?", a: "Профайл → Цахим хэтэвч хэсэгт карт холбож, төлбөртэй үйлчилгээг төлнө. Демо орчинд бодит гүйлгээ хийгдэхгүй." },
  { q: "Бичиг баримтаа хаанаас харах вэ?", a: "Профайл → Миний бичиг баримт хэсэгт SAMPLE / ЗАГВАР тэмдэглэгээтэй картууд харагдана." },
  { q: "Аппын өнгө, загварыг хэрхэн өөрчлөх вэ?", a: "Цэс → Админ удирдлага хэсэгт өнгө, булангийн радиус, нүүр хуудасны бүтцийг өөрчилнө." },
  { q: "QR кодоор хэрхэн нэвтрэх вэ?", a: "Доод цэсний голын QR товчийг дарж, “QR уншуулах” табыг ашиглана." },
];

export const FAQ = [
  { q: "Civic MGL гэж юу вэ?", a: "Цахим үйлчилгээний нэгдсэн системийн загвар (демо) аппликейшн. Бүх өгөгдөл зохиомол." },
  { q: "Миний мэдээлэл хаана хадгалагдах вэ?", a: "Зөвхөн таны төхөөрөмжийн хөтчийн localStorage-д хадгалагдана. Сервер рүү илгээгдэхгүй." },
  { q: "Анхны төлөвт хэрхэн оруулах вэ?", a: "Админ удирдлага → доод самбарын “Анхны загвар сэргээх” товчийг дарна." },
  { q: "Ханшийн мэдээлэл хаанаас ирдэг вэ?", a: "open.er-api.com нээлттэй API-аас шууд татна. Холболтгүй үед нөөц утга эсвэл админы тохируулсан утгыг харуулна." },
  { q: "Үйлчилгээг хадгалах боломжтой юу?", a: "Тийм. Үйлчилгээний карт дээрх хавчуурга дүрсийг дарж “Хадгалсан” жагсаалтад нэмнэ." },
  { q: "Харанхуй горим хэрхэн асаах вэ?", a: "Дээд талын сар/нар дүрс, эсвэл зүүн цэсний шилжүүлэгчийг ашиглана." },
];

export const SERVICE_CENTERS = [
  { id: "c1", name: "Төв үйлчилгээний цэг", address: "Сүхбаатар дүүрэг, 1-р хороо, Демо гудамж 7", hours: "Да–Ба 08:30–17:30", phone: "7000-0001" },
  { id: "c2", name: "Баянзүрх салбар", address: "Баянзүрх дүүрэг, 4-р хороо, Жишээ төв", hours: "Да–Ба 09:00–18:00", phone: "7000-0002" },
  { id: "c3", name: "Хан-Уул салбар", address: "Хан-Уул дүүрэг, 15-р хороо, Загвар плаза", hours: "Да–Бя 09:00–18:00", phone: "7000-0003" },
  { id: "c4", name: "Сонгинохайрхан салбар", address: "СХД, 20-р хороо, Демо цогцолбор", hours: "Да–Ба 08:30–17:30", phone: "7000-0004" },
  { id: "c5", name: "Дархан-Уул салбар", address: "Дархан сум, 3-р баг, Жишээ байр", hours: "Да–Ба 09:00–17:00", phone: "7000-0005" },
  { id: "c6", name: "Орхон салбар", address: "Баян-Өндөр сум, Загвар төв", hours: "Да–Ба 09:00–17:00", phone: "7000-0006" },
];

export const EMERGENCY = [
  { code: "101", title: "Гал түймэр, онцгой байдал", desc: "Гал түймэр, аюулт үзэгдэл, осол", color: "#DC2626" },
  { code: "102", title: "Цагдаа", desc: "Гэмт хэрэг, зөрчил, нийтийн хэв журам", color: "#1D4ED8" },
  { code: "103", title: "Түргэн тусламж", desc: "Амь нас, эрүүл мэндэд яаралтай тусламж", color: "#059669" },
  { code: "105", title: "Онцгой байдлын лавлах", desc: "Байгалийн гамшиг, аврах ажиллагаа", color: "#D97706" },
];

export const DEVICES = [
  { id: "d1", name: "iPhone · Safari", place: "Улаанбаатар", last: "Одоо идэвхтэй", current: true },
  { id: "d2", name: "MacBook · Chrome", place: "Улаанбаатар", last: "2026-11-10 21:14", current: false },
  { id: "d3", name: "Android · Civic MGL app", place: "Дархан", last: "2026-09-02 08:47", current: false },
];
