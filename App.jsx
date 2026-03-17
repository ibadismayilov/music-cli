import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';

import Header from './src/components/Header.jsx';
import LoadingStatus from './src/components/LoadingStatus.jsx';
import Player from './src/components/Player.jsx';
import { useYoutube } from './src/hooks/useYoutube.js';

const App = () => {
    const { stdout } = useStdout();
    const { search, results, loading } = useYoutube();
    const [status, setStatus] = useState('input'); 
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleSearch = (q) => {
        if (!q.trim()) return;
        search(q);
        setStatus('selecting');
    };

    const handleSelect = (item) => {
        const index = results.findIndex(r => (r.value || r.videoId) === (item.value || item.videoId));
        setSelectedIndex(index);
        setStatus('playing');
    };

    return (
        <Box 
            flexDirection="column" 
            paddingX={1}
            borderStyle="round" 
            borderColor="white" 
            width={stdout.columns} 
            height={stdout.rows}
        >
            <Header />

            {status === 'input' && !loading && (
                <Box marginTop={1} borderStyle="single" borderColor="yellow" paddingX={1}>
                    <Text color="yellow" bold>🔍 Search: </Text>
                    <TextInput value={query} onChange={setQuery} onSubmit={handleSearch} />
                </Box>
            )}

            {loading && (
                <Box flexGrow={1} justifyContent="center" alignItems="center">
                    <LoadingStatus />
                </Box>
            )}

            {status === 'selecting' && !loading && (
                <Box flexDirection="column" marginTop={1} flexGrow={1}>
                    <Text color="magenta" bold marginBottom={1}> 🎵 Results for "{query}":</Text>
                    <Box borderStyle="single" borderColor="gray" paddingX={1} flexGrow={1}>
                        <SelectInput items={results} onSelect={handleSelect} />
                    </Box>
                </Box>
            )}

            {status === 'playing' && results.length > 0 && (
                <Box flexGrow={1}>
                    <Player 
                        results={results}
                        currentIndex={selectedIndex}
                        onFinished={() => setStatus('input')} 
                    />
                </Box>
            )}
        </Box>
    );
};

export default App;