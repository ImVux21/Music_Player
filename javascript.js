const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const player = $('.player');
const cdThumb = $('.song-resource .thumb');
const progressBar = $('#progress');
const progressBar2nd = $('.dashboard .progress');

const app = { 
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    playedSongs: [],
    isMiniDashboard: true,
    songs: [
        {
            name: 'Death Bed',
            singer: 'Powfu ft beabadoobee',
            path: './songs/death_bed.mp3',
            image: './img/death_bed.jpg'
        },
        {
            name: 'Just a dream',
            singer: 'Nelly',
            path: './songs/Just_A_Dream.mp3',
            image: './img/Just_a_dream.jpg'
        },
        {
            name: 'Until i found you',
            singer: 'Stephen Sanchez ft Em Beihold',
            path: './songs/until_i_found_u.mp3',
            image: './img/Until_I_found_you.jpg'
        },
        {
            name: 'vaicaunoicokhiennguoithaydoi',
            singer: 'GREY D x TLINH',
            path: './songs/vaicaunoicokhiennguoithaydoi.mp3',
            image: './img/vai_cau_noi.jpg'
        },
        {
            name: 'Yêu em qua dòng tin nhắn',
            singer: 'Ngơ ft Nân',
            path: './songs/yeuemquadongtinnhan.mp3',
            image: './img/yeu_em_qua_dong_tin_nhan.jpg'
        },
        {
            name: 'Bao tiền một mớ bình yên',
            singer: '14 Casper & Bon',
            path: './songs/bao-tien-mot-mo-binh-yen.mp3',
            image: './img/bao-tien-mot-mo-binh-yen.jpg'
        },
        {
            name: 'Chạy Ngay Đi',
            singer: 'Sơn Tùng MTP',
            path: './songs/chayngaydi.mp3',
            image: './img/chay-ngay-di.jpg'
        },
        {
            name: 'Chrismas Tree',
            singer: 'V',
            path: './songs/chrismas-tree.mp3',
            image: './img/chrismas-tree.jpg'
        },
        {
            name: 'Eenie Meenie',
            singer: 'Justin Bieber, Sean Kingston ( Cover By Ray Ft Barron )',
            path: './songs/eenie-meenie.mp3',
            image: './img/eenie-meenie.jpg'
        },
        {
            name: 'Let Her Go',
            singer: 'Passenger ( Cover Lost & HoneyFox & Pop Mage )',
            path: './songs/lethergo.mp3',
            image: './img/let-her-go.jpg'
        },
        {
            name: 'Save Your Tears',
            singer: 'The Weekend',
            path: './songs/saveyourtear.mp3',
            image: './img/save-your-tear.jpg'
        },
    ],

    getCurrentSong() {
        return this.songs[this.currentIndex];
    },

    renderPlaylistSongs() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song" id="${index}">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                </div>
            `;
        });

        playlist.innerHTML = htmls.join('');
    },

    renderSmallDashboard() {
        const currentSong = this.getCurrentSong();
        const title = $('.song-resource .body .title');
        const author = $('.song-resource .body .author');
       
        title.textContent = currentSong.name;
        author.textContent = currentSong.singer;
        cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
        audio.src = `${currentSong.path}`;

        this.hightlightActiveSong();
    },

    renderMainDashboard() {
        const currentSong = this.getCurrentSong();
        const title = $('header h2');
        const cdImage = $('.cd .cd-thumb');

        title.textContent = currentSong.name;
        cdImage.style.backgroundImage = `url('${currentSong.image}')`;
        audio.src = `${currentSong.path}`;
    },

    renderBothDashboards() {
        this.renderSmallDashboard();
        this,this.renderMainDashboard();
    },

    handlePlayBackBar() {
        // cd rotates
        const cdThumbAnimate = this.rotateCd();
        cdThumbAnimate.pause();

        this.handlePlayBtn(cdThumbAnimate);
        this.handleBackBtn();
        this.handleNextBtn();
        this.runSliderThumb();
        this.seek();
        this.updateCurrentTimeOnProgress();
        this.handleRandomBtn();
        this.handleRepeatBtn();
    },

    handleRepeatBtn() {
        const loopBtn = $('.btn-repeat');

        loopBtn.onclick = function () {
            if (audio.loop === false) {
                audio.loop = true;
            } else {
                audio.loop = false;
            }

            this.classList.toggle('active');
        };

    },

    scrollActiveSongIntoView() {
        const activeSong = document.getElementById(`${this.currentIndex}`);

        activeSong.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        }); 
    },

    playRandomSong() {
        // if playedSong is full -> set empty array
        if(this.playedSongs.length >= this.songs.length) {
            this.playedSongs = [];
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);         
        } while(this.currentIndex === randomIndex || this.playedSongs.includes(randomIndex));

        // remove highlight previous active song
        this.removeHighlightSong(this.currentIndex);
        
        this.currentIndex = randomIndex;
        this.renderBothDashboards();
        
        this.scrollActiveSongIntoView();

        // add current index of song into playedSongs when playing next song
        this.addPlayedSong();
    },

    handleRandomBtn() {
        const _this = this;
        const randomBtn = $('.btn-random');

        randomBtn.onclick = function () {
            // if isRandom == true -> false, otherwise
            _this.isRandom = !_this.isRandom;
            
            // when clicking randomBtn -> add active
            this.classList.toggle('active');
            
            // optimize no repeat a song at romdom mode until played alls
            _this.addPlayedSong();

            // if isRandom === false -> set empty array
            if(!_this.isRandom) {
                _this.playedSongs = [];
            }
        };
    },

    addPlayedSong() {    
        this.playedSongs.push(this.currentIndex);
    },

    hightlightActiveSong() {
        const idSong = document.getElementById(`${this.currentIndex}`);

        setTimeout(() => {
            idSong.classList.add('active');
        }, 200);
    },

    removeHighlightSong(oldIndex) {
        const idSong = document.getElementById(`${oldIndex}`);

        setTimeout(() => {
            idSong.classList.remove('active');
        },200);
    },
    
    seek() {
        const _this = this;

        progressBar.onchange = function(e) {
            const seektime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seektime;
        };

        progressBar2nd.onchange = function(e) {
            const seektime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seektime;
        };
    },

    updateCurrentTimeOnProgress() {
        const _this = this;
        const ranTime = $('#ran-time');
        const restTime = $('#rest-time');
        
        // render the duration time to html when loading window
        window.onload = function(){
            const durationTimeString = String((audio.duration / 60).toFixed(2));
            restTime.innerText = _this.splitTime(durationTimeString);
        };

        audio.ontimeupdate = function() {
            if (this.duration) {
                // audio.duration is duration(thoi luong) of song
                const progressTime = Math.floor(this.currentTime / this.duration * 100);

                // update value property of input tags, wheel runs according to progressTime on progress bar
                progressBar2nd.value = progressTime;

                // convert time to minutes and then to string
                const currentTimeString = String((this.currentTime / 60).toFixed(2));
                const restTimeString = String(((this.duration - this.currentTime) / 60).toFixed(2));

                // render time handled time 
                ranTime.innerText = _this.splitTime(currentTimeString);
                restTime.innerText = _this.splitTime(restTimeString);
            }
        };
    },

    splitTime(timeString) {
        const arr = timeString.split('.'); // split time to 2 parts: a whole, a decimal and add : at between
        return arr[0] + ':' + arr[1];
    },

    runSliderThumb() {
        const _this = this;

        audio.ontimeupdate = function() {
            // audio.duration is duration(thoi luong) of song
            const progressTime = Math.floor(this.currentTime / this.duration * 100);

            // update value property of input tags, wheel runs according to progressTime on progress bar
            progressBar.value = progressTime;
            progressBar2nd.value = progressTime;
        }
    },

    autoNextSong() {
        const _this = this;
        // when a song ended
        audio.onended = function () {
            
            _this.updateNextSong();
            audio.play();
        }

        this.scrollActiveSongIntoView();
    },

    handleNextBtn() {
        const _this = this;
        const nextBtn = $('.btn-next');
        const nextBtn2nd = $('.control .btn-next');    
        
        nextBtn.onclick = function () {          
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.updateNextSong();             
            }

            // audio is played when clicking next button
            audio.play();
        };

        nextBtn2nd.onclick = function () {
            nextBtn.click();
        }
    },

    updateNextSong() {
        this.removeHighlightSong(this.currentIndex);

        this.currentIndex++;
        // if reaching last index, current index will be at beginning of index
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
        }
        // load song to dashboard
        this.renderBothDashboards();

        this.scrollActiveSongIntoView();
    },

    handleBackBtn() {
        const _this = this;
        const prevBtn = $('.btn-prev');  
        const prevBtn2nd = $('.control .btn-prev');
        
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.updatePrevSong();             
            }

            audio.play();
        };

        prevBtn2nd.onclick = function () {
            prevBtn.click();
        }
    },

    updatePrevSong() {
        this.removeHighlightSong(this.currentIndex);

        this.currentIndex--;

        // if reaching last index, current index will be at beginning of index
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        // load song to dashboard
        this.renderBothDashboards();

        this.scrollActiveSongIntoView();
    },

    handlePlayBtn(cdThumbAnimate) {
        const _this = this;
        const playBtn = $('.btn-toggle-play');
        const playBtn2nd = $('.control .btn-toggle-play');

        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Main dashboard click
        playBtn2nd.onclick = () => {
            playBtn.click();
        }

        // if audio is playing, add needed properties
        this.changePlayProperties(cdThumbAnimate);
        // if audio is pausing, remove needed properties
        this.changePauseProperties(cdThumbAnimate);
    },

    changePlayProperties(cdThumbAnimate) {
        const _this = this;
        
        audio.onplay = function() {
            // if playing, isPlaying is true
            _this.isPlaying = true;
            
            // when playing, player button will interchange to pause button
            player.classList.add('playing');
            
            // cd runs 
            cdThumbAnimate.play();
        }
    },

    changePauseProperties(cdThumbAnimate) {
        const _this = this;

        audio.onpause = function() {
            _this.isPlaying = false;

            // click player button, will interchange to play button
            player.classList.remove('playing');

            // cd pauses
            cdThumbAnimate.pause();
        }
    },

    rotateCd() {
        return cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 8500,
            iterations: Infinity 
        });
    },

    selectSong() {
        const _this = this;
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (e.target.closest('.song:not(.active)')) {
                _this.removeHighlightSong(_this.currentIndex);
                _this.currentIndex = songNode.getAttribute('id');
                _this.renderBothDashboards();
                audio.play();
            }
        };
    },

    turnOnMainDashboard() {
        const currentSong = $('.current-song');
        const dashboard = $('.dashboard');
        const body = $('body');

        currentSong.onclick = function(e) {
            if(!e.target.closest('.player-bar')) {
                dashboard.style.display = 'grid';
                body.style.overflow = 'hidden';
            }
        }
    },

    turnOffMainDashboard() {
        const closeBtn = $('.close-btn');
        const dashboard = $('.dashboard');
        const body = $('body');

        closeBtn.onclick = function() {
            dashboard.style.display = 'none';
            body.style.overflow = 'visible';
        }
    },

    run() {
        this.renderPlaylistSongs();
        this.renderMainDashboard();
        this.renderSmallDashboard();
        this.handlePlayBackBar();
        this.autoNextSong();
        this.turnOnMainDashboard();
        this.turnOffMainDashboard();
        this.selectSong();
    }
}

app.run();