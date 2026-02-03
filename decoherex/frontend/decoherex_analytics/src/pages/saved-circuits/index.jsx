import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import SavedCircuitsList from '../quantum-operations-command-center/components/SavedCircuitsList';
import Snackbar from '../../components/ui/Snackbar';

const SavedCircuitsPage = () => {
    // The list manages its own toast for copy actions, but we can keep a page-level one if needed.
    // However, SavedCircuitsList has its own internal Snackbar now.
    // We can remove the page-level snackbar if the list handles it all, 
    // BUT the list is embedded. Let's check SavedCircuitsList implementation.
    // It renders a Snackbar inside itself. So we don't need one here for list actions.

    return (
        <div className="min-h-screen text-foreground">
            <Header />
            <main className="pt-[3.75rem]">
                <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Quantum Library</h1>
                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                            Manage your saved quantum circuits and code snippets.
                        </p>
                    </div>

                    <div className="glass-card bg-slate-900/50 rounded-2xl p-6 min-h-[60vh] border border-slate-700/50">
                        <SavedCircuitsList embedded={true} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SavedCircuitsPage;
