import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import Helper from "../../common/consts/Helper";
import Messages from "../../common/consts/Messages";

export default function Login() {
  const history = useHistory();
  const [data, setData] = useState({
    username: "",
    password: "",
    userType: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { value, name } = e.target;
    setData({ ...data, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();
    const { username, password, userType } = data;
    setIsLoading(true);
    const body = {
      email: username,
      password,
      userType,
    };
    try {
      const res = await Helper("admin/signin", "POST", body);
      console.log(res);
      if (res.accessToken) {
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("currentPage", "Dashboard");
        history.push("/");
      } else {
        toast.error(Messages.singin);
      }
    } catch (error) {
      console.log(error);
      toast.error(Messages.singin);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="sidenav">
        <div className="login-main-text">
          <h1 className="text-light">India Car Kharido</h1>
          <br />
          <h2 className="text-light">Welcomes you!!</h2>
          <p className="text-light">Login here to access Admin Panel.</p>
        </div>
      </div>
      <div className="main">
        <div className="col-md-6 col-sm-12">
          <div className="login-form">
            <form onSubmit={login}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="username"
                  onChange={handleChange}
                  value={data.username}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={data.password}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-black"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
