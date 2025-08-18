import React, { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaRedo, FaUndo, FaTimes } from 'react-icons/fa';

const LoginPopup = ({ showLogin, setShowLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('F 3 6 k');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('Not a Valid Request!');
  };

  const handleReset = () => {
    setUserId('');
    setPassword('');
    setError('');
  };

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let newCaptcha = '';
    for (let i = 0; i < 5; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i < 4) newCaptcha += ' ';
    }
    setCaptcha(newCaptcha);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${showLogin ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${showLogin ? 'scale-100' : 'scale-95'}`}
      >
        <div className="flex justify-between items-center border-b p-2">
          <div className="flex items-center">
            <img
              src="http://10.10.11.155:8081/HIS/hisglobal/mod/assets/img/assamlogonew.png"
              alt="Logo"
              className="h-10 mr-3 animate-spin-slow rounded rounded-lg"
            />
            <h2 className="text-2xl text-indigo-800">Login</h2>
          </div>
          <button
            onClick={() => setShowLogin(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors text-lg cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <div className="w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"></div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 animate-shake">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-gray-700">User Id :</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-500" />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-2 pl-8 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                placeholder="Enter User Id"
              />

            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Password :</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-2 pl-8 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                placeholder="Enter Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500 hover:text-gray-600 transition-colors cursor-pointer" />
                ) : (
                  <FaEye className="text-gray-500 hover:text-gray-600 transition-colors cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700">Captcha Type Here</label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  placeholder="Enter Captcha"
                />
              </div>
              <div className="flex items-center space-x-2">
                <div className="bg-gray-200 px-4 py-2 rounded-lg font-mono text-gray-700 select-none">
                  {captcha}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer border border-yellow-800 rounded"
                  title="Refresh Captcha"
                >
                  <FaRedo className="animate-spin-on-hover" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-1 rounded-lg  transition-colors cursor-pointer animate-shake hover:text-[#00d9dc] text-lg border hover:border-yellow-900"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gradient-to-r from-yellow-600 to-red-300 text-gray-800 py-1 rounded-lg  transition-colors flex items-center justify-center space-x-2 cursor-pointer hover:text-[#941714] text-lg border border-yellow-600 hover:border-yellow-900"
            >
              <FaUndo className="text-sm" />
              <span>Reset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;