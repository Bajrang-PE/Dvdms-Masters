import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mt-2 mb-6">
                    Sorry, the page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage
