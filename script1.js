// console.log("hello world");
let currentSong = new Audio();
let songs ;
let log = document.querySelector(".log-container");

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5501/songs/");
    let response = await a.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split("/songs/")[1]));
        }
    }

    return songs;
}
let currentIndex = 0; // Initialize the current index
// let songs = []; // This will be populated with the list of songs

// Function to play music
const playMusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play().then(() => {
        play.src = "img/pause.svg";
    })
    // .catch(error => console.error('Failed to play the audio:', error));
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

const playNextSong = () => {
    if (currentIndex < songs.length - 1) {
        currentIndex++;
        playMusic(songs[currentIndex]);
    } else {
        console.log("This is the last song, can't go forward further.");
    }
}

// Event listener for previous button
document.getElementById("previous").addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");

    if (currentIndex > 0) {
        currentIndex--;
        playMusic(songs[currentIndex]);
    } else {
        console.log("This is the first song, can't go back further.");
    }
});

// Event listener for next button
document.getElementById("next").addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    if (currentIndex < songs.length - 1) {
        currentIndex++;
        playMusic(songs[currentIndex]);
    } else {
        console.log("This is the last song, can't go forward further.");
    }
});


async function main() {
    // Get the list of all songs
    songs = await getSongs();
    playMusic(songs[0], true)
    // console.log(songs);

    if (songs.length > 0) {
        // Play the first song
        var audio = new Audio('songs/' + songs[0]);
        // Uncomment the line below to play the audio
        // audio.play().catch(error => console.error('Failed to play the audio:', error));
    }

    let songsUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">  
                                <div class="songName">${song.replaceAll("%20", " ")}</div>
                               
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
         </li>`;
    }
    // attach an event listener to each song
    Array.from(document.querySelectorAll(".songsList li")).forEach(e => {
        e.addEventListener("click", element => {
            const songName = e.querySelector(".info .songName").innerText.trim();
            console.log(songName);
            playMusic(songName);
        });
    });

    // attach an event listener to play , next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        const currentTime = formatTime(currentSong.currentTime);
        const duration = formatTime(currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${currentTime} / ${duration}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });
    currentSong.addEventListener("ended", () => {
        playNextSong();
    });

    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })

    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    // add an event listener for closs

    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%"
    })

     // Add an event to volume
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

 
    //   Add event listener to the sign-up button
    let logbtn = document.querySelector(".logbtn");
    let logContainer = document.querySelector(".log-container");
    logbtn.addEventListener("click",function(){
        console.log("click");
        window.location.href = "authentication.html"; 
        document.body.innerHTML = ""; 
    })
}
main();

