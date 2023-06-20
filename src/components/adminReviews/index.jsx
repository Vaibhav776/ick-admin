import { useState, useEffect } from "react";
import { Pagination, Switch } from "antd";
import { useHistory } from 'react-router-dom';
import moment from "moment";
import Helper from "../../common/consts/Helper";
import FetchLoader from "../../common/components/loader/fetchLoader";
import Reviews from "../reviews";

export default function AdminReviews() {
	return (
		<>
			<Reviews />
		</>
		// <div className="content">
		// 	<div className="row">
		// 		<div className="col-md-12">
		// 			<div className="card card-user">
		// 				<div className="card-header d-flex align-items-center justify-content-between">
		// 						<h5 className="card-title">All Reviews</h5>
        //                         <button className="btn btn-primary" onClick={() => history.push("add_review")}>Add review</button>
		// 				</div>
		// 				<div className="card-body">
		// 					<div className="col-12">
		// 						<table className="table">
		// 							<thead>
		// 								<tr>
		// 									<th>S.No.</th>
		// 									<th>Type</th>
		// 									<th>Heading</th>
		// 									<th>Descriptiom</th>
		// 									<th>Rating</th>
		// 									<th>User Name</th>
		// 									<th>Creation Date</th>
		// 									<th>Status</th>
		// 								</tr>
		// 							</thead>
		// 							<tbody>
		// 								{/* {!loading ? (
		// 									reviews?.map((review, index) => (
		// 										<tr key={index}>
		// 											<td>
		// 												{(current - 1) *
		// 													pageSize +
		// 													(index + 1)}
		// 											</td>
		// 											<td>{review?.type}</td>
		// 											<td>
		// 												{review?.reviewHeading}
		// 											</td>
		// 											<td>
		// 												{review?.reviewSubText}
		// 											</td>
		// 											<td>{review?.rating}</td>
		// 											<td>
		// 												{
		// 													review
		// 														?.userInfo?.[0]
		// 														?.name
		// 												}
		// 											</td>
		// 											<td>
		// 												{moment(
		// 													review?.createdAt
		// 												).format(
		// 													"MMMM Do, YYYY"
		// 												)}
		// 											</td>
		// 											<td>
		// 												<Switch
		// 													onChange={(
		// 														checked
		// 													) =>
		// 														handleDisable(
		// 															checked,
		// 															review._id
		// 														)
		// 													}
		// 													checked={
		// 														!review?.isDeleted
		// 													}
		// 												/>
		// 											</td>
		// 										</tr>
		// 									))
		// 								) : (
		// 									<div className="row">
		// 										<div className="d-flex justify-content-center">
		// 											<FetchLoader />
		// 										</div>
		// 									</div>
		// 								)} */}
		// 							</tbody>
		// 						</table>
		// 					</div>
		// 					<div className="col-12">
		// 						<Pagination
		// 							pageSize={pageSize}
		// 							current={current}
		// 							total={totalReviews}
		// 							onChange={handlePageChange}
		// 						/>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>
		// </div>
	);
}
