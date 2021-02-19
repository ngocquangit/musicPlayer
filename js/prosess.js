const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
let arrSong = []
const player = $('.player')
const cd = $('.cd')
const title = $('header h2')
const cdthumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn =$('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex:0,
    isPlaying : false,
    isTimeupdate :true,
    isRandom :false,
    isRepeat :false,
    songs: [
    {
      name: "Cô Đơn Không Muốn Về Nhà",
      singer: "Mr. Siro",
      path: "../access/music/1.mp3",
      image: "https://images.genius.com/e8329463dba3d0502eee01e81e800629.500x500x1.jpg"
    },
    {
      name: "MUỐN ĐƯỢC CÙNG EM",
      singer: "FREAKY x CM1X (ft. QUỲNH GAI)",
      path: "../access/music/2.mp3",
      image:
        "https://i1.sndcdn.com/artworks-WCrKmFLsPox8nM9j-yDEHnw-large.jpg"
    },
    {
      name: "CHÚNG TA CỦA HIỆN TẠI",
      singer: "SƠN TÙNG M-TP",
      path:
        "../access/music/3.mp3",
      image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
    },
    {
      name: "1 Phút",
      singer: "Andiez",
      path: "../access/music/4.mp3",
      image:
        "https://i1.sndcdn.com/artworks-000239801550-1w4bun-large.jpg"
    },
    {
      name: "Mặt Trời Của Em",
      singer: "Phương Ly feat. JustaTee (Rhymastic's 1900 Remix)",
      path: "../access/music/5.mp3",
      image:
        "https://i1.sndcdn.com/artworks-000271844240-0rg2xb-large.jpg"
    }
  ],
  definePropertis:function () {
      Object.defineProperty(this,'currentSong',
      {
        get:function () {
          return this.songs[this.currentIndex]
        }
      }
     )
    
  },
  handleEvents:function() {
      
      const _this =this
    //   Xử lý cd quay và dừng
    const cdThumbAnimate = cdthumb.animate([
        {transform : 'rotate(360deg)'}
    ],
    {
        duration: 10000, //10 seconds
        iterations: Infinity
    })
    cdThumbAnimate.pause()
    //   Thu phóng cd
      const cdWidth = cd.offsetWidth
      document.onscroll = function () {
          const scrollTop = window.scrollY || document.documentElement.scrollTop
          const newWidth = cdWidth - scrollTop 
          cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
          cd.style.opacity = newWidth / cdWidth
      }

    // Xử lý khi click play
    playBtn.onclick = function () {
        if(_this.isPlaying)
        {
            audio.pause()
        }
        else
        {
            audio.play()
        }
    }
    // Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying= true
            player.classList.add('playing') 
            cdThumbAnimate.play()
        }
    // Khi bài hát được tạm dừng
        audio.onpause = function () {
            _this.isPlaying= false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
    // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime /audio.duration *100)
            progress.value = progressPercent
            }
        }
    // Khi tua bài hát
        progress.onchange = function(e) {
            const seekTime = (parseInt(e.target.value) / 100) * audio.duration 
            audio.currentTime = seekTime  
        }
    // Khi next bài hát 
        nextBtn.onclick = function () {
            if(_this.isRandom)
            {
                _this.playRandomSong()
            }
            else
            {
                _this.nextSong()
            }
            audio.play()
            
            _this.activeSong()
            _this.scrollToSong()
        },
    // Khi trở về bài hát trước
        prevBtn.onclick = function () {
            if(_this.isRandom)
            {
                _this.playRandomSong()
            }
            else
            {
                _this.prevSong()
            }
             audio.play()
            _this.activeSong()
            _this.scrollToSong()
    }
    // Khi bấm random
        randomBtn.onclick = function () {
            _this.isRandom = ! _this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
            arrSong.push(_this.currentIndex)
        }
    // Khi bấm lặp lại
        repeatBtn.onclick = function () {
            _this.isRepeat = ! _this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
    // Khi audio kết thúc
        audio.onended = function () {
            if (_this.isRepeat) {
                nextBtn.click()
            } else {
                if(_this.songs.length -1 != _this.currentIndex)
                nextBtn.click()
            }
            
        }
    // Lắng nghe sự kiện play list
        playlist.onclick = function (e) {
            const songNot = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')
            if( songNot ||songOption )
            { 
                if(songNot)
                {
                    _this.currentIndex = songNot.dataset.index
                    _this.loadCurrentSong()
                    audio.play()
                    _this.activeSong()
                }
            }
        }
  },
  activeSong: function () {
    const songActive = $$('.song')
    songActive.forEach(e => {
        e.className = "song"
    });
    songActive[this.currentIndex].className = "song active"
  },
  scrollToSong: function () {
      setTimeout(() => {
            if(this.currentIndex < 3)
            {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block  : 'end'
            })
            }
            else
            {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block  : 'center'
                }) 
            }
      }, 300);
  },
  prevSong : function () {
    this.currentIndex--
    
    if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length -1
    }
    this.loadCurrentSong()
    },
  nextSong : function () {
      this.currentIndex++
      if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0
      }
      this.loadCurrentSong()
  },
  playRandomSong : function () {
      let isSucsess = false;
      let newIndex;
    do{
        newIndex = Math.floor(Math.random() * this.songs.length)
        if(newIndex == this.currentIndex )
        isSucsess = true
        else
        {
            if(arrSong.indexOf(newIndex) < 0)
            {
            arrSong.push(newIndex)
            isSucsess =false
            }
            else
            isSucsess = true
        }
        if(this.songs.length == arrSong.length)
        {
        arrSong = [newIndex]
        }
    }  while( isSucsess ==true)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  render: function () {
      const htmls = this.songs.map((song,index) =>{
          return `
            <div class="song ${index === this.currentIndex ? 'active':''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
          `
      })
      playlist.innerHTML = htmls.join('')
  },
  loadCurrentSong : function () {
      title.textContent = this.currentSong.name
      cdthumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
  },
  start: function () {
      // Định nghĩa các thuộc tính
      this.definePropertis()
      // Lắng nghe và xử lí sự kiện
      this.handleEvents()
      // Load bài hát đầu tiên vào UI
      this.loadCurrentSong()
      // Render danh sách
      this.render()
  },
}
app.start()