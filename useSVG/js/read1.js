//全局变量
var svgLeft=0
var svgTop=0

window.onload=function () {
  let svg=null
  mouseWheel()
  analysisXML(svg)

}

/*
* 解析导出的xml文件
* */
function analysisXML(svg) {
  // let xmlFileName="../lyxtxtjgtOne.xml";
  let xmlFileName="../0.xml";
  let xmlDoc
  //IE
  if((/Trident\/7\./).test(navigator.userAgent)){
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }else{
    xmlDoc=document.implementation.createDocument("","",null);
  }
  xmlDoc.async=false
  xmlDoc.load(xmlFileName)
  // 获取文档中标签元素对象
  //xmlDoc.documentElement是根元素即Components
  //childNodes是Component这一个
  // let x=xmlDoc.documentElement.childNodes
  let Configration=xmlDoc.documentElement
  // console.log(Configration)
  let ConfigWidth=Configration.getAttribute("Width")
  // let ConfigWidth=2000
  // console.log(ConfigWidth)
  let ConfigHeight=Configration.getAttribute("Height")
  // let ConfigHeight=1200
  // let ConfigHeight=Configration.getAttribute("Height")
  let num1=0,num2=0,num3=0,num4=0,temp1=0,temp2=0,temp3=0,temp4=0


  //创建svg画布
  // let svg=new Raphael(document.querySelector("#readSVG"),ConfigWidth, ConfigHeight);
  svg=new Raphael(document.querySelector("#readSVG"),ConfigWidth, ConfigHeight);
  dragSVG(svg)
  let LIST=xmlDoc.documentElement.childNodes[0]
  let Components=xmlDoc.documentElement.childNodes[1]

  // console.log(Configration.nodeName)
  let ComponentsChildren=Components.childNodes
  //一共两个List Components
  // console.log(ComponentsChildren.length)
  // console.log(Components.nodeName)
  //改变图片
  var changImg=false
  //优化循环
  // for (let i=0;i<ComponentsChildren.length;i++)
  for (let i=0,m=ComponentsChildren.length;i<m;i++)
  //while循环不分先后
    // let i=ComponentsChildren.length
  // while(i--)
  {
    // console.log()
    let nodename=ComponentsChildren[i].nodeName
    // console.log(nodename)
    let group=ComponentsChildren[i].getAttribute("group")
    let image=null
    let width=ComponentsChildren[i].getAttribute("width")
    let height=ComponentsChildren[i].getAttribute("height")
    let scaleX=ComponentsChildren[i].getAttribute("scaleX")
    let scaleY=ComponentsChildren[i].getAttribute("scaleY")
    let param=ComponentsChildren[i].getAttribute("param")
    //风扇
    let mark=ComponentsChildren[i].getAttribute("mark")

     let fontSize
     if(ComponentsChildren[i].getAttribute("fontSize")){
       fontSize=ComponentsChildren[i].getAttribute("fontSize")
     }
     let textAlign
     if(ComponentsChildren[i].getAttribute("textAlign")){
       textAlign=ComponentsChildren[i].getAttribute("textAlign")
     }

     let compname=ComponentsChildren[i].getAttribute("compname")
     let deviceID=ComponentsChildren[i].getAttribute("deviceID")
     let deviceName=ComponentsChildren[i].getAttribute("deviceName")
     let isMouseOverTip=ComponentsChildren[i].getAttribute("isMouseOverTip")
     let imageSource=ComponentsChildren[i].getAttribute("source")
     let x=ComponentsChildren[i].getAttribute("x")
     let y=ComponentsChildren[i].getAttribute("y")
     let paramID=ComponentsChildren[i].getAttribute("paramID")
    //20001 63
    let deviceParam=deviceID+paramID
    //数组保存参数
    var handAuto=new Array()
    var hzStatus=new Array()
    var inStress=new Array()
    //组件宽高缩放
    if(scaleX){
      width=parseInt(width)*parseFloat(scaleX)
    }
    if(scaleY){
      height=parseInt(height)*parseFloat(scaleY)
    }

    let rotate=0
    if(ComponentsChildren[i].getAttribute("rotation")){
      rotate=parseInt(ComponentsChildren[i].getAttribute("rotation"))
    }

    let lb3;
    //如果是要绘制文字的话===========================================
    if(ComponentsChildren[i].getAttribute("text")){
      let color=ComponentsChildren[i].getAttribute("color")

      //优先绘制黑色背景框
      if(color==="#00FF00"){
        svg.rect(x, y, width-5, height).attr({
          // "stroke": "red",
          "fill": "black"
        })
      }

      let fontFamily=ComponentsChildren[i].getAttribute("fontFamily")
      let fontWeight=ComponentsChildren[i].getAttribute("fontWeight")
      let textX=parseInt(x)+parseInt(width)/2
      let textY=parseInt(y)+parseInt(height)/2
      let text=ComponentsChildren[i].getAttribute("text")

      // drawText(svg,textX,textY,text,fontSize,textAlign,color,fontFamily,fontWeight)
      //绘制文字
      let drawText=svg.text(textX,textY,text)
        .attr({
          "font-size":fontSize+"px",
          "text-align":textAlign,
          cursor:'pointer',
          'fill':color,
          'text-anchor':'middle',
          'font-family':fontFamily,
          'font-weight':fontWeight
        })

      //冷水机的温度
      if(mark==="LSJ"){
        setInterval(function () {
          //创建随机数
          //15-40
          let lt0=parseInt(Math.random()*25+15)
          let lt2=parseInt(Math.random()*25+15)
          let lt3=parseInt(Math.random()*25+15)
          switch(paramID){
            case "160":drawText.attr({text: lt0});break;
            case "162":drawText.attr({text: lt2});break;
            case "163":drawText.attr({text: lt3});break;
          }

        }, 3000);
/*
        function createNum() {
          //创建随机数
          let lt0=parseInt(Math.random()*25+15)
          let lt2=parseInt(Math.random()*25+15)
          let lt3=parseInt(Math.random()*25+15)
          switch(paramID){
            case "160":drawText.attr({text: lt0});break;
            case "162":drawText.attr({text: lt2});break;
            case "163":drawText.attr({text: lt3});break;
          }
          requestAnimationFrame(createNum)
        }
        createNum()
*/

      }
      //=============================
      //冷却泵的Hz和Bars
      if(mark==="LQB" || mark==="LDB"){
        var flag=1
        var lb3img=null
        setInterval(function () {
          //创建随机数
          //左闭右开
          //Hz 50-70
          let lb1=parseInt(Math.random()*20+50)
          let lb2=parseInt(Math.random()*20+50)
          let lb3=parseInt(Math.random()*20+50)
          // lb3=parseInt(Math.random()*20+50)
          let lb4=parseInt(Math.random()*20+50)
          let lb5=parseInt(Math.random()*20+50)
          //bars
          let bar1=(Math.random()*2+1).toFixed(1)
          let bar2=(Math.random()*2+1).toFixed(1)
          let bar3=(Math.random()*2+1).toFixed(1)
          let bar4=(Math.random()*2+1).toFixed(1)
          let bar5=(Math.random()*2+1).toFixed(1)

          switch(deviceParam){
            //Hz
            case "2000163":drawText.attr({text: lb1});hzStatus[20001]=lb1;break;
            case "2000263":drawText.attr({text: lb2});hzStatus[20002]=lb2;break;
            case "2000363":showLb3(lb3);drawText.attr({text: lb3});hzStatus[20003]=lb3;break;
            case "2000463":drawText.attr({text: lb4});hzStatus[20004]=lb4;break;
            case "2000563":drawText.attr({text: lb5});hzStatus[20005]=lb5;break;
            case "3000163":drawText.attr({text: lb1});hzStatus[30001]=lb1;break;
            case "3000263":drawText.attr({text: lb2});hzStatus[30002]=lb2;break;
            case "3000363":drawText.attr({text: lb3});hzStatus[30003]=lb3;break;
            case "3000463":drawText.attr({text: lb4});hzStatus[30004]=lb4;break;
            case "3000563":drawText.attr({text: lb5});hzStatus[30005]=lb5;break;
            //bars
            case "2000162":drawText.attr({text: bar1});inStress[20001]=bar1;break;
            case "2000262":drawText.attr({text: bar2});inStress[20002]=bar2;break;
            case "2000362":drawText.attr({text: bar3});inStress[20003]=bar3;break;
            case "2000462":drawText.attr({text: bar4});inStress[20004]=bar4;break;
            case "2000562":drawText.attr({text: bar5});inStress[20005]=bar5;break;
            case "3000162":drawText.attr({text: bar1});inStress[30001]=bar1;break;
            case "3000262":drawText.attr({text: bar2});inStress[30002]=bar2;break;
            case "3000362":drawText.attr({text: bar3});inStress[30003]=bar3;break;
            case "3000462":drawText.attr({text: bar4});inStress[30004]=bar4;break;
            case "3000562":drawText.attr({text: bar5});inStress[30005]=bar5;break;
          }
        }, 3000);

/*
        //左侧图片
        function createLeft() {
          //创建随机数
          //左闭右开
          //Hz 50-70
          let lb1=parseInt(Math.random()*20+50)
          let lb2=parseInt(Math.random()*20+50)
          let lb3=parseInt(Math.random()*20+50)
          // lb3=parseInt(Math.random()*20+50)
          let lb4=parseInt(Math.random()*20+50)
          let lb5=parseInt(Math.random()*20+50)
          //bars
          let bar1=(Math.random()*2+1).toFixed(1)
          let bar2=(Math.random()*2+1).toFixed(1)
          let bar3=(Math.random()*2+1).toFixed(1)
          let bar4=(Math.random()*2+1).toFixed(1)
          let bar5=(Math.random()*2+1).toFixed(1)

          switch(deviceParam){
            //Hz
            case "2000163":drawText.attr({text: lb1});hzStatus[20001]=lb1;break;
            case "2000263":drawText.attr({text: lb2});hzStatus[20002]=lb2;break;
            case "2000363":showLb3(lb3,lb3img);drawText.attr({text: lb3});hzStatus[20003]=lb3;break;
            case "2000463":drawText.attr({text: lb4});hzStatus[20004]=lb4;break;
            case "2000563":drawText.attr({text: lb5});hzStatus[20005]=lb5;break;
            case "3000163":drawText.attr({text: lb1});hzStatus[30001]=lb1;break;
            case "3000263":drawText.attr({text: lb2});hzStatus[30002]=lb2;break;
            case "3000363":drawText.attr({text: lb3});hzStatus[30003]=lb3;break;
            case "3000463":drawText.attr({text: lb4});hzStatus[30004]=lb4;break;
            case "3000563":drawText.attr({text: lb5});hzStatus[30005]=lb5;break;
            //bars
            case "2000162":drawText.attr({text: bar1});inStress[20001]=bar1;break;
            case "2000262":drawText.attr({text: bar2});inStress[20002]=bar2;break;
            case "2000362":drawText.attr({text: bar3});inStress[20003]=bar3;break;
            case "2000462":drawText.attr({text: bar4});inStress[20004]=bar4;break;
            case "2000562":drawText.attr({text: bar5});inStress[20005]=bar5;break;
            case "3000162":drawText.attr({text: bar1});inStress[30001]=bar1;break;
            case "3000262":drawText.attr({text: bar2});inStress[30002]=bar2;break;
            case "3000362":drawText.attr({text: bar3});inStress[30003]=bar3;break;
            case "3000462":drawText.attr({text: bar4});inStress[30004]=bar4;break;
            case "3000562":drawText.attr({text: bar5});inStress[30005]=bar5;break;
          }

          if(lb3>=60) {
            //只执行一次
            if (flag) {
              lb3img = svg.image("assets/comp/LQB/alarm/1/9.png", 350, 280, 35.2, 34.8)
                .attr({
                  cursor: 'pointer',
                })
            }
          }
          flag=false

          requestAnimationFrame(createLeft)
        }
        createLeft()
*/

      }
    }
    //====================================上面是文字
    //图片====================================
    else{
     let simg=svg.image(imageSource,x,y,width,height)
       .attr({cursor:'pointer',
         //没有x,y即绕自身中心旋转
         //以坐标x,y进行旋转
         'transform':'r'+rotate+','+x+','+y,
       })
       .click(function (e) {
         //切换成自动
         if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/0/1.png"){
           e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/1/1.png")
           handAuto[deviceID]=true
         }
         //切换成手动
         else if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/1/1.png"){
           e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/0/1.png")
           handAuto[deviceID]=false
         }
       })
       .mouseover(function (e) {
         //鼠标悬停有事件
         if(isMouseOverTip){
           //显示栏
           $("#infoDiv")
             //位置
             // .css("left",(parseInt(x)+parseInt(width)+10)+"px")
             .css("left",(parseInt(x)+parseInt(width)+10)+parseInt(svgLeft)+"px")
             // .css("top",(parseInt(y)+parseInt(height)+10)+"px")
             .css("top",(parseInt(y)+parseInt(height)+10)+parseInt(svgTop)+"px")
             .css("display","block")
           //改变数据
           $("#deviceName").text(deviceName)
           $("#handAuto").text(handAuto[deviceID]?"自动":"手动")
           $("#hzStatus").text(hzStatus[deviceID])
           $("#inStress").text(inStress[deviceID])
         }
       })
       .mouseout(function () {
         $("#infoDiv")
           .css("display","none")
       })

      //添加ID
      if(group==="deviceComp"){
        simg.node.setAttribute('id',deviceID)
        simg.node.setAttribute('display','block')
      }

       //显示运行时间
      runTime()

      //绘制旋转动画
      if(mark==="LQT"){
        let i=1
        function frame() {
          i=i+4
          if(i===13){
            i=1
          }
          $("#4001240012")[0].href.baseVal="assets/comp/LQT7/runing1/1/"+i+".png"
          requestAnimationFrame(frame)
        }
        if(group==="deviceComp" && deviceID==='40012'){
        // if(group==="deviceComp" ){
          let aa=svg.image("assets/comp/LQT7/runing1/1/1.png",parseInt(x)+parseInt(width)*parseFloat(scaleX)*0.4,y,parseInt(width)*parseFloat(scaleX)*1.3,parseInt(height)*parseFloat(scaleY)/2.3)
            .attr({cursor:'pointer'
            })
          aa.node.setAttribute("id","4001240012")
          frame()
        }

      }
      //============上面风扇
      //======螺旋
      if(mark==="LSJ"){
        let i=1
        function frame1() {
          i=i+4
          if(i===13){
            i=1
          }
          $("#1000410004")[0].href.baseVal="assets/comp/LGJZ/runing/1/"+i+".png"
          requestAnimationFrame(frame1)
        }
        if(group==="deviceComp" && deviceID==='10004'){
          // console.log("bb")
          let aa=svg.image("assets/comp/LGJZ/runing/1/1.png",parseInt(x)+parseInt(width)*parseFloat(scaleX),parseInt(y)+parseInt(height)*parseFloat(scaleY)*0.4,parseInt(width)*parseFloat(scaleX)*0.8,parseInt(height)*parseFloat(scaleY)/1.3)
            .attr({cursor:'pointer'
            })
          aa.node.setAttribute("id","1000410004")
          frame1()
        }
      }
     }
     //==========else
  }
  //=============循环

  let svgEle=document.querySelector("svg")
  svgEle.style.border="1px red solid"
  let children=svgEle.childNodes
}
//============解析xml

