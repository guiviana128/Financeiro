import React, { createContext, useContext, useState, useEffect } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  // 'auto', 'mobile', 'desktop'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("finflow_view_mode") || "auto";
  });

  const [screenInfo, setScreenInfo] = useState(() => {
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const width = typeof window !== "undefined" ? window.innerWidth : 1200;
    const isMobileDevice = typeof navigator !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return {
      width,
      isTouch,
      isMobileDevice,
      isSmallScreen: width <= 860
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setScreenInfo({
        width,
        isTouch,
        isMobileDevice,
        isSmallScreen: width <= 860
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("finflow_view_mode", viewMode);
  }, [viewMode]);

  // Determine active presentation mode
  const isMobileView = viewMode === "mobile" || (viewMode === "auto" && screenInfo.isSmallScreen);
  const detectedDevice = screenInfo.isMobileDevice || screenInfo.isSmallScreen ? "mobile" : "desktop";

  const changeViewMode = (mode) => {
    setViewMode(mode);
  };

  const toggleViewMode = () => {
    if (viewMode === "auto") {
      setViewMode(isMobileView ? "desktop" : "mobile");
    } else if (viewMode === "mobile") {
      setViewMode("desktop");
    } else {
      setViewMode("auto");
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        viewMode,
        setViewMode: changeViewMode,
        toggleViewMode,
        isMobileView,
        detectedDevice,
        screenInfo
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }
  return context;
};
