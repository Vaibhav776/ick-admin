import { Checkbox, Pagination, Switch } from "antd";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../../common/components/buttonLoader";
import Helper from "../../common/consts/Helper";

export default function News() {
  const history = useHistory();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState([]);
  const [current, setCurrent] = useState(1);
  const [totalNews, setTotalNews] = useState(0);
  const [newSearchList, setNewSearchList] = useState(newsList.newsInfo);
  const [exportLoading, setExportLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [file, setFile] = useState();
  const pageSize = 10;
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews(
    offset = 0,
    isSpecialNews = 0,
    status = false,
    statusType = null
  ) {
    try {
      let data = {
        limit: pageSize,
        offset,
      };
      if (isSpecialNews) {
        data["isSpecialNews"] = 1;
      }
      console.log(status, "STATUSS");
      if (status) {
        if (statusType === "delete") {
          data["requestType"] = 1;
          data["isDeleteRequest"] = 1;
        }
        if (statusType === "sponsored") {
          data["requestType"] = 1;
          data["isSponseredRequest"] = 1;
        }
      }
      const response = await Helper("admin/news", "POST", data);
      if (response) {
        setNewsList(response);
        setNewSearchList(response.newsInfo);
        setTotalNews(response.newsInfoCount);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const editNews = async (newsId, body = {}, method) => {
    await Helper(`news/${newsId}`, method, body);
    fetchNews();
  };

  const handleDisable = async (checked, newsId) => {
    console.log(checked);
    await editNews(
      newsId,
      {
        isDeleted: !checked,
      },
      "DELETE"
    );
  };

  const handlePageChange = (page) => {
    setCurrent(page);
    fetchNews((page - 1) * pageSize);
  };

  const handleExport = async () => {
    setExportLoading(true);
    Helper("export_news_meta", "POST", {})
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
    Helper("import_news_meta", "POST", formData, true)
      .then((res) => history.push("import_files"))
      .catch((error) => console.log(error))
      .finally(() => setFileLoading(false));
  };

  const handleDeletedFilter = (checked) => {
    const status = checked ? 1 : 0;
    fetchNews(0, 0, status, "delete");
  };

  const handleSponsoredFilter = (checked) => {
    const status = checked ? 1 : 0;
    fetchNews(0, 0, status, "sponsored");
  };

  const handleSponsored = (checked, value) => {
    setLoader(true);
    Helper(`news/${value._id}`, "PUT", {
      // newsTitle: value.newsTitle,
      // newsDescription: value.newsDescription,
      // newsImage: value.newsImage,
      // newsShortDescription: value.newsShortDescription,
      // newsVideo: value.newsVideo,
      // snippet: value.snippet,
      // isHeader: value.isHeader,
      // isHeaderUpdatedAt: value.isHeaderUpdatedAt,
      // isHomePage: value.isHomePage,
      // isHomePageUpdatedAt: value.isHomePageUpdatedAt,
      // isMenu: value.isMenu,
      // isMenuUpdatedAt: value.isMenuUpdatedAt,
      // isNewsSection: value.isNewsSection,
      // isNewsSectionUpdatedAt: value.isNewsSectionUpdatedAt,
      sponsered: checked,

      newsTitle: value.newsTitle,
      newsDescription: value.newsDescription,
      newsImage: value.newsImage,
      newsShortDescription: value.newsShortDescription,
      newsVideo: value.newsVideo,
      snippet: value.snippet,
      sponsered: value.sponsered,
      isHeader: value.isHeader,
      isHeaderUpdatedAt: value.isHeaderUpdatedAt,
      isHomePage: value.isHomePage,
      isHomePageUpdatedAt: value.isHomePageUpdatedAt,
      isMenu: value.isMenu,
      isMenuUpdatedAt: value.isMenuUpdatedAt,
      isNewsSection: value.isNewsSection,
      isNewsSectionUpdatedAt: value.isNewsSectionUpdatedAt,
      tags: value.tags,
      // [place]: checked.target.checked,
      // [updatedAt]: new Date(),
    })
      .then((res) => {
        fetchNews();
        if (res) {
          setLoader(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const handleChecked = (checked, place, updatedAt, value) => {
    console.log(checked, "Checked");
    setLoader(true);
    Helper(`news/${value._id}`, "PUT", {
      newsTitle: value.newsTitle,
      newsDescription: value.newsDescription,
      newsImage: value.newsImage,
      newsShortDescription: value.newsShortDescription,
      newsVideo: value.newsVideo,
      snippet: value.snippet,
      sponsered: value.sponsered,
      isHeader: value.isHeader,
      isHeaderUpdatedAt: value.isHeaderUpdatedAt,
      isHomePage: value.isHomePage,
      isHomePageUpdatedAt: value.isHomePageUpdatedAt,
      isMenu: value.isMenu,
      isMenuUpdatedAt: value.isMenuUpdatedAt,
      isNewsSection: value.isNewsSection,
      isNewsSectionUpdatedAt: value.isNewsSectionUpdatedAt,
      tags: value.tags,
      [place]: checked.target.checked,
      [updatedAt]: new Date(),
    })
      .then((res) => {
        fetchNews();
        if (res) {
          setLoader(false);
        }
      })
      .catch((error) => console.log(error));
  };

  const handlePositionFilter = (checked) => {
    fetchNews(0, checked);
  };

  console.log(newSearchList, "List");

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
                <div>
                  <i className="fas fa-arrow-left p-3 cursor-pointer"></i>
                </div>
                <h5 className="card-title">All News</h5>
              </div>
              <div className="d-flex align-items-center">
                <div className="mr-4 d-flex align-items-center">
                  <span className="mr-2">By Position</span>
                  <Switch
                    onChange={(checked) => handlePositionFilter(checked)}
                  />
                </div>
                <div className="mr-4 d-flex align-items-center">
                  <span className="mr-2">Sponsored</span>
                  <Switch
                    onChange={(checked) => handleSponsoredFilter(checked)}
                  />
                </div>
                <div className="mr-4 d-flex align-items-center">
                  <span className="mr-2">Deleted</span>
                  <Switch
                    onChange={(checked) => handleDeletedFilter(checked)}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => history.push("/create_news")}
                >
                  Create News
                </button>
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
              <div className="col-md-12 mt-3"></div>
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Image</th>
                      <th>Title</th>
                      <th>Short Description</th>
                      <th>Tags</th>
                      <th>Sponsored</th>
                      <th>Status</th>
                      <th>Heading News</th>
                      <th>Homepage News</th>
                      <th>Menu News</th>
                      <th>In News</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  {!loading ? (
                    <tbody>
                      {newSearchList?.map((value, index) => (
                        <tr key={value._id}>
                          <td>{index + 1}</td>
                          <td
                            style={{
                              width: "220px",
                            }}
                          >
                            <img
                              style={{
                                width: "100px",
                              }}
                              alt=""
                              src={value.newsImage}
                            />
                          </td>
                          <td>{value.newsTitle}</td>
                          <td>{value.newsShortDescription}</td>
                          {/* <td>
															<div
																dangerouslySetInnerHTML={{
																	__html: value.newsDescription,
																}}></div>
														</td> */}
                          <td>
                            {value.tags.length > 0
                              ? value.tags
                                  .map((tag) => tag.name || tag.label)
                                  .join(", ")
                              : "miscllaneous"}
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleSponsored(checked, value)
                              }
                              disabled={loader}
                              checked={value.sponsered}
                            />
                          </td>
                          <td>
                            <Switch
                              onChange={(checked) =>
                                handleDisable(checked, value._id)
                              }
                              disabled={loader}
                              checked={!value?.isDeleted}
                            />
                          </td>
                          <td>
                            <Checkbox
                              checked={value.isHeader}
                              disabled={loader}
                              onChange={(checked) =>
                                handleChecked(
                                  checked,
                                  "isHeader",
                                  "isHeaderUpdatedAt",
                                  value
                                )
                              }
                            />
                          </td>
                          <td>
                            <Checkbox
                              checked={value.isHomePage}
                              disabled={loader}
                              onChange={(checked) =>
                                handleChecked(
                                  checked,
                                  "isHomePage",
                                  "isHomePageUpdatedAt",
                                  value
                                )
                              }
                            />
                          </td>
                          <td>
                            <Checkbox
                              checked={value.isMenu}
                              disabled={loader}
                              onChange={(checked) =>
                                handleChecked(
                                  checked,
                                  "isMenu",
                                  "isMenuUpdatedAt",
                                  value
                                )
                              }
                            />
                          </td>
                          <td>
                            <Checkbox
                              checked={value.isNewsSection}
                              disabled={loader}
                              onChange={(checked) =>
                                handleChecked(
                                  checked,
                                  "isNewsSection",
                                  "isNewsSectionUpdatedAt",
                                  value
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              disabled={loader}
                              onClick={() =>
                                history.push({
                                  pathname: "edit_news",
                                  state: {
                                    value,
                                  },
                                })
                              }
                            >
                              {loader ? <Loader loading={loader} /> : "Edit"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div>Loading....</div>
                  )}
                </table>
              </div>
              <div className="col-12">
                <Pagination
                  pageSize={pageSize}
                  current={current}
                  total={totalNews}
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
