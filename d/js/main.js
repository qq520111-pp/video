window.onload = function () {
    var full = document.querySelector(".full");
    var video = document.querySelector("video");
    var playBtn = document.querySelector(".play-btn");
    var progress = document.querySelector(".progress");
    var progressBtn = document.querySelector(".progress-btn");
    var fileUpload = document.querySelector(".file-upload");
    var warp = document.querySelector(".warp");
    var control = document.querySelector(".control");
    var input = document.querySelector("input");
    var timeLeft = document.querySelector(".time-left>span");
    var timeRight = document.querySelector(".time-right>span");
    var vioceBtn = document.querySelector(".vioce-btn");
    var vioce = document.querySelector(".music-size>.s");
    var play = document.querySelector(".play");
    var time = document.querySelector(".time").children;
    var tog = false, tog1 = false;//节流开关
    var res = null;//读取file的二进制结果
    var currentLength = 0;//记录声音大小的上一次的长度
    var chaX = 0, chaX1 = 0, downX = 0, moveX = 0, endX = 0, endCX = vioceBtn.parentNode.offsetWidth;

    //屏幕上移动的节流函数
    warp.addEventListener("mousedown", jl());
    warp.addEventListener("mousemove", jl());
    warp.addEventListener("touchstart", jl());
    warp.addEventListener("touchmove", jl());
    function jl() {
        var time = null;
        return function (ev) {
            if (time) {
                clearTimeout(time);
            }
            control.style.transform = "translateY(0%)";
            time = setTimeout(() => {
                if (video.paused) {
                } else {
                    control.style.transform = "translateY(70px)";
                }
            }, 2000);
        }
    }

    //进度条的btn
    document.addEventListener("mousedown", callfn)
    document.addEventListener("mousemove", callfn)
    document.addEventListener("mouseup", callfn)
    function callfn(ev) {
        ev = ev || window.event;
        ev.preventDefault();
        switch (ev.type) {
            case "mousedown":
                //进度条
                if (ev.target.className == "round") {
                    tog = true;
                    downX = ev.clientX;
                    endX = progressBtn.offsetWidth;
                } else if (ev.target.className == "vioce-btn") {
                    //声音大小
                    tog1 = true;
                    downX = ev.clientX;
                    endCX = vioceBtn.parentNode.offsetWidth;
                } else if (ev.target.className == "progress-btn"
                    || ev.target.className == "progress"
                ) {
                    //随机点击位置进度条
                    var num = ev.clientX - 5 - warp.offsetLeft - (progress.offsetLeft - (progress.offsetWidth / 2))
                    progressBtn.style.width = num + "px";
                    videoFn(num, progress)
                } else if (ev.target.tagName == "SPAN" &&
                    ev.target.parentNode.className != "time"
                ) {
                    //随机点击music
                    vioceBtn.parentNode.style.width = ev.offsetX + 5 + "px";
                    musiSize(ev.offsetX);
                } else if (ev.target.tagName == "IMG" &&
                    ev.target.className == "s"
                ) {
                    if (vioceBtn.parentNode.offsetWidth > 10) {
                        static(ev.target);
                    } else {
                        vioceBtn.parentNode.style.width = currentLength + "px";
                        if (currentLength > 10) {
                            musiSize(currentLength);
                        } else {
                            vioceBtn.parentNode.style.width = 70 + "px";
                            musiSize(70);
                        }
                    }
                }
                break;
            case "mousemove":
                if (tog) {
                    moveX = ev.clientX;
                    chaX = moveX - downX + endX;
                    chaX = Math.min(progress.offsetWidth - 10, chaX)
                    progressBtn.style.width = chaX + "px";
                } else if (tog1) {
                    moveX = ev.clientX;
                    chaX1 = moveX - downX + endCX;
                    chaX1 = Math.max(10, chaX1);
                    chaX1 = Math.min(vioceBtn.parentNode.parentNode.offsetWidth, chaX1);
                    vioceBtn.parentNode.style.width = chaX1 + "px";
                    musiSize((chaX1 - 10));
                }
                break;
            case "mouseup":
                if (tog) {
                    endX = progressBtn.offsetWidth;
                    endCX = vioceBtn.parentNode.offsetWidth;
                    videoFn(progressBtn.offsetWidth, progress)
                }
                tog = false;
                tog1 = false;
                break;
        }
    }

    //移动端的事件
    document.addEventListener("touchstart", callfn1)
    document.addEventListener("touchmove", callfn1)
    document.addEventListener("touchend", callfn1)
    function callfn1(ev) {
        ev = ev || window.event;
        switch (ev.type) {
            case "touchstart":
                //进度条
                if (ev.targetTouches[0].target.className == "round") {
                    tog = true;
                    downX = ev.targetTouches[0].clientX;
                    endX = progressBtn.offsetWidth;
                } else if (ev.targetTouches[0].target.className == "vioce-btn") {
                    //声音大小
                    tog1 = true;
                    downX = ev.targetTouches[0].clientX;
                    endCX = vioceBtn.parentNode.offsetWidth;
                }
                break;
            case "touchmove":
                if (tog) {
                    moveX = ev.targetTouches[0].clientX;
                    chaX = moveX - downX + endX;
                    chaX = Math.min(progress.offsetWidth - 10, chaX)
                    progressBtn.style.width = chaX + "px";
                } else if (tog1) {
                    moveX = ev.targetTouches[0].clientX;
                    chaX1 = moveX - downX + endCX;
                    chaX1 = Math.max(10, chaX1);
                    chaX1 = Math.min(vioceBtn.parentNode.parentNode.offsetWidth, chaX1);
                    vioceBtn.parentNode.style.width = chaX1 + "px";
                    musiSize((chaX1 - 10));
                }
                break;
            case "touchend":
                if (tog) {
                    endX = progressBtn.offsetWidth;
                    endCX = vioceBtn.parentNode.offsetWidth;
                    videoFn(progressBtn.offsetWidth, progress)
                }
                tog = false;
                tog1 = false;
                break;
        }
    }

    //上传视频
    fileUpload.onmousedown = function () {
        if (!video.paused) {
            video.pause();//不能再暂停的时候在暂停
        }
    }
    fileUpload.onchange = function () {
        progressBtn.style.width = 0 + "px";
        var file = input.files[0];
        var readerFile = new FileReader();
        if (file) {
            readerFile.readAsDataURL(file);
        }
        readerFile.onload = function (ev) {
            res = readerFile.result;
            video.src = res;
        }
    }

    //首自加载显示的总时长
    video.oncanplay = function () {
        time[2].innerText = handleTime(video.duration);
        timeRight.innerText = handleTime(video.duration);
    }
    //处理变化的视频fn
    function videoFn(x, ele) {
        var num = x / (ele.offsetWidth - 10);
        var currentTime = video.duration * num;
        video.currentTime = currentTime;

    }

    //时间处理函数
    function handleTime(time) {
        time = parseInt(time);
        var h = handleNum(Math.floor(time / 3600));
        var m = handleNum(Math.floor((time % 3600) / 60));
        var s = handleNum(Math.floor(time % 60));
        return m + ":" + s;
    }
    function handleNum(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return '' + num;
        }
    }

    //监听video播放状态
    video.ontimeupdate = function () {
        handleL();
    }
    //播放完重新準備播放
    video.addEventListener("ended", function () {
        video.currentTime = 0;
    })

    //播放器的状态点击
    video.onclick = function () {
        begin()
    }
    function begin() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        };
    }
    //播放器的状态监听
    video.onpause = function () {
        control.style.transform = "translateY(0%)";
        playBtn.children[0].src = "./images/bofang.png";
    }
    video.onplay = function () {
        playBtn.children[0].src = "./images/zanting.png";
    }

    //视频播放进度条变化
    function handleL() {
        time[0].innerText = handleTime(video.currentTime);
        timeLeft.innerText = handleTime(video.currentTime);
        var n = video.currentTime / video.duration;
        var num = n * (progress.offsetWidth - 10);
        num = Math.min(870, num)
        progressBtn.style.width = num + "px";
    }
    function musiSize(x) {
        video.volume = x / vioceBtn.parentNode.parentNode.offsetWidth;
        vioce.src = "./images/weibiaoti1.png";
        if (video.volume <= 0) {
            static(vioce);
        }
    }
    function static(ele) {
        currentLength = vioceBtn.parentNode.offsetWidth;
        vioceBtn.parentNode.style.width = 10 + "px";
        ele.src = "./images/jingyin.png";
        video.volume = 0
    }
    //视频加速减速
    play.addEventListener("mousedown", playFn)
    function playFn(ev) {
        ev = ev || window.event;
        ev.cancelBubble = true;
        if (ev.target.parentNode.className === "backward") {
            video.currentTime -= 2
        } else if (ev.target.parentNode.className === "forward") {
            video.currentTime += 2
        } else if (ev.target.parentNode.className === "play-btn") {
            begin()
        }
    }
    //满屏
    full.onclick = function (ev) {
        ev.preventDefault();
        defaultShop(video)
    }
    // 全屏兼容处理函数
    function defaultShop(ele) {
        //W3C
        if (ele.requestFullscreen) {
            ele.requestFullscreen();
        }
        //FireFox
        else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
        }
        //Chrome等
        else if (ele.webkitRequestFullScreen) {
            ele.webkitRequestFullScreen();
        }
        //IE11
        else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
        }
    } 
}