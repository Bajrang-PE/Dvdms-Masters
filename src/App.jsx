import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoadingSpinner from './component/commons/LoadingSpinner'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {

  return (
    <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

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
