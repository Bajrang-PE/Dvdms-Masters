import React from 'react'

const BottomButtons = ({ isSave = true, isReset = true, isClose = true, onSave = null, onReset = null, onClose = null, onDraft = null, isDraft = true }) => {

    return (
        <div className="buttons__container-controls">
            {isDraft &&
                <button
                    className="buttons__container-controls-btn"
                    onClick={onDraft}
                >
                    Draft Save
                </button>
            }
            {isSave &&
                <button
                    className="buttons__container-controls-btn"
                    onClick={onSave}
                >
                    Save
                </button>
            }
            {isReset &&
                <button
                    className="buttons__container-controls-btn"
                    onClick={onReset}
                >
                    Reset
                </button>
            }
            {isClose &&
                <button
                    className="buttons__container-controls-btn"
                    onClick={onClose}
                >
                    Close
                </button>
            }
        </div>
    )
}

export default BottomButtons
