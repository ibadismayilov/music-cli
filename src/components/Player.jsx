import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { spawn, exec } from 'child_process';
import MusicVisualizer from './MusicVisualizer.jsx';

const Player = ({ results, currentIndex, onFinished }) => {
    const { stdout } = useStdout();
    const songData = results[currentIndex];
    
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume]           = useState(100);
    const [isPaused, setIsPaused]       = useState(false);
    const [isRepeat, setIsRepeat]       = useState(false);
    const [showHelp, setShowHelp]       = useState(false);
    
    const videoId             = songData.value || songData.videoId;
    const { label, duration } = songData;
    const totalDuration       = duration || 0;
    const socketPath          = '/tmp/mpv-socket';

    const sendCommand = (command, callback) => {
        const jsonCommand = JSON.stringify({ command });
        exec(`echo '${jsonCommand}' | socat - ${socketPath}`, (err, res) => {
            if (callback && res) try { callback(JSON.parse(res)); } catch (e) {}
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && !showHelp) {
                sendCommand(['get_property', 'time-pos'], (res) => {
                    if (res?.data) setCurrentTime(Math.floor(res.data));
                });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isPaused, showHelp]);

    useEffect(() => {
        const mpv = spawn('mpv', [
            `https://www.youtube.com/watch?v=${videoId}`,
            '--no-video', `--volume=${volume}`,
            `--input-ipc-server=${socketPath}`, '--msg-level=all=no'
        ]);
        mpv.on('close', onFinished);
        return () => mpv.kill();
    }, [videoId]);

    useInput((input, key) => {
        if (showHelp) return setShowHelp(false);

        if (input === 'q') onFinished();
        if (input === 'h') setShowHelp(true);
        if (input === 'p' || input === ' ') {
            setIsPaused(!isPaused);
            sendCommand(['set_property', 'pause', !isPaused]);
        }
        if (input === 'r') {
            const nextRepeat = !isRepeat;
            setIsRepeat(nextRepeat);
            sendCommand(['set_property', 'loop-file', nextRepeat ? 'inf' : 'no']);
        }
        if (key.upArrow) setVolume(v => { const nv = Math.min(v+5, 100); sendCommand(['set_property', 'volume', nv]); return nv; });
        if (key.downArrow) setVolume(v => { const nv = Math.max(v-5, 0); sendCommand(['set_property', 'volume', nv]); return nv; });
        if (key.rightArrow) sendCommand(['seek', 10]);
        if (key.leftArrow) sendCommand(['seek', -10]);
    });

    const formatTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

    const barWidth = Math.max(stdout.columns - 8, 20); 
    const progress = totalDuration > 0 ? (currentTime / totalDuration) : 0;
    const filledWidth = Math.min(Math.floor(barWidth * progress), barWidth);
    const emptyWidth = Math.max(barWidth - filledWidth, 0);

    return (
        <Box flexDirection="column" flexGrow={1} justifyContent="space-between">
            
            {/* 1. HEADER SPACE */}
            <Box height={1} />

            {/* 2. CENTER CONTENT (Visualizer or Help) */}
            <Box flexGrow={1} justifyContent="center" alignItems="center">
                {showHelp ? (
                    <Box borderStyle="double" borderColor="magenta" paddingX={3} paddingY={1} flexDirection="column">
                        <Text color="magenta" bold underline> 🛠  PLAYER CONTROLS </Text>
                        <Box height={1} />
                        <Text> <Text color="yellow" bold>P / Space </Text> : Play / Pause</Text>
                        <Text> <Text color="yellow" bold>R         </Text> : Repeat Mode</Text>
                        <Text> <Text color="yellow" bold>→ / ←     </Text> : Seek 10s</Text>
                        <Text> <Text color="yellow" bold>↑ / ↓     </Text> : Volume +/-</Text>
                        <Text> <Text color="yellow" bold>Q         </Text> : Stop & Exit</Text>
                        <Box marginTop={1}>
                            <Text dimColor italic>--- Press any key to return ---</Text>
                        </Box>
                    </Box>
                ) : (
                    <Box height={10} alignItems="flex-end">
                        <MusicVisualizer isPaused={isPaused} />
                    </Box>
                )}
            </Box>

            {/* 3. PROGRESS & INFO */}
            <Box flexDirection="column" paddingX={2} marginBottom={1}>
                <Box flexDirection="row">
                    <Text color="yellow" bold>current  : </Text>
                    <Text color="yellow" wrap="truncate-end">{label}</Text>
                    {isRepeat && <Text color="magenta" bold> [REPEAT ON]</Text>}
                </Box>

                <Box flexDirection="column" marginTop={1}>
                    {/* Progress Bar Line */}
                    <Box flexDirection="row">
                        <Text color="yellow" bold>{"━".repeat(filledWidth)}</Text>
                        <Text color="gray" dimColor>{"━".repeat(emptyWidth)}</Text>
                    </Box>
                    {/* Time Labels */}
                    <Box flexDirection="row" justifyContent="space-between">
                        <Text color="yellow" bold>{formatTime(currentTime)}</Text>
                        <Text color="gray">{formatTime(totalDuration)}</Text>
                    </Box>
                </Box>
            </Box>

            {/* 4. FOOTER STATUS BAR */}
            <Box borderStyle="round" borderColor="gray" paddingX={1} flexDirection="row" justifyContent="space-between">
                <Box>
                    <Text color="red" bold> H </Text><Text color="gray">help </Text>
                    <Text color="gray">|</Text>
                    <Text color="yellow" bold> P </Text><Text color="gray">play </Text>
                    <Text color="gray">|</Text>
                    <Text color="cyan" bold> Q </Text><Text color="gray">exit</Text>
                </Box>
                
                <Box>
                    <Text bold color={isPaused ? "yellow" : "green"}>{isPaused ? "PAUSED" : "PLAYING"} </Text>
                    <Text color="gray"> | </Text>
                    <Text color="white" bold>Vol: {volume}%</Text>
                </Box>
            </Box>
        </Box>
    );
};

export default Player;