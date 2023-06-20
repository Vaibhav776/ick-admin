import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//helper functions
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";
import Loader from "../../common/components/buttonLoader";
import Select from "react-select";
import Modal from "./modal";
import { Checkbox } from "antd";
import GlobalFeatures from "./GlobalFeatures";
import MainFile from "./MainFile";
import ExportFeatures from "./ExportFeatures";

function Features() {
	const [brands, setBrands] = useState([]);
	const [selectedBrands, setSelectedBrands] = useState();
	const [exportBrands, setExportBrands] = useState();
	const [models, setModels] = useState([]);
	const [selectedModels, setSelectedModels] = useState();
	const [exportModels, setExportModels] = useState();
	const [variants, setVariants] = useState([]);
	const [selectedVariants, setSelectedVariants] = useState();
	const [exportVariants, setExportVariants] = useState();
	const [featureHeadings, setFeatureHedings] = useState([]);
	const [features, setFeatures] = useState();
	const [selectedFeatures, setSelectedFeatures] = useState();
	const [tableData, setTableData] = useState([]);
	const [specificFeatures, setSpecificFeatures] = useState([]);
	const [modalVariant, setModalVariant] = useState("");
	const [data, setData] = useState([]);
	const [selectedModalIndex, setSelectedModalIndex] = useState();

	const [isLoadingBrands, setIsLoadingBrands] = useState(false);
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [isLoadingVariants, setIsLoadingVariants] = useState(false);
	const [variantSpecific, setVariantSpecific] = useState();

	//checkbox
	const history = useHistory();

	const handleCheckBox = (heading, list) => {
		let newList = [];
		list.forEach((val) => {
			let found = features[heading].find((head) => head.Feature === val);
			newList.push(found);
		});
		let newSelectedFeatures = {
			...selectedFeatures,
			[heading]: newList,
		};

		let specificFeatureList = {
			...specificFeatures,
			[heading]: features[heading]?.filter(
				(head) =>
					!newSelectedFeatures?.[heading]?.find(
						(subSelected) => head.Feature === subSelected
					)
			),
		};
		Object.keys(features).forEach((key) => {
			if (!(key in specificFeatureList)) {
				specificFeatureList[key] = features[key];
			}
		});

		let finalData = [];
		let newData = {
			variantId: selectedVariants,
			standardFeatures: newSelectedFeatures,
			specificFeatures: data[0].specificFeatures,
		};
		finalData.push(newData);
		setData(finalData);
		setSelectedFeatures(newSelectedFeatures);
		setSpecificFeatures(specificFeatureList);
	};

	useEffect(() => {
		setIsLoadingBrands(true);
		Helper("fetch_brands", "GET")
			.then((brands) => setBrands(brands.brands))
			.catch((error) => console.log(error))
			.finally(() => setIsLoadingBrands(false));
	}, []);

	useEffect(() => {
		Helper("features", "GET")
			.then((features) => setFeatures(features.features))
			.catch((error) => console.log(error));
	}, []);

	useEffect(() => {
		if (selectedBrands) {
			setIsLoadingModels(true);
			Helper("fetch_models", "POST", {
				brandId: [selectedBrands],
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
				modelId: [selectedModels],
			})
				.then((variants) => {
					setVariants(variants.variants);
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoadingVariants(false));
		}
	}, [selectedModels]);

	useEffect(() => {
		if (selectedVariants) {
			Helper("fetch_variant_features", "POST", {
				variantIds: [selectedVariants],
			})
				.then((response) => {
					let specificFeatureList = {...features};
					let standardFeature = response?.data?.[0]?.standardFeature;
					let specificFeature = response?.data?.map((d) => d.features ? d.features : {});
					let specific = [];
					Object.keys(standardFeature).forEach(stdFeat => {
						specific = features[stdFeat].filter((subFeat) => !standardFeature[stdFeat].find(stdSubFeat => stdSubFeat.Feature === subFeat.Feature))
						specificFeatureList[stdFeat] = specific;
					})
					setVariantSpecific(specificFeature);
					setSpecificFeatures(specificFeatureList);
					setSelectedFeatures(response?.data?.[0]?.standardFeature);
					let newData = response?.data?.map((d) => {
						return {
							variantId: d._id,
							standardFeatures: d.standardFeature ? d.standardFeature : {},
							specificFeatures: d.features ? d.features : {}
						};
					});
					setData(newData);
				})
				.catch((error) => console.log(error));
			let newData = {
				variantId: selectedVariants,
				standardFeatures: selectedFeatures,
				specificFeatures: {},
			};
			let finalData = [newData];
			setData(finalData);
		}
	}, [selectedVariants]);

	useEffect(() => {
		if (features) {
			let featureKeys = Object.keys(features);
			setFeatureHedings(featureKeys);
		}
	}, [features]);

	const handleSelection = (type, values) => {
		let data = [];
		values.forEach((value) => {
			let brand = brands.find((brand) => brand._id === value.brandId);
			let model = models.find((model) => model._id === value.modelId);
			let tabData = {
				brand: brand["Brand Name"],
				model: model["Model Name"],
				variant: value["label"],
				variantId: value["value"],
			};
			data.push(tabData);
		});
		setTableData(data);
	};

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

	const addSpecificFeature = (tabData, index) => {
		setModalVariant(tabData);
		setSelectedModalIndex(index);
	};

	const saveFeatures = () => {
		let newData = [];
		data.forEach((variantData, index) => {
			let tempData = {
				variantId: variantData.variantId,
				standardFeatures: variantData.standardFeatures,
				specificFeatures: variantData.specificFeatures,
			};
			newData.push(tempData);
		});
		Helper("save_features", "POST", {
			data: newData,
		})
			.then((response) => {
				toast.success("Features saved successfully");
			})
			.catch((error) => console.log(error));
	};

	return (
		<div className="content">
			<GlobalFeatures
				Helper={Helper}
				toast={toast}
				history={history}
				Loader={Loader}
			/>
			<MainFile
				Helper={Helper}
				toast={toast}
				history={history}
				Loader={Loader}
			/>
			<ExportFeatures
				exportBrands={exportBrands}
				exportModels={exportModels}
				exportVariants={exportVariants}
				history={history}
				Helper={Helper}
			/>
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user">
						<div className="card-header d-flex align-items-center">
							<div>
								<i className="fas fa-arrow-left p-3 cursor-pointer"></i>
							</div>
							<div className="col-md-12 d-flex justify-content-between">
								<h5 className="card-title">Save Features</h5>
							</div>
						</div>
						<div className="card-body">
							<div className="row">
								<div className="col-md-4 mt-3">
									<label>Choose Brand</label>
									<div className="input-group mb-3">
										<Select
											options={brandOptions}
											styles={customStyles}
											onChange={(value) => {
												setSelectedModels(undefined);
												setSelectedVariants(undefined);
												setSelectedFeatures([]);
												setSelectedBrands(value.value);
												setExportBrands(value.label);
											}}
											isLoading={isLoadingBrands}
										/>
									</div>
								</div>
								<div className="col-md-4 mt-3">
									<label>Choose Model</label>
									<div className="input-group mb-3">
										<Select
											options={modelOptions}
											isDisabled={
												selectedBrands ? false : true
											}
											styles={customStyles}
											onChange={(value) => {
												setSelectedModels(value.value);
												setExportModels(value.label);
											}}
											isLoading={isLoadingModels}
										/>
									</div>
								</div>
								<div className="col-md-4 mt-3">
									<label>Choose Variants</label>
									<div className="input-group mb-3">
										<Select
											options={variantOptions}
											isDisabled={
												selectedModels ? false : true
											}
											styles={customStyles}
											onChange={(value) => {
												setSelectedVariants(
													value.value
												);
												setExportVariants(value.label);
												handleSelection("variants", [
													value,
												]);
											}}
											isLoading={isLoadingVariants}
										/>
									</div>
								</div>
							</div>
							{selectedVariants && (
								<div className="row d-flex justify-content-center">
									<div className="col-md-12 mt-3">
										<label>Choose Standard Features</label>
										<div className="input-group mb-3">
											{featureHeadings?.map(
												(heading, index) => {
													return (
														<div
															key={index}
															className="">
															<div>{heading}</div>
															<div className="col-12 my-2">
																<Checkbox.Group
																	onChange={(
																		checkedValues
																	) =>
																		handleCheckBox(
																			heading,
																			checkedValues
																		)
																	}
																	options={features?.[
																		heading
																	]?.map(
																		(
																			feature
																		) =>
																			feature.Feature
																	)}
																	value={selectedFeatures?.[
																		heading
																	]?.map(
																		(
																			feat
																		) =>
																			feat.Feature
																	)}></Checkbox.Group>
															</div>
														</div>
													);
												}
											)}
										</div>
									</div>
								</div>
							)}
							{selectedVariants && (
								<div className="row">
									<div className="col-12">
										<div className="table-responsive">
											<table className="table">
												<thead>
													<tr>
														<th scope="col">#</th>
														<th scope="col">
															Brands
														</th>
														<th scope="col">
															Models
														</th>
														<th scope="col">
															Variants
														</th>
														<th scope="col">
															Standard Features
														</th>
														<th scope="col">
															Add Specific
															Features
														</th>
													</tr>
												</thead>
												<tbody>
													{tableData?.map(
														(tabData, index) => (
															<tr key={index}>
																<th>
																	{index + 1}
																</th>
																<td>
																	{
																		tabData?.brand
																	}
																</td>
																<td>
																	{
																		tabData?.model
																	}
																</td>
																<td>
																	{
																		tabData?.variant
																	}
																</td>
																<td>
																	{selectedFeatures &&
																		Object.keys(
																			selectedFeatures
																		)?.map(
																			(
																				feature,
																				index
																			) => (
																				<tr
																					key={
																						index
																					}>
																					<th>
																						{
																							feature
																						}
																					</th>
																					{selectedFeatures[
																						feature
																					]?.map(
																						(
																							subFeature,
																							subIndex
																						) => (
																							<tr
																								index={`${index}${subIndex}`}>
																								{
																									subFeature?.Feature
																								}
																							</tr>
																						)
																					)}
																				</tr>
																			)
																		)}
																</td>
																<td>
																	{data[index]
																		?.specificFeatures &&
																		Object.keys(
																			data?.[
																				index
																			]
																				?.specificFeatures
																		)?.map(
																			(
																				specFeature,
																				specIndex
																			) => (
																				<tr
																					key={
																						index
																					}>
																					<th>
																						{
																							specFeature
																						}
																					</th>
																					{data?.[
																						index
																					]?.specificFeatures?.[
																						specFeature
																					]?.map(
																						(
																							specSubFeature,
																							subSpecIndex
																						) => (
																							<tr
																								key={`${index}${subSpecIndex}`}>
																								{
																									specSubFeature?.Feature
																								}
																							</tr>
																						)
																					)}
																				</tr>
																			)
																		)}
																	<button
																		className="btn btn-primary"
																		data-toggle="modal"
																		data-target="#featureModal"
																		disabled={
																			!selectedFeatures
																		}
																		onClick={() =>
																			addSpecificFeature(
																				tabData,
																				index
																			)
																		}>
																		Add
																		Features
																	</button>
																</td>
															</tr>
														)
													)}
												</tbody>
											</table>
											<div className="col-12 d-flex justify-content-center">
												<button
													className="btn btn-primary"
													disabled={!selectedFeatures}
													onClick={saveFeatures}>
													Save Features
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{data.length ? (
				<Modal
					variantName={modalVariant}
					features={specificFeatures}
					setVariantSpecific={setVariantSpecific}
					variantSpecific={variantSpecific}
					data={data}
					setData={setData}
					selectedModalIndex={selectedModalIndex}
					show={data.length && true}
					specificFeatures={specificFeatures}
				/>
			) : null}
		</div>
	);
}

export default Features;
