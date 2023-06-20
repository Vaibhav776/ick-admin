import { useState } from "react";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import Helper from "../../../common/consts/Helper";

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
export default function EditReviews() {
  const history = useHistory();
  const reviewData = history?.location?.state?.review || {
    rating: { label: "0", value: 0 },
    reviewHeading: "",
    reviewSubText: "",
  }
  const [inputData, setInputData] = useState(reviewData);
  const handleChange = (name, value) => {
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const updateReview = async () => {
    const body = {
      rating: inputData?.rating?.value,
      type:inputData?.type,
      typeId: inputData?._id,
      reviewHeading: inputData.reviewHeading,
      reviewSubText: inputData.reviewSubText,
    };
    if (!inputData?.reviewHeading || !inputData?.reviewSubText) {
      // toast.error("Please Enter Review Heading & Description");
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
console.log(inputData, 'checking input data')
  return (
    <div className="content">
      <div className="card card-user">
        <div className="card-header d-flex align-items-center justify-content-between">
          <h5 className="card-title">Edit Review</h5>
          <button className="btn btn-primary" onClick={() => history.push("admin_reviews")}>Back</button>

        </div>
        <div className="card-body">

        <div className="row">
          <div className="col-md-12">
            <label>Review Heading</label>
            <input
              className="form-control"
              placeholder="Review Heading"
              name="reviewHeading"
              value={inputData.reviewHeading}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="col-md-12">
            <label>Review Description</label>
            <textarea
              className="form-control pl-2"
              placeholder="Review Description"
              name="reviewSubText"
              value={inputData.reviewSubText}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
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
            <button className="btn btn-primary" onClick={updateReview}>
              Save
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
