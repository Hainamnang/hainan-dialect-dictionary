export default function ContactSection() {
  return (
    <section
      id="contact"
      className="mt-6 rounded-xl bg-pink-600 p-5 text-white"
    >
      <h2 className="text-xl font-bold">Contact Us</h2>

      <p className="mt-2 text-pink-50">
        ติดต่อ พูดคุย หรือร่วมแลกเปลี่ยนข้อมูลเกี่ยวกับภาษาและวัฒนธรรมไฮ้หน่ำ
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href="https://m.me/hainamnang"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-5 py-3 text-center font-medium text-pink-700 hover:bg-pink-50"
        >
          Messenger — ส่งข้อความถึงเรา
        </a>

        <a
          href="https://www.facebook.com/hainamnang"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-white px-5 py-3 text-center font-medium text-white hover:bg-pink-500"
        >
          Facebook — Hainamnang
        </a>
      </div>
    </section>
  );
}
