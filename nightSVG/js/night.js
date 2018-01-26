//全局变量
var svgLeft=0
var svgTop=0
var paperLeft=0
var paperTop=0
var jsonData=null
var bigTime=null
var timerAll=null
var timerAlarm=[]
var timerRun=[]
var timerArray=[]
//======
var runIDArray=[]
var runNumArray=[]
var runSpeedArray=[]
//======
var alarmIDArray=[]
var alarmNumArray=[]
var alarmSpeedArray=[]
//===============
var jsonRunIDArray=[]
var jsonAlarmIDArray=[]
//==================
var nodeNameArray=[]
//===============
var deviceIDArray=[]
//装文字对象的数组
var drawTextArray=[]
//文字对象的deviceID
var textDeviceArray=[]
//文字对象的paramID
var textParamArray=[]
//json文字的值
var jsonTextArray=[]
//总长
var alllength=0
//现在的长
var nowlength=0
//剩下的长
var leftlength=0

window.onload=function () {
  deviceIDArray.unshift('')
  $("#showSVG").click(function () {
    //外面===============================================================
    //初始化
    drawTextArray=[]
    // let svg=null
    let jsonOne="../json/hotOne.json"
    //同步
    $.ajaxSettings.async = false
    // mouseWheel()
    //配置的xml
    let cptArray=analysisCompoentsOne()
    // let xmlAddress="../lyxtxtjgt.xml"
    let xmlAddress="../F1VideoNode.xml"
    // let xmlAddress="../0.xml"
    // let xmlAddress="../NLightPlan.xml"
    // let xmlAddress="../NLightPlan1.xml"
    //当前的xml
    // let nowArray=analysisNow(xmlAddress)
    //创建svg画布
    var xmlFileName=xmlAddress
    var xmlDoc
    //IE
    if((/Trident\/7\./).test(navigator.userAgent)){
      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    }else{
      xmlDoc=document.implementation.createDocument("","",null);
    }
    xmlDoc.async=false
    xmlDoc.load(xmlFileName)
    var Configration=xmlDoc.documentElement
    var ConfigWidth=Configration.getAttribute("Width")
    var ConfigHeight=Configration.getAttribute("Height")
    //创建svg画布
    let svg=new Raphael(document.querySelector("#readSVG"),ConfigWidth, ConfigHeight);
    // console.log("每次创建先清除元素")
    // svg.clear()
    var LIST=xmlDoc.documentElement.childNodes[0]
    var LISTImage=LIST.childNodes[1]
    var LISTImageChildren=LISTImage.childNodes
    // console.log(LISTImage.childNodes.length)
    var Components=xmlDoc.documentElement.childNodes[1]
    var ComponentsChildren=Components.childNodes
    //改变图片
    var changImg=false
    let imgnum=0
    //====================================================================
    alllength=ComponentsChildren.length
    let a=5
    nowlength=parseInt(alllength/2)
    leftlength=alllength-nowlength
    //画图
    // while(a){
    //   a--
    console.time()
    // var canvas = document.createElement('canvas');
    // var context = canvas.getContext('2d');  //取得画布的2d绘图上下文
      let ai=0
      analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,nowlength,ai)
    console.timeEnd()
    setTimeout(function () {
      ai=nowlength
      analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,alllength,ai)
      console.log("aaaa")
    }
     
      ,5000)


    //动图和文字
    runAndAlarm()
    // var innerSVG = $("svg")[0].innerHTML
    // var fixedSVG = svgfix(innerSVG);
    // canvg("canvas-result", fixedSVG, {
    //   renderCallback : function() {
    //     render();
    //   }
    // });
  })
  //夜景照明，模式预览

  $("#patternPreview").click(function () {
    if($("#patternPreview")[0].innerText==="模式预览"){
      $("svg").css("z-index",0)
      $("#patternPreview")[0].innerText="停止预览"
    }else if($("#patternPreview")[0].innerText==="停止预览"){
      $("svg").css("z-index",0)
      $("#patternPreview")[0].innerText="模式预览"
    }

  })

  //视频关闭按钮
  $("#vt_btn").click(function () {
    $("#infoVideo").css("display","none")
  })
}

function infoDoor() {
  //显示的时候才执行
  if($("#infoDoor").css("display")==="block"){
    //门禁表格行
    $("#doorTable").click(function (e) {
      $(e.target).parent().addClass("tr_select").siblings().removeClass("tr_select")
      if($(e.target).parent().attr("id")==="toClopen"){
        $(".door_btn1").css("cursor","default").css("opacity","1").attr("disabled",false)
      }else{
        $(".door_btn1").css("cursor","not-allowed").css("opacity","0.6").attr("disabled",true)
      }

    })
    //门禁的下拉框
    let $selectHead = $('.select-head:first')
    let $selectHeadCont = $('.select-head-cont:first')
    let $Option = $('#option')
    let $optionItem = $('.option-item')
    /*默认是第一个选项*/
    $selectHeadCont[0].innerText=$optionItem[0].innerText
    /*点击后出现下拉框*/
    $selectHead.click(function(){
      $Option.css('display','block')
    })
    /*点击选项后出现在下拉框*/
    let len = $optionItem.length
    for(let i=0;i<len;i++){

      $optionItem[i].index = i
      $optionItem[i].addEventListener('click',function(){
        // console.log("aaa")
        $selectHeadCont[0].innerHTML = $optionItem[this.index].innerHTML
        $Option.css('display','none')

      })
    }
    /*点击其他地方时，select会收起来*/
    // document.body.addEventListener('click',function(){
    //   $Option.css('display','none')
    // },false)
    //  关闭
    $(".door_btn2").click(function () {
      $("#infoDoor").css("display","none")
    })
  }
}


