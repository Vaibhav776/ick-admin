import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom';
import Helper from "../../../common/consts/Helper";

function AddComparisons() {
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
    const history = useHistory();

    const [brands1, setBrands1] = useState([]);
    const [models1, setModels1] = useState([]);
    const [variants1, setVariants1] = useState([]);
    const [brands2, setBrands2] = useState([]);
    const [models2, setModels2] = useState([]);
    const [variants2, setVariants2] = useState([]);
    const [selectedBrands1, setSelectedBrands1] = useState();
    const [selectedModels1, setSelectedModels1] = useState();
    const [selectedVariants1, setSelectedVariants1] = useState();
    const [selectedBrands2, setSelectedBrands2] = useState();
    const [selectedModels2, setSelectedModels2] = useState();
    const [selectedVariants2, setSelectedVariants2] = useState();

    const [isLoadingBrands1, setIsLoadingBrands1] = useState(false);
    const [isLoadingModels1, setIsLoadingModels1] = useState(false);
    const [isLoadingVariants1, setIsLoadingVariants1] = useState(false);
    const [isLoadingBrands2, setIsLoadingBrands2] = useState(false);
    const [isLoadingModels2, setIsLoadingModels2] = useState(false);
    const [isLoadingVariants2, setIsLoadingVariants2] = useState(false);

    useEffect(() => {
        setIsLoadingBrands1(true);
        Helper("fetch_brands", "GET")
            .then((brands) => {
                setBrands1(brands.brands)
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setIsLoadingBrands1(false)
            });
    }, []);
    useEffect(() => {
        setIsLoadingBrands2(true);
        Helper("fetch_brands", "GET")
            .then((brands) => {
                setBrands2(brands.brands)
            })
            .catch((error) => console.log(error))
            .finally(() => {
                setIsLoadingBrands2(false)
            });
    }, []);
    useEffect(() => {
        if (selectedBrands1) {
            setIsLoadingModels1(true);
            Helper("fetch_models", "POST", {
                brandId: [selectedBrands1],
            })
                .then((models) => {
                    setModels1(models.models);
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoadingModels1(false));
        }
        if (selectedBrands2) {
            setIsLoadingModels2(true);
            Helper("fetch_models", "POST", {
                brandId: [selectedBrands2],
            })
                .then((models) => {
                    setModels2(models.models);
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoadingModels2(false));
        }
    }, [selectedBrands1, selectedBrands2]);

    useEffect(() => {
        if (selectedModels1) {
            setIsLoadingVariants1(true);
            Helper("fetch_variants", "POST", {
                modelId: [selectedModels1],
            })
                .then((variants) => {
                    setVariants1(variants.variants);
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoadingVariants1(false));
        }
        if (selectedModels2) {
            setIsLoadingVariants2(true);
            Helper("fetch_variants", "POST", {
                modelId: [selectedModels2],
            })
                .then((variants) => {
                    setVariants2(variants.variants);
                })
                .catch((error) => console.log(error))
                .finally(() => setIsLoadingVariants2(false));
        }
    }, [selectedModels1, selectedModels2]);

    const brandOptions1 = brands1?.map((brand) => {
        return {
            label: brand["Brand Name"],
            value: brand._id,
        };
    });
    const brandOptions2 = brands2?.map((brand) => {
        return {
            label: brand["Brand Name"],
            value: brand._id,
        };
    });

    const modelOptions1 = models1?.map((model) => {
        return {
            label: model["Model Name"],
            value: model._id,
        };
    });
    const modelOptions2 = models2?.map((model) => {
        return {
            label: model["Model Name"],
            value: model._id,
        };
    });

    const variantOptions1 = variants1?.map((variant) => {
        return {
            label: variant["Variant Name"],
            value: variant._id,
            modelId: variant.modelId,
            brandId: variant.brandId,
        };
    });
    const variantOptions2 = variants2?.map((variant) => {
        return {
            label: variant["Variant Name"],
            value: variant._id,
            modelId: variant.modelId,
            brandId: variant.brandId,
        };
    });
    
    const handleComparison = () => {
        let body = {
            carId1: selectedVariants1,
            carId2: selectedVariants2
        }
        Helper("add_comparison", "POST", body)
            .then(response => toast.success("Comparison added"))
            .catch(error => console.log(error));
    }

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-user">
                        <div className="card-header d-flex align-items-center">
                            <div onClick={() => history.push("/comparisons")}>
                                <i className="fas fa-arrow-left p-3 cursor-pointer"></i>
                            </div>
                            <div className="col-md-12 d-flex justify-content-between">
                                <h5 className="card-title">Add Comparisons</h5>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <h5>Car 1</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="col-md-12">
                                                <div className="input-group">
                                                    <label>Choose Brand</label>
                                                    <Select
                                                        options={brandOptions1}
                                                        styles={customStyles}
                                                        onChange={(value) => {
                                                            setSelectedModels1(undefined);
                                                            setSelectedVariants1(undefined);
                                                            setSelectedBrands1(value.value);
                                                            // setExportBrands(value.label);
                                                        }}
                                                        isLoading={isLoadingBrands1}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="input-group">
                                                    <label>Choose Model</label>
                                                    <Select
                                                        options={modelOptions1}
                                                        isDisabled={
                                                            selectedBrands1 ? false : true
                                                        }
                                                        styles={customStyles}
                                                        onChange={(value) => {
                                                            setSelectedModels1(value.value);
                                                            // setExportModels(value.label);
                                                        }}
                                                        isLoading={isLoadingModels1}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="input-group">
                                                    <label>Choose Variant</label>
                                                    <Select
                                                        options={variantOptions1}
                                                        isDisabled={
                                                            selectedModels1 ? false : true
                                                        }
                                                        styles={customStyles}
                                                        onChange={(value) => {
                                                            setSelectedVariants1(
                                                                value.value
                                                            );
                                                            // setExportVariants(value.label);
                                                            // handleSelection("variants", [
                                                            //     value,
                                                            // ]);
                                                        }}
                                                        isLoading={isLoadingVariants1}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div style={{ width: "200px", height: "200px" }}>
                                                <img src={models1.find((model) => model._id === selectedModels1)?.["Model Image Path"].split(",")[0]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h5>Car 2</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="col-md-12">
                                                <div className="input-group">
                                                    <label>Choose Brand</label>
                                                    <Select
                                                        options={brandOptions2}
                                                        styles={customStyles}
                                                        onChange={(value) => {
                                                            setSelectedModels2(undefined);
                                                            setSelectedVariants2(undefined);
                                                            setSelectedBrands2(value.value);
                                                            // setExportBrands(value.label);
                                                        }}
                                                        isLoading={isLoadingBrands2}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="input-group">
                                                    <label>Choose Model</label>
                                                    <Select
                                                        options={modelOptions2}
                                                        isDisabled={
                                                            selectedBrands2 ? false : true
                                                        }
                                                        styles={customStyles}
                                                        onChange={(value) => {
                                                            setSelectedModels2(value.value);
                                                            // setExportModels(value.label);
                                                        }}
                                                        isLoading={isLoadingModels2}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="input-group">
                                                    <label>Choose Variant</label>
                                                    <Select
                                                        options={variantOptions2}
                                                        isDisabled={
                                                            selectedModels2 ? false : true
                                                        }
                                                        styles={customStyles}
                                                        onChange={(value) => {
                                                            setSelectedVariants2(
                                                                value.value
                                                            );
                                                            // setExportVariants(value.label);
                                                            // handleSelection("variants", [
                                                            //     value,
                                                            // ]);
                                                        }}
                                                        isLoading={isLoadingVariants2}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div style={{ width: "200px", height: "200px" }}>
                                                <img src={models2.find((model) => model._id === selectedModels2)?.["Model Image Path"].split(",")[0]} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row d-flex justify-content-end mr-4 mt-5">
                                <button className="btn btn-primary" onClick={handleComparison}>Add Comparison</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddComparisons;
