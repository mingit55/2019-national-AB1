class Viewport {
    constructor(viewport, app){
        this.app = app;
        this.playTrack = null;
        this.clipBuffer = null;

        this.root = viewport;
        this.width = viewport.offsetWidth;
        this.height = viewport.offsetHeight;

        this.emptyMsg = this.root.querySelector(".empty-msg");
        this.video = this.root.querySelector("video");

        // 비디오 UI
        this.videoTime = document.querySelector("#v-ui .video-info .current");
        this.videoDuration = document.querySelector("#v-ui .video-info .duration");

        this.addEvent();

        requestAnimationFrame(() => {
            this.frame();
        });
    }

    addEvent(){
        this.root.addEventListener("mousedown", e => {
            if(e.which !== 1) return false;
            if(this.video.src === "") return false;
            if(this.app.status === null) return false;

            if(this.clipBuffer !== null && this.clipBuffer.type === App.TEXT){
                if(this.clipBuffer.root.value.trim() === ""){
                    this.playTrack.removeClip(this.clipBuffer);
                }
                else {
                    this.clipBuffer.setText();
                }
                this.clipBuffer = null;
                return;
            }

            this.pauseVideo();

            // 선택
            if(this.app.status === App.SELECT){
                this.clipBuffer = null;
                this.playTrack.clipList.forEach(x => x.diselect());

                for(const clip of this.playTrack.clipList.reverse()){
                    if(this.clipBuffer !== null) break;
                    if(clip.type !== App.PATH){
                        if(e.target === clip.root) {
                            this.clipBuffer = clip;
                            clip.select();
                            break;
                        }
                    }
                    else { // 선을 선택했을 때
                        let data = clip.ctx.getImageData(e.offsetX + clip.x, e.offsetY + clip.y, 1, 1).data;
                        if(data[3] !== 0) {
                            this.clipBuffer = clip;
                            clip.select();
                            break;
                        }
                    }
                }

            }
            
            // 자유곡선, 사각형, 텍스트
            else {
                const clip = this.clipBuffer = new Clip(this.app.status, this.playTrack);
                clip.root.style.zIndex = this.playTrack.clipList.length + 1;
                this.playTrack.pushClip(clip);
                this.root.append(clip.root);

                let style = clip.root.style;
                if(clip.type === App.PATH){
                    clip.ctx.beginPath();
                    clip.ctx.moveTo(e.offsetX, e.offsetY);
                }
                else if(clip.type === App.RECT){
                    style.left = e.offsetX + "px";
                    style.top = e.offsetY + "px";
                    
                    clip.x = e.offsetX;
                    clip.y = e.offsetY;
                }
                else if(clip.type === App.TEXT){
                    style.left = e.offsetX + "px";
                    style.top = e.offsetY + "px";

                    clip.x = e.offsetX;
                    clip.y = e.offsetY;
                }
            }
        });

        this.root.addEventListener("mousemove", e => {
            if(e.which !== 1) return false;
            if(this.clipBuffer === null) return false;
            if(this.app.status !== App.PATH && this.app.status !== App.RECT && this.app.status !== App.TEXT) return false;

            const clip = this.clipBuffer;

            let x = e.offsetX;
            let y = e.offsetY;
            

            if(clip.type === App.PATH){
                clip.ctx.lineTo(x, y);
                clip.history.push({x: x, y: y});
                this.clipBuffer.ctx.stroke();
            }
            else if(clip.type === App.RECT){
                let style = clip.root.style;

                if(clip.x < x && clip.y < y) {
                    style.left = clip.x + "px"
                    style.top = clip.y + "px";
                    style.width = x - clip.x + "px";
                    style.height = y - clip.y + "px";
                }
                else if(clip.x > x && clip.y > y){
                    style.left = x + "px";
                    style.top = y + "px";
                    style.width = clip.x - x + "px";
                    style.height = clip.y - y + "px";
                }
                else if(clip.x < x && clip.y > y){
                    style.left = clip.x + "px";
                    style.top = y + "px";
                    style.width = x - clip.x + "px";
                    style.height = clip.y - y + "px";
                }
                else if(clip.x > x && clip.y < y){
                    style.left = x + "px";
                    style.top = clip.y + "px";
                    style.width = clip.x - x + "px";
                    style.height = y - clip.y + "px";
                }
            }
        });

        this.root.addEventListener("mouseup", e => {
            if(e.which !== 1) return false;
            if(this.clipBuffer === null) return false;
            if(this.app.status !== App.PATH && this.app.status !== App.RECT && this.app.status !== App.TEXT) return false;

            if(this.clipBuffer.type === App.RECT){
                let style = this.clipBuffer.root.style;
                style.backgroundColor = style.borderColor;
                style.borderColor = "transparent";
            }
            else if(this.clipBuffer.type === App.TEXT) {
                this.clipBuffer.root.focus();
            }
            else {
                this.clipBuffer = null;
            }
        });
    }


    frame(){
        const {currentTime, duration} = this.video;

        requestAnimationFrame(() => {
            this.frame();
        });

        if(this.playTrack !== null){
            if(!this.playTrack.cursorMove) {
                let x = currentTime * this.playTrack.width / duration;
                this.playTrack.seekCursor(x);
            }

            this.videoTime.innerText = currentTime.parseTime();
        }
    }

    seekVideo(x){
        this.video.currentTime = this.video.duration * x / this.playTrack.width;
    }


    playVideo(){
        this.video.play();
    }

    pauseVideo(){
        this.video.pause();
    }

    setVideo(track){ 
        this.playTrack = track;
        this.emptyMsg.remove();
        this.video.src = `movies/movie${track.id}.mp4`;

        this.video.oncanplay = () => {
            this.videoDuration.innerText = this.video.duration.parseTime();
        }
    }
}