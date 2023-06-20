import { useState } from "react";
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";

export default function EditModel() {
	const params = useParams();
	const [details, setDetails] = useState({});
	const history = useHistory();
	useEffect(() => {
		Helper(`model/${params.modelName}`, "GET")
			.then((res) => {
				let details = res?.modelInfo?.[0];
				setDetails({
					brandId: details?.["brandInfo"]?.[0]?._id,
					modelId: details?._id,
					brandName: details?.brandInfo?.[0]?.["Brand Name"],
					modelName: details?.["Model Name"],
					bodyTypeId: details?.["bodyTypeInfo"]?.[0]?._id,
					modelImagePath: details?.["Model Image Path"],
					globalNCapRating: details?.["Global NCAP Rating"],
					modelDisplacement: details?.["Model Displacement (cc)"],
					modelFuelType: details?.["Model FuelType"],
					modelMileage: details?.["Model Mileage"],
					modelPriceRange: details?.["Model Price Range"],
					modelSeatingCapacity: details?.["Model Seating Capacity"],
					modelTransmission: details?.["Model Transmission"],
					metaTitle: details?.metaTitle,
					metaDescription: details?.metaDescription,
					metaKeywords: details?.metaKeywords
				})
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
		Helper(`model/${details.modelId}`, "PUT", details)
			.then((res) => {
				toast.success(`${res.message}`);
				history.push("/models");
			})
			.catch((error) => console.log(error));
	};

	console.log(details, "Details");

	return (
		<div className="content">
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user">
						<div className="card-header d-flex align-items-center">
							<h5 className="card-title">Edit Model</h5>
						</div>

						<div className="card-body">
							<div className="row">
								<div className="col-md-12">
									<div className="form-group">
										<div className="col-md-12 mb-3">
											<div className="row">
												<div className="col-md-6 mb-4">
													<label>Brand Name</label>
													<input type="text" className="form-control" disabled={true} value={details?.brandName} />
												</div>
												<div className="col-md-6 mb-4">
													<label>Model Name</label>
													<input type="text" className="form-control" disabled={true} value={details?.modelName} />
												</div>
											</div>
											<label for="exampleInputEmail1">
												Model Image
											</label>
											<input
												required
												type="text"
												name="modelImagePath"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.["modelImagePath"]
												}
												onChange={handleChange}
											/>
											{details?.["modelImagePath"] !==
												"" && (
													<img
														src={
															details?.[
															"modelImagePath"
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
												Global NCAP Rating
											</label>
											<input
												required
												type="text"
												name="globalNCapRating"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.[
													"globalNCapRating"
													]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Model Displacement
											</label>
											<input
												required
												type="text"
												name="modelDisplacement"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.[
													"modelDisplacement"
													]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Fuel Type
											</label>
											<input
												required
												type="text"
												name="modelFuelType"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.["modelFuelType"]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Model Mileage
											</label>
											<input
												required
												type="text"
												name="modelMileage"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.["modelMileage"]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Model Price Range
											</label>
											<input
												required
												type="text"
												name="modelPriceRange"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.["modelPriceRange"]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Model Seating Capacity
											</label>
											<input
												required
												type="text"
												name="modelSeatingCapacity"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.[
													"modelSeatingCapacity"
													]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Model Transmission
											</label>
											<input
												required
												type="text"
												name="modelTransmission"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={
													details?.[
													"modelTransmission"
													]
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Meta Description
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
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Meta Title
											</label>
											<input
												required
												type="text"
												name="metaDescription"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={details?.metaDescription}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12 mb-3">
											<label for="exampleInputEmail1">
												Meta Keywords
											</label>
											<input
												required
												type="text"
												name="metaKeywords"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={details?.metaKeywords}
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
