$(function(){

   /* copy.click(function () {
        alert(1);
    });
    canvas.click(function () {
        alert(2);
    });               用jquery写会记录下每一个事件

*/
   /* copy[0].onclick=function(){
        alert(1);
    }
    copy[0].onclick=function(){
        alert(2);
    }       原生方法写事件。同一种事件会被后面的覆盖掉
    */

    //copy在canvas的上方。所以要获取copy，给copy添加点击事件
    var canvas=$("canvas");      //画布
    var copy=$(".copy");
    var cobj=canvas[0].getContext("2d");      //创建对象
    var xpobj=$(".eraser");
    var selectobj=$(".selectarea");
    canvas.attr({
        width:copy.width(),
        height:copy.height()
    });
    //菜单hover效果
    $(".parent").hover(function () {
        $(this).find(".son").finish();
        $(this).find(".son").slideDown(200);
    }, function () {
        $(this).find(".son").slideUp(200);
    });
    $(".son li").hover(function () {
        $(this).css({background:"#FFFABF",color:"#5bc0de"});
    },function(){
        $(this).css({background:"#5bc0de",color:"#fff"});
    })
    var obj=new shape(copy[0],canvas[0],cobj,xpobj,selectobj);

    //画图类型
    $(".shapes").find(".son li").click(function(){
        if($(this).attr("data-role")!="pen"){
            obj.shapes=$(this).attr("data-role");
            obj.draw();
        }else{
            obj.shapes=$(this).attr("data-role");
            obj.pen();
        }
    });
    //填充类型
    $(".type").find(".son li").click(function () {
        obj.type=$(this).attr("data-role");
        obj.draw();
    });
    //边框颜色
    $(".bordercolor input").change(function () {
        obj.bordercolor=$(this).val();
        obj.draw();
    });
    //填充颜色
    $(".fillcolor input").change(function () {
        obj.bgcolor=$(this).val();
        obj.draw();
    });
    //边框粗细
    $(".borderwidth").find(".son li").click(function () {
        obj.linewidth=$(this).attr("borderWidth");
        obj.draw();
    })
    //橡皮
    $(".xpsize li").click(function () {
        var w=$(this).attr("data-role");
        var h=$(this).attr("data-role");
        obj.xp($(".eraser"),w,h);
    });
    //选择
    $(".select").click(function(){
        console.log(1);
        obj.select($(".selectarea"));
    });
    $(".file li").click(function () {

        var index=$(this).index(".file li");
        if(index==0){
            if(obj.history.length>0){
                var yes=window.confirm("是否要保存");
                if(yes){
                    location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"));
                }
            }
            obj.history=[];
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
        }else if(index==1){
            cobj.clearRect(0,0,canvas[0].width,canvas[0].height);
            obj.history.pop();
            if(obj.history.length==0){
                alert("不能后退");
                return;
            }
            cobj.putImageData(obj.history[obj.history.length-1],0,0);
        }else {
            location.href=(canvas[0].toDataURL().replace("data:image/png","data:stream/octet"));
        }
    })

})