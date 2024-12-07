// Get the elements
const playButton = document.querySelector('.playback-btns img:nth-child(3)');  // Play/Pause button
const skipBackButton = document.querySelector('.playback-btns img:nth-child(2)'); // Skip Back (Previous Song)
const skipForwardButton = document.querySelector('.playback-btns img:nth-child(4)'); // Skip Forward (Next Song)
const shuffleButton = document.querySelector('.playback-btns img:nth-child(1)'); // Shuffle button
const repeatButton = document.querySelector('.playback-btns img:nth-child(5)'); // Repeat button


const progressBar = document.querySelector('.dur-bar'); // Progress bar
const currentTimeSpan = document.querySelector('.durations span:first-child'); // Current time
const durationTimeSpan = document.querySelector('.durations span:last-child'); // Total duration time

// Song details elements
const songNameElement = document.getElementById('song-name');
const songArtistElement = document.getElementById('song-artist');
const songThumbnailElement = document.getElementById('song-thumbnail');

// Get the additional elements
const currentSongNameDiv = document.querySelector('.cuname'); // For the current song name
const totalDurationDiv = document.querySelector('.hh'); // For the total duration of the song

// Set up the audio player
const audio = new Audio();
let isPlaying = false;
let isShuffle = false;
let isRepeating = false;
let isCurrFav = false

allSongs = playlist = [
    {
        name: 'Khuda Jaane',
        artist: 'Vishal-Shekhar | KK | Shipa Rao',
        thumbnail: './More/Bachna ae hasino.jpg',
        audioPath: 'Audio/KJ.mp3'
    }, 
    {
        name: 'Kya Mujhe Pyar Hain',
        artist: 'Pritam | KK',
        thumbnail: './More/KK.jpg',
        audioPath: 'Audio/KMPH.mp3'
    }, 
    {
        name: 'Pee Loon',
        artist: 'Pritam Irshad Kamil | Mohit Chauhan',
        thumbnail: './More/Mumbai.jpeg',
        audioPath: 'Audio/PL.mp3'
    },
    {
        name: 'Dil Ibadat',
        artist: 'KK | Pritam',
        thumbnail: './More/DI.jpg',
        audioPath: 'Audio/DI.mp3'
    }
    , {
        name: 'I AM IN LOVE',
        artist: 'Pritam | KK | Dominique | Nilesh Mishra',
        thumbnail: './More/Mumbai.jpeg',
        audioPath: 'Audio/IAIL.mp3'
    }, {
        name: 'O Meri Laila',
        artist: 'Joi Barua | Atif Aslam | Jyoti Tangri',
        thumbnail: './More/laila majnu.jpg',
        audioPath: 'Audio/laila.mp3'
    }, {
        name: 'Sajde Kiye Hain Lakho',
        artist: 'Pritam | KK | Sunidhi Chauhan',
        thumbnail: './More/S.png',
        audioPath: 'Audio/S.mp3'
    }, {
        name: 'Tum Jo Aye',
        artist: 'Pritam | Rahat Fateh Ali Khan | Tulsi Kumar',
        thumbnail: './More/Mumbai.jpeg',
        audioPath: 'Audio/TJA.mp3'
    }, {
        name: 'Zara Sa',
        artist: 'Pritam | KK',
        thumbnail: './More/Zara sa.jpeg',
        audioPath: 'Audio/ZS.mp3'
    }, {
        name: 'Soniye (Heartless)',
        artist: 'Pritam | KK',
        thumbnail: './More/KK.jpg',
        audioPath: 'Audio/soniye.mp3'
    }, {
        name: 'Mere Yaara',
        artist: 'Arijit S | Neeti M | Rashmi V',
        thumbnail: './More/MY.jpeg',
        audioPath: 'Audio/MY.mp3'
    }
];


playlist = allSongs



let favoriteSongs = []