//缩放
/*
function scale() {
  let r = document.body.offsetWidth / window.screen.availWidth;
  $(document.body).css("-ms-transform","scale("+r+")");

  $(window).resize(function() {
    let r = document.body.offsetWidth / window.screen.availWidth;
    $(document.body).css("-ms-transform","scale("+r+")");
  });
}
*/

//缩放
function scale(r) {
  $(document.body).css("-ms-transform","scale("+r+")")
  $(window).resize(function() {
    $(document.body).css("-ms-transform","scale("+r+")")
  })
}

function drawText(svg,textX,textY,text,fontSize,textAlign,color,fontFamily,fontWeight) {
  svg.text(textX,textY,text)
    .attr({
      "font-size":fontSize+"px",
      "text-align":textAlign,
      cursor:'pointer',
      'fill':color,
      'text-anchor':'middle',
      'font-family':fontFamily,
      'font-weight':fontWeight
    })
}

//运行时间
function runTime() {
  let i=0
  setInterval(function () {
    i++
    $("#runTime").text(i)
  },1000)

  /*
  function createTime() {
    i++
    $("#runTime").text(i)
    requestAnimationFrame(createTime)
  }
  createTime()
*/
}

//报警变红
function showLb3(lb3) {
  if
  (lb3>=60 && $("#20003")[0].href.baseVal==="assets/comp/LQB/alarm/0/1.png")
  {
    $("#20003")[0].href.baseVal="assets/comp/LQB/alarm/1/9.png"
  }
  else
    if
  (lb3<60 && $("#20003")[0].href.baseVal==="assets/comp/LQB/alarm/1/9.png")
  {
    $("#20003")[0].href.baseVal="assets/comp/LQB/alarm/0/1.png"
  }
}

