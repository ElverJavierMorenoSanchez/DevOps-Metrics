import Image from "next/image";

const Navbar = () => {
  return (
    <nav class="absolute flex w-full flex-wrap items-center justify-between py-2 text-neutral-500  hover:text-neutral-700 focus:text-neutral-700 dark:bg-neutral-600 lg:py-4">
      <div class="flex w-full flex-wrap items-center justify-between px-3">
        <div>
          <a
            class="mx-2 my-1 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 lg:mb-0 lg:mt-0"
            href="#"
          >
            <Image
              class="mr-2 rounded-full"
              src="/logo-hispam.jpg"
              alt="TE Logo"
              loading="lazy"
              width={80}
              height={80}
            />
            <span class="font-medium dark:text-neutral-200"></span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
