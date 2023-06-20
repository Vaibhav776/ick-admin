import React, { useEffect, useState } from "react";
import Select from "react-select";

//helper functions
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";
import Loader from "../../common/components/buttonLoader";
import Editor from "../news/Editor";
import { useHistory, useLocation } from "react-router-dom";

function AddUpcomingCar() {
  const history = useHistory();
  const location = useLocation();
  const isEdit = location.state ? true : false;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  const [brands, setBrands] = useState([]);
  const [bodyType, setBodyType] = useState([]);
  const [inputDetails, setInputDetails] = useState(
    location?.state?.model || {}
  );

  const customStyles = {
    option: (provided) => ({
      ...provided,
      textTransform: "capitalize",
    }),
    menu: ({ width, ...css }) => ({
      ...css,
      width: "max-content",
      minWidth: "100%",
    }),
    container: () => ({
      minWidth: "100%",
      textTransform: "capitalize",
    }),
  };

  const inputJson = [
    {
      name: "modelName",
      label: "Model Name*",
      type: "text",
      placeholder: "ex: alto",
    },
    {
      name: "modelImagePath",
      label: "Image Link*",
      type: "text",
      placeholder: "ex: http://image-path.com",
    },
    {
      name: "modelLaunchDate",
      label: "Expected Launch Date",
      type: "date",
      placeholder: "",
    },
    {
      name: "modelExpectedPrice",
      label: "Expected Price",
      type: "input",
      placeholder: "ex: 6 Lakh",
    },
    {
      name: "slug",
      label: "Model Slug",
      type: "input",
      placeholder: "slug",
    },
    {
      name: "modelDescription",
      label: "Model Discription",
      type: "textArea",
      placeholder: "ex: discription about the model",
    },
    {
      name: "metaTitle",
      label: "Meta Title",
      type: "input",
      placeholder: "Meta Title",
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "input",
      placeholder: "Meta Description",
    },
    {
      name: "metaKeywords",
      label: "Meta Keywords",
      type: "input",
      placeholder: "Meta Keywords",
    },
  ];

  const brandOptions = brands?.map((brand) => {
    return {
      label: brand["Brand Name"],
      value: brand._id,
    };
  });

  const bodyTypeOptions = bodyType?.map((types) => {
    return {
      label: types["Bodytype Name"],
      value: types._id,
    };
  });

  useEffect(() => {
    setIsLoadingBrands(true);
    Helper("fetch_brands", "GET")
      .then((brands) => setBrands(brands.brands))
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingBrands(false));

    Helper("bodyTypes", "POST", {
      //   limit: 10,
      //   offset: 0,
      isAll: 1,
    })
      .then(({ bodyTypeInfo }) => setBodyType(bodyTypeInfo))
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingBrands(false));
  }, []);

  const handleSelectedOption = (value, fieldName) => {
    setInputDetails({
      ...inputDetails,
      [fieldName]: value.value,
    });
  };

  const handleInputOption = (e) => {
    setInputDetails({
      ...inputDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Coming");
    if (inputDetails) {
      setIsLoading(true);
      const url = isEdit
        ? `upcoming_model/${inputDetails._id}`
        : "add_upcoming_model";
      const method = isEdit ? "PUT" : "POST";
      Helper(url, method, { ...inputDetails, modelId: inputDetails._id })
        .then((response) => {
          if (!response.error) {
            toast.success(response.message);
            history.push("/upcoming_cars");
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    } else {
      toast.error("Please add details");
    }
  };

  console.log(inputDetails, "Sttaate");

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center justify-content-between mt-2">
              <div className="d-flex">
                <div
                  className="my-auto"
                  onClick={() => history.push("/upcoming_cars")}
                >
                  <i className="fas fa-arrow-left px-3 cursor-pointer"></i>
                </div>
                <h5 className="my-auto card-title">
                  {isEdit ? "Edit Upcoming Models" : "Add Upcoming Models"}
                </h5>
              </div>
            </div>
            <div className="card-body">
              <form>
                {!isEdit && (
                  <div className=" d-flex">
                    <div className="col-md-6 mt-3">
                      <label>Choose Brand*</label>
                      <div className="input-group mb-3">
                        <Select
                          name="brandId"
                          options={brandOptions}
                          styles={customStyles}
                          onChange={(value) =>
                            handleSelectedOption(value, "brandId")
                          }
                          isLoading={isLoadingBrands}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 mt-3">
                      <label>Choose Body Type*</label>
                      <div className="input-group mb-3">
                        <Select
                          name="bodyTypeId"
                          options={bodyTypeOptions}
                          styles={customStyles}
                          onChange={(value) =>
                            handleSelectedOption(value, "bodyTypeId")
                          }
                          isLoading={isLoadingBrands}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {inputJson?.map((value, index) => (
                  <div
                    className="col-md-12 mb-3"
                    key={value.label + "-" + index}
                  >
                    <label
                      for="exampleInputEmail1"
                      style={{
                        textTransform: "capitalize",
                      }}
                    >
                      {value?.label}
                    </label>
                    {value.type === "textArea" ? (
                      <Editor
                        required
                        value={inputDetails.modelDescription}
                        name="modelDescription"
                        onChange={(data) => {
                          setInputDetails({
                            ...inputDetails,
                            modelDescription: data,
                          });
                        }}
                        editorLoaded={true}
                      />
                    ) : (
                      <input
                        required
                        value={inputDetails[value?.name]}
                        placeholder={value?.placeholder}
                        type={value?.type}
                        name={value?.name}
                        className="form-control"
                        onChange={(e) => handleInputOption(e)}
                      />
                    )}
                  </div>
                ))}
                <div className="row">
                  <div className="update ml-auto mr-auto">
                    <button
                      type="button"
                      className="btn btn-primary btn-round"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader loading={isLoading} />
                      ) : isEdit ? (
                        "Update Car"
                      ) : (
                        "Add Car"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUpcomingCar;
