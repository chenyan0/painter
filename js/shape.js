function shape(canvas,canvas1,cobj,xpobj,selectobj){
    this.canvas=canvas;//新创建的对象身上具有的属性
    this.canvas1=canvas1;
    this.cobj=cobj;    //this.cobj是二级对象   只要绘制图形，就要使用二级对象
    this.xpobj=xpobj;
    this.selectobj=selectobj;
    this.bgcolor="#000";
    this.bordercolor="#000";
    this.linewidth=1;
    this.type="stroke";  //线条或填充
    this.shapes="line";
    this.width=canvas1.width;
    this.height=canvas1.height;
    this.history=[];


}

shape.prototype={
    init:function(){
        this.xpobj.css("display","none");
        this.selectobj.css("display","none");
        if(this.temp){
            this.history.push(this.cobj.getImageData(0, 0, this.width, this.height));
            this.temp = null;
        }
        this.cobj.fillStyle=this.bgcolor;
        this.cobj.strokeStyle=this.bordercolor;
        this.cobj.lineWidth=this.linewidth;
    },
    line:function (x,y,x1,y1) {

        var that=this;
        that.cobj.beginPath();
        that.cobj.moveTo(x,y);
        that.cobj.lineTo(x1,y1);
        that.cobj.stroke();
        that.cobj.closePath();
    },
    circle:function (x,y,x1,y1) {
        var that=this;
        that.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        that.cobj.arc(x,y,r,0,Math.PI*2);
        that.cobj.closePath();
        that.cobj[that.type]();
    },
    rect:function (x,y,x1,y1) {
        var that=this;
        that.cobj.beginPath();
        that.cobj.rect(x,y,x1-x,y1-y);
        that.cobj.closePath();
        that.cobj[that.type]();

    },
    start:function (x,y,x1,y1) {
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=r/2;
        this.cobj.beginPath();
        this.cobj.moveTo(x+r,y);
        for(var i=1;i<10;i++){
            if(i%2==0){
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r,y+Math.sin(i*36*Math.PI/180)*r);
            }else{
                this.cobj.lineTo(x+Math.cos(i*36*Math.PI/180)*r1,y+Math.sin(i*36*Math.PI/180)*r1);
            }
        }
        this.cobj.closePath();
        this.cobj[this.type]();
    },
    draw:function () {
        var that=this;
        that.init();
        //copy在canvas的上方。所以要获取copy，给copy添加点击事件
        that.canvas.onmousedown= function (e) {

            var startX= e.offsetX;
            var startY= e.offsetY;
            that.canvas.onmousemove= function (e) {
                that.cobj.clearRect(0,0,that.canvas1.width,that.canvas1.height);
                if(that.history.length>0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0)
                }
                var endX= e.offsetX;
                var endY= e.offsetY;
                that[that.shapes](startX,startY,endX,endY);

            };
            that.canvas.onmouseup= function (e) {
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.canvas.onmouseup=null;
                that.canvas.onmousemove=null;
            };



        }
    },
    pen:function () {
        var that=this;
        that.init();
        //copy在canvas的上方。所以要获取copy，给copy添加点击事件
        that.canvas.onmousedown= function (e) {

            var startX= e.offsetX;
            var startY= e.offsetY;
            that.init();
            that.cobj.beginPath();
            that.cobj.moveTo(startX,startY);

            that.canvas.onmousemove= function (e) {
                var endX= e.offsetX;
                var endY= e.offsetY;
                that.cobj.lineTo(endX, endY);
                that.cobj.stroke();
            };
            that.canvas.onmouseup= function (e) {
                that.cobj.closePath();
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.canvas.onmouseup=null;
                that.canvas.onmousemove=null;
            };



        }
    },
    xp:function(xpobj,w,h){
        var that=this;
        that.init();
        that.canvas.onmousedown= function () {
            that.canvas.onmousemove= function (e) {
                var ox= e.offsetX;
                var oy= e.offsetY;
                var lefts=ox-w/2;
                var tops=oy-h/2;

                if(lefts<0){
                    lefts=0;
                }
                if(lefts>that.width-w){
                    lefts=that.width-w;
                }
                if(tops<0){
                    tops=0;
                }
                if(tops>that.height-h){
                    tops=that.height-h;
                }
                xpobj.css({display:"block",width:w,height:h,left:lefts,top:tops});
                that.cobj.clearRect(lefts,tops,w,h);


            }
            that.canvas.onmouseup=function(){
                xpobj.css({display:"none"});
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            }
        }

    },
    select:function(selectareaobj){
        var that=this;
        that.init();
        that.canvas.onmousedown= function (e) {
            var startx= e.offsetX;
            var starty= e.offsetY;
            var minx,miny,w,h;
            that.canvas.onmousemove= function (e) {
                var endx= e.offsetX;
                var endy= e.offsetY;
                minx=startx>endx?endx:startx;
                miny=starty>endy?endx:starty;
                w=Math.abs(startx-endx);
                h=Math.abs(starty-endy);

                selectareaobj.css({display:"block",width:w,height:h,left:minx,top:miny});


            }
            that.canvas.onmouseup=function(){
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
                that.temp=that.cobj.getImageData(minx, miny,w , h);      //截取下选中的区域
                that.cobj.clearRect(minx,miny,w,h);          //清空选中的区域
                that.history.push(that.cobj.getImageData(0,0,that.width,that.height));     //把画布可见部分存储下来
                that.cobj.putImageData(that.temp,minx,miny);     //把临时存储的选中区域重新放回画布上
                that.drag(minx,miny,w,h,selectareaobj);            //给selectareaobj添加拖拽事件
            }
        }
    },
    drag:function(x,y,w,h,selectareaobj){
        var that=this;
        that.canvas.onmousemove=function(e){
            var ox= e.offsetX;
            var oy= e.offsetY;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.canvas.style.cursor="move";
            }else{
                that.canvas.style.cursor="default";
            }
        }
        that.canvas.onmousedown= function (e) {
            var ox= e.offsetX;
            var oy= e.offsetY;
            var cx=ox-x;       //点击的地方据选中区域边界的距离
            var cy=oy-y;
            if(ox>x&&ox<x+w&&oy>y&&oy<y+h){
                that.canvas.style.cursor="move";
            }else{
                that.canvas.style.cursor="default";
                return;
            }
            that.canvas.onmousemove= function (e) {
                that.cobj.clearRect(0,0,that.width,that.height);        //拖动过程中始终清除画布，添加历史记录中存储的最后一个状态
                if(that.history.length!==0){
                    that.cobj.putImageData(that.history[that.history.length-1],0,0);
                }
                var endx= e.offsetX;
                var endy= e.offsetY;
                var lefts=endx-cx;
                var tops=endy-cy;
                    if(lefts<0){
                        lefts=0;
                    }
                    if(lefts>that.width-w){
                        lefts=that.width-w;
                    }
                    if(tops<0){
                        tops=0;
                    }
                    if(tops>that.height-h){
                        tops=that.height-h;
                    }
                    selectareaobj.css({left:lefts,top:tops});
                    x=lefts;
                    y=tops;
                    that.cobj.putImageData(that.temp,lefts,tops);      //鼠标移动到哪  选择的区域移动到哪



            }
            that.canvas.onmouseup=function(){
                that.drag(x,y,w,h,selectareaobj);
                that.canvas.onmousemove=null;
                that.canvas.onmouseup=null;
            }

        }
    }

};


