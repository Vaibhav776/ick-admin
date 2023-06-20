import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';

//helper functions
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";
import Loader from "../../common/components/buttonLoader";
import Select from "react-select";

function AddPrices() {
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [states, setStates] = useState([]);

  const [selectedState, setSelectedState] = useState([]);
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [allModels, setAllModels] = useState([]);

  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const history = useHistory();

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const addPrice = () => {
    if (file) {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("file", file);
      Helper("import_prices", "POST", formData, true)
        .then((response) => toast.success(response.message))
        .catch((error) => console.log(error))
        .finally(() => setIsLoading(false));
    } else {
      toast.error("Please select atleast one file");
    }
  };

  const fetchStates = useCallback(async () => {
    try {
      setIsLoadingStates(true);
      const response = await Helper("fetch_states");
      if (response?.states && response.states?.length > 0) {
        setStates(response.states);
      }
    } catch (error) {
    } finally {
      setIsLoadingStates(false);
    }
  }, []);

  const fetchModels = useCallback(async () => {
    try {
      setIsFetchingModels(true);
      const response = await Helper("all_models", "GET");
      if (response?.models && response.models?.length > 0) {
        setAllModels(response.models);
      }
    } catch (error) {
    } finally {
      setIsFetchingModels(false);
    }
  }, []);

  useEffect(() => {
    fetchStates();
  }, [fetchStates]);
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const stateOptions = states?.map((state) => {
    return {
      label: state.name,
      value: state.name,
    };
  });

  function filterSelectedStates(value, index) {
    let rtrnVal = false;
    for (const singleState of selectedState) {
      if (singleState === value.name) {
        rtrnVal = true;
      }
    }
    return rtrnVal;
  }

  let cityOptions = states?.filter(filterSelectedStates)?.map((city) => {
    return city.citiesInfo;
  });

  const modelOptions = allModels?.map((model) => {
    return {
      label: model["Model Name"],
      value: model["Model Name"],
    };
  });

  if (cityOptions?.length > 0) {
    cityOptions = cityOptions
      ?.reduce((pre, cur) => pre?.concat(cur))
      .map((citySingle) => {
        return {
          label: citySingle.name,
          value: citySingle.name,
        };
      });
  }

  function validateExportPrices() {
    let validated = false;
    if (selectedState?.length === 0) {
      toast.error("Please select atleast one state to continue!");
    } else if (selectedCity?.length === 0) {
      toast.error("Please select atleast one city to continue!");
    } else if (selectedModels?.length === 0) {
      toast.error("Please select atleast one model to continue!");
    } else {
      validated = true;
    }
    return validated;
  }

  async function exportPrices() {
    try {
      const validated = true;
      if (validated) {
        const body = {
          model: selectedModels,
          state: selectedState,
          city: selectedCity,
        };
        setIsExporting(true);
        const response = await Helper("export_prices", "POST", body);
        if (response?.data?.url) {
          toast.info("File is processing. You can check it from Import Files")
          history.push("import_files");
        }
        if (response?.message) {
          toast.info(response.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong, Please try again later!");
    } finally {
      setIsExporting(false);
    }
  }

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

  return (
    <div className="content">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-user">
            <div className="card-header d-flex align-items-center">
              <div>
                <i className="fas fa-arrow-left p-3 cursor-pointer"></i>
              </div>
              <h5 className="card-title">Price Export</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mt-3">
                  <label>Choose State</label>
                  <div className="input-group mb-3">
                    <Select
                      options={stateOptions}
                      isMulti
                      styles={customStyles}
                      onChange={(values) => {
                        setSelectedState(values.map((value) => value.value));
                      }}
                      isLoading={isLoadingStates}
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-3">
                  <label>Choose City</label>
                  <div className="input-group mb-3">
                    <Select
                      options={cityOptions}
                      isMulti
                      isLoading={isLoadingStates}
                      styles={customStyles}
                      onChange={(values) => {
                        setSelectedCity(values.map((value) => value.value));
                      }}
                      value={selectedCity?.map((city) => {
                        return { label: city, value: city };
                      })}
                    />
                  </div>
                </div>
                <div className="col-md-4 mt-3">
                  <label>Choose Model</label>
                  <div className="input-group mb-3">
                    <Select
                      options={modelOptions}
                      isMulti
                      isLoading={isFetchingModels}
                      styles={customStyles}
                      onChange={(values) => {
                        setSelectedModels(values.map((value) => value.value));
                      }}
                      value={selectedModels?.map((city) => {
                        return { label: city, value: city };
                      })}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="update ml-auto mr-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-round"
                    onClick={exportPrices}
                    disabled={isExporting}
                  >
                    {isExporting ? <Loader loading={isExporting} /> : "Export"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card card-user">
            <div className="card-header d-flex align-items-center">
              <h5 className="card-title">Add Price</h5>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-12 mt-3">
                  <div className="input-group mb-3">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input z-0"
                        id="inputGroupFile01"
                        multiple
                        onChange={handleFile}
                      />
                      <label
                        className="custom-file-label"
                        htmlFor="inputGroupFile01"
                      >
                        Choose Price File
                      </label>
                    </div>
                  </div>
                  <div className="mt-3 mb-3 position-relative"></div>
                </div>
              </div>
              <div className="row"></div>
              <div className="col-12">
                {file ? (
                  <>
                    <span style={{ color: "#f00" }}>*</span>
                    {`${file?.name} is being imported`}
                  </>
                ) : null}
              </div>
              <div className="row">
                <div className="update ml-auto mr-auto">
                  <button
                    type="button"
                    className="btn btn-primary btn-round"
                    onClick={addPrice}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader loading={isLoading} />
                    ) : (
                      "Add Price File"
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

export default AddPrices;
