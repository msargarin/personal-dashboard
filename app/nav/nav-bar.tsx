import NavLinks from '@/app/nav/nav-links';
import NavLogo from '@/app/nav/nav-logo';

export default function AppNav() {
  return (
    <div className="flex bg-gray-50 h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex h-30 items-end justify-start rounded-md bg-sky-300 p-4 md:h-40">
        <NavLogo />
      </div>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
      </div>
    </div>
  );
}