function favSongs() {
    const heartIcon = document.querySelector("img.heart");
    if (!heartIcon) {
        console.error("Heart icon not found!");
        return;
    }

    heartIcon.addEventListener("click", () => {
        playlist = isCurrFav ? playlist : favoriteSongs; // Switch playlists
        if (!isCurrFav) {
            playlist = favoriteSongs

            isCurrFav = !isCurrFav
            generatePlaylist()
        }
        else if (isCurrFav) {
            playlist = allSongs

            isCurrFav = !isCurrFav
            generatePlaylist()
        }
        console.log(`Playlist length: ${playlist.length}`);
        generatePlaylist()
    });
    // shufflePlaylist()

}

favSongs()


function shufflePlaylist() {
    for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]]; // Swap elements
    }
    updatePlaylistUI(); // Update the UI after shuffling
}

// Function to clear and regenerate the playlist in the UI
function updatePlaylistUI() {
    const section = document.querySelector("section");
    section.innerHTML = ""; // Clear the existing playlist
    generatePlaylist(); // Regenerate the playlist with the updated order
}

// Load the first song
shufflePlaylist()
let currentSongIndex = 0;

// Load the first song
loadSong(currentSongIndex);

// Play/Pause functionality
playButton.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        playButton.src = 'Assets/slice 8.png'; // Update to play button
    } else {
        audio.play();
        playButton.src = 'Assets/slice 3.png'; // Update to pause button
    }
    isPlaying = !isPlaying;
});

// Skip forward functionality (Next song)
skipForwardButton.addEventListener('click', () => {
    nextSong();
});

// Skip back functionality (Previous song)
skipBackButton.addEventListener('click', () => {
    prevSong();
});

// Shuffle functionality
shuffleButton.addEventListener('click', () => {
    shufflePlaylist()
});

// Repeat functionality
repeatButton.addEventListener('click', () => {
    // Listener for the repeat button to reset the song duration

    audio.currentTime = 0; // Reset the audio's playback time to 0
    currentTimeSpan.textContent = '0:00'; // Update the current time display to 0:00
    progressBar.style.width = '0%'; // Reset the progress bar to 0%


});

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    // Update current time display  
    currentTimeSpan.textContent = formatTime(currentTime);

    // Update progress bar width
    const progress = (currentTime / duration) * 100;
    progressBar.style.width = `${progress}%`;
});

// Update the total duration when the song's metadata is loaded
audio.addEventListener('loadedmetadata', () => {
    const totalDuration = audio.duration;
    durationTimeSpan.textContent = formatTime(totalDuration); // Update total duration span
    totalDurationDiv.textContent = `${formatTime(totalDuration)}`; // Update .hh div
});

// Format time (helper function for displaying time in MM:SS format)
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Load the song details (name, artist, thumbnail)
function loadSong(index) {
    const song = playlist[index];
    audio.src = song.audioPath;
    songNameElement.textContent = song.name;
    songArtistElement.textContent = song.artist;
    songThumbnailElement.src = song.thumbnail;


    // document.querySelectorAll("i.ri-play-circle-line").forEach(e => {
    //     e.addEventListener("click", () => {
    //         songThumbnailElement.src
    //     })
    // })
    document.querySelector("main > img.bg").src = song.thumbnail

    // Update the "cuname" div with the current song name
    currentSongNameDiv.textContent = `Now Playing: ${song.name}`;

    // Reset progress bar and durations
    progressBar.style.width = '0%';
    currentTimeSpan.textContent = '0:00';
    durationTimeSpan.textContent = '0:00';

    // Play the song once it is loaded
    audio.play();
    isPlaying = true;
    playButton.src = 'Assets/slice 8.png'; // Update button to pause
}

// Play next song
function nextSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
    }
    loadSong(currentSongIndex);
}

// Play previous song
function prevSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    }
    loadSong(currentSongIndex);
}

// Audio ended event (play next song)
audio.addEventListener('ended', () => {
    if (isRepeating) {
        audio.play(); // Loop the current song
    } else {
        nextSong(); // Play the next song in the playlist
    }
});

audio.pause()

// Register the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(() => {
        console.log('Service Worker Registered');
    });
}

