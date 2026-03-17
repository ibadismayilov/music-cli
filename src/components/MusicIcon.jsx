import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

const MusicIcon = ({ isPaused }) => {
    const [colorIndex, setColorIndex] = useState(0);
    const colors = ['cyan', 'blue', 'magenta', 'yellow'];

    const iconLines = [
        "   ____   ",
        "  /    \\  ",
        " /      \\ ",
        " |  🎵  | ",
        " \\      / ",
        "  \\____/  ",
    ];

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setColorIndex(prev => (prev + 1) % colors.length);
        }, 1200);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <Box flexDirection="column" alignItems="center">
            {iconLines.map((line, index) => (
                <Box key={index}>
                    <Text color={colors[colorIndex]} bold>
                        {line}
                    </Text>
                </Box>
            ))}
        </Box>
    );
};

export default MusicIcon;