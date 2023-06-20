import React, { useState } from "react";

import { Radio, Space } from "antd";
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";
import FetchLoader from "../../common/components/loader/fetchLoader";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function AddSlider() {
  const fieldMap = [
    {
      fieldName: "title",
    },
    {
      fieldName: "description",
    },
    {
      fieldName: "image",
    },
    {
      fieldName: "video"
    },
    {
      fieldName: "url",
      placeholder: "enter link eg:( /news_collections/news-name )",
    },
  ];
  const [inputValue, setInputValue] = useState({ sponsered: false });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const [banner, setBanner] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const history = useHistory();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInputValue({ ...inputValue, [name]: value });
  };
  
  const addBanner = (bannerId) => {
    if (inputValue) {
      setIsLoading(true);
      const url = isEdit ? `banner/${inputValue._id}` : 'banner';
      const method = isEdit ? "PUT" : "POST";
      Helper(url, method, inputValue)
        .then((response) => {
          setInputValue({sponsered: false})
          toast.success(response.message)
          setIsEdit(false)
        })
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
      fetchBanners();
    } else {
      toast.error("Please fill missing fields");
    }
  };

  async function fetchBanners() {
    try {
      const response = await Helper("banners", "POST", {
        isAll: 1,
      });
      if (response?.bannerInfo) {
        setData(response.bannerInfo);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteBanner = (element) => {
    if (element) {
      Helper(`banner/${element}`, "DELETE")
        .then((response) => {
          fetchBanners();
          toast.success(response.message)
        })
        .catch((error) => console.log(error));
    } else {
      toast.error("Id not available");
    }
    fetchBanners();
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleEdit = (model, index) => {
    setInputValue({title: model.title, description: model.description, image: model.image, video: model?.video, url: model.url, sponsered: model.sponsered, _id: model._id})
    setIsEdit(true)
  }

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="adjust-header">
                <div className="d-flex">
                  <h5 className="card-title ml-2">{isEdit ? "Edit Banner" : "Add Banners"}</h5>
                </div>
              </div>
            </div>
            <div className="card-body border-bottom">
              <div className="row">
                {fieldMap.map((value, index) => (
                  <div className="col-md-12 mb-3" key={value + "-" + index}>
                    <label
                      for="exampleInputEmail1"
                      style={{ textTransform: "capitalize" }}
                    >
                      {value.fieldName}
                    </label>
                    <input
                      required
                      value={inputValue[value.fieldName] || ''}
                      placeholder={value.placeholder}
                      type="text"
                      name={value.fieldName}
                      className="form-control"
                      id={`id-${value.fieldName}-input`}
                      aria-describedby="emailHelp"
                      onChange={handleInput}
                    />
                  </div>
                ))}
                <div className="col-md-12 mb-3">
                  <label for="exampleInputEmail1">Sponsered</label>
                  <div className="d-flex">
                    <Radio.Group
                      name="sponsered"
                      onChange={handleInput}
                      style={{ marginTop: "16px", marginBottom: "16px" }}
                      value={inputValue?.sponsered}
                    >
                      <Space direction="vertical">
                        <Radio value={true}></Radio>
                        <Radio value={false}></Radio>
                      </Space>
                    </Radio.Group>
                    <div className="grid">
                      <div style={{ marginTop: "12px" }}>Yes</div>
                      <div style={{ marginTop: "8px" }}>No</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addBanner}
                    className={
                      isLoading
                        ? "btn btn-round btn-disabled"
                        : "btn btn-round btn-primary"
                    }
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : isEdit ? "Update Banner" : "Add Banner"}
                  </button>
                </div>
              </div>
            </div>
            <div className="d-flex ml-4 mt-4">
              <h5 className="card-title pb-2">All Banners</h5>
            </div>
            <div className="card-body">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Title</th>
                      <th>Image</th>
                      <th>Video</th>
                      <th>Description</th>
                      <th>url</th>
                      <th>Delete Banner</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data ? (
                      data?.map((model, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{model.title}</td>
                          <td>
                            {
                              model.image ? <img
                                alt=""
                                style={{
                                  width: "150px",
                                }}
                                src={model.image}
                              /> : '-'
                            }
                          </td>
                          <td>
                            {model.video ? model.video : '-'}
                          </td>
                          <td>{model.description}</td>
                          <td>{model.url}</td>
                          <td>
                            <button
                              type="button"
                              class="btn btn-primary"
                              data-toggle="modal"
                              data-target="#exampleModalCenter"
                              onClick={() => setBanner(model)}
                            >
                              Delete
                            </button>
                          </td>
                          <td><button className="btn btn-primary" onClick={() => {handleEdit(model, index)}}>Edit</button></td>
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
                      Delete this banner
                    </div>
                    <div class="font-bold px-2">
                      <div>
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Title</th>
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
                                  src={banner?.image}
                                />
                              </td>
                              <td>{banner?.title}</td>
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
                        disabled={isLoading ? true : false}
                        onClick={() => handleDeleteBanner(banner?._id)}
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
