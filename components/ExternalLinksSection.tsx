import { getSafeSourceUrl } from "@/lib/contentUrls";
import type { ExternalLink } from "@/types/content";

type ExternalLinksSectionProps = {
  externalLinks: ExternalLink[];
};

export default function ExternalLinksSection({
  externalLinks,
}: ExternalLinksSectionProps) {
  return (
    <section
      id="links"
      className="min-h-36 scroll-mt-24 rounded-xl bg-blue-500 p-4 text-white"
    >
      <h2 className="text-lg font-bold">Link เพื่อนบ้าน</h2>

      {externalLinks.length === 0 ? (
        <p className="mt-2 text-sm text-blue-50">
          ยังไม่มีลิงก์ที่เผยแพร่ในขณะนี้
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {externalLinks.map((item) => {
            const safeLinkUrl = getSafeSourceUrl(item.url);
            const safeImageUrl = item.image_url
              ? getSafeSourceUrl(item.image_url)
              : null;

            return (
              <article
                key={item.id}
                id={`link-${item.id}`}
                className="scroll-mt-24 rounded-lg bg-white p-3 text-gray-900 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  {safeImageUrl ? (
                    <img
                      src={safeImageUrl}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      className="h-16 w-16 shrink-0 rounded-md border border-gray-200 bg-white object-contain p-1"
                    />
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold leading-5">
                      {safeLinkUrl ? (
                        <a
                          href={safeLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-800 hover:underline"
                        >
                          {item.title}
                        </a>
                      ) : (
                        item.title
                      )}
                    </h3>

                    {item.description ? (
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-5 text-gray-600">
                        {item.description}
                      </p>
                    ) : null}

                    {safeLinkUrl ? (
                      <div className="mt-3">
                        <a
                          href={safeLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex rounded-md bg-blue-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-800"
                        >
                          {item.link_label || "คลิก"}
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
