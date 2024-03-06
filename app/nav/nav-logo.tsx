import { CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function NavLogo() {
  return (
    <div className='flex flex-row items-center leading-none text-gray-800'>
      <CalendarDaysIcon className="h-12 w-12 mr-4 rotate-[15deg]" />
      <p className="text-[32px]">
        My Personal Dashboard
      </p>
    </div>
  );
}
