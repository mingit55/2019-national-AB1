class Clip {
    static activeColor = "rgb(255, 173, 96)";
    static min_time_width = 10;

    constructor(type, track){
        this.type = type;
        this.track = track;

        // 클립 시간
        this.startTime = 0;
        this.duration = this.track.videoDuration;

        this.active = false;
        this.clipClick = false;
        this.timeClick = null;

        // Viewport size
        this.v_width = this.track.app.viewport.width;
        this.v_height = this.track.app.viewport.height;

        // Timeline width
        this.tx = 0;
        this.t_width = 0;

        // click X, Y
        this.cx = 0;
        this.cy = 0;

        // 클립 UI
        this.clipStart = document.querySelector("#v-ui .clip-info .start");
        this.clipDuration = document.querySelector("#v-ui .clip-info .duration");

        // 클립 옵션
        this.clipColor = document.querySelector("#s-color");
        this.clipWidth = document.querySelector("#s-width");
        this.clipFsize = document.querySelector("#s-fsize");


        this.root = null;
        this.ctx = null;
        this.history = [];
        this.x = 0;
        this.y = 0;
        
        this.t_root =  `<div class="item">
                            <div class="view-line">
                                <div class="left" data-id="left"></div>
                                <div class="center" data-id="center"></div>
                                <div class="right" data-id="right"></div>
                            </div>
                        </div>`.parseDom();

        this.v_line = this.t_root.querySelector(".view-line");

        if(type === App.PATH) {
            this.root = document.createElement("canvas");
            this.root.width = this.v_width;
            this.root.height = this.v_height;

            this.ctx = this.root.getContext('2d');
            this.ctx.strokeStyle = this.clipColor.value;
            this.ctx.lineWidth = this.clipWidth.value;
        }  
        else if(type === App.RECT) {
            this.root = document.createElement("div");

            let style = this.root.style;
            style.borderColor = this.clipColor.value;
        }
        else if(type === App.TEXT) {
            this.root = document.createElement("input");
            this.root.type = "text";

            let style = this.root.style;
            style.color = this.clipColor.value;
            style.fontSize = this.clipFsize.value;

            this.root.addEventListener("keydown", e => {
                let scrollWidth = e.target.scrollWidth;
                e.target.style.width = scrollWidth > this.v_width - this.x ? this.v_width - this.x + "px" : scrollWidth + "px";
            });
        }

        this.root.classList.add("clip");

        this.addEvent();
    }

    setText(){
        let text = this.root.value;
        let parent = this.root.parentElement;
        
        let span = document.createElement("span");
        span.classList.add("clip");
        span.innerText = text;
        
        span.style = this.root.style.cssText;

        span.addEventListener("mousedown", e => {
            this.clipClick = true; 
            this.cx = e.offsetX;
            this.cy = e.offsetY;
        });

        parent.insertBefore(span, this.root);
        this.root.remove();

        this.root = span;
    }

    addEvent(){
        // ROOT
        this.root.addEventListener("keydown", e => e.stopPropagation());

        this.root.addEventListener("mousedown", e => {
            this.clipClick = true; 
            this.cx = e.offsetX;
            this.cy = e.offsetY;
        });

        window.addEventListener("mousemove", e => {
            if(e.which !== 1 || !this.clipClick || !this.active) return false;
            
            let os = offset(this.track.app.viewport.root);
            let ox = e.pageX - os.left;
            let oy = e.pageY - os.top;

            ox = ox < 0 ? 0 : ox > this.v_width ? this.v_width : ox;
            oy = oy < 0 ? 0 : oy > this.v_height ? this.v_height : oy;

            this.root.style.left = ox - this.cx + "px";
            this.root.style.top = oy - this.cy + "px";
            
            this.x = ox - this.cx;
            this.y = oy - this.cy;
        });
        
        window.addEventListener("mouseup", e => {
            this.clipClick = false;
            this.cx = 0;
            this.cy = 0;
        });


        // TRACK ROOT

        this.t_root.addEventListener("click", () => {
            this.track.clipList.forEach(x => x.diselect());
            this.select();
        });

        this.t_root.querySelectorAll(".view-line > div").forEach(x => {
            x.addEventListener("mousedown", e => {
                if(!this.active || e.which !== 1) return false;

                this.cx = e.offsetX;
                this.tx = this.v_line.offsetLeft;
                this.t_width = this.v_line.offsetWidth;

                this.timeClick = e.target.dataset.id;
            });
        });

        window.addEventListener("mousemove", e => {
            if(!this.timeClick) return false;


            // 크기 변경

            const style = this.v_line.style;        
            const min_w = Clip.min_time_width * 3;
        
            let w = this.t_width;
            let ox = e.pageX - offset(this.t_root).left;  

            if(this.timeClick === "left") {
                const max_x = this.tx + this.t_width - min_w;
                ox = ox < 0 ? 0 : ox > max_x ? max_x : ox;

                w = this.tx - ox + this.t_width;
                w = w < min_w ? min_w : w > this.v_width ? this.v_width : w;
    
                style.left = ox + "px";
                style.width = w + "px";
            }
            else if(this.timeClick === "center") {
                const max_x = this.v_width - this.t_width;
                ox -= this.cx;
                ox = ox < 0 ? 0 : ox > max_x ? max_x : ox;

                style.left = ox + "px";
            }
            else if(this.timeClick === "right") {
                w = ox - this.tx;
                w = w < min_w ? min_w : w > this.v_width ? this.v_width : w;

                style.width = w + "px";
            }

            // 시간 변경
            
        });

        window.addEventListener("mouseup", e => {
            if(!this.timeClick)  return false;
            
            this.timeClick = null;
            this.cx = 0;
            this.tx = 0;
            this.t_width = 0;

        });
    }


    select(){
        this.active = true;
        this.root.classList.add("active");
        this.t_root.classList.add("active");

        this.clipStart.innerText = this.startTime.parseTime();
        this.clipDuration.innerText = this.duration.parseTime();

        if(this.type === App.PATH){
            const lineColor = this.ctx.strokeStyle;
            const lineWidth = this.ctx.lineWidth;

            this.ctx.clearRect(0, 0, this.v_width, this.v_height);

            this.ctx.strokeStyle = Clip.activeColor;
            this.ctx.lineWidth = lineWidth + 8;

            this.history.forEach((data, idx) => {
                const {x, y} = data;
                if(idx === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            });
            this.ctx.stroke();

            this.ctx.strokeStyle = lineColor;
            this.ctx.lineWidth = lineWidth;
            
            this.history.forEach((data, idx) => {
                const {x, y} = data;
                if(idx === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            });
            this.ctx.stroke();
        }
    }

    diselect(){
        this.active = false;
        this.root.classList.remove("active");
        this.t_root.classList.remove("active");

        if(this.type === App.PATH){
            this.ctx.clearRect(0, 0, this.v_width, this.v_height);
            
            this.history.forEach((data, idx) => {
                const {x, y} = data;
                if(idx === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            });
            this.ctx.stroke();
        }
    }
}