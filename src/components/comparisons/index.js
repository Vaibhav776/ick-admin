import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import LoadingSpinner from "../../common/components/loader/spinLoader";
import Helper from "../../common/consts/Helper";

export default function Comparisons() {
    const history = useHistory();
    const [comparisons, setComparisons] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchComparison();
    }, [])

    const handleDelete = (id) => {
        setLoading(true);
        Helper("fetch_comparison", "DELETE", {comparisonId: id})
            .then((res) => fetchComparison())
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }

    const fetchComparison = () => {
        Helper("fetch_comparison", "POST", { city: "ysr kadapa" })
            .then(response => setComparisons(response.comparisons))
            .catch(error => console.log(error));
    }

    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-user">
                        <div className="card-header d-flex align-items-center">
                            <div className="col-md-12 d-flex justify-content-between">
                                <h5 className="card-title">All Comparisons</h5>
                                <button className="btn btn-primary" onClick={() => history.push("/add_comparison")}>Add Comparisons</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {
                                    comparisons && comparisons.length ? comparisons?.map((comp, index) => (
                                        <div className="col-md-6">
                                            <div class="card">
                                                <div class="card-body">
                                                    <div className="d-flex justify-content-between">
                                                        <h4 class="card-title">{`${comp.carInfo1.modelInfo?.["Model Name"].toUpperCase()} VS ${comp.carInfo2.modelInfo?.["Model Name"].toUpperCase()}`}</h4>
                                                        <button className="btn btn-warning" onClick={() => handleDelete(comp._id)}>
                                                            {loading ? <LoadingSpinner /> : "Delete"}
                                                        </button>
                                                    </div>
                                                    <div className="row">
                                                    <div className="col-md-6">
                                                        <h5>{comp.carInfo1["Variant Name"]}</h5>
                                                        <img style={{width: "200px"}} src={comp.carInfo1.modelInfo?.["Model Image Path"]?.split(",")[0]}/>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h5>{comp.carInfo2["Variant Name"]}</h5>
                                                        <img style={{ width: "200px" }} src={comp.carInfo2.modelInfo?.["Model Image Path"]?.split(",")[0]} />
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )) : <div className="col-md-6">
                                            <h2>No comparisons found</h2>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