/*
* 解析导出的xml文件
* */
function nowXML(){

}


function analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,alength,ai) {
  //优化循环
  // for (var i=0,m=ComponentsChildren.length;i<m;i++){
  for (var i=ai,m=alength;i<m;i++){
    var imageSource=ComponentsChildren[i].getAttribute("source");
    // imageSource= '/'+$rootScope.serPath+'/static/'+ComponentsChildren[i].getAttribute("source");
    // imageSource="../1.svg"
    //如果没有source就从listimg中寻找
    if(!imageSource){
      for(var j=0,n=LISTImageChildren.length;j<n;j++){
        if(ComponentsChildren[i].nodeName===LISTImageChildren[j].nodeName){
          imageSource=LISTImageChildren[j].getAttribute("source")

        }
      }
    }

    var nodename=ComponentsChildren[i].nodeName
    // console.log(nodename)
    var group=ComponentsChildren[i].getAttribute("group")
    var image=null
    var width=ComponentsChildren[i].getAttribute("width")
    var height=ComponentsChildren[i].getAttribute("height")
    //匹配大背景图片
    if(group==="map"){
      
      // imageSource="../F1Node-mask.svg"
      // imageSource='/'+$rootScope.serPath+'/static/retailers/'+$rootScope.gcID.toLowerCase()+'/'+ComponentsChildren[i].getAttribute("source");
      width=!width?ConfigWidth:width
      // console.log(width,"width")
      // console.log("aaaaa")
      height=!height?ConfigHeight:height
    }

    var scaleX=ComponentsChildren[i].getAttribute("scaleX")
    var scaleY=ComponentsChildren[i].getAttribute("scaleY")
    var param=ComponentsChildren[i].getAttribute("param")
    //风扇
    var mark=ComponentsChildren[i].getAttribute("mark")

    var fontSize
    if(ComponentsChildren[i].getAttribute("fontSize")){
      fontSize=ComponentsChildren[i].getAttribute("fontSize")
    }
    var textAlign
    if(ComponentsChildren[i].getAttribute("textAlign")){
      textAlign=ComponentsChildren[i].getAttribute("textAlign")
    }

    var compname=ComponentsChildren[i].getAttribute("compname")
    var deviceID=ComponentsChildren[i].getAttribute("deviceID")
    var deviceName=ComponentsChildren[i].getAttribute("deviceName")
    var isMouseOverTip=ComponentsChildren[i].getAttribute("isMouseOverTip")

    var x=ComponentsChildren[i].getAttribute("x")
    var y=ComponentsChildren[i].getAttribute("y")
    // 文字以paramid标识
    var paramID=ComponentsChildren[i].getAttribute("paramID")
    //20001 63
    var deviceParam=deviceID+paramID
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

    var rotate=0
    if(ComponentsChildren[i].getAttribute("rotation")){
      rotate=parseInt(ComponentsChildren[i].getAttribute("rotation"))
    }

    var lb3;
    //如果是要绘制文字的话===========================================
    if(ComponentsChildren[i].getAttribute("text")){
      var color=ComponentsChildren[i].getAttribute("color")
      var contentBackgroundColor=ComponentsChildren[i].getAttribute("contentBackgroundColor")
      var contentBackgroundAlpha=ComponentsChildren[i].getAttribute("contentBackgroundAlpha")

      color=color.indexOf("#")===-1?colorTransformation(parseInt(color)):color
      // console.log(color)
      var fontFamily=ComponentsChildren[i].getAttribute("fontFamily")
      //优先绘制黑色背景框
      // if(fontFamily==="digifaw" || (parseInt(contentBackgroundAlpha)===1 && parseInt(contentBackgroundColor)===0)){
      //   svg.rect(x, y, width?width-5:40, height?height:20).attr({
      //     "fill": "black"
      //   })
      // }

      var fontWeight=ComponentsChildren[i].getAttribute("fontWeight")
      var textX=parseInt(x)
      var textY=parseInt(y)
      var text=ComponentsChildren[i].getAttribute("text")
      //绘制文字
      // var drawText=svg.text(textX,textY,text)
      var drawText=document.createElement('span')
      drawText.innerText=text
      // drawText.attr({
      $(drawText).css({
        "font-size":fontSize+"px",
        "text-align":textAlign,
        cursor:'pointer',
        color:"#"+color,
        'text-anchor':'middle',
        'font-family':fontFamily,
        'font-weight':fontWeight,
        position:'absolute',
        left:textX+"px",
        top:textY+"px",
        backgroundColor:"#"+contentBackgroundColor
      })
      //给文字加id
      // drawText.node.setAttribute("deviceId",deviceID)
      // drawText.node.setAttribute("paramId",paramID)
      if(deviceID){
        drawText.setAttribute("deviceId",deviceID)
      }
     if(paramID){
       drawText.setAttribute("paramId",paramID)
     }

      $("#readSVG")[0].appendChild(drawText)

      //=================================
      //根据json绘制文字
      // if(fontFamily==="digifaw"){
      // drawTextArray.push(drawText)
      // textDeviceArray.push(deviceID)
      // textParamArray.push(paramID)
      // if(paramID == 63 && deviceID==30005){
      // console.log("aaa")
      // drawTextArray.push(drawText)
      // }
      // }
    }
    //====================================上面是文字
    //图片====================================
    else{
      // imgnum++
      // console.log(imgnum)
      // var simg=svg.image(imageSource,x,y,width,height)
      var simg = new Image();
      simg.src=imageSource
      // drawText.attr({
      $(simg).css({
        cursor:'pointer',
        position:'absolute',
        left:x+"px",
        top:y+"px",
        width:width,
        height:height
      })
      //	能不加就不加
      if(rotate){
        // simg.attr({
        $(simg).css({
          // cursor:'pointer',
          //没有x,y即绕自身中心旋转
          //以坐标x,y进行旋转
          // 'transform':'r'+rotate+','+x+','+y,
          transform:"rotate("+rotate+"deg)"
        })

      }

      // simg.mouseover(function (e) {
      //   // .mouseenter(function (e) {
      //   // time = (new Date()).getTime();
      //   // console.log(time)
      //   //鼠标悬停有事件
      //   // if(isMouseOverTip){
      //     // console.log(deviceID)
      //     //改变数据
      //     // $("#deviceName").text(deviceName)
      //     // $("#handAuto").text(handAuto[deviceID]?"自动":"手动")
      //     // $("#hzStatus").text(hzStatus[deviceID])
      //     // $("#inStress").text(inStress[deviceID])
      //     //=======================================
      //     //读取单个json
      //     //getJSON(deviceID,x,y,width,height,ConfigHeight,ConfigWidth)
      //     //======================================
      //
      //   // }
      // })
      // .mouseout(function () {
      //   // $("#infoDiv")
      //   //   .css("display","none")
      // })

      //添加ID
      //是设备图片
      if(group==="deviceComp" || group==="commonComp"){
        // simg.node.setAttribute('id',deviceID)
        simg.setAttribute('id',deviceID)
        // simg.node.setAttribute('display','block')
        if(deviceID){deviceIDArray.push(deviceID.toString())}
        //添加id,速度,数量
        getImgNum(deviceID,nodename,imageSource)
        // drawRunAndAlarm(deviceID,nodename,cptArray,x,y,scaleX,scaleY,svg,imageSource,simg)
        //=================================

        // simg.click(function (e) {
        //   // //切换成自动
        //   // if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/0/1.png"){
        //   //   e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/1/1.png")
        //   //   handAuto[deviceID]=true
        //   // }
        //   // // //切换成手动
        //   // else if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/1/1.png"){
        //   //   e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/0/1.png")
        //   //   handAuto[deviceID]=false
        //   // }
        //
        // })
      }
      $("#readSVG")[0].appendChild(simg)
    }
    //==========else
  }
  //=============循环


}
//============解析xml

