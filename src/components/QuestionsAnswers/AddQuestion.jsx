import Select from "react-select";
import { useEffect, useState } from "react";
import Helper from "../../common/consts/Helper";
import { toast } from "react-toastify";
import { useLocation, useHistory, Link } from "react-router-dom";

export default function AddQuestion() {
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
	const location = useLocation();
  const history = useHistory();
	const isEdit = location.state ? true : false;
	const [brands, setBrands] = useState([]);
	const [models, setModels] = useState([]);
	const [variants, setVariants] = useState([]);
	const [selectedBrands, setSelectedBrands] = useState();
	const [selectedModels, setSelectedModels] = useState();
	const [selectedVariants, setSelectedVariants] = useState();
	const [isLoadingBrands, setIsLoadingBrands] = useState(false);
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [isLoadingVariants, setIsLoadingVariants] = useState(false);
	const [question, setQuestion] = useState("");
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
	useEffect(() => {
		if (location.state) {
      console.log(location.state?.question.variantInfo);
			setSelectedBrands({
				label: location.state?.question?.variantInfo
					?.brandInfo?.[0]?.["Brand Name"],
				value: location.state?.question?.variantInfo
					?.brandInfo?.[0]?._id,
			});
			setSelectedModels({
				label: location.state?.question?.variantInfo
					?.modelInfo?.[0]?.["Model Name"],
				value: location.state?.question?.variantInfo
					?.modelInfo?.[0]?._id,
			});
			setSelectedVariants({
				label: location.state?.question?.variantInfo?.["Variant Name"],
				value: location.state?.question?.variantInfo?._id
			});
      setQuestion(location.state?.question?.question)
		}
	}, [location.state, brands]);
	useEffect(() => {
		setIsLoadingBrands(true);
		Helper("fetch_brands", "GET")
			.then((brands) => {
				setBrands(brands.brands);
			})
			.catch((error) => console.log(error))
			.finally(() => {
				setIsLoadingBrands(false);
			});
	}, []);
	useEffect(() => {
		if (selectedBrands) {
			setIsLoadingModels(true);
			Helper("fetch_models", "POST", {
				brandId: [selectedBrands.value],
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
				modelId: [selectedModels.value],
			})
				.then((variants) => {
					setVariants(variants.variants);
				})
				.catch((error) => console.log(error))
				.finally(() => setIsLoadingVariants(false));
		}
	}, [selectedModels]);

	const addQuestion = async () => {
    const url = isEdit ? `question/${location.state?.question?._id}` : "question";
    const method = isEdit ? "PUT" : "POST";
    const payload = isEdit
		? { ...location.state.question, question }
		: { type: "variant", typeId: selectedVariants.value, question };
		let result = await Helper(url, method, {
			...payload
		});
		if (result.msg) {
			history.push("/qa_panel")
			toast.success("Question added successfully");
		}
		isEdit ? setQuestion(question) : setQuestion("") ;
	};
  
	return (
		<div className="content">
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user">
						<div className="card-header d-flex align-items-center justify-content-between mt-2">
							<div className="d-flex">
								<div className="my-auto">
									<Link to= '/qa_panel'>
									<i className="fas fa-arrow-left px-3 cursor-pointer"></i>
									</Link>
								</div>
								<h5 className="my-auto card-title">
									{isEdit ? "Edit Question" : "Add Question"}
								</h5>
							</div>
						</div>
						<div className="card-body">
							<div className="row">
								{!isEdit && (
									<>
										<div className="col-md-4">
											<label>Choose Brand</label>
											<div className="input-group mb-3">
												<Select
													placeholder={"Select..."}
													isDisabled={isEdit}
													options={brandOptions}
													styles={customStyles}
													value={selectedBrands}
													onChange={(value) => {
														console.log(
															"VALLSS",
															value
														);
														setSelectedModels(
															undefined
														);
														setSelectedVariants(
															undefined
														);
														setSelectedBrands(
															value
														);
													}}
													isLoading={isLoadingBrands}
												/>
											</div>
										</div>
										<div className="col-md-4">
											<label>Choose Model</label>
											<div className="input-group mb-3">
												<Select
													placeholder={"Select..."}
													value={selectedModels}
													options={modelOptions}
													isDisabled={
														isEdit ||
														selectedBrands?.value
															? false
															: true
													}
													styles={customStyles}
													onChange={(value) => {
														setSelectedModels(
															value
														);
													}}
													isLoading={isLoadingModels}
												/>
											</div>
										</div>
										<div className="col-md-4">
											<label>Choose Variant</label>
											<div className="input-group mb-3">
												<Select
													placeholder={"Select..."}
													options={variantOptions}
													value={selectedVariants}
													isDisabled={
														selectedModels?.value
															? false
															: true
													}
													styles={customStyles}
													onChange={(value) => {
														setSelectedVariants(
															value
														);
													}}
													isLoading={
														isLoadingVariants
													}
												/>
											</div>
										</div>
									</>
								)}
								<div className="col-md-12 mt-3">
									<label>Question</label>
									<input
										value={question}
										disabled={
											selectedVariants?.value
												? false
												: true
										}
										className="form-control"
										onChange={(e) =>
											setQuestion(e.target.value)
										}
									/>
								</div>
								<div className="col-md-12 d-flex justify-content-center mt-4">
									<button
										className="btn btn-primary"
										onClick={addQuestion}>
										{isEdit ? "Update Question" : "Add Question"}
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
