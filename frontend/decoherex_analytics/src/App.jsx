import React, { useState } from "react";
import Routes from "./Routes";
import LoadingWizard from "./components/LoadingWizard";

function App() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <>
      {showLoading && (
        <LoadingWizard onComplete={() => setShowLoading(false)} />
      )}
      {!showLoading && <Routes />}
    </>
  );
}

export default App;
