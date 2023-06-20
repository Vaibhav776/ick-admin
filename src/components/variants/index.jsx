import { useEffect, useState } from "react";
import FetchLoader from "../../common/components/loader/fetchLoader";
import Helper from "../../common/consts/Helper";
import moment from "moment";
import { Pagination, Switch } from "antd";
import { useHistory } from "react-router-dom";
import Loader from "../../common/components/buttonLoader";

export default function Variants() {
  const pageSize = 10;
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);
  const [totalVariant, setTotalVariant] = useState(0);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [file, setFile] = useState();
  const history = useHistory();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("select");
  const [selectedModelFilter, setSelectedModelFilter] = useState("select");

  useEffect(() => {
    fetchVariants(0);
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrandFilter !== "select") {
      fetchModels(selectedBrandFilter);
    }
  }, [selectedBrandFilter]);

  const fetchBrands = async () => {
    let res = await Helper("admin/brands", "POST", {
      isAll: 1,
    });
    setBrands(res.brandInfo);
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
    if (selectedModelFilter !== "select" && !!selectedModelFilter) {
      updateParams = {
        ...updateParams,
        modelId: selectedModelFilter,
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
  const fetchModels = async (brand) => {
    let res = await Helper("admin/models", "POST", {
      isAll: 1,
      brandId: brand,
    });
    setModels(res.modelInfo);
  };

  const fetchVariants = (data = { offset: 0 }) => {
    setLoading(true);
    console.log(data, "DATA");
    Helper("admin/variants", "POST", {
      limit: 10,
      offset: data.offset,
      ...data,
    })
      .then((variants) => {
        setVariants(variants.variantInfo);
        setTotalVariant(variants.variantInfoCount);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const editVariant = (id, body, method) => {
    setLoading(true);
    return Helper(`get_variant/${id}`, method, body)
      .then(() => {
        const paramsData = fetchModelsParams();
        fetchVariants(paramsData);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const handleDisable = async (checked, variantId) => {
    console.log(checked, "Cjec");
    await editVariant(variantId, { isDeleted: !checked }, "DELETE");
  };

  const handleSponsored = async (checked, variantId, variantName, modelId) => {
    await editVariant(
      variantId,
      { sponsored: checked, variantName, modelId },
      "PUT"
    );
  };

  const handlePopular = async (checked, variantId, variantName, modelId) => {
    await editVariant(
      variantId,
      { isPopular: checked, variantName, modelId },
      "PUT"
    );
  };

  const handleLaunched = async (checked, variantId, variantName, modelId) => {
    await editVariant(
      variantId,
      { justLaunched: checked, variantName, modelId },
      "PUT"
    );
  };

  const handlePageChange = (page) => {
    setCurrent(page);
    let payload = {
      offset: (page - 1) * pageSize,
    };
    if (selectedModelFilter !== "select" && !!selectedModelFilter) {
      payload.modelId = selectedModelFilter;
    }
    if (selectedBrandFilter !== "select") {
      payload = {
        ...payload,
        brandId: selectedBrandFilter,
      };
    }
    if (selectedFilter === "sponsored") {
      payload = {
        ...payload,
        requestType: 1,
        isSponseredRequest: 1,
      };
    }
    if (selectedFilter === "deleted") {
      payload = {
        ...payload,
        requestType: 1,
        isDeleteRequest: 1,
      };
    }
    fetchVariants(payload);
  };

  const handleExport = async () => {
    setExportLoading(true);
    Helper("export_variant_meta", "POST", {})
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
    setSelectedFilter(checked ? "sponsored" : "");
    setCurrent(1);
    const payload = {
      requestType: status,
      isSponseredRequest: status,
      offset: 0,
    };
    if (selectedBrandFilter !== "select" && !!selectedBrandFilter) {
      payload.brandId = selectedBrandFilter;
    }
    if (selectedModelFilter !== "select" && !!selectedModelFilter) {
      payload.modelId = selectedModelFilter;
    }
    fetchVariants(payload);
  };
  const handleDeletedFilter = (checked) => {
    const status = checked ? 1 : 0;
    setSelectedFilter(checked ? "deleted" : "");
    setCurrent(1);
    fetchVariants({
      requestType: status,
      isDeleteRequest: status,
      offset: 0,
      brandId: selectedBrandFilter !== "select" ? selectedBrandFilter : "",
      modelId: selectedModelFilter !== "select" ? selectedModelFilter : "",
    });
  };

  // const handleBrandFilter = (val) => {
  // 	setSelectedBrandFilter(val);
  // 	fetchVariants({
  // 		offset: 0,
  // 		brandId: val,
  // 	})
  // 	setSelectedModelFilter("select");
  // }

  const handleBrandFilter = (val) => {
    let payload = {};
    setSelectedBrandFilter(val);
    const updateParams = fetchModelsParams("selectedBrandFilter");
    payload = {
      ...payload,
      ...updateParams,
      brandId: val,
    };
    // fetchVariants({
    // 	offset: 0,
    // 	brandId: val,
    // })
    fetchVariants(payload);
    setSelectedModelFilter("select");
  };

  const handleModelFilter = (val) => {
    setSelectedModelFilter(val);
    fetchVariants({
      offset: 0,
      brandId: selectedBrandFilter,
      modelId: val,
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
                <h5 className="card-title">All Variants</h5>
              </div>
              <div className="d-flex align-items-center">
                <div className="d-flex mr-4 align-items-center">
                  <span className="mr-2">Brand</span>
                  <select
                    className="form-control"
                    defaultValue={"select"}
                    value={selectedBrandFilter}
                    onChange={(e) => handleBrandFilter(e.target.value)}
                  >
                    <option value={"select"} disabled>
                      Select
                    </option>
                    {brands.map((brand) => (
                      <option value={brand?._id}>
                        {brand?.["Brand Name"]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex mr-4 align-items-center">
                  <span className="mr-2">Model</span>
                  <select
                    className="form-control"
                    defaultValue={"select"}
                    value={selectedModelFilter}
                    onChange={(e) => handleModelFilter(e.target.value)}
                  >
                    <option value={"select"} disabled>
                      Select
                    </option>
                    {models.map((model) => (
                      <option value={model?._id}>
                        {model?.["Model Name"]}
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
                <table className="table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Variant Image</th>
                      <th>Brand Name</th>
                      <th>Model Name</th>
                      <th>Variant Name</th>
                      <th>Fuel Type</th>
                      <th>Creation Date</th>
                      <th>Status</th>
                      <th>Sponsored</th>
                      <th>Popular</th>
                      <th>Just Launched</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? (
                      variants?.map((variant, index) => (
                        <tr key={index}>
                          <td>{(current - 1) * pageSize + (index + 1)}</td>
                          <td>
                            <img
                              alt=""
                              style={{
                                width: "150px",
                              }}
                              src={
                                variant?.["Variant Image Path"]?.split(",")[0]
                              }
                            />
                          </td>
                          <td>
                            {variant?.brandId?.[0]?.[
                              "Brand Name"
                            ].toUpperCase()}
                          </td>
                          <td>
                            {variant?.modelId?.[0]?.[
                              "Model Name"
                            ].toUpperCase()}
                          </td>
                          <td>{variant?.["Variant Name"].toUpperCase()}</td>
                          <td>
                            {variant?.["FUEL"]?.[
                              "Variant Fuel Type"
                            ].toUpperCase()}
                          </td>
                          <td>
                            {moment(variant?.createdAt).format("MMMM Do, YYYY")}
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleDisable(checked, variant._id)
                              }
                              checked={!variant?.isDeleted}
                            />
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleSponsored(
                                  checked,
                                  variant._id,
                                  variant["Variant Name"],
                                  variant.modelId[0]?._id
                                )
                              }
                              checked={variant?.sponsored}
                            />
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handlePopular(
                                  checked,
                                  variant._id,
                                  variant["Variant Name"],
                                  variant.modelId[0]?._id
                                )
                              }
                              checked={variant?.isPopular}
                            />
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleLaunched(
                                  checked,
                                  variant._id,
                                  variant["Variant Name"],
                                  variant.modelId[0]?._id
                                )
                              }
                              checked={variant?.justLaunched}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                history.push(
                                  `/variants/${variant?.modelId?.[0]?._id}/${variant?._id}`
                                )
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
                  total={totalVariant}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
