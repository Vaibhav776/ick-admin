import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Helper from "../../common/consts/Helper";

export default function Modal({ data, setModalOpen, fetchSeo, setMetaData }) {

    const modal = useRef(null);

    const [meta, setMeta] = useState({
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        requestType: "",
        _id: ""
    });

    useEffect(() => {
        setMeta({
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            metaKeywords: data.metaKeywords,
            requestType: data.requestType,
            _id: data._id
        })
    }, [data])

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setMeta({
            ...meta,
            [name]: value
        })
    }

    const handleSave = () => {
        Helper("meta", "PUT", {
            metaTitle: meta.metaTitle,
            metaDescription: meta.metaDescription,
            metaKeywords: meta.metaKeywords,
            requestType: meta.requestType,
            _id: meta._id
        })
            .then(res => {
                setMeta({
                    metaTitle: "",
                    metaDescription: "",
                    metaKeywords: "",
                    _id: "",
                    requestType: ""
                })
                setMetaData({
                    metaTitle: "",
                    metaDescription: "",
                    metaKeywords: "",
                    requestType: "",
                    _id: ""
                })
                fetchSeo();
                modal.current.click();
                setModalOpen(false)
            })
            .catch(err => console.log(err));
    }

    const handleClose = () => {
        modal.current.click();
        setMetaData({
            metaTitle: "",
            metaDescription: "",
            metaKeywords: "",
            requestType: "",
            _id: ""
        })
    }

    return (
        <div
            className="modal fade"
            id="seoModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            Meta Data
                        </h5>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-12 mt-3">
                                <label for="exampleInputEmail1">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    className="form-control"
                                    value={meta.metaTitle}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-12 mt-3">
                                <label for="exampleInputEmail1">
                                    Meta Description
                                </label>
                                <input
                                    type="text"
                                    name="metaDescription"
                                    className="form-control"
                                    value={meta.metaDescription}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-12 mt-3">
                                <label for="exampleInputEmail1">
                                    Meta Keywords
                                </label>
                                <input
                                    type="text"
                                    name="metaKeywords"
                                    className="form-control"
                                    value={meta.metaKeywords}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            ref={modal}
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            onClick={handleClose}
                        >
                            Close
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}