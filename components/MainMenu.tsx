const menuItems = [
  ["Home", "#home"],
  ["Dictionary", "#dictionary"],
  ["Pinyin", "#pinyin-lessons"],
  ["Article", "#articles"],
  ["Video", "#videos"],
  ["Music", "#music"],
] as const;

export default function MainMenu() {
  return (
    <nav
      aria-label="เมนูหลัก"
      className="sticky top-0 z-20 mt-4 rounded-xl bg-purple-800 p-1 shadow-sm"
    >
      <div className="mx-auto flex items-center justify-between sm:w-2/3">
        {menuItems.map(([label, href]) => (
          <a
            key={label}
            href={href}
            className="px-1 py-1 text-center text-[12px] font-bold leading-none text-white transition hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}
