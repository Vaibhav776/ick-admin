import { useState } from 'react';

export default function GlobalFeatures({ Helper, toast, history, Loader}) {
	const [file, setFile] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const handleFile = (e) => {
		setFile(e.target.files[0]);
	};

	const addFeatures = () => {
		if (file) {
			setIsLoading(true);
			let formData = new FormData();
			formData.append("file", file);
			Helper("import_features", "POST", formData, true)
				.then((response) => {
					toast.success(response.msg);
					history.push("/import_files");
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoading(false));
		} else {
			toast.error("Please select atleast one file");
		}
	};

	return (
		<div className="row">
			<div className="col-md-12">
				<div className="card card-user">
					<div className="card-header d-flex align-items-center">
						<div>
							<i className="fas fa-arrow-left p-3 cursor-pointer"></i>
						</div>
						<h5 className="card-title">Add Global File</h5>
					</div>
					<div className="card-body">
						<div className="row">
							<div className="col-md-12 mt-3">
								<div class="input-group mb-3">
									<div class="custom-file">
										<input
											type="file"
											className="custom-file-input"
											id="inputGroupFile01"
											onChange={handleFile}
										/>
										<label
											className="custom-file-label"
											htmlFor="inputGroupFile01">
											{file
												? file?.name
												: "Choose Feature File"}
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
									onClick={addFeatures}>
									{isLoading ? (
										<Loader loading={isLoading} />
									) : (
										"Add Feature File"
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}