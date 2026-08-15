import Image from "next/image";
import Link from "next/link";
import { getNavigation } from "@/lib/navigation";
import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";

export default function Header() {
  const navLinks = getNavigation();

  return (
    <header className="sticky top-0 z-50 bg-brand-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/images/2021/08/fishfinder-1.png"
            alt="Best Fish Finders Today"
            width={291}
            height={94}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <DesktopNav links={navLinks} />
        <MobileNav links={navLinks} />
      </div>
    </header>
  );
}
