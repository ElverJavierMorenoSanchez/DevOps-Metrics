import Link from "next/link";

function AsideButton({ icon: Icon, href, onClick }) {
  return (
    <Link
      href={href}
      className="p-2 transition-colors duration-300 rounded-lg group hover:bg-white"
      onClick={onClick}
    >
      <Icon size="1.3em" />
    </Link>
  );
}

export default AsideButton;
