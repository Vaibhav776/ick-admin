import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//toast contaienr and css
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'

//screens
import Main from "./components/main";
import Login from "./components/login";

//redux imports
import { Provider } from "react-redux";
import store from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route
            path="/"
            render={(props) =>
              localStorage.getItem("accessToken") ? (
                <Main {...props} />
              ) : (
                <Login {...props} />
              )
            }
          />
        </Switch>
      </Router>
      <ToastContainer />
    </Provider>
  );
}

export default App;
