import { Pagination, Switch } from "antd";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import FetchLoader from "../../common/components/loader/fetchLoader";
import Helper from "../../common/consts/Helper";
import { useHistory } from "react-router-dom";
import Loader from "../../common/components/buttonLoader";

export default function Brands() {
  const [file, setFile] = useState();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [totalBrands, setTotalBrands] = useState(0);
  const [current, setCurrent] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const pageSize = 10;
  const history = useHistory();

  useEffect(() => {
    handleBrands("admin/brands", "POST", { limit: pageSize, offset: 0 });
  }, []);

  const handleBrands = (url, method, body = { requestType: 0 }) => {
    setLoading(true);
    return Helper(url, method, body)
      .then((brands) => {
        setBrands(brands.brandInfo);
        setTotalBrands(brands?.brandInfoCount);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const handlePageChange = (page) => {
    setCurrent(page);
    handleBrands("admin/brands", "POST", {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  };

  const handleDisable = async (checked, brandId) => {
    await handleBrands(`brand/${brandId}`, "DELETE", {
      isDeleted: !checked,
    });
    await handleBrands("admin/brands", "POST", {});
  };

  const handlePopular = async (checked, brandId, brandName) => {
    await handleBrands(`brand/${brandId}`, "PUT", {
      isPopular: checked,
      brandName,
    });
    await handleBrands("admin/brands", "POST", {});
  };

  const handleSponsored = async (checked, brandId, brandName) => {
    await handleBrands(`brand/${brandId}`, "PUT", {
      sponsored: checked,
      brandName,
    });
    await handleBrands("admin/brands", "POST", {});
  };

  const handleExport = async () => {
    setExportLoading(true);
    Helper("export_brand_meta", "POST", {})
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
    Helper("import_brand_meta", "POST", formData, true)
      .then((res) => history.push("import_files"))
      .catch((error) => console.log(error))
      .finally(() => setFileLoading(false));
  };

  const handleSponsoredFilter = (checked) => {
    console.log(checked, "Checked");
    const status = checked ? 1 : 0;
    setSelectedFilter("sponsored");
    handleBrands("admin/brands", "POST", {
      requestType: status,
      isSponseredRequest: status,
    });
  };
  const handleDeletedFilter = (checked) => {
    console.log(checked, "Checked");
    const status = checked ? 1 : 0;
    setSelectedFilter(status);
    handleBrands("admin/brands", "POST", {
      requestType: status,
      isDeleteRequest: status,
    });
  };

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center">
              <h5 className="card-title">Add Brand Meta</h5>
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
                <h5 className="card-title">All Brands</h5>
              </div>
              <div className="d-flex align-items-center">
                {/* <div className="d-flex mr-4">
									<span className="mr-2">Sponsored</span>
									<Switch
										checked={selectedFilter === "sponsored"}
										onChange={(checked) =>
											handleSponsoredFilter(checked)
										}
									/>
								</div> */}
                <div className="d-flex mr-4">
                  <span className="mr-2">Deleted</span>
                  <Switch
                    checked={selectedFilter}
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
                      <th>Logo</th>
                      <th>Brand Name</th>
                      <th>Creation Date</th>
                      <th>Status</th>
                      <th>Popular</th>
                      <th>Sponsored</th>
                      <th>Edit</th>
                      {/* <th>Position</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? (
                      brands?.map((brand, index) => (
                        <tr key={index}>
                          <td>{(current - 1) * pageSize + (index + 1)}</td>
                          <td>
                            {brand?.["Brand Logo"] !== "" ? (
                              <img
                                alt=""
                                style={{
                                  width: "150px",
                                }}
                                src={brand?.["Brand Logo"]}
                              />
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>{brand?.["Brand Name"]}</td>
                          <td>
                            {moment(brand?.createdAt).format("MMMM Do, YYYY")}
                          </td>
                          <td>
                            <Switch
                              checked={!brand?.isDeleted}
                              onChange={(checked) =>
                                handleDisable(checked, brand._id)
                              }
                            />
                          </td>
                          <td>
                            <Switch
                              checked={brand?.isPopular}
                              onChange={(checked) =>
                                handlePopular(
                                  checked,
                                  brand._id,
                                  brand["Brand Name"]
                                )
                              }
                            />
                          </td>
                          <td>
                            <Switch
                              checked={brand?.sponsored}
                              onChange={(checked) =>
                                handleSponsored(
                                  checked,
                                  brand._id,
                                  brand["Brand Name"]
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                history.push({
                                  pathname: `/brands/${brand?.["Brand Name"]}`,
                                  state: { ...brand },
                                })
                              }
                            >
                              Edit
                            </button>
                          </td>
                          {/* <td>
														<input className="position-box" type="number" />
													</td> */}
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
                  total={totalBrands}
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
