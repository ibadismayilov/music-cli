import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

const MusicVisualizer = ({ isPaused }) => {
    const columns = 25;
    const [bars, setBars] = useState(new Array(columns).fill(2));

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setBars(prev => prev.map(() => Math.floor(Math.random() * 6) + 1));
        }, 150);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <Box flexDirection="row" alignItems="flex-end" height={6}>
            {bars.map((h, i) => (
                <Box key={i} marginRight={1}>
                    <Text color="white">{"┃".repeat(h).split("").join("\n")}</Text>
                </Box>
            ))}
        </Box>
    );
};

export default MusicVisualizer;