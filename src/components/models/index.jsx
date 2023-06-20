import { Pagination, Switch, Select } from "antd";
import { useEffect, useState } from "react";
import FetchLoader from "../../common/components/loader/fetchLoader";
import Helper from "../../common/consts/Helper";
import ModalForInfo from "./Modal";
import { useHistory } from "react-router-dom";
import Loader from "../../common/components/buttonLoader";
import { toast } from "react-toastify";
import LoadingSpinner from "../../common/components/loader/spinLoader";

export default function Models() {
  const [models, setModels] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [brandLoading, setBrandLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [totalModels, setTotalModels] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [sponsored, setSponsored] = useState([]);
  const [launched, setLaunched] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [manageData, setManageData] = useState();
  const [fileLoading, setFileLoading] = useState(false);
  const [file, setFile] = useState();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("select");
  const [insuranceLoader, setInsuranceLoader] = useState(false);
  const [insurance, setInsurance] = useState(0);
  const { Option } = Select;
  const history = useHistory();
  const [brandInfoData, setbrandInfoData] = useState({
    BrandLogo: [],
    BrandName: [],
    Description: [],
    isActive: [],
    isDeleted: [],
  });
  const [brandTypeData, setbrandTypeData] = useState({
    BrandLogo: [],
    BodyType: [],
    Description: [],
    isActive: [],
    isDeleted: [],
  });

  const fetchModels = (data = { offset: 0 }) => {
    Helper("admin/models", "POST", {
      limit: 10,
      ...data,
    })
      .then((response) => {
        setModels(response?.modelInfo);
        setTotalModels(response?.modelInfoCount);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };
  const fetchModelsParams = (currentFilter = "") => {
    let updateParams = {
      offset: 0,
    };

    if (selectedFilter === "launched") {
      updateParams = {
        ...updateParams,
        requestType: 1,
        isJustLaunchRequest: 1,
      };
    }
    if (selectedFilter === "sponsored") {
      updateParams = {
        ...updateParams,
        requestType: 1,
        isSponseredRequest: 1,
      };
    }
    if (selectedFilter === "deleted") {
      updateParams = {
        ...updateParams,
        requestType: 1,
        isDeleteRequest: 1,
      };
    }
    if (
      selectedBrandFilter !== "select" &&
      !!selectedBrandFilter &&
      currentFilter !== "selectedBrandFilter"
    ) {
      updateParams = {
        ...updateParams,
        brandId: selectedBrandFilter,
      };
    }
    return updateParams;
  };
  const editModel = (id, body, method) => {
    setIsLoading(true);
    return Helper(`model/${id}`, method, body)
      .then(() => {
        const paramsData = fetchModelsParams();
        fetchModels(paramsData);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoading(false));
  };

  const setInitialValues = () => {
    let UpcomingArray = [];
    let SponsoredArray = [];
    let launchedArray = [];
    for (let i = 0; i < 10; i++) {
      UpcomingArray[i] = false;
      SponsoredArray[i] = false;
      launchedArray[i] = false;
    }
    setUpcoming(UpcomingArray);
    setSponsored(SponsoredArray);
    setLaunched(launchedArray);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchModels();
    setInitialValues();
    getInsurance();
  }, []);

  useEffect(() => {
    setBrandLoading(true);
    fetchBrands();
  }, []);

  useEffect(() => {
    let upcomingArray = upcoming.slice();
    let sponosoredArray = sponsored.slice();
    let launchedArray = launched.slice();
    if (models?.length) {
      models?.forEach((model, index) => {
        upcomingArray[index] = model?.isUpcoming;
        sponosoredArray[index] = model?.sponsored;
        launchedArray[index] = model?.justLaunched;
      });
    }
    setUpcoming(upcomingArray);
    setSponsored(sponosoredArray);
    setLaunched(launchedArray);
  }, [models]);

  const fetchBrands = async () => {
    const result = await Helper("admin/brands", "POST", {
      isAll: 1,
    });
    setBrandLoading(false);
    setAllBrands(result?.brandInfo);
  };

  const handlePageChange = (page) => {
    setCurrent(page);
    let payload = {
      offset: (page - 1) * 10,
    };
    const updateParams = fetchModelsParams();
    payload = {
      ...payload,
      ...updateParams,
    };
    fetchModels(payload);
  };

  const handleSponsored = (
    id,
    brandId,
    modelName,
    modelFuelType,
    modelDisplacement,
    bodyTypeId,
    checked,
    key
  ) => {
    console.log(checked, "Checked");
    editModel(
      id,
      {
        brandId,
        modelName,
        modelFuelType,
        modelDisplacement,
        bodyTypeId,
        sponsored: checked,
      },
      "PUT"
    );
  };
  const handleLaunched = (
    id,
    brandId,
    modelName,
    modelFuelType,
    modelDisplacement,
    bodyTypeId,
    checked
  ) => {
    editModel(
      id,
      {
        brandId,
        modelName,
        modelFuelType,
        modelDisplacement,
        bodyTypeId,
        justLaunched: checked,
      },
      "PUT"
    );
  };
  const showModal = (index, condition) => {
    setIsModalVisible(true);
    if (condition) {
      setManageData(0);
      setbrandTypeData({
        BrandLogo: models[index].bodyTypeInfo[0]["image"],
        BodyType: models[index].bodyTypeInfo[0]["Bodytype Name"],
        Description: models[index].bodyTypeInfo[0]["description"],
        isActive: models[index].bodyTypeInfo[0]["isActive"],
        isDeleted: models[index].bodyTypeInfo[0]["isDeleted"],
      });
    } else {
      setManageData(1);
      setbrandInfoData({
        BrandLogo: models[index].brandInfo[0]["logo"],
        BrandName: models[index].brandInfo[0]["Brand Name"],
        Description: models[index].brandInfo[0]["description"],
        isActive: models[index].brandInfo[0]["isActive"],
        isDeleted: models[index].brandInfo[0]["isDeleted"],
      });
    }
  };

  const handleDisable = async (checked, modelId) => {
    await editModel(
      modelId,
      {
        isDeleted: !checked,
      },
      "DELETE"
    );
  };

  const handleExport = async () => {
    setExportLoading(true);
    Helper("export_model_meta", "POST", {})
      .then((res) => history.push("import_files"))
      .catch((error) => console.log(error))
      .finally(() => setExportLoading(false));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addMeta = () => {
    setFileLoading(true);
    let formData = new FormData();
    formData.append("file", file);
    Helper("import_model_meta", "POST", formData, true)
      .then((res) => history.push("import_files"))
      .catch((error) => console.log(error))
      .finally(() => setFileLoading(false));
  };

  const handleSponsoredFilter = (checked) => {
    const status = checked ? 1 : 0;
    checked ? setSelectedFilter("sponsored") : setSelectedFilter("");
    setCurrent(1);
    const payload = {
      requestType: status,
      isSponseredRequest: status,
      offset: 0,
    };
    if (selectedBrandFilter !== "select" && !!selectedBrandFilter) {
      payload.brandId = selectedBrandFilter;
    }
    fetchModels(payload);
  };
  const handleDeletedFilter = (checked) => {
    const status = checked ? 1 : 0;
    checked ? setSelectedFilter("deleted") : setSelectedFilter("");
    setCurrent(1);
    fetchModels({
      requestType: status,
      isDeleteRequest: status,
      offset: 0,
      brandId: selectedBrandFilter !== "select" ? selectedBrandFilter : "",
    });
  };
  const handleLaunchedFilter = (checked) => {
    console.log(checked, "Checked");
    const status = checked ? 1 : 0;
    setCurrent(1);
    const payload = {
      requestType: status,
      isJustLaunchRequest: status,
      offset: 0,
    };
    checked ? setSelectedFilter("launched") : setSelectedFilter("");
    if (selectedBrandFilter !== "select" && !!selectedBrandFilter) {
      payload.brandId = selectedBrandFilter;
    }
    fetchModels(payload);
  };

  const handlePopular = (
    id,
    brandId,
    modelName,
    modelFuelType,
    modelDisplacement,
    bodyTypeId,
    checked,
    key
  ) => {
    editModel(
      id,
      {
        brandId,
        modelName,
        modelFuelType,
        modelDisplacement,
        bodyTypeId,
        isPopular: checked,
      },
      "PUT"
    );
  };

  const handleInsurance = (e) => {
    setInsurance(e.target.value);
  };

  const getInsurance = async () => {
    let res = await Helper("get_insurance", "GET");
    console.log(res, "RES");
    setInsurance(res.insurance.insurance);
  };

  const addInsurance = async () => {
    setInsuranceLoader(true);
    let res = await Helper("set_insurance", "POST", {
      insurance,
    });
    setInsuranceLoader(false);
    toast.success(res.message);
  };

  const handleBrandFilter = (val) => {
    let payload = {};
    const updateParams = fetchModelsParams("selectedBrandFilter");
    payload = {
      ...payload,
      ...updateParams,
    };
    setSelectedBrandFilter(val);
    setCurrent(1);
    fetchModels({
      offset: 0,
      brandId: val,
      ...payload,
    });
  };

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center">
              <h5 className="card-title">Add Model Meta</h5>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-12 mt-3">
                  <div className="input-group mb-3">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input z-0"
                        id="inputGroupFile01"
                        multiple
                        onChange={handleFile}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="inputGroupFile01"
                      >
                        Choose Meta File
                      </label>
                    </div>
                  </div>
                  <div className="mt-3 mb-3 position-relative"></div>
                </div>
              </div>
              <div className="row"></div>
              <div className="col-12">
                {file ? (
                  <>
                    <span style={{ color: "#f00" }}>*</span>
                    {`${file?.name} is being imported`}
                  </>
                ) : null}
              </div>
              <div className="row">
                <div className="update ml-auto mr-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-round"
                    onClick={addMeta}
                    disabled={fileLoading}
                  >
                    {fileLoading ? (
                      <Loader loading={fileLoading} />
                    ) : (
                      "Add Meta File"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-user">
            <div className="card-header d-flex align-items-center justify-content-between">
              <div className="d-flex">
                <h5 className="card-title">All Models</h5>
              </div>
              <div className="d-flex align-items-center">
                <div className="d-flex mr-4">
                  <select
                    className="form-control"
                    defaultValue={"select"}
                    value={selectedBrandFilter}
                    onChange={(e) => handleBrandFilter(e.target.value)}
                  >
                    <option value={"select"} disabled>
                      Select
                    </option>
                    {allBrands.map((brand) => (
                      <option value={brand?._id}>
                        {brand?.["Brand Name"]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex mr-4">
                  <span className="mr-2">Sponsored</span>
                  <Switch
                    checked={selectedFilter === "sponsored"}
                    onChange={(checked) => handleSponsoredFilter(checked)}
                  />
                </div>
                <div className="d-flex mr-4">
                  <span className="mr-2">Just Launched</span>
                  <Switch
                    checked={selectedFilter === "launched"}
                    onChange={(checked) => handleLaunchedFilter(checked)}
                  />
                </div>
                <div className="d-flex mr-4">
                  <span className="mr-2">Deleted</span>
                  <Switch
                    checked={selectedFilter === "deleted"}
                    onChange={(checked) => handleDeletedFilter(checked)}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleExport}>
                  {exportLoading ? (
                    <Loader loading={exportLoading} />
                  ) : (
                    "Meta Export"
                  )}
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="col-12">
                <label for="exampleInputEmail1">Insurance Percentage</label>
                <input
                  type="number"
                  className="form-control mb-1"
                  value={insurance}
                  onChange={handleInsurance}
                />
                <button className="btn btn-primary" onClick={addInsurance}>
                  {insuranceLoader ? <LoadingSpinner /> : "Add Percentage"}
                </button>
                <table className="table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Model Image</th>
                      <th>Model Name</th>
                      <th>Body Type</th>
                      <th>Brand Info</th>
                      <th>Sponsored</th>
                      <th>Popular</th>
                      <th>Status</th>
                      <th>Just Launched</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? (
                      models?.map((model, index) => (
                        <tr key={index}>
                          <td>{(current - 1) * 10 + (index + 1)}</td>
                          <td>
                            <img
                              alt=""
                              style={{
                                width: "150px",
                              }}
                              src={model?.["Model Image Path"].split(",")[0]}
                            />
                          </td>
                          <td>{model?.["Model Name"]}</td>
                          <td>
                            <button
                              onClick={() => showModal(index, true)}
                              className="btn btn-primary"
                            >
                              View Info
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => showModal(index, false)}
                              className="btn btn-primary"
                            >
                              View Info
                            </button>
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleSponsored(
                                  model?._id,
                                  model?.brandInfo[0]?._id,
                                  model?.["Model Name"],
                                  model?.["Model FuelType"],
                                  model?.["Model Displacement (cc)"],
                                  model?.bodyTypeInfo[0]?._id,
                                  checked,
                                  index
                                )
                              }
                              checked={model.sponsored}
                            />
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handlePopular(
                                  model?._id,
                                  model?.brandInfo[0]?._id,
                                  model?.["Model Name"],
                                  model?.["Model FuelType"],
                                  model?.["Model Displacement (cc)"],
                                  model?.bodyTypeInfo[0]?._id,
                                  checked,
                                  index
                                )
                              }
                              checked={model.isPopular}
                            />
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleDisable(checked, model._id)
                              }
                              checked={!model?.isDeleted}
                            />
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleLaunched(
                                  model?._id,
                                  model?.brandInfo[0]?._id,
                                  model?.["Model Name"],
                                  model?.["Model FuelType"],
                                  model?.["Model Displacement (cc)"],
                                  model?.bodyTypeInfo[0]?._id,
                                  checked,
                                  index
                                )
                              }
                              checked={model?.justLaunched}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                history.push(`/models/${model?.["Model Name"]}`)
                              }
                            >
                              Edit
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
                  current={current}
                  total={totalModels}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalVisible ? (
        <ModalForInfo
          visible={isModalVisible}
          setvisible={setIsModalVisible}
          data={manageData === 0 ? brandTypeData : brandInfoData}
        />
      ) : null}
    </div>
  );
}
