import React, { useEffect, useState } from "react";
import Button from "../hooks/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import DefaultImage from "../../../assets/images/default/user-default.png";
import { useCookies } from "react-cookie";

const Profile = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["admin"]);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const initialFormData = {
    userName: "",
    email: "",
    profileimg: null,
  };
  const [formData, setFormData] = useState(initialFormData);

  const toggleEditMode = () => {
    setEditMode((prevEditMode) => !prevEditMode);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
      if (validImageTypes.includes(selectedImage.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result);
        };
        reader.readAsDataURL(selectedImage);
        setFormData((prevFormData) => ({
          ...prevFormData,
          profileimg: selectedImage,
        }));
      } else {
        e.target.value = null;
        toast.error("Please select a valid image (jpg, png, or webp).", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } else {
      setImage(null);
      setFormData((prevFormData) => ({
        ...prevFormData,
        profileimg: null,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${window.react_app_url + window.user_url}`
        );
        const admin = response.data.data.find((user) => user.role === "admin");
        setUserData(admin);
        setFormData({
          userName: admin.userName,
          email: admin.email,
          profileimg: admin.profileimg,
        });
        if (admin.profileimg) {
          setImage(
            `${window.react_app_url}public/images/user/${admin.profileimg}`
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    if (!userData) {
      fetchData();
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName.trim() || !formData.email.trim()) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userName", formData.userName);
    formDataToSend.append("email", formData.email);
    if (formData.profileimg) {
      formDataToSend.append("profileimg", formData.profileimg);
    }

    try {
      const response = await axios.put(
        `${window.react_app_url + window.user_url}/${userData._id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        navigate("/admin-dashboard");
      }
    } catch (error) {
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
    }
  };

  const handlelogout = () => {
    removeCookie("admin");
    toast.success("logout Successfully.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigate("/admin-authentication");
  };

  return (
    <main className="profile-page mt-56">
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-slate-100 w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mt-12 flex justify-center items-center">
                  <label htmlFor="profile-image" className="cursor-pointer">
                    {image ? (
                      <img
                        src={image}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-lg"
                      />
                    ) : (
                      <img
                        src={DefaultImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-lg"
                      />
                    )}
                    <input
                      type="file"
                      id="profile-image"
                      name="profile-image"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="mx-24 space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        editMode ? "" : "pointer-events-none"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                        editMode ? "" : "pointer-events-none"
                      }`}
                    />
                  </div>
                </div>
                <div className="ml-20 mt-12">
                  {editMode && (
                    <Button
                      label="Update"
                      type="submit"
                      width="48"
                      bgColor="blue"
                    />
                  )}
                  <Button
                    label={editMode ? "Cancel" : "Edit Profile"}
                    onClick={toggleEditMode}
                    width="48"
                    bgColor="gray"
                  />
                  <Button
                    label="logout"
                    onClick={handlelogout}
                    width="48"
                    bgColor="red"
                  />
                </div>
              </form>
            </div>
            <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <Link to={`/admin-profile-change-password/${userData?._id}`}>
                    <p className="mb-4 text-lg leading-relaxed text-blue-700 cursor-pointer hover:underline">
                      Want to change Password?
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
