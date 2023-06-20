import { useState, useEffect } from 'react';
import Select from "react-select";
import { toast } from 'react-toastify';

export default function ExportFeatures({Helper, history}) {

    const [brands, setBrands] = useState([]);
	const [selectedBrands, setSelectedBrands] = useState();
    const [exportBrands, setExportBrands] = useState();
	const [models, setModels] = useState([]);
	const [selectedModels, setSelectedModels] = useState();
    const [exportModels, setExportModels] = useState();
	const [variants, setVariants] = useState([]);
    const [exportVariants, setExportVariants] = useState();
    const [isLoadingBrands, setIsLoadingBrands] = useState(false);
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [isLoadingVariants, setIsLoadingVariants] = useState(false);

    const customStyles = {
		option: (provided, state) => ({
			...provided,
			textTransform: "capitalize",
		}),
		menu: ({ width, ...css }) => ({
			...css,
			width: "max-content",
			minWidth: "100%",
		}),
		container: () => ({
			minWidth: "100%",
			textTransform: "capitalize",
		}),
	};

    useEffect(() => {
		setIsLoadingBrands(true);
		Helper("fetch_brands", "GET")
			.then((brands) => setBrands(brands.brands))
			.catch((error) => console.log(error))
			.finally(() => setIsLoadingBrands(false));
	}, []);

    useEffect(() => {
		if (selectedBrands) {
			setIsLoadingModels(true);
			Helper("fetch_models", "POST", {
				brandId: selectedBrands,
			})
				.then((models) => {
					setModels(models.models);
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoadingModels(false));
		}
	}, [selectedBrands]);

	useEffect(() => {
		if (selectedModels) {
			setIsLoadingVariants(true);
			Helper("fetch_variants", "POST", {
				modelId: selectedModels,
			})
				.then((variants) => {
					setVariants(variants.variants);
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoadingVariants(false));
		}
	}, [selectedModels]);

    const brandOptions = brands?.map((brand) => {
		return {
			label: brand["Brand Name"],
			value: brand._id,
		};
	});

	const modelOptions = models?.map((model) => {
		return {
			label: model["Model Name"],
			value: model._id,
		};
	});

	const variantOptions = variants?.map((variant) => {
		return {
			label: variant["Variant Name"],
			value: variant._id,
			modelId: variant.modelId,
			brandId: variant.brandId,
		};
	});

    
    const handleExport = () => {
		Helper("export_features", "POST", {
			brands: exportBrands || "",
			models: exportModels || "",
			variants: exportVariants || "",
		})
			.then((response) => {
				if(!response.error) {
					history.push("/import_files");
				} else {
					toast.error(response.error);
				}
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className="row">
			<div className="col-md-12">
				<div className="card card-user">
					<div className="card-header d-flex align-items-center">
						<div>
							<i className="fas fa-arrow-left p-3 cursor-pointer"></i>
						</div>
						<div className="col-md-12 d-flex justify-content-between">
							<h5 className="card-title">Export Features</h5>
						</div>
					</div>
					<div className="card-body">
						<div className="row">
							<div className="col-md-4 mt-3">
								<label>Choose Brand</label>
								<div class="input-group mb-3">
									<Select
										isMulti
										options={brandOptions}
										styles={customStyles}
										onChange={(values) => {
											setSelectedBrands(
												values.map(
													(value) => value.value
												)
											);
											setExportBrands(
												values.map(
													(value) => value.label
												)
											);
										}}
										isLoading={isLoadingBrands}
									/>
								</div>
							</div>
							<div className="col-md-4 mt-3">
								<label>Choose Model</label>
								<div class="input-group mb-3">
									<Select
										isMulti
										options={modelOptions}
										isDisabled={
											selectedBrands ? false : true
										}
										styles={customStyles}
										onChange={(values) => {
											setSelectedModels(
												values.map(
													(value) => value.value
												)
											);
											setExportModels(
												values.map(
													(value) => value.label
												)
											);
										}}
										isLoading={isLoadingModels}
									/>
								</div>
							</div>
							<div className="col-md-4 mt-3">
								<label>Choose Variants</label>
								<div class="input-group mb-3">
									<Select
										isMulti
										options={variantOptions}
										isDisabled={
											selectedModels ? false : true
										}
										styles={customStyles}
										onChange={(values) => {
											setExportVariants(
												values.map(
													(value) => value.label
												)
											);
										}}
										isLoading={isLoadingVariants}
									/>
								</div>
							</div>
							<div className="col-md-12 d-flex justify-content-center">
								<button
									className="btn btn-primary mr-5"
									onClick={handleExport}>
									Export
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