//缩放
// function scale(r) {
//   let readSVG=$("#readSVG")
//   // $(document.body).css("-ms-transform","scale("+r+")")
//   readSVG.css("-ms-transform","scale("+r+")")
//   $(window).resize(function() {
//     // $(document.body).css("-ms-transform","scale("+r+")")
//     readSVG.css("-ms-transform","scale("+r+")")
//   })
// }

//滚轮滚动
// function mouseWheel() {
//   let r=1
//   window.addEventListener("mousewheel",function(event){
//     event.delta = event.wheelDelta /120
//     //1为向上滚动，放大
//     if(event.delta===1){
//       r+=0.1
//       console.log(r)
//     }else if(event.delta===-1){
//       r-=0.1
//     }
//     scale(r)
//   },false)
//
// //  拖动画布
//   dragSVG(r)
// }

//拖拽画布
// function dragSVG(r) {
//   let flag=false
//
//   let readSVG=document.querySelector("#readSVG")
//   readSVG.onmousedown=function (event) {
//     readSVG.setCapture && readSVG.setCapture()
//     event=event || window.event
//     //求div的偏移量
//     let ol=event.clientX - readSVG.offsetLeft
//     let ot=event.clientY-readSVG.offsetTop
//     console.log(readSVG.offsetTop,"readSVG.offsetTop")
//     // console.log(ol)
//     document.onmousemove=function (event) {
//       // console.log("onmousemove")
//       event=event || window.event
//       let mouseLeft=event.clientX
//       let mouseTop=event.clientY
//       let divLeft=mouseLeft-ol
//       let divTop=mouseTop-ot
//       // console.log(divTop,"divTop")
//       svgLeft=divLeft
//       svgTop=divTop
//       readSVG.style.left=divLeft+"px"
//       readSVG.style.top=divTop+"px"
//     }
//     //若给box1绑定，若有其他兄弟div，则会触发其他div的点击
//     //事件，而不是box1的
//     document.onmouseup=function () {
//       document.onmousemove=null;
//       //当onmousemove销毁后，onmouseup仍然存在，故要销毁
//       document.onmouseup=null;
//       //当鼠标松开取消捕获
//       //兼容IE8
//       readSVG.releaseCapture && readSVG.releaseCapture();
//     }
//     //拖拽时取消浏览器搜索引擎的行为
//     return false
//   }
// }
//=============================

