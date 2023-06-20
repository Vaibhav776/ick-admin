import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Select from "react-select";
import LoadingSpinner from "../../common/components/loader/spinLoader";
import Helper from "../../common/consts/Helper";
import Editor from "./Editor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditNews() {
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [fields, IsFields] = useState(false);
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState();
    const [selectedSnippet, setSelectedSnippet] = useState("");
    const [models, setModels] = useState([]);
    const [selectedModels, setSelectedModels] = useState();
    const [variants, setVariants] = useState([]);
    const [isLoadingBrands, setIsLoadingBrands] = useState(false);
    const [isLoadingModels, setIsLoadingModels] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingVariants, setIsLoadingVariants] = useState(false);
    const [image, setImage] = useState(undefined);
    const [tags, setTags] = useState({
        Brands: [],
        Models: [],
        Variants: [],
    });
    const location = useLocation()
    const [finalData, setFinalData] = useState({
        newsTitle: location.state.value.newsTitle,
        newsDescription: location.state.value.newsDescription,
        newsShortDescription: location.state.value.newsShortDescription,
        newsImage: location.state.value.newsImage,
        tags: location.state.value.tags.map((tag) => { return { label: tag.label, value: tag.id } }),
        snippet: { label: location.state.value?.brandInfo[0]?.["Brand Name"], value: location.state.value?.brandInfo[0]?._id },
        isHeader: location.state.value.isHeader,
        isHeaderUpdatedAt: location.state.value.isHeaderUpdatedAt,
        isHomePage: location.state.value.isHomePage,
        isHomePageUpdatedAt: location.state.value.isHomePageUpdatedAt,
        isMenu: location.state.value.isMenu,
        isMenuUpdatedAt: location.state.value.isMenuUpdatedAt,
        isNewsSection: location.state.value.isNewsSection,
        isNewsSectionUpdatedAt: location.state.value.isNewsSectionUpdatedAt,
        socialLink: location.state.value.socialLink ? JSON.parse(location.state.value.socialLink) : [{
            portal: null,
            url: ""
        }]
    });
    const [selectedSocialMedias, setSelectedSocialMedias] = useState([{ portal: null, url: '' }]);
    const history = useHistory();

    useEffect(() => {
        setEditorLoaded(true);
    }, []);

    useEffect(() => {
        setSelectedSocialMedias(finalData.socialLink);
    }, [finalData])

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
    function handleSelectedTag(values, type) {
        console.log(values, "Valuess");
        setFinalData({
            ...finalData,
            tags: values
        })
        let formattedData = values.map((value) => {
            if (type === "Brands") {
                setSelectedBrands(values.map((value) => value.value));
            } else if (type === "Models") {
                setSelectedModels(values.map((value) => value.value));
            } else if (type === "Variants") {
                setSelectedVariants(values.map((value) => value.value));
            }
            return {
                type: type,
                name: value.label,
                id: value.value,
            };
        });
        setTags({
            ...tags,
            [type]: formattedData,
        });
    }

    const handleImageChange = (e) => {
        setImage(e.target.value)
    }

    const addImage = () => {
        let description = finalData.newsDescription;
        let img = `
    <div className="w-full h-auto">
      <img src="${image}"/>
    </div>`;
        description += img;
        setFinalData({
            ...finalData,
            newsDescription: description
        });
    }

    async function handleEditNews() {
        setIsLoading(true);
        const data = finalData;
        data["snippet"] = finalData.snippet.value
        data["tags"] = finalData.tags.map((tag) => { return { id: tag.value, label: tag.label, type: "Brands" } })
        data["socialLink"] = JSON.stringify(selectedSocialMedias);
        try {
            await Helper(`news/${location.state.value._id}`, "PUT", data).then((res) => {
                if (res.message) {
                    toast.success(res.message)
                    history.push("/news");
                }
            });
        } catch (error) {
            console.log("error", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSnippetTag = (value) => {
        setFinalData({
            ...finalData,
            snippet: value
        })
    }

    const handleSocialMediaLink = (value, index) => {
        let arr = [...selectedSocialMedias];
        let obj = {
            ...arr[index],
            url: value
        }
        arr[index] = obj;
        setSelectedSocialMedias(arr);
    }

    const handlePlatform = (value, index) => {
        let arr = [...selectedSocialMedias];
        let obj = {
            ...arr[index],
            portal: value
        }
        arr[index] = obj;
        setSelectedSocialMedias(arr);
    }

    const removeSocialMediaEmbed = (index) => {
        let arr = [...selectedSocialMedias];
        arr.splice(index, 1);
        setSelectedSocialMedias(arr);
    }

    const addSocialMediaEmbed = () => {
        let newObject = {
            portal: null,
            url: ""
        }
        let arr = [...selectedSocialMedias];
        arr.push(newObject);
        setSelectedSocialMedias(arr);
    }

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-user">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <div className="d-flex">
                                <div onClick={() => history.push("/news")}>
                                    <i className="fas fa-arrow-left p-3 cursor-pointer"></i>
                                </div>
                                <h5 className="card-newsTitle">Edit News</h5>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="col-md-12 mt-3">
                                <div className="form-group">
                                    <div className="col-md-12 mb-3">
                                        <label for="exampleInputEmail1">Title</label>
                                        <input
                                            required
                                            type="text"
                                            name="newsTitle"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            value={finalData?.newsTitle}
                                            aria-describedby="emailHelp"
                                            onChange={(e) => {
                                                setFinalData({
                                                    ...finalData,
                                                    [e.target.name]: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label for="exampleInputEmail1">Short Description</label>
                                        <textarea
                                            required
                                            type="text"
                                            name="newsShortDescription"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            value={finalData?.newsShortDescription}
                                            aria-describedby="emailHelp"
                                            onChange={(e) => {
                                                setFinalData({
                                                    ...finalData,
                                                    [e.target.name]: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label for="exampleInputEmail1">Description</label>
                                        <Editor
                                            required
                                            value={finalData?.newsDescription}
                                            name="newsDescription"
                                            onChange={(data) => {
                                                setFinalData({
                                                    ...finalData,
                                                    newsDescription: data,
                                                });
                                            }}
                                            editorLoaded={editorLoaded}
                                        />
                                        <div className="col-12 mt-4">
                                            <input className="form-control" placeholder="Image link" onChange={handleImageChange} />
                                            <button
                                                disabled={!image}
                                                className="btn btn-primary"
                                                onClick={addImage}
                                            >Add Image</button>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label for="exampleInputEmail1">News Image Link</label>
                                        <input
                                            required
                                            type="text"
                                            name="newsImage"
                                            className="form-control"
                                            id="exampleInputEmail1"
                                            value={finalData?.newsImage}
                                            aria-describedby="emailHelp"
                                            onChange={(e) => {
                                                setFinalData({
                                                    ...finalData,
                                                    [e.target.name]: e.target.value,
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-md-12 mt-5">
                                        <div className="row">
                                            {
                                                selectedSocialMedias.map((value, index) => (
                                                    <>
                                                        <div className="col-md-2">
                                                            <label for="exampleInputEmail1">Social Media Platform</label>
                                                            <select className="form-control" defaultValue={"select"} value={value.portal} onChange={(e) => handlePlatform(e.target.value, index)}>
                                                                <option value={"select"} disabled>Select</option>
                                                                <option value={"facebook"}>Facebook</option>
                                                                <option value={"instagram"}>Instagram</option>
                                                                <option value={"linkedin"}>Linkedin</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-9">
                                                            <label for="exampleInputEmail1">Social Media Link</label>
                                                            <input value={value.url} type={"text"} className="form-control" onChange={(e) => handleSocialMediaLink(e.target.value, index)} />
                                                        </div>
                                                        <button className="btn btn-danger mt-4" onClick={() => removeSocialMediaEmbed(index)}>-</button>
                                                    </>
                                                ))
                                            }
                                        </div>
                                        <div className="col-md-12 d-flex justify-content-center">
                                            <button className="btn btn-primary" onClick={() => addSocialMediaEmbed()}>+</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mt-3">
                                            <label>Choose Brand Tag</label>
                                            <div className="input-group mb-3">
                                                <Select
                                                    options={brandOptions}
                                                    isMulti
                                                    styles={customStyles}
                                                    onChange={(values) =>
                                                        handleSelectedTag(values, "Brands")
                                                    }
                                                    isLoading={isLoadingBrands}
                                                    value={finalData.tags}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-4 mt-3">
                                            <label>Choose Snippet Tag</label>
                                            <div className="input-group mb-3">
                                                <Select
                                                    options={brandOptions}
                                                    styles={customStyles}
                                                    onChange={(values) =>
                                                        handleSnippetTag(values)
                                                    }
                                                    isLoading={isLoadingBrands}
                                                    value={finalData.snippet}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-center my-5">
                            <button
                                onClick={handleEditNews}
                                disabled={isLoading ? true : false}
                                className="btn btn-primary"
                            >
                                {isLoading ? <LoadingSpinner /> : "Edit News"}
                            </button>
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}