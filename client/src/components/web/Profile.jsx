import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { BiSolidMessageSquareEdit } from "react-icons/bi";
import { AiFillCloseCircle } from "react-icons/ai";
import useLoader from "../Admin/hooks/useLoader";
import { toast } from "react-toastify";
import Button from "./hooks/Button";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [cookies, setCookie] = useCookies(["user"]);
  const { loading, startLoading, stopLoading, Loader } = useLoader();
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    startLoading();
    try {
      const response = await axios.get(
        `${window.react_app_url}${window.user_url}`
      );
      const user = response.data.data.find((user) => user.role === "user");
      setUserData(user);
      if (user.profileimg) {
        setImage(
          `${window.react_app_url}public/images/user/${user.profileimg}`
        );
      }
      stopLoading();
    } catch (error) {
      console.error("Error fetching user data:", error);
      stopLoading();
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: name === "gender" && !isEditing ? null : value,
    }));
  };

  const toggleEditing = () => {
    setIsEditing((prevIsEditing) => !prevIsEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    const formDataToSend = new FormData();
    formDataToSend.append("userName", userData?.userName || "");
    formDataToSend.append("email", userData?.email || "");
    formDataToSend.append("phone", userData?.phone || "");
    formDataToSend.append("gender", userData?.gender || "");

    if (image) {
      formDataToSend.append("profileimg", image);
    }

    try {
      const res = await axios.put(
        `${window.react_app_url}${window.user_url}/${userData._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsEditing(false);
        stopLoading();
        fetchData();
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating user data", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      stopLoading();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div className="page-banner mb-20">
        <div className="container-fluid pl-60 pr-60">
          <div className="page-banner-content">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li className="active">
                <NavLink to="/profile">Profile</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        {loading && <Loader />}
        <div className="container mx-auto">
          <form className="my-8 w-3/5 mx-auto" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center">
              <p className="text-xl font-bold mb-4 ml-24">
                Hello, {userData?.userName}
              </p>
              <div className="flex items-center">
                <button type="button" onClick={toggleEditing}>
                  {isEditing ? (
                    <AiFillCloseCircle className="text-3xl" />
                  ) : (
                    <BiSolidMessageSquareEdit className="text-3xl" />
                  )}
                </button>
              </div>
            </div>
            {userData && (
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-1/3 flex justify-center">
                  <label htmlFor="profile-image" className="cursor-pointer">
                    <img
                      src={image || "https://i.stack.imgur.com/l60Hf.png"}
                      alt="Profile"
                      className="w-40 h-40 rounded-full border-2 border-gray-200 shadow-lg"
                    />
                    <input
                      type="file"
                      id="profile-image"
                      name="profile-image"
                      accept="image/*"
                      className="hidden"
                      onChange={isEditing ? handleImageChange : null}
                    />
                  </label>
                </div>
                <div className="flex flex-col space-y-4 w-full md:w-2/3">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-600 font-semibold"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={userData.email}
                      className={`input-field ${
                        !isEditing ? "cursor-not-allowed" : ""
                      }`}
                      onChange={isEditing ? handleInputChange : null}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-gray-600 font-semibold"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="number"
                      value={userData.phone}
                      className={`input-field ${
                        !isEditing ? "cursor-not-allowed" : ""
                      }`}
                      onChange={isEditing ? handleInputChange : null}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="block text-gray-600 font-semibold"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={userData.gender || ""}
                      className={`input-field ${
                        !isEditing ? "cursor-not-allowed" : ""
                      }`}
                      onChange={isEditing ? handleInputChange : null}
                      readOnly={!isEditing}
                      required // Add required attribute
                    >
                      <option value="">Select Gender</option>{" "}
                      {/* Add option to select gender */}
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {isEditing && (
              <div className="flex justify-end mt-3">
                <Button
                  label="Cancel"
                  onClick={handleCancel}
                  fullWidth={false}
                  backgroundColor="bg-red-500"
                  textColor="text-white"
                  borderColor="border-red-500"
                  width="48"
                />
                <Button
                  label="Update"
                  type="submit"
                  fullWidth={false}
                  backgroundColor="bg-blue-500"
                  textColor="text-white"
                  borderColor="border-blue-500"
                  width="48"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