function getJSON(deviceID,x,y,width,height,ConfigHeight,ConfigWidth,mouseEvent) {
  // console.log("aaaaa")
  //ajax======================
  let param={}
  let httpUrl
  param.gcID='JSCZJTWY'
  param.device=deviceID.toString()
  httpUrl='http://192.168.1.15:8888/XYCloudService/configurationService/getDeviceParam?falg='+Math.random().toFixed(3)

  let $infoDiv=null


    //请求
    $.ajax({
      type:'get',
      // type:'post',
      url:httpUrl,
      data:{'str':JSON.stringify(param) },
      success:function (data) {
        data=JSON.parse(data)

        //====================
        if(mouseEvent==="isMouseOverTip"){
          /*需要*/
        // =======================================================================================
          $infoDiv= $("#infoDiv")
          $infoDiv.empty();//清空内容
          let tbody= document.createElement('tbody');
          tbody.innerHTML="<tr><td>设备</td><td>位置</td><td>参数</td><td>参数值</td></tr>"
        for(let j=0,groups=data.result,n=groups.length;j<n;j++){
          tbody.innerHTML+="<tr><td>"+groups[j].deviceName+"</td><td>位置</td><td>"+groups[j].paramName+"</td><td>"+groups[j].statusEnValue+"</td></tr>"
          $infoDiv[0].appendChild(tbody)
        }
        //======================================================================================

          //============================================================================
          // $infoDiv=$("#infoDoor").css("display","block")
          // $("#doorTable").empty()
          // let tbody= document.createElement('tbody');
          // tbody.innerHTML="<tr><td>设备名称</td><td>参数名称</td><td>参数值</td></tr>"
          // for(let j=0,groups=data.result,n=groups.length;j<n;j++){
          //   if(groups[j].paramName==="开关状态"){
          //     tbody.innerHTML+="<tr id='toClopen'><td>"+groups[j].deviceName+"</td><td>"+groups[j].paramName+"</td><td style='background-color: #82B882'>"+groups[j].statusEnValue+"</td></tr>"
          //   }else{
          //     tbody.innerHTML+="<tr><td>"+groups[j].deviceName+"</td><td>"+groups[j].paramName+"</td><td>"+groups[j].statusEnValue+"</td></tr>"
          //   }
          //   $("#doorTable")[0].appendChild(tbody)
          // }
          //
          // //奇偶行设置背景颜色
          // $('#doorTable tbody tr:even').addClass("trEven")
          // $('#doorTable tbody tr:odd').addClass("trOdd")
          // infoDoor()
        //============================================================================

        }
      //  ==============
        else if(mouseEvent==="list"){
          console.log(data)
          $infoDiv=$("#infoDoor").css("display","block").empty() //清空内容
          let tbody= document.createElement('tbody');
          tbody.innerHTML="<tr><td>设备名称</td><td>参数名称</td><td>参数值</td></tr>"
          for(let j=0,groups=data.result,n=groups.length;j<n;j++){
            tbody.innerHTML+="<tr><td>"+groups[j].deviceName+"</td><td>位置</td><td>"+groups[j].paramName+"</td><td>"+groups[j].statusEnValue+"</td></tr>"
            $infoDiv[0].appendChild(tbody)
          }

          //奇偶行设置背景颜色
          $('#doorTable tbody tr:even').css('background','white');
          $('#doorTable tbody tr:odd').css('background','#f1f5f8');




        }


      },
      error:function (err) {
      }
    })

    //=========================

  //让显示框不出画布=============================================
  let showHeight=parseInt(y)+parseInt(height)+10+parseInt(svgTop)+parseInt(paperTop)
  let showWidth=parseInt(x)+parseInt(width)+10+parseInt(svgLeft)+parseInt(paperLeft)
  let cha1=showHeight+parseInt($infoDiv.css("height"))-parseInt(paperTop)-ConfigHeight
  let cha2=showWidth+parseInt($infoDiv.css("width"))-parseInt(paperLeft)-ConfigWidth
  if(cha1>0 && cha2>0){
    $infoDiv
      .css("left",showWidth-cha2+"px")
      .css("top",showHeight-cha1+"px")
      .css("display","block")
  } else if(cha1>0 && cha2<=0)
  {
    $infoDiv
      .css("left",showWidth+"px")
      .css("top",showHeight-cha1+"px")
      .css("display","block")

  }else if(cha1<=0 && cha2>0){
    $infoDiv
      .css("left",showWidth-cha2+"px")
      .css("top",showHeight+"px")
      .css("display","block")
  }
  else{
    //显示栏
    $infoDiv
    //位置
      .css("left",showWidth+"px")
      .css("top",showHeight+"px")
      .css("display","block")
  }
//==================================


}
//画配置图片
function drawRunAndAlarm(deviceID,nodename,cptArray,x,y,scaleX,scaleY,svg,trueImgSource,simg) {
  //读取配置文件
  //在添加好图片的基础上再去添加它的运行，报警图片
  //背景是bg的，画新的alarm
  //背景是alarm的，不用画
  if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID+deviceID) && document.getElementById(deviceID).getAttribute("href").indexOf("alarm")===-1) {
    if (cptArray[nodename]) {
      //有的图是用alarm画的，有alarm就不画报警图了
      if (cptArray[nodename]["alarm"] && trueImgSource.indexOf("alarm") === -1) {
        let imgSource = cptArray[nodename]["alarm"]["imgSource"]
        let imgX = parseInt(cptArray[nodename]["alarm"]["imgX"]) * parseFloat(scaleX) + parseInt(x)
        let imgY = parseInt(cptArray[nodename]["alarm"]["imgY"]) * parseFloat(scaleY) + parseInt(y)
        let imgWidth = parseInt(cptArray[nodename]["alarm"]["imgWidth"]) * parseFloat(scaleX)
        let imgHeight = parseInt(cptArray[nodename]["alarm"]["imgHeight"]) * parseFloat(scaleY)
        //画图
        let imgRun = svg.image(imgSource, imgX, imgY, imgWidth, imgHeight)
          .attr({
            cursor: 'pointer',
          })
        imgRun.node.setAttribute("id", deviceID + deviceID + deviceID)
      }
    }
  }
  //================画报警图

  //防止重新绘画
  //run
  if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID)){
  // if($("#"+deviceID) && !$("#"+deviceID+deviceID)){
    if(cptArray[nodename]) {
      //running=====================
      if (cptArray[nodename]["running"]) {
        let imgSource = cptArray[nodename]["running"]["imgSource"]
        let imgX = parseInt(cptArray[nodename]["running"]["imgX"]) * parseFloat(scaleX) + parseInt(x)
        let imgY = parseInt(cptArray[nodename]["running"]["imgY"]) * parseFloat(scaleY) + parseInt(y)
        let imgWidth = parseInt(cptArray[nodename]["running"]["imgWidth"]) * parseFloat(scaleX)
        let imgHeight = parseInt(cptArray[nodename]["running"]["imgHeight"]) * parseFloat(scaleY)
        //画图
        let imgRun = svg.image(imgSource, imgX, imgY, imgWidth, imgHeight)
          .attr({
            cursor: 'pointer',
          })
        imgRun.node.setAttribute("id", deviceID + deviceID)
      }
    //  ================
    //  设置悬浮，点击属性==================
      if (cptArray[nodename]["mouseEvent"]) {
        // console.log(cptArray[nodename]["mouseEvent"])
        let isPop=cptArray[nodename]["mouseEvent"]["isPop"]
        let popType=cptArray[nodename]["mouseEvent"]["popType"]
        let isToolTip=cptArray[nodename]["mouseEvent"]["isToolTip"]
        // console.log(isPop)
        //设置mouse属性
        if(isPop){
          simg.node.setAttribute('isPop',"true")
          simg.node.setAttribute('popType',popType)
        }
        if(isToolTip){
          simg.node.setAttribute('isToolTip',"true")
        }
      }

      
    }
  }
