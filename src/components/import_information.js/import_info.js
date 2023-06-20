import { useEffect, useState } from "react";
import Helper from "../../common/consts/Helper";
import { BASE_URL } from "../../common/consts/Config";
import moment from "moment";
import { Link } from "react-router-dom";

function Import_Info() {
  const [data, setData] = useState([]);

  useEffect(() => {
    Helper("files", "POST", {
      limit: 10,
      offset: 0,
    })
      .then(async (response) => {
        setData(response.files);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        console.log("Download successfull");
      });
  }, []);
  console.log(data, "hey this is files");
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center">
              <div>
                <Link to="/brands">
                  <i className="fas fa-arrow-left p-3 cursor-pointer"></i>
                </Link>
              </div>
              <h5 className="card-title">Import Files</h5>
            </div>
            <div className="card-body">
              <table className="col-md-12 border">
                <tr className="">
                  <th className="col-md-4 border border-r ">Created at</th>
                  <th className="col-md-4 border border-r ">Files</th>
                  <th className="col-md-4 border border-r">Type</th>
                  <th className="col-md-4 border border-r">No of Records</th>
                  <th className="col-md-4 ">Download</th>
                </tr>
                {data.length > 0
                  ? data.map((visit, index) => {
                      console.log("visit", visit);
                      return (
                        <tr key={index}>
                          <td className="col-md-4 border border-r ">
                            {moment(visit?.createdAt).format(
                              "Do MMMM, YYYY, h:mm:ss A"
                            )}
                          </td>
                          <td className="col-md-4 border border-r ">
                            {visit.fileName}
                          </td>
                          <td className="col-md-3 border border-r ">
                            {visit.type}
                          </td>
                          <td className="col-md-3 border border-r  ">
                            {visit.recordCount}
                          </td>
                          <td className="col-md-4 border border-r ">
                            {visit.completed ? (
                              visit.type === "export" ? (
                                <button
                                  onClick={() =>
                                    window.open(
                                      `${BASE_URL}public/${visit.fileName}`,
                                      "_blank"
                                    )
                                  }
                                  className="btn-primary btn px-4"
                                >
                                  Download
                                </button>
                              ) : (
                                <button
                                  disabled={true}
                                  className="btn btn-primary"
                                >
                                  Processed
                                </button>
                              )
                            ) : (
                              <button disabled={true} className="btn">
                                Processing
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </table>
              {!data.length ? (
                <div
                  className="d-flex align-items-center justify-content-center text-bold mt-5"
                  style={{ fontSize: "20px" }}
                >
                  No Data Found
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Import_Info;
