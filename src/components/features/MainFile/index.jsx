import {useState} from 'react';

export default function MainFile({ Helper, toast, history, Loader}) {
    const [mainFile, setMainFile] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleMainFile = (e) => {
		setMainFile(e.target.files[0]);
	};

	const addMainFeatures = () => {
		if(mainFile) {
			let formData = new FormData();
			formData.append("file", mainFile);
			setIsLoading(true);
			Helper("import_main_file", "POST", formData, true)
				.then((response) => {
					if (response?.error) {
						toast.error(response.error);
						setIsLoading(false);
						return;
					}
					history.push("/import_files");
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoading(false))
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
							<h5 className="card-title">Add Main File</h5>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-12 mt-3">
									<div className="input-group mb-3">
										<div className="custom-file">
											<input
												type="file"
												className="custom-file-input"
												id="inputGroupFile01"
												onChange={handleMainFile}
											/>
											<label
												className="custom-file-label"
												htmlFor="inputGroupFile01">
												{mainFile
													? mainFile?.name
													: "Choose Feature File"}
											</label>
										</div>
									</div>
									<div className="mt-3 mb-3 position-relative"></div>
								</div>
							</div>
							<div className="row"></div>
							<div className="col-12">
								{mainFile ? (
									<>
										<span style={{ color: "#f00" }}>*</span>
										{`${mainFile?.name} is being imported`}
									</>
								) : null}
							</div>
							<div className="row">
								<div className="update ml-auto mr-auto">
									<button
										type="button"
										className="btn btn-primary btn-round"
										onClick={addMainFeatures}>
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
    )
}