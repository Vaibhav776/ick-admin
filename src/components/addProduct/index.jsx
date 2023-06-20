import React, { useState } from "react";
import { useHistory } from "react-router-dom";

//helper functions

import { Checkbox, Col, Row } from 'antd';
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";
import Loader from "../../common/components/buttonLoader";
import { useEffect } from "react";

function AddProductForm() {
	const history = useHistory();

	const [file, setFile] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const [checkAll, setCheckAll] = useState(true);
	const [allFields, setAllFields] = useState([]);
	const [selectedFields, setSelectedFields] = useState([]);
	const [exportLoading, setExportLoading] = useState(false);

	useEffect(() => {
		Helper("fetch_fields", "GET")
			.then((res) => {

				setAllFields(res.fields)
				setSelectedFields(res.fields)
			})
			.catch(error => console.log(error));
	}, [])

	const onChange = (checkedValue) => {
		if (checkedValue.length === allFields.length) {
			setCheckAll(true)
		} else {
			setCheckAll(false);
		}
		setSelectedFields(checkedValue);
	};

	const onCheckAllChange = (e) => {
		setCheckAll(e.target.checked)
		if (e.target.checked) {
			setSelectedFields([...allFields])
		} else {
			setSelectedFields([]);
		}
	};

	const addProduct = () => {
		if (file) {
			setIsLoading(true);
			let formData = new FormData();
			formData.append("file", file);
			Helper("import", "POST", formData, true)
				.then((response) => {
					if (!response.error) {
						history.push("/import_files");
					}
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoading(false));
		} else {
			toast.error("Please select atleast one file");
		}
	};

	const handleFile = (e) => {
		setFile(e.target.files[0]);
	};

	const handleExport = () => {
		setExportLoading(true)
		Helper("export_ic_car_data", "POST", { fields: selectedFields })
			.then((res) => {
				if (res?.data) {
					history.push("/import_files");
				}
			})
			.catch((error) => console.log(error))
			.finally(() => setExportLoading(false))
	}

	return (
		<div className="content">
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user pt-1">
						<div className="card-header d-flex align-items-center justify-content-between">
							<div className="d-flex">
								<h5 className="card-title">Export Product File</h5>
							</div>
						</div>
						<div className="card-body px-4 py-0">
							<Row>
								<Col span={8}>
									<Checkbox checked={checkAll} onChange={onCheckAllChange}>Check All</Checkbox>
								</Col>
							</Row>
							<Checkbox.Group style={{ width: "100%" }} onChange={onChange} value={selectedFields}>
								<Row>
									{
										allFields?.map((field, index) => (
											<Col key={index} span={8}>
												<Checkbox checked={true} disabled={field === "model image path" ? true : false } value={field} onChange={onChange}>{field}</Checkbox>
											</Col>
										))
									}
								</Row>
							</Checkbox.Group>
							<div className="row mb-auto">
								<div className="update ml-auto mr-auto">
									<button
										type="button"
										className="btn btn-primary btn-round"
										onClick={handleExport}
										disabled={exportLoading}>
										{exportLoading ? (
											<Loader loading={exportLoading} />
										) : (
											"Export Product File"
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className="card card-user pt-1">
						<div className="card-header d-flex align-items-center justify-content-between">
							<div className="d-flex">
								<h5 className="card-title">Add Product File</h5>
							</div>
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
												onChange={handleFile}
											/>
											<label
												className="custom-file-label"
												htmlFor="inputGroupFile01">
												{file
													? file?.name
													: "Choose Product File"}
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
										onClick={addProduct}
										disabled={isLoading}>
										{isLoading ? (
											<Loader loading={isLoading} />
										) : (
											"Add Product File"
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddProductForm;
