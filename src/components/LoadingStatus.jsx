import React from 'react';
import { Box, Text } from 'ink'; 
import Spinner from 'ink-spinner';

const LoadingStatus = () => (
    <Box marginTop={1}>
        <Text color="yellow">
            <Spinner type="dots" /> <Text bold>YouTube</Text> results are loading...
        </Text>
    </Box>
);

export default LoadingStatus;