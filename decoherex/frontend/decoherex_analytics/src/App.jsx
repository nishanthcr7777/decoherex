import React, { useState } from "react";
import { motion } from "framer-motion";
import Routes from "./Routes";
import LoadingWizard from "./components/LoadingWizard";

function App() {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <div className="min-h-screen bg-app-gradient">
      {showLoading && (
        <LoadingWizard onComplete={() => setShowLoading(false)} />
      )}
      {!showLoading && (
        <motion.div
          className="min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Routes />
        </motion.div>
      )}
    </div>
  );
}

export default App;
