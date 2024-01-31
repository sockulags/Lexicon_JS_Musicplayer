import { buttons } from "./constants.js";
import { songs } from "./songs.js";

const mediaPlayer = document.querySelector(".mediaplayer");

const coverImg = mediaPlayer.querySelector(".img-container img");
const title = mediaPlayer.querySelector(".song-name");
const artist = mediaPlayer.querySelector(".artist");

const audioPlayer = document.querySelector("audio");
const songList = document.querySelector(".songs");
const switchViewButton = document.querySelector(".tab");
const controls = document.querySelector(".control-btns");
const loopBtn = controls.querySelector(".loop-btn");
const shuffleBtn = controls.querySelector(".shuffle-btn");
const playButton = controls.querySelector(".mediaplayer .play-btn");
const nextSong = controls.querySelector(".next-btn");
const previousSong = controls.querySelector(".prev-btn");
const inputRange = document.querySelector(".time-input");
const songTimeElapsed = document.querySelector(".current-time");
const songLength = document.querySelector(".time-length");
const root = document.querySelector(":root");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search");
let shuffle = false;
let loop=false;

let currPlayBtn = null;
let isMouseDownOnInputRange = false;
const debouncedFilterSongs = debounce(filterSongs, 300);
document.addEventListener("DOMContentLoaded", initialize);

inputRange.addEventListener("mousedown", (e) => {
  isMouseDownOnInputRange = true;
});
inputRange.addEventListener("mouseup", (e) => {
  isMouseDownOnInputRange = false;
  audioPlayer.currentTime = e.target.value;
});

function initialize() {
  populateSongList();
  updateMediaPlayerSong(songs[0]);
  switchViewButton.addEventListener("click", switchView);
  songList.addEventListener("click", handleSongClick);
  playButton.addEventListener("click", togglePlay);
  audioPlayer.addEventListener("loadedmetadata", setSongLength);
  audioPlayer.addEventListener("timeupdate", setTimeElapsed);
  nextSong.addEventListener("click", playNextSong);
  previousSong.addEventListener("click", playPreviousSong)
  shuffleBtn.addEventListener("click", handleShuffleButtonClick)
  loopBtn.addEventListener("click", handleLoopButtonClick)
}


searchButton.addEventListener("click", function() {  
    searchInput.disabled = false; 
    searchInput.focus(); 
  });

  searchInput.addEventListener("input", debouncedFilterSongs);
  searchInput.addEventListener("blur", () => {
    searchInput.value = ''; 
    searchInput.disabled = true;
    debouncedFilterSongs(); 
  });

function filterSongs() {
    const searchQuery = searchInput.value.toLowerCase();
    const songContainers = document.querySelectorAll(".song-container");
  
    songContainers.forEach(container => {
      const songTitle = container.querySelector(".song-name").textContent.toLowerCase();
      const artistName = container.querySelector(".artist").textContent.toLowerCase();  
      
      if (songTitle.includes(searchQuery) || artistName.includes(searchQuery)) {
        container.style.display = ''; 
      } else {
        container.style.display = 'none'; 
      }
    });
  }

  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }
  

function togglePlay() {
  const songId = mediaPlayer.getAttribute("song-id");
  const songContainer = document.querySelector(`[song-id="${songId}"]`);

  const playBtn = songContainer.querySelector(".play-btn");
  handlePlayButtonClick(playButton.textContent === buttons.pause, songContainer, playBtn);
}

function handleShuffleButtonClick(){
    shuffleBtn.classList.toggle("active-btn");
    shuffle = !shuffle;
    if(loop){
        loopBtn.classList.toggle("active-btn"); 
        loop = !loop;   
    }
}

function handleLoopButtonClick(){
    loopBtn.classList.toggle("active-btn");  
    loop = !loop;   
    if(shuffle){
        shuffleBtn.classList.toggle("active-btn");
        shuffle = !shuffle;
    }
}

function handlePlayButtonClick(isPlaying, container, button) {
  playSong(container, !isPlaying);
}
function handlePlayButtonStateUpdate(songId, isPlaying) {    
    playButton.textContent = isPlaying ? buttons.pause : buttons.play;
  
    const songContainers = document.querySelectorAll('.song-container');
    songContainers.forEach(container => {
      const containerSongId = container.getAttribute('song-id');
      const playBtn = container.querySelector('.play-btn');  
     
      if (parseInt(containerSongId) === songId) {
        playBtn.textContent = isPlaying ? buttons.pause : buttons.play;
      } else {       
        playBtn.textContent = buttons.play;
      }
    });
  }
  
