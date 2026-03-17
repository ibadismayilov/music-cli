# Music CLI 🎵

A terminal-based YouTube music player built with React and Ink. Search for music on YouTube, select tracks, and enjoy playback with visual feedback and full controls—all from your command line.

## Features

- **Interactive Terminal UI**: Colored interface with animations and responsive layout
- **YouTube Search**: Search and select from YouTube results using yt-dlp
- **Real-time Playback**: Progress bar, time display, and animated music visualizer
- **Full Controls**: Play/pause, volume adjustment, seeking, repeat mode
- **Help Screen**: Press 'H' for control reference
- **Metadata Display**: Song title, duration, uploader, view count

## Prerequisites

- **Node.js** 16 or higher
- **pnpm** 10.32.1 or higher
- **System Dependencies**:
  - `yt-dlp` (YouTube downloader and metadata extractor)
  - `mpv` (media player with IPC socket support)
  - `socat` (for inter-process communication)

### Installing System Dependencies

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install yt-dlp mpv socat
```

#### On macOS (with Homebrew):
```bash
brew install yt-dlp mpv socat
```

#### On other systems:
- [yt-dlp installation guide](https://github.com/yt-dlp/yt-dlp#installation)
- [mpv installation guide](https://mpv.io/installation/)
- Install `socat` via your package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd music-cli
```

2. Install dependencies:
```bash
pnpm install
```

## Quick Start

Run the application:
```bash
pnpm start
```

1. Enter a search query (e.g., "your favorite song")
2. Select a track from the results using arrow keys and Enter
3. Enjoy playback with controls!

## Controls

| Key | Action |
|-----|--------|
| `P` | Play/Pause |
| `R` | Toggle repeat mode |
| `↑/↓` | Volume up/down (±5%) |
| `←/→` | Seek backward/forward (±10 seconds) |
| `H` | Show help screen |
| `Q` | Quit |

## Architecture

### Components
- **App.jsx**: Main container managing UI states (input → selecting → playing)
- **Player.jsx**: Core player with progress bar, controls, and visualizer
- **Header.jsx**: Title banner
- **LoadingStatus.jsx**: Search loading spinner
- **MusicVisualizer.jsx**: Animated playback visualizer
- **MusicIcon.jsx**: Animated musical note icon

### Hooks
- **useYoutube.js**: Handles YouTube search using yt-dlp subprocess

### Workflow
1. **Input**: User enters search query
2. **Selecting**: Interactive menu of YouTube results
3. **Playing**: Full player interface with mpv playback

## Troubleshooting

### "Command not found: yt-dlp"
- Install yt-dlp as described in Prerequisites

### "Command not found: mpv"
- Install mpv with IPC socket support

### Playback doesn't start
- Ensure `socat` is installed for IPC communication
- Check that the selected video is available on YouTube

### Visualizer not animating
- The visualizer responds to playback state; ensure audio is playing

### Socket errors
- The app uses `/tmp/mpv-socket` for communication; ensure no permission issues

## Known Limitations

- Requires internet connection for YouTube search and playback
- Depends on external tools (yt-dlp, mpv, socat)
- Terminal resize may affect layout
- No offline playback support

## Developed by

Ibad Ismayilov