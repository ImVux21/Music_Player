const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const audio = $('#audio');
const progressBar = $('#progress');
const cdThumb = $('.cd-thumb');
const player = $('.player');

const app = { 
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
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
            name: 'vaicaunoi',
            singer: 'GREY D x TLINH',
            path: './songs/vaicaunoicokhiennguoithaydoi.mp3',
            image: './img/vai_cau_noi.jpg'
        },
        {
            name: 'Yêu em qua dòng tin nhắn',
            singer: 'Ngơ ft Nân',
            path: './songs/yeuemquadongtinnhan.mp3',
            image: './img/yeu_em_qua_dong_tin_nhan.jpg'
        }
    ],

    renderPlaylistSongs() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });

        $('.playlist').innerHTML = htmls.join('');
    },

    scrollMinisizeCD() {
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        // event scroll according to Y (vertical scrolling)
        document.onscroll = function() {
            // scrollY returns the number of pixels that the document is currently scrolled vertically. 
            const scrollTop = window.scrollY;
            // when scrolling, cd will reduce dimensions(kich thuoc) -> newCdWidth
            const newCdWidth = cdWidth - scrollTop;


            // every times scrolling, adding new width of cd
            // check if scrollTop is negative -> cd width = 0
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            // every times scrolling, adding new opacity of cd
            cd.style.opacity = newCdWidth / cdWidth;
        }
    },

    loadCurrentSongToDashBoard() {
        const headerTitleSong = $('header h2');
        const currentSong = this.getCurrentSong();
        
        headerTitleSong.textContent = currentSong.name;
        cdThumb.style.backgroundImage = `url('${currentSong.image}')`;
        audio.src = `${currentSong.path}`;
    },

    getCurrentSong() {
        return this.songs[this.currentIndex];
    },

    handleAudioPlayerBar() {
        // cd rotates
        const cdThumbAnimate = this.rotateCd();
        cdThumbAnimate.pause();

        // handle play button
        this.handlePlayBtn(cdThumbAnimate);
        // update current time in progress bar
        this.updateCurrentTime();
        // handle seek action
        this.seek();
        // handle loop button
        this.handleRepeatBtn();
        // handle random button
        this.handleRandomBtn();
        // previous playback
        this.handelPreviousBtn();
        // next playbcak
        this.handleNextBtn();     
    },

    playRandomSong() {
        const _this = this;
        
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.songs.length);           
        } while(this.currentIndex === randomIndex);
        
        this.currentIndex = randomIndex;
        this.loadCurrentSongToDashBoard(); 
    },
    
    handleRandomBtn() {
        const _this = this;
        const randomBtn = $('.btn-random');

        randomBtn.onclick = function () {
            // if isRandom == true -> false, otherwise
            _this.isRandom = !_this.isRandom;
            
            // when clicking randomBtn -> add active
            this.classList.toggle('active'); 
        };
    },

    handelPreviousBtn() {
        const _this = this;
        const prevBtn = $('.btn-prev');
        
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.updatePrevSong();             
            }
            audio.play();
        };
    },

    updatePrevSong() {
        this.currentIndex--;
        // if reaching last index, current index will be at beginning of index
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        // load song to dashboard
        this.loadCurrentSongToDashBoard();
    },

    handleNextBtn() {
        const _this = this;
        const nextBtn = $('.btn-next');
        
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.updateNextSong();
            }

            // audio is played when clicking next button
            audio.play();
        };
    },

    updateNextSong() {
            this.currentIndex++;
            // if reaching last index, current index will be at beginning of index
            if (this.currentIndex > this.songs.length - 1) {
                this.currentIndex = 0;
            }
            // load song to dashboard
            this.loadCurrentSongToDashBoard();
    },

    handlePlayBtn(cdThumbAnimate) {
        const _this = this;
        const playBtn = $('.btn-toggle-play');

        // handle play button
        playBtn.onclick = function () {
            _this.turnOnOrOffAudio();
        }

        // if audio is playing, add needed properties
        this.changePlayProperties(cdThumbAnimate);
        // if audio is pausing, remove needed properties
        this.changePauseProperties(cdThumbAnimate);
    },

    turnOnOrOffAudio() {
        // if use this in here, this = playBtn, so assign _this = this, instead;
        if (this.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
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

    updateCurrentTime() {
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
                progressBar.value = progressTime;

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

    seek() {
        const _this = this;
        progressBar.onchange = function(e) {
            const seektime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seektime;
        };
    },

    rotateCd() {
        return cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 8500,
            iterations: Infinity 
        });
    },

    autoNextSong() {
        const _this = this;
        // when a song ended
        audio.onended = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.updateNextSong();
            }
            audio.play();
        }
        
    },

    start() {
        // render playlist songs to htmls
        this.renderPlaylistSongs();
        // minimize Cd when scrolling
        this.scrollMinisizeCD();
        // load current song
        this.loadCurrentSongToDashBoard();
        // handle Play button
        this.handleAudioPlayerBar();
        // automatically next song when ending song
        this.autoNextSong();
    }
};

app.start();