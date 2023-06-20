import { useState } from "react";
import { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";

export default function EditVariant() {
	const params = useParams();
	const [details, setDetails] = useState({});
	const history = useHistory();
	useEffect(() => {
		Helper(
			`admin/variant/${params.modelId}/${params.variantId}`,
			"POST",
			{}
		)
			.then((res) => {
				console.log(res?.msg?.data?.[0], "REsponse");
				let details = res?.msg?.data?.[0];
				setDetails({
					brandName: details?.brandInfo?.["Brand Name"],
					modelName: details?.modelInfo?.["Model Name"],
					modelId: params.modelId,
					fuelType: details?.["FUEL"]?.["Variant Fuel Type"],
					variantId: params.variantId,
					variantName: details?.["Variant Name"],
					variantImagePath: details?.["Variant Image Path"],
					warrantyPeriod: details?.["Warranty Period"],
					warrantyDistance: details?.["Warranty Distance"],
					metaTitle: details?.metaInfo?.[0]?.metaTitle,
					metaDescription: details?.metaInfo?.[0]?.metaDescription,
					metaKeywords: details?.metaInfo?.[0]?.metaKeywords,
				});
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

	console.log(details, "Details***");

	return (
		<div className="content">
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user">
						<div className="card-header d-flex align-items-center">
							<h5 className="card-title">Edit Variant</h5>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-12">
									<div className="form-group">
										<div className="row">
											<div className="col-md-6 mb-4">
												<label>Brand Name</label>
												<input type="text" className="form-control" disabled={true} value={details?.brandName} />
											</div>
											<div className="col-md-6">
												<label>Model Name</label>
												<input type="text" className="form-control" disabled={true} value={details?.modelName} />
											</div>
											<div className="col-md-6">
												<label>Variant Name</label>
												<input type="text" className="form-control" disabled={true} value={details?.variantName} />
											</div>
											<div className="col-md-6">
												<label>Fuel Type</label>
												<input type="text" className="form-control" disabled={true} value={details?.fuelType} />
											</div>
										</div>
										<div className="col-md-12 mb-3 mt-4">
											<label for="exampleInputEmail1">
												Variant Image
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
												Variant Warranty Period
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
												Variant Warranty Distance
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
