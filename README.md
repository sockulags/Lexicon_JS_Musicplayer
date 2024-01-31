## MusicPlayer Application - TuneToad

Live demo here: [TuneToad](https://sockulags.github.io/Lexicon_JS_Musicplayer/)

### Goals
The MusicPlayer is a JavaScript-based application designed to showcase a real-world implementation of a web-based music player. The primary goal is to create an interactive, user-friendly music player using vanilla JavaScript and CSS. The application aims to provide a seamless experience for playing a variety of songs, complete with custom controls and a visually appealing user interface.

---

### How It Works
MusicPlayer utilizes the HTML `<audio>` element to handle audio playback. The core functionality is scripted in vanilla JavaScript, which dynamically generates the playlist, controls the playback, and updates the user interface in response to user interactions. The application reads from a predefined list of songs, each with associated metadata such as song title, artist, and cover image. Custom controls for play, pause, navigation, and shuffle are implemented to enhance the user experience.

---

### Features
- **Multi-Track Playlist**: Supports different songs, complete with album covers and locally stored audio files.
- **Dynamic Playlist View**: A section of the app displays the current playlist, allowing users to select and play songs.
- **Current Song Display**: The app shows information about the song currently playing, including title, artist, and album cover.
- **User Friendly Search Bar**: Click the magnifying glass and start type - automatically shows the option you have left based on your search criteria.
- **Interactive Controls**: Custom-built play, pause, next, previous, loop, and shuffle controls.
- **Progress Bar**: A slider to indicate song progress and to seek within the song.
- **Automatic Playback**: Automatically plays the next song in the list upon completion of the current song.
- **Shuffle Play**: Option to shuffle the playlist, ensuring a unique listening experience.
---
### Moving forward / Possible updates
- **Volume control**: The ability to adjust volume interactively and ability to mute on click.
- **Playlists**: Be able to make your own playlist - need more songs for that though.
- **Fetch songs from some api**: More songs, more options.
- **Expand UI**: Right now it's like a prototype design encapsulated to mimick small screen devices. Make desktop friendly and remove the container.