//======================
}

// function jsonStatus(address) {
//
//   //注意清空
//   jsonAlarmIDArray=[]
//   jsonRunIDArray=[]
//   jsonTextArray=[]
//   let param={}
//   let httpUrl
//   param.gcID='JSCZJTWY'
//   param.device=deviceIDArray.toString()
//   httpUrl='http://192.168.1.15:8888/XYCloudService/configurationService/getDeviceParam?falg='+Math.random()
//   //请求
//   $.ajax({
//     type:'get',
//     // type:'post',
//     url:httpUrl,
//     data:{'str':JSON.stringify(param) },
//     success:function (data) {
//       data=JSON.parse(data)
//       // console.log(data)
//       for(let j=0,groups=data.result,n=groups.length;j<n;j++){
//         //===================alarm
//         if (groups[j].paramID === 2 && groups[j].statusValue === "1") {
//           let id = groups[j].deviceID
//           jsonAlarmIDArray.push(id)
//           // console.log(jsonAlarmIDArray)
//         }else
//         //运行，即动画
//         //=============run
//         if (groups[j].paramID === 1 && groups[j].statusValue === "1") {
//           let id = groups[j].deviceID
//           jsonRunIDArray.push(id)
//         }
//
//         if(groups[j].paramID === 63 && groups[j].deviceID===30005){
//           jsonTextArray.push(groups[j].statusEnValue)
//         }
//
//         // for(let i=0,m=textParamArray.length;i<m;i++){
//         //   if (groups[j].paramID+'' === textParamArray[i]+'' && groups[j].deviceID+'' === textDeviceArray[i]+'') {
//         //     jsonTextArray.push(textParamArray[i])
//         //     break;
//         //   }
//         // }
//
//
//       }
//     },
//     error:function (err) {
//     }
//
//   })
//
//
// }

//十进制颜色转换为十六进制
function colorTransformation(colorStr){
  colorStr = colorStr.toString(16);
 let colorLen = colorStr.length;
 // console.log(colorStr)
 if(colorStr==="ff"){
   colorStr='#00ff00'
 }else if(colorLen===6){
    colorStr = '#'+colorStr;
  }
  if(colorLen===5){
    colorStr = '#0'+colorStr;
  }else if(colorLen===4){
    colorStr = '#00'+colorStr;
  }else if(colorLen===3){
    colorStr = '#000'+colorStr;
  }
  // else if(colorLen===2 && colorStr!=="ff"){
  //   colorStr = '#0000'+colorStr;
  // }
  // console.log(colorStr.toString())
  return colorStr.toString();
}


