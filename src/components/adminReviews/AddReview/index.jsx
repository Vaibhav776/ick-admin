import { Pagination } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";
import FetchLoader from "../../../common/components/loader/fetchLoader";
import Helper from "../../../common/consts/Helper";
import { toast } from "react-toastify";

export default function AddReview() {
  const pageSize = 10;

  const customStyles = {
    option: (provided, state) => ({
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
  const options = [
    {
      label: "Brand",
      value: "admin/brands",
    },
    {
      label: "Model",
      value: "admin/models",
    },
    {
      label: "Variant",
      value: "admin/variants",
    },
  ];
  const ratingOptions = [
    {
      label: "1",
      value: 1,
    },
    {
      label: "2",
      value: 2,
    },
    {
      label: "3",
      value: 3,
    },
    {
      label: "4",
      value: 4,
    },
    {
      label: "5",
      value: 5,
    },
  ];
  const [option, setOption] = useState();
  const [result, setResult] = useState([]);
  const [isAddReview, setIsAddReview] = useState(false);
  const [selectedResult, setSelectedResult] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const [current, setCurrent] = useState(1);
  const [inputData, setInputData] = useState({
    rating: { label: "0", value: 0 },
    reviewHeading: "",
    reviewSubText: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (option) {
      setLoading(true);
      fetchValues();
    }
  }, [option]);
  const fetchValues = async (offset = 0) => {
    let result = await Helper(option.value, "POST", { offset, limit: 10 }).then(
      (res) => {
        setTotalPages(
          res?.brandInfoCount || res?.modelInfoCount || res?.variantInfoCount
        );
        setResult(
          option.label === "Brand"
            ? res?.brandInfo
            : option?.label === "Model"
            ? res?.modelInfo
            : res?.variantInfo
        );
      }
    );
    setLoading(false);
  };
  const getImage = (res) => {
    if (option.label === "Brand") {
      return (
        <div>
          <img src={res?.["logo"]} style={{ width: "60px" }} />
        </div>
      );
    } else if (option.label === "Model") {
      return (
        <div>
          <img src={res?.["Model Image Path"]} />
        </div>
      );
    } else {
      return (
        <div>
          <img src={res?.["Variant Image Path"]} />
        </div>
      );
    }
  };
  const getName = (res) => {
    if (option.label === "Brand") {
      return (
        <div>
          <strong>Brand - </strong>
          {res["Brand Name"]}
        </div>
      );
    } else if (option.label === "Model") {
      return (
        <div>
          <strong>Brand - </strong>
          {res?.brandInfo?.[0]?.["Brand Name"]}
          <br />
          <strong>Model - </strong>
          {res?.["Model Name"]}
        </div>
      );
    } else {
      return (
        <div>
          <strong>Brand - </strong>
          {res?.brandId?.[0]?.["Brand Name"]}
          <br />
          <strong>Model - </strong>
          {res?.modelId?.[0]?.["Model Name"]}
          <br />
          <strong>Variant - </strong>
          {res?.["Variant Name"]}
        </div>
      );
    }
  };
  const addReview = (id) => {
    setIsAddReview(true);
    setSelectedResult(id);
    setInputData({
      rating: { label: "0", value: 0 },
      reviewHeading: "",
      reviewSubText: "",
    });
  };
  const handleChange = (name, value) => {
    setInputData({
      ...inputData,
      [name]: value,
    });
  };
  const handlePageChange = (page) => {
    setCurrent(page);
    fetchValues((page - 1) * pageSize);
  };
  const saveReview = async () => {
    const body = {
      rating: inputData?.rating?.value,
      type: option.label,
      typeId: selectedResult._id,
      reviewHeading: inputData.reviewHeading,
      reviewSubText: inputData.reviewSubText,
    };
    if (!inputData?.reviewHeading || !inputData?.reviewSubText) {
      toast.error("Please Enter Review Heading & Description");
    } else {
      const result = await Helper("admin/review", "POST", body);
      if (result.message === "Review added successfully") {
        setInputData({
          rating: { label: "0", value: 0 },
          reviewHeading: "",
          reviewSubText: "",
        });
      }
    }
  };
  console.log(inputData, selectedResult["Brand Name"], "Result", result);
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center justify-content-between mt-2">
              <div className="d-flex">
                <div className="my-auto">
                  <i className="fas fa-arrow-left px-3 cursor-pointer"></i>
                </div>
                <h5 className="my-auto card-title">
                  {/* {isEdit ? "Edit Question" : "Add Question"} */}
                </h5>
              </div>
            </div>
            <div className="card-body">
              {isAddReview && (
                <div className="row">
                  <div className="col-md-12">
                    <label>{getName(selectedResult)}</label>
                  </div>
                  <div className="col-md-12">
                    <label>Review Heading</label>
                    <input
                      className="form-control"
                      placeholder="Review Heading"
                      name="reviewHeading"
                      value={inputData.reviewHeading}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-12">
                    <label>Review Description</label>
                    <textarea
                      className="form-control pl-2"
                      placeholder="Review Description"
                      name="reviewSubText"
                      value={inputData.reviewSubText}
                      onChange={(e) =>
                        handleChange(e.target.name, e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-12">
                    <label>Rating</label>
                    <Select
                      placeholder={"Select..."}
                      styles={customStyles}
                      defaultValue={inputData.rating}
                      value={inputData?.rating}
                      options={ratingOptions}
                      onChange={(value) => handleChange("rating", value)}
                    />
                  </div>
                  <div className="col-md-12">
                    <button className="btn btn-primary" onClick={saveReview}>
                      Save
                    </button>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-md-4">
                  <label>Review For</label>
                  <div className="input-group mb-3">
                    <Select
                      placeholder={"Select..."}
                      styles={customStyles}
                      options={options}
                      onChange={(value) => {
                        setOption(value);
                        setIsAddReview(false);
                      }}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Type</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!loading ? (
                        result?.map((res, index) => (
                          <tr key={index}>
                            <td>{index}</td>
                            {/* <td>
														{(current - 1) *
															pageSize +
															(index + 1)}
													</td> */}
                            <td>{option.label}</td>
                            <td>{getImage(res)}</td>
                            <td>{getName(res)}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => addReview(res)}
                              >
                                Add Review
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <div className="row">
                          <div className="d-flex justify-content-center">
                            <FetchLoader />
                          </div>
                        </div>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="col-12">
                  <Pagination
                    pageSize={pageSize}
                    current={current}
                    total={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
