

///////////////////******Selects******//////////////////////

var playPause = document.querySelector('#play-pause');
var mute = document.querySelector('#mute');
var repeat = document.querySelector('#repeat');
// var nextBtn = document.querySelector('#next');
// var pervBtn = document.querySelector('#perv');
var audio = document.querySelector('audio');
var playIcon = document.querySelector('#play-icon');
var muteIcon = document.querySelector('#mute-icon');
var repeatIcon = document.querySelector('#repeat-icon');
var artistTxt = document.querySelector('#artist');
var trackTxt = document.querySelector('#track');
var durationTxt = document.querySelector('#duration');
var currentTimeTxt = document.querySelector('#currentTime');
var progressBar = document.querySelector('.progress__bar');
var progressCurrent = document.querySelector('.progress__current');
var duration = audio.duration;


///////////////////******Functions******//////////////////////

// Assuming audio and playIcon are properly defined and initialized
function play() {
    if (audio && audio.paused) {
        audio.play();
        playIcon.src = 'pause.png';
    }
}
function pause() {
    if (audio && !audio.paused) {
        audio.pause();
        playIcon.src = 'play.png';
    }
}
function togglePlayPause() {
    if (audio && playIcon) {
        if (audio.paused) {
            play();
        } else {
            pause();
        }
    }
}

function toggleMute() {
    if (audio.muted) {
        muteIcon.src = 'Mute.png';
        audio.muted = false;
    }
    else {
        muteIcon.src = 'unmute.png';
        audio.muted = true;
    }
}

function toggleRepeat() {
    var repeatIconSrc = repeatIcon.getAttribute('src');
    if (repeatIconSrc === 'unrepeat.png') {
        repeatIcon.setAttribute('src', 'repeat.png');
        if (audio.ended) {
            pause();
        }
    } else if (repeatIconSrc === 'repeat.png') {
        repeatIcon.setAttribute('src', 'unrepeat.png');
        if (audio.ended) {
            audio.currentTime = 0;
            play();
        }
    }
}

function metaData() {
    var file = audio.src;

    jsmediatags.read(file, {

        onSuccess: function (tag) {
            var artist = tag.tags.artist;
            var title = tag.tags.title;
            var duration = audio.duration;
            var currentTime = audio.currentTime;

            artistTxt.innerHTML = artist;
            trackTxt.innerHTML = title;
            durationTxt.innerHTML = secondToTime(duration);
            currentTimeTxt.innerHTML = secondToTime(currentTime);

            var cover = tag.tags.picture;
            var base64String = '';
            for (var i = 0; i < cover.data.length; i++) {
                base64String += String.fromCharCode(cover.data[i]);
            }
            var base64Image = 'data:' + cover.format + ';base64,' + window.btoa(base64String);

            // Set the background image of the div to the base64 image
            var divElement = document.getElementById('coverImage');
            divElement.style.backgroundImage = 'url(' + base64Image + ')';
        },
        onError: function (error) {
            console.log('Error:', error.type, error.info);
        }
    });

}

function durationUpdate() {
    var currentTime = audio.currentTime;
    durationTxt.innerHTML = secondToTime(duration);
    currentTimeTxt.innerHTML = secondToTime(currentTime);

    timePercent = (currentTime / duration) * 100;
    progressCurrent.style.width = timePercent + '%';

}

function secondToTime(second) {

    var hour = Math.floor(second / 3600);
    var min = Math.floor((second % 3600) / 60);
    var sec = Math.floor(second % 60);
    var HMS = '';

    if (hour > 0) {
        HMS += hour.toString().padStart(2, '0') + ':';
    }
    HMS += min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
    return HMS;
}

function next() {

    var src = audio.src;
    var track = parseInt(src.match(/\d+/)[0]);
    console.log(track);
    if (track < 25) {
        track++;
    }
    else {
        track = 1;
    }
    audio.src = `audio/${track}.mp3`;
    progressCurrent.style.width = '0%';
    togglePlayPause();
}

function perv() {

    var src = audio.src;
    var track = parseInt(src.match(/\d+/)[0]);
    console.log(track);
    if (track > 1) {
        track--;
    }
    else {
        track = 25;
    }
    audio.src = `audio/${track}.mp3`;
    progressCurrent.style.width = '0%';
    togglePlayPause();
}

function spacePause(e) {
    if (e.keyCode || e.key) {
        var key = e.keyCode || e.key;
        if (key == '32') {
            togglePlayPause();
            e.preventDefault();
        }
    }
}

function seek(e) {
    var rect = progressBar.getBoundingClientRect();
    var clicked = e.pageX - rect.left;
    var ratio = clicked / rect.width;
    audio.currentTime = ratio * duration;
    play();    
}

///////////////////******Events******//////////////////////

playPause.addEventListener('click', togglePlayPause);
mute.addEventListener('click', toggleMute);
repeat.addEventListener('click', toggleRepeat);
audio.addEventListener('loadedmetadata', metaData);
audio.addEventListener('timeupdate', durationUpdate);
document.addEventListener('keypress', spacePause);
// nextBtn.addEventListener('click', next);
// pervBtn.addEventListener('click', perv);
window.addEventListener("load", function() {
    alert(`از ورودتان خرسند شدیم 💕🙃
    به این قطعه گوش فرا دهید`);
  });
  progressBar.addEventListener('click', seek);