//获取图片数量
function getImgNum(deviceID,nodeName,imageSource) {
  //转动数量
  let runNum = 3
  //转动速率
  let runSpeed = 80
  let alarmSpeed = 910
  let alarmNum=1
  if(nodeName.indexOf('LQT')>-1){
    runNum = 10
    runSpeed = 40
    alarmSpeed = 910
  }else if(nodeName.indexOf('LQB')>-1){
    runNum = 3;
    runSpeed = 80;
    alarmSpeed = 910
  }else if(nodeName.indexOf('LGJZ')>-1){
    runNum = 12;
    runSpeed = 90
    alarmSpeed = 910
  }else if(nodeName.indexOf('LXJZ')>-1){
    runNum = 5;
    runSpeed = 60
    alarmSpeed = 910
  }else if(nodeName.indexOf('RQGL')>-1){
    runNum = 30
    runSpeed = 80
    alarmSpeed = 910
  }else if(nodeName.indexOf('BSHX')>-1){
    runNum = 6
    runSpeed = 60
    alarmSpeed = 910
  }

  if(nodeName==="BSB2" || nodeName==="BSB1" ||
     nodeName==="DRFM" || nodeName==="EAF" ||
     nodeName==="EAF1" || nodeName==="EAF2" ||
     nodeName==="FPG" || nodeName==="PWB" ||
     nodeName==="PWB1" || nodeName==="RGSHU" ||
     nodeName==="LQB" || nodeName==="RQGL" ||
     nodeName==="SAF" || nodeName==="SAF1" ||
     nodeName==="SAF2"){
    // alarmNum=16
    alarmNum=2
    // console.log(alarmNum)
  }else{
    alarmNum=1
  }

  runIDArray.push(deviceID+deviceID)
  runSpeedArray.push(runSpeed)
  runNumArray.push(runNum)

  //有alarm
  if(imageSource.indexOf("alarm")>-1){
    alarmIDArray.push(deviceID)
  }else{
    alarmIDArray.push(deviceID+deviceID+deviceID)
  }
  alarmSpeedArray.push(alarmSpeed)
  alarmNumArray.push(alarmNum)

  nodeNameArray.push(nodeName)
}

