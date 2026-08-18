type Edito = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type EditoImage = {
  id: number;
  edito_id: number;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  sort_key: number;
};

type EditoSectionProps = {
  edito: Edito | null;
  images: EditoImage[];
  onOpen: () => void;
};

const SECTION_IMAGE_URL =
  "https://ujmutclgypdfvgdpvqyx.supabase.co/storage/v1/object/public/edito-images/section-images/Tong.jpg";

export default function EditoSection({
  edito,
  images,
  onOpen,
}: EditoSectionProps) {
  return (
    <section
      id="edito"
      className="min-h-36 scroll-mt-24 rounded-xl bg-white p-4 text-gray-900 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <img
          src={SECTION_IMAGE_URL}
          alt=""
          width={72}
          height={72}
          className="h-18 w-18 shrink-0 rounded-lg object-cover"
        />

        <div className="min-w-0">
          <h2 className="text-lg font-bold">那顾打lom多事。</h2>

          <div className="mt-1 text-sm">
            Na1 gu4 pa6 lom6 doi1 se5.
          </div>

          <div className="text-sm">
            มีเรื่องมากมายอยากคุยด้วย
          </div>
        </div>
      </div>

      {edito ? (
         <button
           type="button"
           onClick={onOpen}
           className="mt-4 w-full rounded-lg bg-blue-500 px-3 py-2 text-sm font-bold text-white hover:bg-blue-600"
       >
           คลิก &gt; เสี่ยะดัวเกหล่ายพ่ะล่ม
       </button>
     ) : null}
    </section>
  );
}