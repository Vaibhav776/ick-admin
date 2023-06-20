import React, { useState } from "react";

//helper functions
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";
import Loader from "../../common/components/buttonLoader";

function AddImages() {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = (e) => {
    let allFiles = [...e.target.files];
    allFiles.length > 0 && toast.success("Files are uploaded");
    allFiles.length > 5
      ? setFiles(allFiles.splice(0, 5))
      : setFiles(allFiles.splice(0, allFiles.length));
  };
  let tempfilesUploaded = [];
  const addProduct = async () => {
    if (files.length) {
      setIsLoading(true);
      await files.forEach((currentFile, index) => {
        let formData = new FormData();
        formData.append("file", currentFile);
        Helper("store_file", "POST", formData, true)
          .then(async (response) => {
            if (index === files.length - 1) {
              setIsLoading(false);
            }
            if (response.thumbImagePath) {
              toast.success("Images have been saved successfully");
              tempfilesUploaded.push(response);
            }
          })
          .catch((error) => console.log(error))
          .finally(() => {
            setUploadedFiles(tempfilesUploaded);
            setFiles([]);
          });
      });
    } else {
      toast.error("Please select atleast one file");
    }
  };

  console.log(tempfilesUploaded);

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center">
              <div>
                <i className="fas fa-arrow-left p-3 cursor-pointer"></i>
              </div>
              <h5 className="card-title">Add Images</h5>
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
                        multiple
                        onChange={handleFile}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="inputGroupFile01"
                      >
                        Choose Image File
                      </label>
                    </div>
                  </div>
                  <div className="mt-3 mb-3 position-relative"></div>
                </div>
                <div className="col-md-6 mt-3 map_size">
                  {files.length > 0 &&
                    files.map((file) => {
                      return (
                        <>
                          <div>
                            {" "}
                            <span style={{ color: "#FF0000" }} className="mr-2">
                              *
                            </span>
                            {`${file?.name} is being imported`}
                            <div className="float-right">
                              {/* <select>
                                <option>select for color</option>
                                <option>Red</option>
                                <option>yellow</option>

                              </select> */}
                            </div>
                          </div>
                        </>
                      );
                    })}
                </div>
              </div>
              <div className="col-12">
                {uploadedFiles.length > 0 && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Thumb Image Path</th>
                        <th scope="col">Small Image Path</th>
                        <th scope="col">Large Image Path</th>
                        <th scope="col">Original Image Path</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedFiles.map((file, fIdx) => {
                        return (
                          <tr>
                            <th scope="row">{fIdx + 1}</th>
                            <td>{file.thumbImagePath}</td>
                            <td>{file.smallImagePath}</td>
                            <td>{file.largeImagePath}</td>
                            <td>{file.originalImagePath}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="row">
                <div className="update ml-auto mr-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-round"
                    onClick={addProduct}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader loading={isLoading} />
                    ) : (
                      "Add Image File"
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

export default AddImages;
