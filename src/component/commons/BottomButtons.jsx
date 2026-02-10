import React from 'react'

const BottomButtons = ({ isSave = true, isReset = true, isClose = true, onSave = null, onReset = null, onClose = null }) => {

    return (
        <div className="bankmaster__container-controls">
            {isSave &&
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={onSave}
                >
                    Save
                </button>
            }
            {isReset &&
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={onReset}
                >
                    Reset
                </button>
            }
            {isClose &&
                <button
                    className="bankmaster__container-controls-btn"
                    onClick={onClose}
                >
                    Close
                </button>
            }
        </div>
    )
}

export default BottomButtons
