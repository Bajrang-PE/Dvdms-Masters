import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoadingSpinner from './component/commons/LoadingSpinner'
import './App.css'
import HomeWrapper from './pages/HomeWrapper';
import MainPage from './pages/MainPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MenuPage from './pages/MenuPage';

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/home/:stateCode" element={<HomeWrapper />} />
          <Route path="/home/:stateCode/menus" element={<MenuPage />} />

          {/* Example protected route */}
          {/* <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route> */}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
