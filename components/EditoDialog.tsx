import type { Edito, EditoImage } from "@/types/content";

type EditoDialogProps = {
  edito: Edito | null;
  images: EditoImage[];
  shareMessage: string;
  onCopyLink: (editoId: number) => void;
  onClose: () => void;
};

export default function EditoDialog({
  edito,
  images,
  shareMessage,
  onCopyLink,
  onClose,
}: EditoDialogProps) {
  if (!edito) {
    return null;
  }

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
         <h2 className="text-xl font-bold text-gray-900">
             {edito.title}
         </h2>

        <div className="flex shrink-0 items-center gap-2">
           <button
              type="button"
              onClick={() => onCopyLink(edito.id)}
              className="rounded-md bg-blue-500 px-3 py-1 text-sm font-bold text-white hover:bg-blue-600"
      >
         Copy Link
      </button>

      <button
          type="button"
          onClick={onClose}
          className="rounded-md px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
      >
          ปิด
       </button>
     </div>
   </div>

   {shareMessage ? (
     <div className="mt-2 text-sm text-gray-500">
        {shareMessage}
     </div>
  ) : null}

    <div className="mt-3 text-xs text-gray-500">
       <div>
          เผยแพร่: {new Date(edito.created_at).toLocaleString("th-TH")}
       </div>

       <div>
          แก้ไขล่าสุด: {new Date(edito.updated_at).toLocaleString("th-TH")}
       </div>
    </div>
        
    <div className="mt-4 whitespace-pre-wrap text-base leading-7 text-gray-800">
          {edito.content}
    </div>

        {images.length > 0 ? (
          <div className="mt-6 space-y-4">
            {images.map((image) => (
              <figure key={image.id}>
                <img
                  src={image.image_url}
                  alt={image.alt_text || ""}
                  className="h-auto max-w-full rounded-lg"
                />

                {image.caption ? (
                  <figcaption className="mt-1 text-sm text-gray-500">
                    {image.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}