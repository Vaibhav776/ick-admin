import { Switch } from "antd";
import { useCallback, useState } from "react"
import { useEffect } from "react"
import Helper from "../../common/consts/Helper";
import Modal from "./modal";

export default function Seo() {

    const [urls, setUrls] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [ searchInput, setSearchInput ] = useState('');
    const [ filteredSearch, setFilteredSearch ] = useState([]);
    const [metaData, setMetaData] = useState({
        metaDescription: "",
        metaKeywords: "",
        metaTitle: "",
        requestType: "",
        _id: ""
    })
    useEffect(() => {
        fetchSeo();
    }, [])

    const fetchSeo = (sortOrder = 1) => {
        Helper("meta", "POST", {
			sortOrder,
		})
			.then((res) => setUrls(res.urls))
			.catch((err) => console.log(err));
    }

    const handleModalOpen = (data) => {
        setModalOpen(true);
        setMetaData({
            metaDescription: data.metaDescription,
            metaTitle: data.metaTitle,
            metaKeywords: data.metaKeywords,
            requestType: data.type,
            _id: data._id
        })
    }

    const handleModalDelete = (data) => {
    let request = window.confirm("Are you sure you want to Delete URL?");
        if(request) {
            Helper("delete_meta_url", "POST", {
				metaId: data,
			})
				.then((res) =>{
					fetchSeo();
					const clone = filteredSearch.map((obj)=>obj);
					const list = clone.filter((obj)=>{
						return !obj.url.match(data.url);
					})
					setFilteredSearch(list)

				} 
				)
				.catch((err) => console.log(err));
        }

    }


    const handleFilledFilter = (checked) => {
        if (checked) {
            fetchSeo(-1)
        } else {
            fetchSeo(1)
        }
    }

     const handleSearchInput = (e) => {
			setSearchInput(e.target.value);
            getSearchResult(e.target.value)
		};

    const getSearchResult = (data) => {
        // let regex = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;
        let regex = /^[a-zA-Z0-9\&/\ )\(+=._-]+$/g;
        let filter = [];
		console.log("data.search(regex)", data.search(regex));
        setTimeout(() => {
			if (data.length > 0 && data.search(regex) != -1) {
				urls?.forEach((obj, index) => {
					if (obj?.url.toLowerCase().match(data.toLowerCase())) {
						filter.push(obj);
					}
					return filter;
				});

				setFilteredSearch(filter);
			}
        }, 2000);
    };


    return (
		<div className="content">
			<div className="row">
				<div className="col-md-12">
					<div className="card card-user">
						<div className="card-header d-flex align-items-center justify-content-between">
							<div className="d-flex">
								<div className="d-flex">
									<h5 className="card-title">Url Links</h5>
								</div>
								<div className="d-flex align-items-center ml-5">
									<div className="d-flex mr-4">
										<span className="mr-2">Filled</span>
										<Switch
											onChange={(checked) =>
												handleFilledFilter(checked)
											}
										/>
									</div>
									<div class="">
										<input 
                                        placeholder="Search here"
                                        value={searchInput}
                                        onChange={(e)=>handleSearchInput(e)}
                                        />
									</div>
								</div>
							</div>
						</div>
						<div className="card-body">
							<div className="col-md-12 mt-3"></div>
							<div className="col-12">
								<table className="table">
									<thead>
										<tr>
											<th>S.No.</th>
											<th>Url</th>
											<th>Meta</th>
                                            <th>Delete</th>
										</tr>
									</thead>
									<tbody>
										{(searchInput.length > 0 ? filteredSearch : urls )?.map((url, index) => (
											<tr key={index}>
												<td>{index + 1}</td>
												<td>{url.url}</td>
												<td>
													<button
														className="btn btn-primary"
														data-toggle="modal"
														data-target="#seoModal"
														onClick={() =>
															handleModalOpen(url)
														}>
														{url.metaDescription !==
															"" &&
														url.metaKeywords !==
															"" &&
														url.metaTitle !== ""
															? "Edit"
															: "Add"}
													</button>
                                                    </td>
                                                    <td>
													<button
														style={{
															backgroundColor:
																"#D82802",
															marginLeft: "15px",
														}}
														className="btn btn-danger"
														data-toggle="modal"
														data-target="#seoModal"
														onClick={() =>
															handleModalDelete(
																url._id
															)
														}>
														Delete
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			{modalOpen && (
				<Modal
					data={metaData}
					fetchSeo={fetchSeo}
					setModalOpen={setModalOpen}
					setMetaData={setMetaData}
				/>
			)}
		</div>
	);
}