import { createContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UnifiedContext = createContext()

const UnifiedContextApi = ({ children }) => {

    const navigate = useNavigate();

    const loadTabsFromStorage = () => {
        const savedTabs = localStorage.getItem('menuTabs');
        const savedActiveTab = localStorage.getItem('activeTab');

        if (savedTabs) {
            return {
                tabs: JSON.parse(savedTabs),
                activeTab: savedActiveTab || "home"
            };
        }

        // Default tabs if nothing in storage
        return {
            tabs: [
                { id: "home", title: "Home", path: ``, closable: false },
                { id: "bankmaster", title: "Bank Master", path: `bank-master`, closable: true },
            ],
            activeTab: "home"
        };
    };

    const { tabs: savedTabs, activeTab: savedActiveTab } = loadTabsFromStorage();

    const [tabs, setTabs] = useState(savedTabs);
    const [activeTab, setActiveTab] = useState(savedActiveTab);

    useEffect(() => {
        localStorage.setItem('menuTabs', JSON.stringify(tabs));
        localStorage.setItem('activeTab', activeTab);
    }, [tabs, activeTab]);

    const openTab = (tab, stCode) => {
        setTabs((prev) => {
            const exists = prev.find((t) => t.path === tab.path);
            if (exists) {
                setActiveTab(exists.id);
                navigate(`home/${stCode}/menus/${exists.path}`);
                return prev;
            }
            return [...prev, tab];
        });

        setActiveTab(tab.id);
        // navigate(tab.path);
    };

    const closeTab = (id, stCode) => {
        setTabs((prev) => {
            const filtered = prev.filter((t) => t.id !== id);
            if (activeTab === id) {
                const lastTab = filtered[filtered.length - 1];
                setActiveTab(lastTab.id);
                navigate(`home/${stCode}/menus/${lastTab.path}`);
            }
            return filtered;
        });
    };


    return (
        <UnifiedContext.Provider value={{
            activeTab, setActiveTab, tabs, setTabs, openTab, closeTab
        }}>
            {children}
        </UnifiedContext.Provider>
    )
}

export default UnifiedContextApi;