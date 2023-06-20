import React, { useState, useEffect } from "react";
import FetchLoader from "../../common/components/loader/fetchLoader";
import Helper from "../../common/consts/Helper";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function ViewData() {
  const history = useHistory();
  const [allModelInfo, setAllModelInfo] = useState();
  const [deleteModel, setDeleteModel] = useState();

  async function fetchAllModelInfo() {
    try {
      const response = await Helper("model/upcoming", "POST", {
        limit: 10,
        offset: 0,
        // isAll: 1,
      });
      if (response) {
        setAllModelInfo(response.modelInfo);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllModelInfo();
  }, []);

  const handleDeleteUpcomingModel = (element) => {
    if (element) {
      Helper(`upcoming_model/${element}`, "DELETE", {
        isDeleted: true,
      })
        .then((response) => toast.success(response.message))
        .catch((error) => console.log(error));
    } else {
      toast.error("Id not available");
    }
    setTimeout(() => fetchAllModelInfo(), "2000");
  };

  const deleteModalProps = {
    deleteModel,
    handleDeleteUpcomingModel,
  };

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="px-3 card-title">All Upcoming Models</h5>
              <button
                className="btn btn-primary"
                onClick={() => history.push("/add_upcoming_car")}
              >
                Add Upcoming Model
              </button>
            </div>
            <div className="card-body">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Expected Price</th>
                      <th>Expected Date</th>
                      <th>Delete</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allModelInfo ? (
                      allModelInfo?.map((model) => {
                        const image = model.modelImagePath.split(", ");
                        return (
                          <tr key={model._id}>
                            <td>
                              <img
                                alt=""
                                style={{
                                  width: "150px",
                                }}
                                src={image[0]}
                              />
                            </td>
                            <td>{model.modelName || "not available"}</td>
                            <td>
                              {model.modelExpectedPrice || "not available"}
                            </td>
                            <td>{model.modelLaunchDate || "not available"}</td>
                            <td>
                              <button
                                type="button"
                                class="btn btn-primary"
                                data-toggle="modal"
                                data-target="#exampleModalCenter"
                                onClick={() => setDeleteModel(model)}
                              >
                                Delete
                              </button>
                            </td>
                            <td>
                              <button
                                type="button"
                                class="btn btn-primary"
                                data-toggle="modal"
                                data-target="#exampleModalCenter"
                                onClick={() =>
                                  history.push({
                                    pathname: "/add_upcoming_car",
                                    state: { model },
                                  })
                                }
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <FetchLoader />
                    )}
                  </tbody>
                </table>
              </div>
              <DeleteModal props={deleteModalProps} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DeleteModal = ({ props }) => {
  const { deleteModel, handleDeleteUpcomingModel } = props;
  const image = deleteModel?.modelImagePath?.split(", ");
  return (
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="text-bold p-3 modal-header">
            Delete this upcoming model
          </div>
          <div class="font-bold px-2">
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Launch Date</th>
                    <th>Expected Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <img
                        alt=""
                        style={{
                          width: "150px",
                        }}
                        src={image?.[0]}
                      />
                    </td>
                    <td>
                      {deleteModel?.brandInfo?.[0]?.["Brand Name"] ||
                        "not available"}
                    </td>
                    <td>{deleteModel?.modelName || "not available"}</td>
                    <td>{deleteModel?.modelLaunchDate || "not available"}</td>
                    <td>
                      {deleteModel?.modelExpectedPrice || "not available"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              data-dismiss="modal"
              onClick={() => handleDeleteUpcomingModel(deleteModel?._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
