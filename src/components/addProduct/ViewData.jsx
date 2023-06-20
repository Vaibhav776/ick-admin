import React from 'react';
import { Link } from 'react-router-dom';

export default function ViewData() {
    return (
        <div className="content">
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <h4 className="card-title"> Products Data</h4>
                            <div className="update">
                                <Link to="/add_data">
                                    <button type="button" className="btn btn-primary btn-round">Add Product</button>
                                </Link>
                            </div>
                        </div>
                        <div className="card-header">
                            <form>
                                <div className="input-group no-border">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <i className="nc-icon nc-zoom-split"></i>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className=" text-primary">
                                        <th className="text-center">
                                            Sno
                                        </th>
                                        <th className="text-center">
                                            Product Name
                                        </th>
                                        <th className="text-center">
                                            Article
                                        </th>
                                        <th className="text-center">
                                            Discount%
                                        </th>
                                        <th className="text-center">
                                            Sizes
                                        </th>
                                        <th className="text-center">
                                            Colors
                                        </th>
                                        <th className="text-center">
                                            Options
                                        </th>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">
                                                1
                                            </td>
                                            <td className="text-center">
                                                Jockey Underwear
                                            </td>
                                            <td className="text-center">
                                                1015
                                            </td>
                                            <td className="text-center">
                                                20
                                            </td>
                                            <td className="text-center">
                                                30, 32, 34, 36
                                            </td>
                                            <td className="text-center">
                                                Navy, Blue, Simple
                                            </td>
                                            <td className="text-center">
                                                <button type="button" className="btn btn-primary btn-round bg-warning">
                                                    <i className="nc-icon nc-ruler-pencil"></i>
                                                </button>
                                                <button type="button" className="btn btn-primary btn-round bg-danger ml-2">
                                                    <i className="nc-icon nc-simple-delete"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}