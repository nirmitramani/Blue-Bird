import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Button from "../../hooks/Button";
import BreadCrumb from "../../hooks/BreadCrumb";
import { toast } from "react-toastify";
import useLoader from "../../hooks/useLoader";
import Select from "react-select";

const AddUpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, startLoading, stopLoading, Loader } = useLoader();
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const initialFormData = {
    name: "",
    shortdescription: "",
    description: "",
    price: "",
    categoryid: "", // Initialize categoryid with an empty string
    productimg: null,
    productthumbimg: [],
  };
  const [formData, setFormData] = useState(initialFormData);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    axios
      .get(`${window.react_app_url + window.product_category_url}`)
      .then((response) => {
        setProductCategories(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);

  useEffect(() => {
    if (id && !dataFetched) {
      startLoading();
      axios
        .get(`${window.react_app_url + window.product_url}/${id}`)
        .then((response) => {
          if (response.data.status) {
            setFormData(response.data.data);
            setSelectedCategory(response.data.data.categoryid);
          } else {
            console.error("Error fetching product data:");
          }

          stopLoading();
          setDataFetched(true);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          stopLoading();
          navigate("/admin-products");
        });
    }
  }, [id, dataFetched, navigate]);

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
    setFormData({
      ...formData,
      categoryid: selectedOption.value,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "productimg" || name === "productthumbimg") {
      const fileList = Array.from(files); // Convert FileList to an array
      if (fileList.length > 0) {
        const validFiles = fileList.filter((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        );
        if (validFiles.length > 0) {
          setFormData({
            ...formData,
            [name]: name === "productimg" ? validFiles[0] : validFiles,
          });
        } else {
          e.target.value = null;
          toast.error(
            "Please select jpg, webp, or png images for product and product thumbnails."
          );
        }
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    console.log(formData);
    if (
      !formData.name.trim() ||
      !formData.shortdescription.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.categoryid ||
      (!id && !formData.productimg) ||
      (!id && !formData.productthumbimg)
    ) {
      toast.warning("Please fill in all required fields.", {
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
      return;
    }

    if (!/[a-zA-Z]/.test(formData.name)) {
      toast.warning("Name must contain at least one alphabet character.", {
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
      return;
    }

    if (!/[a-zA-Z]/.test(formData.description)) {
      toast.warning(
        "Description must contain at least one alphabet character.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      stopLoading();
      return;
    }

    if (!/[a-zA-Z]/.test(formData.shortdescription)) {
      toast.warning(
        "Short Description must contain at least one alphabet character.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      stopLoading();
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      toast.error(`Price must be greater than 0.`, {
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
      return;
    }

    const formDataToSend = new FormData();

    for (const key in formData) {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((file, index) => {
          formDataToSend.append(`${key}_${index}`, file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      if (id) {
        if (!dataFetched) {
          navigate("/admin-products");
        }
        if (dataFetched) {
          const response = await axios.put(
            `${window.react_app_url + window.product_url}/${id}`,
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
          } else {
            toast.error(response.data.message, {
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
        }
      } else {
        const requiredFields = [
          "name",
          "shortdescription",
          "description",
          "price",
          "categoryid",
          "productimg",
          "productthumbimg",
        ];

        let hasMissingFields = false;

        for (const fieldName of requiredFields) {
          if (!formData[fieldName]) {
            hasMissingFields = true;
            break;
          }
        }

        if (hasMissingFields) {
          toast.warning("Please fill in all required fields.", {
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
        console.log(formData);
        const response = await axios.post(
          `${window.react_app_url + window.product_url}`,
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
        } else {
          toast.error(response.data.message, {
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
      }
      navigate("/admin-products");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="p-2 flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <BreadCrumb
            title="Product / "
            desc={id ? "Update Product" : "Add Product"}
            link="/admin-products"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-24">
          <div>
            <label
              htmlFor="name"
              className="mt-4 block text-sm font-medium text-gray-900"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Name"
            />
            <label
              htmlFor="shortdescription"
              className="mt-4 block text-sm font-medium text-gray-900 "
            >
              Short Description
            </label>
            <textarea
              type="textarea"
              id="shortdescription"
              name="shortdescription"
              value={formData.shortdescription}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Short Description"
            />
            <label
              htmlFor="description"
              className="mt-4 block text-sm font-medium text-gray-900 "
            >
              Description
            </label>
            <textarea
              type="textarea"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Description"
            />
            <label
              htmlFor="price"
              className="mt-4 block text-sm font-medium text-gray-900 "
            >
              Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter Price"
            />
            <label
              htmlFor="category"
              className="mt-4 block text-sm font-medium text-gray-900"
            >
              Product Category
            </label>
            <Select
              id="category"
              name="categoryid"
              value={productCategories.find(
                (cat) => cat._id === selectedCategory
              )}
              onChange={handleCategoryChange}
              options={getCategoryOptions(productCategories)}
              isSearchable
              isClearable
            />
          </div>

          <div>
            <label
              htmlFor="productimg"
              className="mt-4 block text-sm font-medium text-gray-900 "
            >
              Product Image
            </label>
            <input
              type="file"
              id="productimg"
              name="productimg"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div>
            <label
              htmlFor="productthumbimg"
              className="mt-4 block text-sm font-medium text-gray-900 "
            >
              Product Thumbnail Images
            </label>
            <input
              type="file"
              id="productthumbimg"
              name="productthumbimg"
              onChange={handleInputChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              multiple
            />
          </div>
        </div>
        <div className="ml-20 mt-12">
          <Button label="Submit" type="submit" width="32" bgColor="blue" />
          <Button
            label="Reset"
            type="reset"
            onClick={() => {
              setFormData(initialFormData);
            }}
            width="32"
            bgColor="red"
          />
        </div>
      </form>
    </>
  );
};

const getCategoryOptions = (categories) => {
  const groupedOptions = categories.reduce((acc, category) => {
    const existingGroup = acc.find((group) => group.label === category.gender);
    if (existingGroup) {
      existingGroup.options.push({ value: category._id, label: category.name });
    } else {
      acc.push({
        label: category.gender,
        options: [{ value: category._id, label: category.name }], 
      });
    }
    return acc;
  }, []);
  console.log(groupedOptions);
  return groupedOptions;
};

export default AddUpdateProduct;
