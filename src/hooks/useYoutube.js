import { useState } from 'react';
import { spawn } from 'child_process';

export const useYoutube = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const search = (query) => {
        setLoading(true);
        const ytdlp = spawn('yt-dlp', [
            `ytsearch10:${query}`,
            '--dump-single-json',
            '--flat-playlist'
        ]);

        let output = '';
        ytdlp.stdout.on('data', data => output += data.toString());
        
        ytdlp.on('close', () => {
            try {
                const data = JSON.parse(output);
                const formatted = data.entries.map(video => ({
                    label: video.title,           
                    value: video.id,              
                    duration: video.duration,     
                    uploader: video.uploader,     
                    view_count: video.view_count, 
                    upload_date: video.upload_date 
                }));
                
                setResults(formatted);
            } catch (err) {
                console.error("Something went wrong: ", err);
            }
            setLoading(false);
        });
    };

    return { search, results, loading };
};