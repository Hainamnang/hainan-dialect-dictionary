import Image from "next/image";

export default function HeaderSection() {
  return (
    <section
      id="home"
      className="scroll-mt-24 rounded-xl border bg-white p-3 sm:p-4"
    >
      <Image
        src="/HomePage.jpg"
        alt="Hainanese Dialect Dictionary"
        width={2048}
        height={1055}
        priority
        className="h-auto w-full rounded-lg"
      />
    </section>
  );
}
