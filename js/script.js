import { buttons } from "./constants.js";
import { songs } from "./songs.js";

const songList = document.querySelector(".songs");
const songContainers = document.querySelectorAll(".song-container");

let currPlayBtn = null;

document.addEventListener('DOMContentLoaded', () => {
    songs.forEach(song => {
        songList.innerHTML += songContainer(song);
    });
    songList.addEventListener('click', (e) => {
        const clickedContainer = e.target.closest('.song-container');
        if (clickedContainer) {
            const playBtn = clickedContainer.querySelector('.play-btn');

            // If the current play button is not the clicked one and is in 'pause' state
            if (currPlayBtn && currPlayBtn !== playBtn && currPlayBtn.textContent === buttons.pause) {
                currPlayBtn.textContent = buttons.play;
            }

            if (playBtn && playBtn.textContent === buttons.play) {
                playSong(clickedContainer, false);
                playBtn.textContent = buttons.pause;
            } else if (playBtn) {
                playSong(clickedContainer, true);
                playBtn.textContent = buttons.play;
            }

            currPlayBtn = playBtn; // Update the current play button
        }
    });
});


function songContainer(song){
   return `<div class="song-container">
    <div class="song-info">
      <h2 class="song-name">${song.title}</h2>
      <h3 class="artist">${song.artist}</h3>
    </div>
    <span class="material-symbols-outlined play-btn">play_circle</span>
    <div class="song-img-container">
      <img src="${song.cover}" />
    </div>
  </div>
  `
}

let currentSong = null;
let currentSongTime = 0;

function playSong(clickedContainer, isPlaying) {   
    const songTitle = clickedContainer.querySelector('.song-name').textContent;
    const song = songs.find(s => s.title === songTitle);

    const audioPlayer = document.querySelector('audio');

    if (song) {
        // Check if the clicked song is different from the current song
        if (currentSong !== song.src) {
            currentSong = song.src;
            audioPlayer.src = song.src;
            currentSongTime = 0;
        }
        if (isPlaying) {          
            currentSongTime = audioPlayer.currentTime;
            audioPlayer.pause();
        } else {
            audioPlayer.currentTime = currentSongTime;
            audioPlayer.play();
        }
    }
}