function generatePlaylist() {
    document.querySelector("section").innerHTML = ""
    let y = document.createElement("h1")
    y.classList.add("playlist-heading")
    y.style.fontSize = "20px"
    y.innerText = "Playlist: "
    document.querySelector("section").append(y)
    for (let i = 0; i < playlist.length; i++) {
        const container = document.createElement("div");
        container.classList.add("container");

        const h1 = document.createElement("h1")
        h1.innerHTML = (i + 1)// + '<i class="ri-heart-fill"></i>'
        h1.classList.add("h")


        container.appendChild(h1)

        const img = document.createElement("img")
        img.src = playlist[i].thumbnail
        img.classList.add("tnail")
        container.append(img)
        const durElem = document.createElement("p")
        const audioElement = new Audio(playlist[i].audioPath);
        audioElement.addEventListener("loadedmetadata", () => {
            var totalSeconds = Math.floor(audioElement.duration);
            var minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
            var seconds = (totalSeconds % 60).toString().padStart(2, '0');
            // console.log(`Song: ${playlist[i].name}, Duration: ${minutes}:${seconds}`);
            durElem.innerText = `${minutes}:${seconds}`
            durElem.classList.add("durElem")
            container.appendChild(durElem)

            console.log(durElem);
        });
        const lft = document.createElement("div");
        lft.classList.add("lft");

        const songName = document.createElement("h4");
        songName.setAttribute("id", "song-name");
        songName.innerText = playlist[i].name;

        const songArtist = document.createElement("h5");
        songArtist.setAttribute("id", "song-artist");
        songArtist.innerText = playlist[i].artist;

        lft.appendChild(songName);
        lft.appendChild(songArtist);

        container.appendChild(lft);

        // Add play icon
        const playIcon = document.createElement("i");
        playIcon.classList.add("ri-play-circle-line");
        playIcon.setAttribute("data-index", i); // Use a data attribute to store the index
        container.appendChild(playIcon);

        const moreIcon = document.createElement("i")
        moreIcon.classList.add("ri-play-list-add-fill", "more")
        moreIcon.setAttribute("data-index", i)
        container.appendChild(moreIcon)






        // Append to the section
        document.querySelector("section").append(container);
    }

    // Add click event listeners for all play icons
    document.querySelectorAll(".ri-play-circle-line").forEach((icon) => {
        icon.addEventListener("click", () => {
            // Reset styling for all songs
            document.querySelectorAll(".container").forEach((container) => {
                const songNameElement = container.querySelector("h4#song-name");
                songNameElement.style.textDecoration = "none";
                songNameElement.style.fontWeight = "400";
                songNameElement.style.color = "#fff";
            });

            // Get the index and selected song
            const index = icon.getAttribute("data-index"); // Get the index from the data attribute
            const selectedSong = playlist[index]; // Retrieve the song object from the playlist
            loadSong(index)
            audio.pause(); // Pause current audio if playing
            audio.src = selectedSong.audioPath; // Update audio source to the selected song
            audio.play(); // Play the new song

            // Update UI elements
            songThumbnailElement.src = "./" + selectedSong.thumbnail;
            songNameElement.innerText = selectedSong.name;
            songArtistElement.innerText = selectedSong.artist;

            currentSongIndex = index; // Update the current song index

            // Apply styling to the selected song
            const selectedContainer = icon.parentElement;
            const selectedSongNameElement = selectedContainer.querySelector("h4#song-name");
            selectedSongNameElement.style.textDecoration = "underline";
            selectedSongNameElement.style.fontWeight = "600";
            selectedSongNameElement.style.color = "#70ffe1";
            document.querySelector(".cuname").innerText = selectedSong.name
        });
    });


}

// Songs playlist as defined earlier


// Function to rearrange the playlist
function moveSongToFirst(index) {
    // Check if index is valid
    if (index < 0 || index >= playlist.length) {
        console.error("Invalid index");
        return;
    }

    // Extract the selected song
    const selectedSong = playlist.splice(index, 1)[0];

    // Add the selected song to the beginning of the array
    playlist.unshift(selectedSong);

    console.log("Updated playlist:");
}

// Example usage
// Assuming the "more" icon of the second song (index 1) is clicked

