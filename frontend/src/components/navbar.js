import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  
} from "@headlessui/react";
import { Bars3Icon,  XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";


const navigation = [
  { name: "Dashboard", href: "/home", current: true },
  { name: "History", href: "/history", current: true },
];

const auth=[
  { name: "Login", href: "/login", current: true },
  { name: "Sign In", href: "/register", current: true },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
let navigate=useNavigate();

const handleOnclick=(e)=>{
  // localStorage.removeItem('token');
  sessionStorage.clear();
  navigate("/login");
}
  return (
    <Disclosure as="nav" className="bg-gray-800 z-50 relative">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo or site name (optional) */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center"></div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {sessionStorage.getItem("token: ")&& navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        required 
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-end">
                <div className="flex shrink-0 items-center"></div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                   
                  {sessionStorage.getItem('token: ')? <Link key="logout"
                         onClick={handleOnclick}
                         to="/login"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white 
                          rounded-md px-3 py-2 text-sm font-medium"
                        >Logout</Link>: auth.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div> 

                </div>
              </div>
            </div>
          </div>

          {/* Mobile navigation panel */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
