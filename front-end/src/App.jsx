import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { FiCheckCircle, FiAlertCircle, FiRefreshCcw } from 'react-icons/fi'; // Icons for status

function App() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState(''); // Status to show changes or errors
    const [isLoading, setIsLoading] = useState(false); // Loading indicator
    const [previousData, setPreviousData] = useState(null); // Store previous page data

    // Function to detect specific changes
    const detectChanges = (previousData, currentData) => {
        const changes = [];

        // Detect text content changes
        if (previousData.textContent !== currentData.textContent) {
            changes.push('Text content has changed');
        }

        // Detect style changes
        const styleChanges = currentData.styles.filter((style, i) => style !== previousData.styles[i]);
        if (styleChanges.length > 0) {
            changes.push('Layout or style changes detected');
        }

        // Detect class name changes
        const classChanges = currentData.classNames.filter((className, i) => className !== previousData.classNames[i]);
        if (classChanges.length > 0) {
            changes.push('Class name changes detected');
        }

        return changes.length > 0 ? changes.join(', ') : 'No changes detected.';
    };

    // Function to fetch website content
    const fetchContent = useCallback(async () => {
        if (!url) return;

        setIsLoading(true); // Start loading
        try {
            const response = await fetch(`http://localhost:5000/api/fetch?url=${encodeURIComponent(url)}`);
            if (!response.ok) throw new Error('Failed to fetch the URL');

            const data = await response.json();
            const currentData = data.pageData;

            // If previous data exists, detect changes
            if (previousData) {
                const changeSummary = detectChanges(previousData, currentData);
                setStatus(changeSummary);
            } else {
                setStatus('Monitoring initialized, no previous data to compare.');
            }

            // Update the previous data
            setPreviousData(currentData);
        } catch (error) {
            setStatus(`Error: ${error.message}`);
        } finally {
            setIsLoading(false); // End loading
        }
    }, [url, previousData]);

    // Polling logic
    useEffect(() => {
        if (!url) return;

        const interval = setInterval(fetchContent, 10000); // Check every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount or URL change
    }, [url, fetchContent]);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Website Monitor</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
            </div>
            <button
                onClick={fetchContent}
                className={`w-full p-3 text-white rounded-lg ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <FiRefreshCcw className="animate-spin mr-2" /> Checking...
                    </span>
                ) : (
                    'Check Now'
                )}
            </button>
            <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {status && (
                    <p className={`text-lg font-semibold ${status.includes('Error') ? 'text-red-500' : status.includes('changed') ? 'text-orange-500' : 'text-green-500'}`}>
                        {status.includes('changed') ? <FiAlertCircle className="inline-block mr-2" /> : <FiCheckCircle className="inline-block mr-2" />}
                        {status}
                    </p>
                )}
            </motion.div>
        </div>
    );
}

export default App;
