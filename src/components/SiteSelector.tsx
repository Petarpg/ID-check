import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface Site {
  id: string;
  name: string;
}

interface SiteSelectorProps {
  sites: Site[];
  selectedSite: Site;
  onSiteChange: (site: Site) => void;
}

export default function SiteSelector({
  sites,
  selectedSite,
  onSiteChange,
}: SiteSelectorProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
          {selectedSite.name}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-white"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sites.map((site) => (
              <Menu.Item key={site.id}>
                {({ active }) => (
                  <button
                    onClick={() => onSiteChange(site)}
                    className={`${
                      active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                    } block w-full px-4 py-2 text-left text-sm transition-colors duration-200`}
                  >
                    {site.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
