import { buttons } from "./constants.js";
import { songs } from "./songs.js";

const mediaPlayer = document.querySelector(".mediaplayer");

const coverImg = mediaPlayer.querySelector(".img-container img");
const title = mediaPlayer.querySelector(".song-name");
const artist = mediaPlayer.querySelector(".artist");

const audioPlayer = document.querySelector('audio');
const songList = document.querySelector(".songs");
const switchViewButton = document.querySelector(".tab");
const controls = document.querySelector(".control-btns");
const loopBtn = controls.querySelector(".loop-btn");
const shuffleBtn  = controls.querySelector(".shuffle-btn");
const playButton = controls.querySelector(".mediaplayer .play-btn");
const nextSong = controls.querySelector(".next-btn");
const previousSong = controls.querySelector(".prev-btn");

let currPlayBtn = null;

document.addEventListener('DOMContentLoaded', initialize);

function initialize(){
    populateSongList();
    switchViewButton.addEventListener("click", switchView)
    songList.addEventListener('click', handleSongClick)
    updateMediaPlayerSong(songs[0]);
    playButton.addEventListener('click', togglePlay);
}

function togglePlay(){
const songId = mediaPlayer.getAttribute("song-id");
const songContainer = document.querySelector(`[song-id="${songId}"]`);

const playBtn = songContainer.querySelector('.play-btn');
handlePlayButtonClick(playButton.textContent === buttons.play, songContainer, playBtn)
}

function handlePlayButtonClick(isPlaying, container, button){
    playSong(container, !isPlaying);
    button.textContent =  isPlaying ? buttons.pause : buttons.play;
    playButton.textContent =  isPlaying ? buttons.pause : buttons.play;
}

function populateSongList(){
    songs.forEach(song => {
        songList.innerHTML += songContainer(song);
    });
}

function switchView(){
    songList.classList.toggle("hider");
}
function updateMediaPlayerSong(song) {
    mediaPlayer.setAttribute("song-id", song.id)
    coverImg.setAttribute("src", song.cover);
    title.textContent = song.title;
    artist.textContent = song.artist;
}

function handleSongClick(e) {
    const clickedContainer = e.target.closest('.song-container');
    if (!clickedContainer) return;

    const playBtn = clickedContainer.querySelector('.play-btn');
    if (!playBtn) return;

    if (currPlayBtn && currPlayBtn !== playBtn && currPlayBtn.textContent === buttons.pause) {
        currPlayBtn.textContent = buttons.play;
    }
    handlePlayButtonClick(playBtn.textContent === buttons.play, clickedContainer, playBtn)

    currPlayBtn = playBtn;
}

function songContainer(song){
   return `<div class="song-container" song-id="${song.id}">
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

    if (song) {   
        if (currentSong !== song.src) {
            currentSong = song.src;
            audioPlayer.src = song.src;
            currentSongTime = 0;    
            updateMediaPlayerSong(song)        
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