function addMoreButtonListeners() {
    document.querySelectorAll(".more").forEach(e => {
        // Remove any existing event listener to avoid duplication
        e.removeEventListener('click', handleMoreClick);

        // Add a single event listener
        e.addEventListener('click', handleMoreClick);
    });
}

function handleMoreClick(event) {
    const e = event.target;
    const num = parseInt(e.getAttribute("data-index"));
    const song = playlist[num];
    const songIndex = favoriteSongs.indexOf(song);

    if (songIndex !== -1) {
        // If the song exists in favoriteSongs, remove it
        favoriteSongs.splice(songIndex, 1);
        alert(`Removed: ${song.name}`);
        e.style.color = "white"; // Set icon color to white
    } else {
        // If the song doesn't exist, add it to favoriteSongs
        favoriteSongs.push(song);
        alert(`Added: ${song.name}`);
        e.style.color = "lightseagreen"; // Set icon color to lightseagreen
    }

    // Update the playlist UI (optional if you need to refresh the display)
    generatePlaylist();

    // Re-attach event listeners to the updated DOM
    addMoreButtonListeners();
}

let captions = {
    "DI.mp3": [
        { time: 13.4, text: "DIL Ibadat Kar Raha Hain" },
        { time: 16.6, text: "Dhadkane Meri Sunn" },
        { time: 19, text: "Tujhko Main Kar Loon Haasil" },
        { time: 21.4, text: "Lagi Hain Yahi Dhunn" },
        { time: 26.4, text: "Zindagi Ki Shaakh Se Loon" },
        { time: 29.6, text: "Kuch Haseen Pal Main Chun" },
        { time: 31.9, text: "TujhKo Main Kar Loon Haasil" },
        { time: 34.2, text: "Lagi Hain Yahi Dhunn" },

        { time: 39.24, text: "Seyo Leyo Sama Leyo Seyo Leyo Haa" },
        { time: 51.2, text: "Oh Yeah" },

        { time: 52, text: "DIL Ibadat Kar Raha Hain" },
        { time: 55.2, text: "Dhadkane Meri Sunn" },
        { time: 57.6, text: "Tujhko Main Kar Loon Haasil" },
        { time: 59.8, text: "Lagi Hain Yahi Dhun" },
        { time: 62.8, text: "" },
        { time: 64.8, text: "Zindagi Ki Shaakh Se Loon" },
        { time: 68, text: "Kuch Haseen Pal Main Chun" },
        { time: 70.4, text: "TujhKo Main Kar Loon Haasil" },
        { time: 72.37, text: "Lagi Hain Yahi Dhunn" },
        { time: 76, text: "" },


        { time: 77.2, text: "Jo Bhi Jitne Pal Jiyu" },
        { time: 80.55, text: "Unhe Tere Sang Jiyu" },
        { time: 83.6, text: "Jo Bhi Kal Ho Ab Mera" },
        { time: 86.8, text: "Use Tere Sang Jiyu" },
        { time: 90.1, text: "Jo Bhi Sansein Main Bharu" },
        { time: 93.3, text: "Unhe Tere Sang Bharu" },
        { time: 96.5, text: "Chaahe Jo Ho Raasta" },
        { time: 99.7, text: "Use Tere Sang Chalu" },
        { time: 103.2, text: "DIL Ibadat Kar Raha Hain" },
        { time: 106.5, text: "Dhadkane Meri Sunn" },
        { time: 108.8, text: "Tujhko Main Kar loon Haasil" },
        { time: 111.18, text: "Lagi Hain Yahi Dhunn" },
        { time: 115, text: "Na Na Na Na Na Na Na Na Na Na Na " },
        { time: 119.31, text: "Na Na Na Na Na" },
        { time: 121.31, text: "Na Na Na Na Na Na Na Na Na Na Na" },
        { time: 125.31, text: "Na Na Na Na Na" },
        { time: 127.31, text: "~~~🎵 🎶~~~" },
        { time: 154.3, text: "Mujhko De Tuu Mitt Jaane" },
        { time: 158, text: "Ab Khud Se Dil Mil Jaane" },
        { time: 161.15, text: "Kyun Hain Yeh Itna Faasla" },
        { time: 166, text: " " },
        { time: 167.2, text: "Lamhein Yeh Fir Na Aane" },
        { time: 170.8, text: "Inko Tu Na De Jaane" },
        { time: 173.9, text: "Tu Mujh Pe Khud Ko De Luta" },
        { time: 179.6, text: "Tujhe Tujhse Todh Loon" },
        { time: 182.8, text: "Kahin Khud Se Jodh Loon" },
        { time: 186, text: "Mere Jismo-Jaan Pe Aaa" },
        { time: 189.26, text: "Teri Khushbu Odh Loon" },
        { time: 192.24, text: "Jo Bhi Sansein Main Bharu" },
        { time: 195.76, text: "Unhe Tere Sang Bharu" },
        { time: 198.92, text: "Chaahe Jo Ho Raasta" },
        { time: 202.1, text: "Use Tere Sang Chalu" },
        { time: 205.6, text: "Dil Ibadat Kar Raha Hain" },
        { time: 208.9, text: "Dhadhkane Meri Sunn" },
        { time: 211.18, text: "Tujhko Main Kar loon Haasil" },
        { time: 213.5, text: "Lagi Hain Yahi Dhunn" },
        { time: 219.1, text: "Aaaaaa" },

        { time: 243.9, text: "Baahon Mein De Bas Jaane" },
        { time: 247.5, text: "Seenein Mein De Chup Jaane" },
        { time: 250.7, text: "Tujh Bin Main Jauu To Kahaa" },

        { time: 257, text: "Tujhse Hain Mujhko Paane" },
        { time: 260.4, text: "Yaadon Ke Voh Nazraane" },
        { time: 263.5, text: "Ik Jinpe Hak Ho Bas Mera" },
        { time: 269.3, text: "Teri Yaadon Mein Rahun" },
        { time: 272.4, text: "Tere Khwabon Mein Jagoon" },
        { time: 275.7, text: "Mujhe Dhoonde Jab Koi" },
        { time: 278.9, text: "Teri Ankhon Mein Milu" },

        { time: 282, text: "Jo Bhi Saansein Main Bharu" },
        { time: 285.39, text: "Unhe Tere Sang Bharu" },
        { time: 288.4, text: "Chaahe Jo Ho Raasta" },
        { time: 291.7, text: "Use Tere Sang Chalu" },

        { time: 295.3, text: "Dil Ibadat Kar Raha Hain" },
        { time: 298.41, text: "Dhadkane Meri Sunn" },
        { time: 300.7, text: "Tujhko Main Kar Loon Haasil" },
        { time: 303.1, text: "Lagi Hain Yahi Dhun" },
        { time: 312, text: "Lyrics by Sayeed Quadri" },

    ], "S.mp3": [
        { time: 11.8, text: "ਅੱਖੀਆਂ 'ਚ ਵੱਸਦਾ ਜਿਹੜਾ ਓਹੀ ਮੇਰਾ ਮਾਹੀ ਐ" },
        { time: 24.5, text: " " },
        { time: 26.3, text: "ਚੰਨ ਦੀ, ਨਾ ਤਾਰਿਆਂ ਦੀ, ਰੱਬ ਦੀ ਗਵਾਹੀ ਐ" },
        { time: 37, text: " " },
        { time: 48.2, text: "Sajde kiye hain lakho" },
        { time: 51.1, text: "Lakho Duyaein Mangi" },
        { time: 53.8, text: "Paya hai maine phir tujhe" },
        { time: 59.1, text: "Chahat ki teri maine" },
        { time: 61.7, text: "Haq mein hawayein mangi" },
        { time: 64.39, text: "Paya hai maine phir tujhe" },
        { time: 68.39, text: " " },
        { time: 69.8, text: "Tujhse hi dil yeh behla" },
        { time: 72.6, text: "Tu jaise Kalma phela" },
        { time: 75.2, text: "Chaahoon na phir kyun main tujhe" },
        { time: 80.3, text: "Jis pal na chaha tujhko" },
        { time: 83.2, text: "Us pal sazayein mangi" },
        { time: 85.8, text: "Paya hai maine phir tujhe" },
        { time: 89.6, text: "Ooohh" },
        { time: 91.2, text: "Sajde kiye hai lakho" },
        { time: 93.7, text: "Lakho duyaien mangi" },
        { time: 96.4, text: "Paya hai maine phir tujhe" },
        { time: 102, text: " " },
        { time: 128.7, text: "Jaanein tuu sara woh" },
        { time: 131, text: "Dil mein jo mere ho" },
        { time: 133.8, text: "Padh le tu aankein har dafa" },
        { time: 140.8, text: " " },
        { time: 142.3, text: "Hoo" },
        { time: 144.6, text: "Jaanein tu sara woh" },
        { time: 147.0, text: "Dil mein jo mere ho" },
        { time: 150.2, text: "Padh le tu ankhein har dafa" },
        // { time: , text: "Haan" },
        { time: 155.4, text: "Nakhre se na-jee bhi" },
        { time: 158.1, text: "Hote hain razii bhi" },
        { time: 160.7, text: "Tujhse hi hoti hai khafa" },
        { time: 165.8, text: "Jane tu baatein sari" },
        { time: 168.72, text: "Katt ti hain raatein sari" },
        { time: 171.2, text: "Jalte diye see unbujhe" },
        { time: 176.4, text: "Uth uth ke raaton ko bhi" },
        { time: 179.25, text: "Teri wafayein mangi" },
        { time: 181.7, text: "Paya hai maine phir tujhe" },
        { time: 185.6, text: "Ooohh" },
        { time: 187.03, text: "Sajde kiye hai lakho" },
        { time: 189.9, text: "Lakho duyaien mangi" },
        { time: 192.55, text: "Paya hai maine phir tujhe" },
        { time: 197.5, text: "" },
        { time: 219.4, text: "Chahat ke kajal se" },
        { time: 222, text: "Kismat ke kagaz pe" },
        { time: 224.7, text: "Apni wafayein likh zara" },
        { time: 231, text: " " },
        { time: 234, text: "Haannnnan" },
        { time: 235.2, text: "Chahat ke kajal se" },
        { time: 237.9, text: "Kismat ke kagaj pe" },
        { time: 240.5, text: "Apni wafaein likh zara" },
        { time: 246, text: "Bole zamana yun" },
        { time: 248.5, text: "Mein tere jaisi hoon" },
        { time: 251.2, text: "Tu bhi to mujhsa dikh zara" },
        { time: 256.5, text: "Mera hi saya tu hai" },
        { time: 259.1, text: "Mujh mein samaya tu hai" },
        { time: 262, text: "Har pal yeh lagta hai mujhe" },
        { time: 267, text: "Khud ko mitaya maine" },
        { time: 269.9, text: "Teri balayein mangi" },
        { time: 272.2, text: "Paya hai maine phir tujhe" },
        { time: 276.3, text: "Oooooo" },
        { time: 277.8, text: "Chahe: tu chahe mujhko" },
        { time: 280.1, text: "Aise adayein mangi" },
        { time: 283.02, text: "Paya hai maine phir tujhe" },
        { time: 299.02, text: "Lyrics by Irshad Kamil" }
    ]

};


const captionsDiv = document.querySelector(".captions")
// Get audio element and captions div
function updateCaptions() {
    const currentSong = audio.getAttribute("src").split("/").pop(); // Get current song file name
    const currentTime = audio.currentTime; // Get current play time of song

    if (captions[currentSong]) {
        // Find the caption that matches the current time
        const currentCaption = captions[currentSong].find(
            (caption, index, array) => {
                const nextCaptionTime = array[index + 1]?.time || Infinity; // Get the next caption's start time or Infinity
                return currentTime >= caption.time && currentTime < nextCaptionTime; // Caption is valid until the next one starts
            }
        );

        // Update the captions div with the current caption or clear it if none found
        captionsDiv.textContent = currentCaption ? currentCaption.text : "";
    } else {
        captionsDiv.textContent = "No captions available"; // Default message for songs without captions
    }
}

// Attach the function to the `timeupdate` event of the audio element
audio.addEventListener("timeupdate", updateCaptions);
