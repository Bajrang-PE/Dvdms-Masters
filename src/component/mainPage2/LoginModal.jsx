import React, { useEffect, useState } from "react";
import { fetchData, fetchPostConfigData, fetchPostData } from "../../utils/ApiHook";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ show, onClose }) => {
  const [username, setUsername] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaImage, setCaptchaImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      fetchCaptcha();
      setUsername("");
      setCaptchaValue("");
      setError("");
    }
  }, [show]);

  const fetchCaptcha = async () => {
    try {
      const res = await fetchData("/auth/captcha");

      if (res?.data?.status === 1) {
        setCaptchaImage(res?.data?.data?.captchaUri || "");
        setCaptchaToken(res?.data?.data?.captchaToken || "");
      } else {
        setCaptchaImage("");
        setCaptchaToken("");
      }
    } catch (err) {
      console.error("Captcha Error:", err);
      setCaptchaImage("");
      setCaptchaToken("");
    }
  };

  const onLogin = async () => {
    try {
      setLoading(true);

      const payload = {
        username: username.trim(),
        captchaValue: captchaValue.trim(),
      };

      const response = await fetchPostConfigData(
        "/auth/central-lookup",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${captchaToken}`,
          },
        }
      );

      const apiResponse = response?.data;

      if (apiResponse?.status === 1) {
        const stateName =
          apiResponse?.data?.gstrStateshort ||
          apiResponse?.data?.gstrStateShort ||
          "";

        const userId =
          apiResponse?.data?.gnumUserid ||
          apiResponse?.data?.userId ||
          "";

        if (stateName) {
          const localData = {
            state: stateName,
            userId,
            username,
            isLogin: "true"
          };

          localStorage.setItem(
            "data",
            JSON.stringify(localData)
          );

          navigate(`/home/${stateName}`, {
            state: {
              username,
              userId,
            },
          });
        } else {
          setError("State information not found.");
        }
      } else {
        setError(
          apiResponse?.message ||
          "Invalid username or captcha."
        );

        setCaptchaValue("");
        fetchCaptcha();
      }
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message ||
        "Something went wrong. Please try again."
      );

      setCaptchaValue("");
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username is required.");
      return;
    }

    if (!captchaValue.trim()) {
      setError("Captcha is required.");
      return;
    }

    if (!captchaToken) {
      setError("Captcha expired. Please refresh.");
      return;
    }

    setError("");
    onLogin();
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      style={{
        backgroundColor: show
          ? "rgba(0,0,0,0.5)"
          : "transparent",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">
              <i className="fas fa-sign-in-alt me-2"></i>
              DVDMS Login
            </h4>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="text-center mb-4">
              <i className="fas fa-user-circle fa-4x text-primary"></i>

              <p className="text-muted mt-2 fw-bold">
                Enter your username to access your state's DVDMS
                portal
              </p>
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
            >
              {/* Username */}
              <div className="mb-3">
                <label
                  htmlFor="username"
                  className="form-label"
                >
                  Username <span className="text-danger">*</span>
                </label>

                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                />
              </div>

              {/* Captcha */}
              <div className="mb-3">
                <label className="form-label">
                  Captcha <span className="text-danger">*</span>
                </label>

                <div className="row g-2 align-items-center">

                  {/* Captcha Input */}
                  <div className="col-12 col-md-5">
                    <input
                      type="text"
                      className="form-control mb-1"
                      placeholder="Enter captcha"
                      value={captchaValue}
                      onChange={(e) => {
                        setCaptchaValue(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                  {/* Captcha Image */}
                  <div className="col-8 col-md-5">
                    <div
                      className="border rounded bg-light d-flex justify-content-center align-items-center h-100"
                      style={{ minHeight: "42px" }}
                    >
                      {captchaImage ? (
                        <img
                          src={captchaImage}
                          alt="captcha"
                          className="img-fluid border rounded"
                          style={{
                            width: "100%",
                            height: "50px",
                            objectFit: "fill"
                          }}
                        />
                      ) : (
                        <span className="text-muted small">
                          Loading...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Refresh Button */}
                  <div className="col-4 col-md-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary w-100"
                      onClick={() => {
                        fetchCaptcha();
                        setCaptchaValue("");
                      }}
                      title="Refresh Captcha"
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  </div>

                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="login-btn mt-3 w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                    ></span>
                    Please wait...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;