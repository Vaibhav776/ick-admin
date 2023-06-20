import { useState } from "react";
import { useEffect } from "react";
import { Pagination, Switch } from "antd";
import moment from "moment";
import Helper from "../../common/consts/Helper";
import FetchLoader from "../../common/components/loader/fetchLoader";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";

export default function Reviews() {
  const pageSize = 10;
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const history = useHistory();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = (offset = 0) => {
    setLoading(true);
    Helper("admin/get_reviews", "POST", {
      limit: pageSize,
      offset,
    })
      .then((res) => {
        setReviews(res.reviews);
        setTotalReviews(res.totalReviews);
      })
      .catch((error) => console.log(error))
      .finally(setLoading(false));
  };

  const handleReviews = (url, method, body) => {
    Helper(url, method, body)
      .then(() => fetchReviews())
      .catch((error) => console.log(error));
  };

  const handleDisable = async (checked, reviewId) => {
    await handleReviews(`review/${reviewId}`, "DELETE", {
      isDeleted: !checked,
    });
  };

  const handlePageChange = (page) => {
    setCurrent(page);
    fetchReviews((page - 1) * pageSize);
  };

  const handleDelete = async (reviewId) => {
    const body = {
      isDeleted: true,
    };
    const result = await Helper(`review/${reviewId}`, "DELETE", body);
    console.log(result);
    if (result.message === "Reviews deleted successfully") {
      fetchReviews();
      setCurrent(1);
    } else {
      toast.error("Error while delete Review Please try after some time");
    }
  };
  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center justify-content-between">
              <h5 className="card-title">All Reviews</h5>
              <button
                className="btn btn-primary"
                onClick={() => history.push("add_review")}
              >
                Add review
              </button>
            </div>
            <div className="card-body">
              <div className="col-12">
                <table className="table">
                  <thead>
                    <tr>
                      <th>S.No.</th>
                      <th>Type</th>
                      <th>Heading</th>
                      <th>Descriptiom</th>
                      <th>Rating</th>
                      <th>User Name</th>
                      <th>Creation Date</th>
                      <th>Action</th>
                      {/* <th>Status</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!loading ? (
                      reviews?.map((review, index) => (
                        <tr key={index}>
                          <td>{(current - 1) * pageSize + (index + 1)}</td>
                          <td>{review?.type}</td>
                          <td>{review?.reviewHeading}</td>
                          <td>{review?.reviewSubText}</td>
                          <td>{review?.rating}</td>
                          <td>{review?.userInfo?.[0]?.name}</td>
                          <td>
                            {moment(review?.createdAt).format("MMMM Do, YYYY")}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleDelete(review?._id)}
                            >
                              Delete
                            </button>
                          </td>
                          {/* <td>
														<Switch
															onChange={(
																checked
															) =>
																handleDisable(
																	checked,
																	review._id
																)
															}
															checked={
																!review?.isDeleted
															}
														/>
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
                  total={totalReviews}
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