//运行和报警和绘制文字
function runAndAlarm() {
  let aa = 2
  let address
  let bb = 8

  timerAll=setInterval(function () {
    //清除运行定时器
    for(let aa in timerRun){
      clearTimeout(timerRun[aa])
    }
    //清除报警定时器
    for(let bb in timerAlarm){
      clearTimeout(timerAlarm[bb])
    }

    //获取运行，报警数组和文字
    // jsonStatus()
    // console.log(jsonTextArray)
    //根据json绘制文字
    // if(group.deviceID===parseInt(deviceID) && group.paramID===parseInt(paramID) ) {
    //   drawTextArray[0].attr({text: jsonTextArray[0]})
    // console.log(drawTextArray[0]);
    //   return false
    // }

      //绘制文字=============================

    //alarm===================
    // console.log(alarmIDArray)
    for(let i=0,n=jsonAlarmIDArray.length;i<n;i++){
      // console.log(jsonAlarmIDArray[i])
      for(let j=0,m=alarmIDArray.length;j<m;j++){

        //本来背景是报警图
        if((jsonAlarmIDArray[i]+"")===alarmIDArray[j]+""){
          
          let id=alarmIDArray[j]

          let realJ=j
          let alarmnum=8
          let alarmnumOne=0
          //配置里报警有
          if(alarmNumArray[j]===2){
            // console.log(id,alarmNumArray[j])
            // if(id===20001){
            //   console.log(address)
            // }
            
            function funcTimeAlarmOne() {
            if(alarmnum>9) {
              alarmnum = 8
            }
            $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/"+alarmnum+".png")
              alarmnum++
            timerAlarm.push(setTimeout(funcTimeAlarmOne,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmOne()

          }else{
            function funcTimeAlarmTwo() {
              if(alarmnumOne>1) {
                alarmnumOne =0
              }
              $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/1.png")
              alarmnumOne++
              timerAlarm.push(setTimeout(funcTimeAlarmTwo,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmTwo()
          }
          //=======================
          //符合条件就break
          break;
        }else if((jsonAlarmIDArray[i]+""+jsonAlarmIDArray[i]+""+jsonAlarmIDArray[i]+"")===alarmIDArray[j]+""){
          let alarmnum=8
          let id=alarmIDArray[j]
          let realJ=j
          let alarmnumOne=0
          if(alarmNumArray[j]===1){

            function funcTimeAlarmThree() {
              if(alarmnumOne>1) {
                alarmnumOne =0
              }
              $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/1.png")
              alarmnumOne++
              timerAlarm.push(setTimeout(funcTimeAlarmThree,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmThree()
          }else {
            function funcTimeAlarm() {
              if (alarmnum > 9) {
                alarmnum = 8
              }
              $("#" + id)[0].setAttribute("href", "assets/comp/" + nodeNameArray[realJ] + "/alarm/1/" + alarmnum + ".png")
              alarmnum++
              timerAlarm.push(setTimeout(funcTimeAlarm, alarmSpeedArray[realJ]))
            }

            funcTimeAlarm()
            //=======================
            //符合条件就break
          }
          break;
        }
      }
    }
    //alarm===============================


  //  run=====================
  for(let i=0,n=jsonRunIDArray.length;i<n;i++){
    // console.log(jsonRunIDArray[i]+jsonRunIDArray[i])
    for(let j=0,m=runIDArray.length;j<m;j++){
    //拼接看有没有在运行数组里面
    if((jsonRunIDArray[i]+""+jsonRunIDArray[i]+"")===runIDArray[j]+""){
      // console.log(address)
    let runnum=1
    let id=runIDArray[j]
    let realJ=j

    //  =====================
    function funcTimeRun() {
      if(runnum>runNumArray[realJ]) {
        runnum = 1
      }
      $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[realJ] + "/runing/1/" + runnum + ".png")
      runnum++
      timerRun.push(setTimeout(funcTimeRun,runSpeedArray[realJ]))
    }
      funcTimeRun()
  //=======================
  //符合条件就break
      break;
  }
  }
  }
  //run=====================

  aa++
  }, 6000)


}

//解析配置文件
function analysisCompoentsOne() {
  let compoentsArray={}
  // console.log("aaa")
  let xmlFileName="../Components.xml"
  let xmlDoc
  //IE
  if((/Trident\/7\./).test(navigator.userAgent)){
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }else{
    xmlDoc=document.implementation.createDocument("","",null);
  }
  xmlDoc.async=false
  xmlDoc.load(xmlFileName)
  // let Components=xmlDoc.documentElement
  let Component=xmlDoc.documentElement.childNodes[0]
  let ComponentChildren=Component.childNodes
  for(let i=0,m=ComponentChildren.length;i<m;i++){
    //节点名
    let childName=ComponentChildren[i].nodeName
    //节点名下的孩子
    let child=ComponentChildren[i].childNodes
    compoentsArray[childName]={}
    compoentsArray[childName]["running"]={}
    compoentsArray[childName]["alarm"]={}
    compoentsArray[childName]["mouseEvent"]={}
    //==========获取点击，悬浮属性
    if(ComponentChildren[i].childNodes[0] && ComponentChildren[i].getAttribute("isPop")==="true"){
      compoentsArray[childName]["mouseEvent"]["isPop"]=ComponentChildren[i].getAttribute("isPop")
      compoentsArray[childName]["mouseEvent"]["popType"]=ComponentChildren[i].getAttribute("popType")
    }
    if(ComponentChildren[i].childNodes[0] && ComponentChildren[i].getAttribute("isToolTip")==="true"){
      compoentsArray[childName]["mouseEvent"]["isToolTip"]=ComponentChildren[i].getAttribute("isToolTip")
    }
    //=====================


    if(child){
      // console.log(childName)
      //读取除第一个子节点的图片，如运行和报警
      for(let j=0,n=child.length;j<n;j++){
        if(child[j].getAttribute("param")==="runing"){
          compoentsArray[childName]["running"]["imgX"]=child[j].getAttribute("x")
          compoentsArray[childName]["running"]["imgY"]=child[j].getAttribute("y")
          compoentsArray[childName]["running"]["imgWidth"]=child[j].getAttribute("width")
          compoentsArray[childName]["running"]["imgHeight"]=child[j].getAttribute("height")
          compoentsArray[childName]["running"]["imgSource"]=child[j].getAttribute("source")
        }

        if(child[j].getAttribute("param")==="alarm"){
          compoentsArray[childName]["alarm"]["imgX"]=child[j].getAttribute("x")
          compoentsArray[childName]["alarm"]["imgY"]=child[j].getAttribute("y")
          compoentsArray[childName]["alarm"]["imgWidth"]=child[j].getAttribute("width")
          compoentsArray[childName]["alarm"]["imgHeight"]=child[j].getAttribute("height")
          compoentsArray[childName]["alarm"]["imgSource"]=child[j].getAttribute("source")
        }
      }
    }



  }
  // console.log(compoentsArray)
  return compoentsArray
}

// 解析当前的文件
function analysisNow(xmlAddress) {
  let nowxmlArray = {}
  let xmlFileName = xmlAddress
  let xmlDoc
  //IE
  if ((/Trident\/7\./).test(navigator.userAgent)) {
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
  } else {
    xmlDoc = document.implementation.createDocument("", "", null);
  }
  xmlDoc.async = false
  xmlDoc.load(xmlFileName)
  let Configration = xmlDoc.documentElement
  // console.log(Configration.nodeName)
  let ConfigWidth = Configration.getAttribute("Width")
  let ConfigHeight = Configration.getAttribute("Height")
  nowxmlArray["ConfigWidth"]=ConfigWidth
  nowxmlArray["ConfigHeight"]=ConfigHeight

  let LIST = xmlDoc.documentElement.childNodes[0]
  let LISTImage = LIST.childNodes[1]
  let LISTImageChildren = LISTImage.childNodes
  // console.log(LISTImage.childNodes.length)
  let Components = xmlDoc.documentElement.childNodes[1]
  let ComponentsChildren = Components.childNodes
  alllength = ComponentsChildren.length
  nowlength = parseInt(alllength / 2)
  //改变图片
  var changImg = false
  // console.log(ComponentsChildren[i].nodeName)
  if (ComponentsChildren[i].nodeName !== "#comment") {
    let imageSource = ComponentsChildren[i].getAttribute("source")
    //如果没有source就从listimg中寻找
    if (!imageSource) {
      for (let j = 0, n = LISTImageChildren.length; j < n; j++) {
        if (ComponentsChildren[i].nodeName === LISTImageChildren[j].nodeName) {
          imageSource = LISTImageChildren[j].getAttribute("source")
        }
      }
    }
    let nodename = ComponentsChildren[i].nodeName
    // console.log(nodename)
    let group = ComponentsChildren[i].getAttribute("group")
    let image = null
    let width = ComponentsChildren[i].getAttribute("width")
    let height = ComponentsChildren[i].getAttribute("height")
    //匹配大背景图片
    if (group === "map" && !width) {
      width = ConfigWidth
      height = ConfigHeight
    }

    let scaleX = ComponentsChildren[i].getAttribute("scaleX")
    let scaleY = ComponentsChildren[i].getAttribute("scaleY")
    let param = ComponentsChildren[i].getAttribute("param")
    //风扇
    let mark = ComponentsChildren[i].getAttribute("mark")

    let fontSize = null
    if (ComponentsChildren[i].getAttribute("fontSize")) {
      fontSize = ComponentsChildren[i].getAttribute("fontSize")
    }
    let textAlign = null
    if (ComponentsChildren[i].getAttribute("textAlign")) {
      textAlign = ComponentsChildren[i].getAttribute("textAlign")
    }
    let isControl = null
    if (ComponentsChildren[i].getAttribute("isControl")) {
      isControl = ComponentsChildren[i].getAttribute("isControl")
    }


    let compname = ComponentsChildren[i].getAttribute("compname")
    let deviceID = ComponentsChildren[i].getAttribute("deviceID")
    let deviceName = ComponentsChildren[i].getAttribute("deviceName")
    let isMouseOverTip = ComponentsChildren[i].getAttribute("isMouseOverTip")

    let x = ComponentsChildren[i].getAttribute("x")
    let y = ComponentsChildren[i].getAttribute("y")
    // 文字以paramid标识
    let paramID = ComponentsChildren[i].getAttribute("paramID")
    //20001 63
    let deviceParam = deviceID + paramID
    //数组保存参数
    var handAuto = new Array()
    var hzStatus = new Array()
    var inStress = new Array()
    //组件宽高缩放
    if (scaleX) {
      width = parseInt(width) * parseFloat(scaleX)
    }
    if (scaleY) {
      height = parseInt(height) * parseFloat(scaleY)
    }

    let rotate = 0
    if (ComponentsChildren[i].getAttribute("rotation")) {
      rotate = parseInt(ComponentsChildren[i].getAttribute("rotation"))
    }

    let lb3;


    //========================

    // console.log("aaa")
    let xmlFileName = "../Components.xml"
    let xmlDoc
    //IE
    if ((/Trident\/7\./).test(navigator.userAgent)) {
      xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    } else {
      xmlDoc = document.implementation.createDocument("", "", null);
    }
    xmlDoc.async = false
    xmlDoc.load(xmlFileName)
    // let Components=xmlDoc.documentElement
    let Component = xmlDoc.documentElement.childNodes[0]
    let ComponentChildren = Component.childNodes
    for (let i = 0, m = ComponentChildren.length; i < m; i++) {
      //节点名
      let childName = ComponentChildren[i].nodeName
      //节点名下的孩子
      let child = ComponentChildren[i].childNodes
      compoentsArray[childName] = {}
      compoentsArray[childName]["running"] = {}
      compoentsArray[childName]["alarm"] = {}
      compoentsArray[childName]["mouseEvent"] = {}
      //==========获取点击，悬浮属性
      if (ComponentChildren[i].childNodes[0] && ComponentChildren[i].getAttribute("isPop") === "true") {
        compoentsArray[childName]["mouseEvent"]["isPop"] = ComponentChildren[i].getAttribute("isPop")
        compoentsArray[childName]["mouseEvent"]["popType"] = ComponentChildren[i].getAttribute("popType")
      }
      if (ComponentChildren[i].childNodes[0] && ComponentChildren[i].getAttribute("isToolTip") === "true") {
        compoentsArray[childName]["mouseEvent"]["isToolTip"] = ComponentChildren[i].getAttribute("isToolTip")
      }
      //=====================


      if (child) {
        // console.log(childName)
        //读取除第一个子节点的图片，如运行和报警
        for (let j = 0, n = child.length; j < n; j++) {
          if (child[j].getAttribute("param") === "runing") {
            compoentsArray[childName]["running"]["imgX"] = child[j].getAttribute("x")
            compoentsArray[childName]["running"]["imgY"] = child[j].getAttribute("y")
            compoentsArray[childName]["running"]["imgWidth"] = child[j].getAttribute("width")
            compoentsArray[childName]["running"]["imgHeight"] = child[j].getAttribute("height")
            compoentsArray[childName]["running"]["imgSource"] = child[j].getAttribute("source")
          }

          if (child[j].getAttribute("param") === "alarm") {
            compoentsArray[childName]["alarm"]["imgX"] = child[j].getAttribute("x")
            compoentsArray[childName]["alarm"]["imgY"] = child[j].getAttribute("y")
            compoentsArray[childName]["alarm"]["imgWidth"] = child[j].getAttribute("width")
            compoentsArray[childName]["alarm"]["imgHeight"] = child[j].getAttribute("height")
            compoentsArray[childName]["alarm"]["imgSource"] = child[j].getAttribute("source")
          }
        }
      }


    }
    // console.log(compoentsArray)
    return compoentsArray
  }
}



/*
* 你的心里,可曾有个鬼，
你可曾有否,与她同醉，
你可曾与她,满饮此杯，
你可曾与她,不醉不归*/