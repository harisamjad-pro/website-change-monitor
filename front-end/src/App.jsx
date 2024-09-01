import { useState, useEffect, useCallback } from 'react';

function App() {
    const [url, setUrl] = useState('');
    const [content, setContent] = useState('');
    const [previousContent, setPreviousContent] = useState('');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchContent = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/fetch?url=${encodeURIComponent(url)}`);
            const data = await response.json();

            if (previousContent && previousContent !== data.content) {
                alert('Content has changed!');
            }

            setPreviousContent(content);
            setContent(data.content);
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (url) {
                fetchContent();
            }
        }, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [fetchContent, url]);

    return (
        <div>
            <h1>Website Monitor</h1>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL"
            />
            <button onClick={fetchContent}>Fetch Content</button>
            <div>
                <h2>Website Content:</h2>
                <pre>{content}</pre>
            </div>
        </div>
    );
}

export default App;
