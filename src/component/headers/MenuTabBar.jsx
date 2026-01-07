import { useContext, useState } from "react";
import './MenuTabBar.css'
import { useNavigate, useParams } from "react-router-dom";
import { UnifiedContext } from "../../context/UnifiedContext";

const MenuTabBar = () => {

    const { tabs, activeTab, setActiveTab, closeTab } = useContext(UnifiedContext);;

    const navigate = useNavigate()
    const { stateCode } = useParams();

    const handleTabClick = (tab) => {
        setActiveTab(tab.id);
        navigate(`/home/${stateCode}/menus/${tab.path}`);
    }

    return (
        <div className="menu-tab-container">
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    className={`menu-tab-item ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => handleTabClick(tab)}
                >
                    <span className="tab-title">{tab.title}</span>

                    {tab.closable && (
                        <span
                            className="menu-tab-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                closeTab(tab.id,stateCode);
                            }}
                        >
                            ×
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MenuTabBar;