//滚轮滚动
function mouseWheel() {
  let r=1
  window.addEventListener("mousewheel",function(event){
    event.delta = event.wheelDelta /120
    //1为向上滚动，放大
    if(event.delta===1){
      r+=0.1
    }else if(event.delta===-1){
      r-=0.1
    }
    scale(r)
  },false)
}

//拖拽画布
function dragSVG() {
  let readSVG=document.querySelector("#readSVG")
  readSVG.onmousedown=function (event) {
    readSVG.setCapture && readSVG.setCapture()
    event=event || window.event
    //求div的偏移量
    let ol=event.clientX - readSVG.offsetLeft
    let ot=event.clientY-readSVG.offsetTop

    document.onmousemove=function (event) {
      // console.log("onmousemove")
      event=event || window.event
      let mouseLeft=event.clientX
      let mouseTop=event.clientY
      let divLeft=mouseLeft-ol
      let divTop=mouseTop-ot
      svgLeft=divLeft
      svgTop=divTop
      readSVG.style.left=divLeft+"px"
      readSVG.style.top=divTop+"px"
    }

    //若给box1绑定，若有其他兄弟div，则会触发其他div的点击
    //事件，而不是box1的
    document.onmouseup=function () {
      document.onmousemove=null;
      //当onmousemove销毁后，onmouseup仍然存在，故要销毁
      document.onmouseup=null;
      //当鼠标松开取消捕获
      //兼容IE8
      readSVG.releaseCapture && readSVG.releaseCapture();
    }
    //拖拽时取消浏览器搜索引擎的行为
    return false
  }
}








