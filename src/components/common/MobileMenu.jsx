import { Link, matchPath, useLocation } from "react-router-dom"
import IconBtn from "./IconBtn"
import { BsChevronDown } from "react-icons/bs"
import { useState } from "react";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { AiOutlineShoppingCart } from "react-icons/ai";

export default function MobileMenu({ modalData,onLinkClick }) {
    const location=useLocation();
    const [loading, setLoading] = useState(false)
    const { user } = useSelector((state) => state.profile)
    const { totalItems } = useSelector((state) => state.cart)
    const { token } = useSelector((state) => state.auth)
console.log("modal data",modalData)
    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname)
      }
  return (
    <div className="fixed  top-16 md:hidden inset-0 z-[1] !mt-0 grid place-items-center overflow-x-hidden bg-white bg-opacity-10 backdrop-blur-lg">
   

      <div className="flex flex-col gap-y-3 justify-center items-center  mx-auto ">
       <nav >
          <ul className="flex flex-col gap-y-6 text-center  mx-auto text-richblack-25">
            {modalData?.navbarLinks?.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p className="font-rubik false text-xl leading-5">{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) :  modalData?.subLinks.length ? (
                          <>
                            {modalData?.subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                  onClick={onLinkClick}
                                >
                                  <p className="font-rubik false text-xl leading-5" >{subLink?.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                      onClick={onLinkClick}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className=" flex-col gap-4 items-center gap-x-4 flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button  onClick={onLinkClick}    className="rounded-md bg-brand text-[#fff] border-brand font-rubik xl:text-lg  border mt-6 py-2 px-11 text-lg flex items-center bg-[#6674cc]">
                Log in
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button  onClick={onLinkClick} className="rounded-md bg-brand text-[#fff] border-brand font-rubik xl:text-lg  border mt-6 py-2 px-11 text-lg flex items-center bg-[#6674cc]">
                Sign up
              </button>
            </Link>
          )}
          {/* {token !== null && <ProfileDropDown className="hidden" />} */}
        </div>

        </div>

        
    </div>
  )
}