function updateMediaPlayerSong(song) {  
  mediaPlayer.setAttribute("song-id", song.id);
  coverImg.setAttribute("src", song.cover);
  title.textContent = song.title;
  artist.textContent = song.artist;
}

function handleSongClick(e) {
  const clickedContainer = e.target.closest(".song-container");
  if (!clickedContainer) return;

  const playBtn = clickedContainer.querySelector(".play-btn");
  if (!playBtn) return;

  if (
    currPlayBtn &&
    currPlayBtn !== playBtn &&
    currPlayBtn.textContent === buttons.pause
  ) {
    currPlayBtn.textContent = buttons.play;
  }
  handlePlayButtonClick(
    playBtn.textContent === buttons.pause,
    clickedContainer,
    playBtn
  );
  currPlayBtn = playBtn;
  switchView();
}

let currentSong = null;
let currentSongTime = 0;
let playHistory = []; 

function playSong(clickedContainer, isPlaying) {
    const songTitle = clickedContainer.querySelector(".song-name").textContent;
    const song = songs.find((s) => s.title === songTitle);
  
    if (song) {
      if (currentSong !== song.src) {        
        playHistory.push(mediaPlayer.getAttribute("song-id"));        
        currentSong = song.src;
        audioPlayer.src = song.src;
        currentSongTime = 0;
        updateMediaPlayerSong(song);
      }
      if (isPlaying) {
        audioPlayer.currentTime = currentSongTime;
        audioPlayer.play();
      } else {
        currentSongTime = audioPlayer.currentTime;
        audioPlayer.pause();
      }
      handlePlayButtonStateUpdate(song.id, isPlaying)
    }
  }
  
  function playPreviousSong() {
    if (playHistory.length > 0) {
      const wasPlaying = !audioPlayer.paused;
      const prevSongId = playHistory.pop();
  
      if (prevSongId) {
        const prevSong = songs.find(song => song.id == prevSongId);
        if (prevSong) {
          updateMediaPlayerSong(prevSong);
          audioPlayer.src = prevSong.src;
          currentSong = audioPlayer.src;
          audioPlayer.load(); 
  
          if (wasPlaying) {
            audioPlayer.play();
          }
          handlePlayButtonStateUpdate(prevSong.id, wasPlaying)
        }
      }
    } else {     
      if (!audioPlayer.paused) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
      }
    }
  }
  
  
  function playNextSong() {
    let nextSongId;
    const currentSongId = mediaPlayer.getAttribute("song-id");
    const wasPlaying = !audioPlayer.paused;
  
    playHistory.push(currentSongId);
  
    if (shuffle) {
      do {
        nextSongId = Math.floor(Math.random() * songs.length);
      } while (nextSongId === parseInt(currentSongId));
    } else {
      nextSongId = parseInt(currentSongId);
      if (nextSongId >= songs.length) {
        nextSongId = 0;
      }
    }
  
    const nextSong = songs[nextSongId];
    if (nextSong) {
      updateMediaPlayerSong(nextSong);
      audioPlayer.src = nextSong.src;
      currentSong = audioPlayer.src;
      audioPlayer.load(); 
  
      if (wasPlaying) {
        audioPlayer.play();
      }
      handlePlayButtonStateUpdate(nextSong.id, wasPlaying)
    }
  }
  
  

function setSongLength() {
  let durationInSeconds = audioPlayer.duration;
  root.style.setProperty("--value", "0");
  inputRange.setAttribute("max", durationInSeconds);
  songLength.textContent = getMinutesAndSeconds(durationInSeconds);
}

function setTimeElapsed() {
  let currentTimeInSeconds = audioPlayer.currentTime;
  if (!isMouseDownOnInputRange) {
    inputRange.value = currentTimeInSeconds;
  }
  if (currentTimeInSeconds >= audioPlayer.duration) {
    playNextSong();
  }
  
  root.style.setProperty(
    "--value",
    `${(currentTimeInSeconds / audioPlayer.duration) * 100}%`
  );
  songTimeElapsed.textContent = getMinutesAndSeconds(currentTimeInSeconds);
}

function getMinutesAndSeconds(totalSeconds) {
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
function populateSongList() {
  songs.forEach((song) => {
    songList.innerHTML += songContainer(song);
  });
}

function switchView() {
   searchButton.classList.toggle("hider");
   if(searchButton.classList.contains("hider"))
   searchInput.value = "Playlist"
else
    searchInput.value = "";
  songList.classList.toggle("hider");
}

function songContainer(song) {
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
   `;
}
