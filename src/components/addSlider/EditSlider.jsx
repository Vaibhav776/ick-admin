import { useState } from "react";
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";

export default function EditSlider() {
	const params = useParams();
	const [details, setDetails] = useState({});
	const history = useHistory();
	useEffect(() => {
		Helper(`banner/${params.sliderId}`, "GET")
			.then((res) => {
				console.log(res, "REsponse");
				// let details = res?.msg?.data?.[0];
				// setDetails({
				// 	modelId: params.modelId,
				// 	variantId: params.variantId,
				// 	variantName: details?.["Variant Name"],
				// 	variantImagePath: details?.["Variant Image Path"],
				// 	warrantyPeriod: details?.["Warranty Period"],
				// 	warrantyDistance: details?.["Warranty Distance"],
				// 	metaTitle: details?.metaTitle,
				// 	metaDescription: details?.metaDescription,
				// 	metaKeywords: details?.metaKeywords,
				// });
			})
			.catch((error) => console.log(error));
	}, []);

	const handleChange = (e) => {
		setDetails({
			...details,
			[e.target.name]: e.target.value,
		});
	};

	const updateModel = () => {
		Helper(`get_variant/${details.variantId}`, "PUT", details)
			.then((res) => {
				toast.success(`${res.msg}`);
				history.push("/variants");
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className="content">
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user">
						<div className="card-header d-flex align-items-center">
							<h5 className="card-title">Edit Slider</h5>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-12">
									<div className="form-group">
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Title
											</label>
											<input
												required
												type="text"
												name="variantImagePath"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.[
														"variantImagePath"
													]
												}
												onChange={handleChange}
											/>
											{details?.["variantImagePath"] !==
												"" && (
												<img
													src={
														details?.[
															"variantImagePath"
														]
													}
													style={{
														width: "100px",
														height: "100px",
													}}
												/>
											)}
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
                                                Description
											</label>
											<input
												required
												type="text"
												name="warrantyPeriod"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.["warrantyPeriod"]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Image
											</label>
											<input
												required
												type="text"
												name="warrantyDistance"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.[
														"warrantyDistance"
													]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Video
											</label>
											<input
												required
												type="text"
												name="metaTitle"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={details?.metaTitle}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12">
											<div className="d-flex justify-content-center">
												<button
													className="btn btn-primary text-center"
													onClick={updateModel}>
													Update
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
		</div>
	);
}
