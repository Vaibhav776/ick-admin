import { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";

export default function EditBrand() {
    const history = useHistory();
	const [details, setDetails] = useState(history.location.state);

    const handleChange = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        })
    }

    const updateBrand = () => {
		details.brandName = details["Brand Name"];
		details.logo = details["Brand Logo"];
        Helper(`brand/${details._id}`, "PUT", details)
            .then(res => {
                toast.success(`${res.message}`)
                // history.push("/brands")
            })
            .catch(error => console.log(error));
    }

	return (
		<div className="content">
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user">
						<div className="card-header d-flex align-items-center">
							<h5 className="card-title">Edit Brand</h5>
						</div>

						<div className="card-body">
							<div className="row">
								<div className="col-md-12">
									<div className="form-group">
										<div className="col-md-12 mb-3">
											<div className="row">
												<div className="col-md-12 mb-4">
													<label>Brand Name</label>
													<input
														type="text"
														className="form-control"
														disabled={true}
														value={
															details?.[
																"Brand Name"
															]
														}
													/>
												</div>
											</div>
											<label for="exampleInputEmail1">
												Logo Url
											</label>
											<input
												required
												type="text"
												name="Brand Logo"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={details?.["Brand Logo"]}
												onChange={handleChange}
											/>
											{details?.["Brand Logo"] !== "" && (
												<img
													src={
														details?.["Brand Logo"]
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
											<textarea
												required
												type="text"
												name="description"
												className="form-control"
												id="exampleInputEmail1"
												aria-describedby="emailHelp"
												value={details?.description}
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
												value={
													details?.metaInfo?.[0]
														?.metaTitle
												}
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
												value={
													details?.metaInfo?.[0]
														?.metaDescription
												}
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
												value={
													details?.metaInfo?.[0]
														?.metaKeywords
												}
												onChange={handleChange}
											/>
										</div>
										<div className="col-md-12">
											<div className="d-flex justify-content-center">
												<button
													className="btn btn-primary text-center"
													onClick={updateBrand}>
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
