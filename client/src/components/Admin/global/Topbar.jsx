import React, { useEffect, useState } from "react";
import birdlogo from "../../../assets/Admin/icons/birdlogo.svg";
import blackbirdlogo from "../../../assets/Admin/icons/blackbirdlogo.svg";
import { FaSearch } from "react-icons/fa";
import Dashboard from "../home/Dashboard";
import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png';
import logo2 from '../../../assets/logo2.png';
import smalllogo from '../../../assets/small-logo.png';
import axios from "axios";

const Topbar = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const [dropDown, setDropDown] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`${window.react_app_url + window.user_url}`)
        .then((response) => {
            const admin = response.data.data.find(user => user.role === 'admin');
            if (admin.profileimg) {
                setImage(`${window.react_app_url}public/images/user/${admin.profileimg}`);
            }else{
              setImage(`${window.react_app_url}public/images/default/user-default.png`);
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
        });
}, []);

  return (
    <>
      <div className="2xl:container 2xl:mx-auto">
        <div className="bg-slate-300 rounded shadow-lg py-3 px-4">
          <nav className="flex justify-between h-14">
            <div className="flex items-center space-x-3 lg:pr-6">
              {open ? (
                <img src={smalllogo} alt=""
                className="cursor-pointer w-16 h-12" />
              ) : (
                <img src={logo} alt="" className="cursor-pointer w-20 h-16" />
              )}
            </div>
            <div className="hidden md:flex flex-auto">
              <div className="w-1/2 relative flex items-center h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                <div className="grid place-items-center h-full w-12 text-gray-300">
                  <FaSearch />
                </div>
                <input
                  className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                  type="text"
                  id="search"
                  placeholder="Search something.."
                />
              </div>
            </div>
            <div className="flex space-x-5 justify-center items-center pl-2">
              <Link to="/admin-profile">
                <img
                  src={image}
                  className={`w-10 h-10 rounded-full border-2 shadow-lg cursor-pointer duration-500`}
                />
              </Link>
            </div>
          </nav>
          <div className="block md:hidden w-full mt-5">
            <div onClick={() => setDropDown(!dropDown)} className="cursor-pointer px-4 py-3 text-white bg-indigo-600 rounded flex justify-between items-center w-full">
              <div className="flex space-x-2">
                <span id="s1" className={`${text.length !== 0 ? '' : 'hidden'} font-semibold text-sm leading-3`}>Selected: </span>
                <p id="textClicked" className="font-normal text-sm leading-3 focus:outline-none hover:bg-gray-800 duration-100 cursor-pointer ">{text ? text : "Collections"}</p>
              </div>
              <svg id="ArrowSVG" className={`${dropDown ? '' : 'rotate-180'} transform duration-100`} width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9L12 15L18 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
