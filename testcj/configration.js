
//十进制颜色转换为十六进制
function colorTransformation(colorStr){
	colorStr = colorStr.toString(16);
	var colorLen = colorStr.length;
	if(colorLen==6){
		colorStr = colorStr;
	}
	if(colorLen==5){
		colorStr = '0'+colorStr;
	}else if(colorLen==4){
		colorStr = '00'+colorStr;
	}else if(colorLen==3){
		colorStr = '000'+colorStr;
	}else if(colorLen==2){
		colorStr = '0000'+colorStr;
	}else if(colorLen==1){
		colorStr = '00000'+colorStr;
	}
	return colorStr.toString();
}

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
var timer1
var timer2
var timer3
/*
* 部分解析导出的xml文件
* */
function partXML(cptArray,xmlAddress,svg){
  var xmlFileName=xmlAddress
	// console.log(xmlFileName)
  var xmlDoc
  //IE
  if((/Trident\/7\./).test(navigator.userAgent)){
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }else{
    xmlDoc=document.implementation.createDocument("","",null);
  }
  xmlDoc.async=false
  xmlDoc.load(xmlFileName)
  let Configration=xmlDoc.documentElement
  let ConfigWidth=Configration.getAttribute("Width")
  let ConfigHeight=Configration.getAttribute("Height")

  let LIST=xmlDoc.documentElement.childNodes[0]
  let LISTImage=LIST.childNodes[1]
  let LISTImageChildren=LISTImage.childNodes
  // console.log(LISTImage.childNodes.length)
  let Components=xmlDoc.documentElement.childNodes[1]
  let ComponentsChildren=Components.childNodes
  //总长
  let alllength=0
  //第一
  let firstlength=0
  //第二
  let secondlength=0
  let lastlength=0
  alllength=ComponentsChildren.length
  firstlength=parseInt(alllength/6)
  secondlength=firstlength*2
  lastlength=firstlength*4
  // console.time()
  let ai=0
  analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,firstlength,ai)
  // analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,alllength,ai)
  // console.timeEnd()
  clearTimeout(timer1)
  clearTimeout(timer2)
  clearTimeout(timer3)

  //第一次延时
  timer1=setTimeout(function () {
    ai=firstlength
    analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,secondlength,ai)
  },60)
	//第二次延时
  timer2=setTimeout(function () {
    ai=secondlength
    analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,lastlength,ai)
  },80)
	//第三次延时
  timer3=setTimeout(function () {
    ai=lastlength
    analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,alllength,ai)

  },100)

}

// 解析导入的xml文件
function analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,alength,ai) {
  for (var i=ai,m=alength;i<m;i++){
    // var imageSource=ComponentsChildren[i].getAttribute("source");
    var imageSource= '/'+$rootScope.serPath+'/static/'+ComponentsChildren[i].getAttribute("source")
		// console.log(imageSource)
    //如果没有source就从listimg中寻找
    if(!imageSource){
      for(var j=0,n=LISTImageChildren.length;j<n;j++){
        if(ComponentsChildren[i].nodeName===LISTImageChildren[j].nodeName){
          imageSource='/'+$rootScope.serPath+'/static/'+LISTImageChildren[j].getAttribute("source")

        }
      }
    }

    var nodename=ComponentsChildren[i].nodeName
    // console.log(nodename)
    let group=ComponentsChildren[i].getAttribute("group")
    let image=null
    let width=ComponentsChildren[i].getAttribute("width")
    let height=ComponentsChildren[i].getAttribute("height")


    var scaleX=ComponentsChildren[i].getAttribute("scaleX")
    var scaleY=ComponentsChildren[i].getAttribute("scaleY")
    var param=ComponentsChildren[i].getAttribute("param")
    //风扇
    let mark=ComponentsChildren[i].getAttribute("mark")

    let fontSize
    if(ComponentsChildren[i].getAttribute("fontSize")){
      fontSize=ComponentsChildren[i].getAttribute("fontSize")
    }
    var textAlign
    if(ComponentsChildren[i].getAttribute("textAlign")){
      textAlign=ComponentsChildren[i].getAttribute("textAlign")
    }

    let compname=ComponentsChildren[i].getAttribute("compname")
    let deviceID=ComponentsChildren[i].getAttribute("deviceID")
    let deviceName=ComponentsChildren[i].getAttribute("deviceName")
    let isMouseOverTip=ComponentsChildren[i].getAttribute("isMouseOverTip")

    let x=ComponentsChildren[i].getAttribute("x")
    let y=ComponentsChildren[i].getAttribute("y")
    // 文字以paramid标识
    let paramID=ComponentsChildren[i].getAttribute("paramID")
    //20001 63
    let deviceParam=deviceID+paramID
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
    // var clonedrawText=document.createElement('span')
    //匹配大背景图片
    if(group==="map"){
      imageSource='/'+$rootScope.serPath+'/static/retailers/'+$rootScope.gcID.toLowerCase()+'/'+ComponentsChildren[i].getAttribute("source")
      width=!width?ConfigWidth:width
      // console.log(width,"width")
      // console.log("aaaaa")
      height=!height?ConfigHeight:height
      let simg = new Image();
      simg.src=imageSource
      // console.log(simg.src)
      $(simg).css({
        cursor:'pointer',
        position:'absolute',
        left:x+"px",
        top:y+"px",
        width:width,
        height:height
      })
      document.querySelector("#readSVG").appendChild(simg)
    }


    //图片====================================
    if(!ComponentsChildren[i].getAttribute("text")) {
      if(group!=="map"){
      // imgnum++
      // console.log(imgnum)
      // var simg=svg.image(imageSource,x,y,width,height)
      var simg = new Image()
      simg.src = imageSource
      // console.log(simg.src)
      $(simg).css({
        cursor: 'pointer',
        position: 'absolute',
        left: x + "px",
        top: y + "px",
        width: width,
        height: height
      })
      //	能不加就不加
      if (rotate) {
        $(simg).css({
          transformOrigin:"0% 0%",
          transform:"rotate("+rotate+"deg)",
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
      //   // }
      // })
      // .mouseout(function () {
      //   // $("#infoDiv")
      //   //   .css("display","none")
      // })
      //添加ID
      //是设备图片

      document.querySelector("#readSVG").appendChild(simg)
      if (deviceID && group === "deviceComp") {
          deviceID="d"+deviceID
          simg.setAttribute('id', deviceID)
          deviceIDArray.push(deviceID.toString().substr(1))



      }else if(deviceID &&group === "commonComp"){
        deviceID="c"+deviceID
        simg.setAttribute('id', deviceID)
			}
        //======================================================添加id,速度,数量
        getImgNum(deviceID, nodename, imageSource)
        drawRunAndAlarm(deviceID, nodename, cptArray, x, y, scaleX, scaleY, svg, imageSource, simg)
        //=================================
        $(simg).css('display','block')
        $(simg).click(function (e) {

          //  弹窗
          if (e.target.getAttribute("isPop")) {
            //弹窗类型
            let mouseEvent = ""
            let clickObj={}
            // console.log("aaaaaaaaaaaaaa")
            switch (e.target.getAttribute("popType")) {
              //  视频
              case "video":
                mouseEvent = "video"
                clickObj.deviceID=e.target.getAttribute("id").substr(1)
                clickObj.popType = "video"
                // console.log(clickObj)
                window.$rootScope.$broadcast('SELECTED_BINDDEVICE_COMP',clickObj);
                // cjbindCompMouseMove(deviceID)
                // console.log("videooooooooooo")
                break;
              //空调
              case "redirect":
                mouseEvent = "redirect"
                break;
              //门禁管理
              case "list":
                mouseEvent = "list"
                // deviceID = 1390069
                // getJSON(deviceID,x,y,width,height,ConfigHeight,ConfigWidth,mouseEvent)
                break;
              //  CO探测器
              case "line":
                mouseEvent = "line"
                break;
              //  温度探测器
              case "chart":
                mouseEvent = "chart";
                break;
              //  退出按钮
              case "btn":
                mouseEvent = "btn";
                break;
              //消防摄像机
              case "videoSub":
                mouseEvent = "videoSub";
                break;
              //客流黄色按钮
              case "yBtn":
                mouseEvent = "yBtn";
                break;
              //  客流橙色按钮
              case "oBtn":
                mouseEvent = "oBtn";
                break;
              //客流红色按钮
              case "rBtn":
                mouseEvent = "rBtn";
                break;
              //方法按钮
              case "funcBtn":
                mouseEvent = "funcBtn";
                break;


            }

          }
        })
        //click===========end
        $(simg).mouseover(function (e) {
          //鼠标悬停有事件
          if(isMouseOverTip || e.target.getAttribute("isToolTip")==='true'){
            let clickObj={}
            //改变数据
            clickObj.mouseX=parseInt($(e.target).css("left"))
            clickObj.mouseY=parseInt($(e.target).css("top"))
            // console.log(x,y,"x，y")
            clickObj.deviceID=e.target.getAttribute("id").substr(1)
            // console.log(clickObj.deviceID,"clickObj.deviceID")
            // hasOwnProperty('isToolTip')
            if(isMouseOverTip){
              clickObj.isMouseOverTip='true'
            }
            if(e.target.getAttribute("isToolTip")==='true'){
              clickObj.isToolTip='true'
            }
            window.$rootScope.$broadcast('MOUSEMOVE_BINDDEVICE_COMP',clickObj);
          }
        })
          .mouseout(function (e) {
            window.$rootScope.$broadcast('MOUSE_OUT_BINDDEVICE_COMP');
          })




      //device commonComp================================

    }
    }
    //==========else
    //如果是要绘制文字的话===========================================
    else{
      let color=ComponentsChildren[i].getAttribute("color")
      let contentBackgroundColor=ComponentsChildren[i].getAttribute("contentBackgroundColor")
      let contentBackgroundAlpha=ComponentsChildren[i].getAttribute("contentBackgroundAlpha")
			color=color.toString()
      color=color.indexOf("#")===-1?colorTransformation(parseInt(color)):color
      if(contentBackgroundColor){
        contentBackgroundColor=contentBackgroundColor.indexOf("#")===-1?colorTransformation(parseInt(contentBackgroundColor)):contentBackgroundColor

      }
      // console.log(contentBackgroundColor)
      let fontFamily=ComponentsChildren[i].getAttribute("fontFamily")
      //优先绘制黑色背景框
      // if(fontFamily==="digifaw" || (parseInt(contentBackgroundAlpha)===1 && parseInt(contentBackgroundColor)===0)){
      //   svg.rect(x, y, width?width-5:40, height?height:20).attr({
      //     "fill": "black"
      //   })
      // }
      // svg.rect(x, y, width, height).attr({
      //       "fill": "#"+contentBackgroundColor
      //     })

      let fontWeight=ComponentsChildren[i].getAttribute("fontWeight")
      // var textX=parseInt(x)+parseInt(width?width-5:40)/2
      let textX=parseInt(x)
      // var textY=parseInt(y)+parseInt(height?height:20)/2
      let textY=parseInt(y)
      let text=ComponentsChildren[i].getAttribute("text")
      //绘制文字
      var drawText=document.createElement('span')
      drawText.innerText=text
      $(drawText).css({
        "font-size":fontSize+"px",
        "text-align":textAlign,
        cursor:'pointer',
        color:'#'+color,
        'text-anchor':'middle',
        'font-family':fontFamily,
        'font-weight':fontWeight,
        position:'absolute',
        left:textX+"px",
        top:textY+"px",
        backgroundColor:'#'+contentBackgroundColor
      })
      // drawText.attr({
      //   "font-size":fontSize+"px",
      //   "text-align":textAlign,
      //   cursor:'pointer',
      //   'fill':color,
      //   'text-anchor':'middle',
      //   'font-family':fontFamily,
      //   'font-weight':fontWeight
      // })
      //给文字加id
      // drawText.node.setAttribute("deviceId",deviceID)
      // drawText.node.setAttribute("paramId",paramID)

      if(deviceID){
        drawText.setAttribute("deviceId",deviceID)
      }
      if(paramID){
        drawText.setAttribute("paramId",paramID)
      }
      // $("#readSVG")[0].appendChild(drawText)
      document.querySelector("#readSVG").appendChild(drawText)

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
  }
  //=============循环

  //设置画布的属性
  // var svgEle=document.querySelector("svg")
  // svgEle.style.border="1px red solid"
  //居中
  // svgEle.style.left='50%'
  // svgEle.style.top='50%'
  // svgEle.style.marginLeft="-"+parseInt(ConfigWidth)/2+"px"
  // svgEle.style.marginTop="-"+parseInt(ConfigHeight)/2+"px"
  // paperLeft=parseInt($("#readSVG").css("width"))/2-parseInt(ConfigWidth)/2
  // paperTop=parseInt($("#readSVG").css("height"))/2-parseInt(ConfigHeight)/2
  // var children=svgEle.childNodes
}

//缩放
// function scale(r) {
//   var readSVG=$("#readSVG")
//   // $(document.body).css("-ms-transform","scale("+r+")")
//   readSVG.css("-ms-transform","scale("+r+")")
//   $(window).resize(function() {
//     // $(document.body).css("-ms-transform","scale("+r+")")
//     readSVG.css("-ms-transform","scale("+r+")")
//   })
// }

//滚轮滚动
// function mouseWheel() {
//   var r=1
//   window.addEventListener("mousewheel",function(event){
//     event.delta = event.wheelDelta /120
//     //1为向上滚动，放大
//     if(event.delta===1){
//       r+=0.1
//     }else if(event.delta===-1){
//       r-=0.1
//     }
//     // scale(r)
//   },false)
//   // dragSVG()
// 	// console.log("drag")
// }

//拖拽画布
// function dragSVG() {
//   var readSVG=document.querySelector("#readSVG")
//   readSVG.onmousedown=function (event) {
//     readSVG.setCapture && readSVG.setCapture()
//     event=event || window.event
//     //求div的偏移量
//     var ol=event.clientX - readSVG.offsetLeft
//     var ot=event.clientY-readSVG.offsetTop
//     document.onmousemove=function (event) {
//       // console.log("onmousemove")
//       event=event || window.event
//       var mouseLeft=event.clientX
//       var mouseTop=event.clientY
//       var divLeft=mouseLeft-ol
//       var divTop=mouseTop-ot
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

// function getJSON(deviceID,x,y,width,height,ConfigHeight,ConfigWidth) {
//   var $infoDiv= $("#infoDiv")
//   $infoDiv.empty();//清空内容
//   var tbody= document.createElement('tbody');
//   tbody.className = 'infoTr';
//   tbody.innerHTML="<tr><td>设备</td><td>位置</td><td>参数</td><td>参数值</td></tr>"
//   //ajax======================
//   var param={}
//   var httpUrl
//   param.gcID='JSCZJTWY'
//   param.device=deviceID.toString()
//   httpUrl=$rootScope.reqPath+'/configurationService/getDeviceParam?falg='+Math.random()
//   //请求
//   $.ajax({
//     type:'get',
//     // type:'post',
//     url:httpUrl,
//     data:{'str':JSON.stringify(param) },
//     success:function (data) {
//       data=JSON.parse(data)
//       // console.log(data)
//       for(var j=0,groups=data.result,n=groups.length;j<n;j++){
//         tbody.innerHTML+="<tr><td>"+groups[j].deviceName+"</td><td>位置</td><td>"+groups[j].paramName+"</td><td>"+groups[j].statusEnValue+"</td></tr>"
//         $infoDiv[0].appendChild(tbody)
//       }
//     },
//     error:function (err) {
//     }
//   })
//   //=========================
//
//   //让显示框不出画布
//   var showHeight=parseInt(y)+parseInt(height)+10+parseInt(svgTop)+parseInt(paperTop)
//   var showWidth=parseInt(x)+parseInt(width)+10+parseInt(svgLeft)+parseInt(paperLeft)
//   var cha1=showHeight+parseInt($infoDiv.css("height"))-parseInt(paperTop)-ConfigHeight
//   var cha2=showWidth+parseInt($infoDiv.css("width"))-parseInt(paperLeft)-ConfigWidth
//   if(cha1>0 && cha2>0){
//     $infoDiv
//       .css("left",showWidth-cha2+"px")
//       .css("top",showHeight-cha1+"px")
//       .css("display","block")
//   } else if(cha1>0 && cha2<=0)
//   {
//     $infoDiv
//       .css("left",showWidth+"px")
//       .css("top",showHeight-cha1+"px")
//       .css("display","block")
//
//   }else if(cha1<=0 && cha2>0){
//     $infoDiv
//       .css("left",showWidth-cha2+"px")
//       .css("top",showHeight+"px")
//       .css("display","block")
//   }
//   else{
//     //显示栏
//     $infoDiv
//     //位置
//       .css("left",showWidth+"px")
//       .css("top",showHeight+"px")
//       .css("display","block")
//   }
//
//
//
// }

//画配置图片
function drawRunAndAlarm(deviceID,nodename,cptArray,x,y,scaleX,scaleY,svg,trueImgSource,simg) {
// console.log(document.getElementById(deviceID))
// console.log(cptArray,"cptArray")
	//读取配置文件
  //在添加好图片的基础上再去添加它的运行，报警图片
  //背景是bg的，画新的alarm
  //背景是alarm的，不用画
  // if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID+deviceID) && document.getElementById(deviceID).getAttribute("href").indexOf("alarm")===-1) {
  if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID+deviceID) && document.getElementById(deviceID).getAttribute("src").indexOf("alarm")===-1) {
    if (cptArray[nodename]) {

      //有的图是用alarm画的，有alarm就不画报警图了
      if (cptArray[nodename]["alarm"]["imgSource"] && trueImgSource.indexOf("alarm") === -1) {
        //添加XCXY的地址
        let imgSource ='/'+$rootScope.serPath+'/static/'+cptArray[nodename]["alarm"]["imgSource"]
        let imgX = parseInt(cptArray[nodename]["alarm"]["imgX"]) * parseFloat(scaleX) + parseInt(x)
        let imgY = parseInt(cptArray[nodename]["alarm"]["imgY"]) * parseFloat(scaleY) + parseInt(y)
        let imgWidth = parseInt(cptArray[nodename]["alarm"]["imgWidth"]) * parseFloat(scaleX)
        let imgHeight = parseInt(cptArray[nodename]["alarm"]["imgHeight"]) * parseFloat(scaleY)
        //画图
        // var imgRun = svg.image(imgSource, imgX, imgY, imgWidth, imgHeight)
					// .attr({
           //  cursor: 'pointer',
          // })
        let imgRun = new Image();
        imgRun.src=imgSource
        // drawText.attr({
        $(imgRun).css({
          cursor:'pointer',
          position:'absolute',
          left:imgX+"px",
          top:imgY+"px",
          width:imgWidth,
          height:imgHeight
        })

        // imgRun.node.setAttribute("id", deviceID + deviceID + deviceID)
        imgRun.setAttribute("id", deviceID + deviceID + deviceID)
        document.querySelector("#readSVG").appendChild(imgRun)
      }
    }
  }
  //=====================画报警图end
  // console.log($("#"+deviceID))
  //防止重新绘画=====================
  if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID)){
  // if($("#"+deviceID) && !$("#"+deviceID+deviceID)){
  //   console.log("aaaaa")
  	// if($("#"+deviceID) && !$("#"+deviceID+deviceID)){
    if(cptArray[nodename]) {
      //run
      if (cptArray[nodename]["running"]["imgSource"]) {
        let imgSource ='/'+$rootScope.serPath+'/static/'+cptArray[nodename]["running"]["imgSource"]
        let imgX = parseInt(cptArray[nodename]["running"]["imgX"]) * parseFloat(scaleX) + parseInt(x)
        let imgY = parseInt(cptArray[nodename]["running"]["imgY"]) * parseFloat(scaleY) + parseInt(y)
        let imgWidth = parseInt(cptArray[nodename]["running"]["imgWidth"]) * parseFloat(scaleX)
        let imgHeight = parseInt(cptArray[nodename]["running"]["imgHeight"]) * parseFloat(scaleY)
        //画图
        // var imgRun = svg.image(imgSource, imgX, imgY, imgWidth, imgHeight)
        //   .attr({
        //     cursor: 'pointer',
        //   })
        // imgRun.node.setAttribute("id", deviceID + deviceID)
        let imgRun = new Image()
        imgRun.src=imgSource
        // drawText.attr({
        $(imgRun).css({
          cursor:'pointer',
          position:'absolute',
          left:imgX+"px",
          top:imgY+"px",
          width:imgWidth,
          height:imgHeight
        })
      
        imgRun.setAttribute("id", deviceID + deviceID)
        document.querySelector("#readSVG").appendChild(imgRun)
      }
    //  run===end============
      //  设置悬浮，点击属性==================
      if (cptArray[nodename]["mouseEvent"]) {
        // console.log(cptArray[nodename]["mouseEvent"])
        let isPop=cptArray[nodename]["mouseEvent"]["isPop"]
        let popType=cptArray[nodename]["mouseEvent"]["popType"]
        let isToolTip=cptArray[nodename]["mouseEvent"]["isToolTip"]
        // console.log(isPop)
        //设置mouse属性
        //不能删除！
        if(isPop){
          // simg.node.setAttribute('isPop',"true")
          simg.setAttribute('isPop',"true")
          // simg.node.setAttribute('popType',popType)
          simg.setAttribute('popType',popType)
					// console.log("aaaaa")
        }
        if(isToolTip){
          // simg.node.setAttribute('isToolTip',"true")
          simg.setAttribute('isToolTip',"true")
        }
      }


    }
  }
//======================

}

//鼠标点击悬浮从后台获取的数据
function jsonStatus(address) {
  //注意清空
  jsonAlarmIDArray=[]
  jsonRunIDArray=[]
  jsonTextArray=[]
  let param={}
  // let httpUrl
  param.gcID='JSCZJTWY'
  param.device=deviceIDArray.toString()
  // httpUrl='http://192.168.1.15:8888/XYCloudService/configurationService/getDeviceParam?falg='+Math.random()
  // httpUrl=address
  // $rootScope.reqPath+'/configurationService/getDeviceParam'+'?flag='+Math.random()
  //请求
  $.ajax({
    type:'get',
    // type:'post',
    url:address,
    data:{'str':JSON.stringify(param) },
    success:function (data) {
      // data="{\"result\":[{\"deviceTypeID\":64,\"statusValue\":\"1\",\"paramName\":\"视频设备状态\",\"deviceID\":640086,\"deviceName\":\"13.6:一层9号楼梯入口\",\"statusEnValue\":\"正常\",\"handAutoMode\":0,\"alarmValue\":0,\"parentDeviceID\":null,\"location\":\"JK-1A-KK10\",\"isControl\":0,\"paramOder\":1,\"paramID\":2,\"isAnlog\":1}],\"errorID\":0,\"errorString\":\"\"}"
      data=JSON.parse(data)
      // console.log(data)
      for(let j=0,groups=data.result,n=groups.length;j<n;j++){
        //===================alarm
        if (groups[j].paramID === 2 && groups[j].statusValue === "1") {
          let id = groups[j].deviceID
          jsonAlarmIDArray.push("d"+id)
          // console.log(jsonAlarmIDArray,'jsonAlarmIDArray')
        }else
        //运行，即动画
        //=============run
        if (groups[j].paramID === 1 && groups[j].statusValue === "1") {
          let id = groups[j].deviceID
          jsonRunIDArray.push("d"+id)
					// console.log(jsonRunIDArray,'jsonRunIDArray')
        }

        // if(groups[j].paramID === 63 && groups[j].deviceID===30005){
        //   jsonTextArray.push(groups[j].statusEnValue)
        // }

        // for(var i=0,m=textParamArray.length;i<m;i++){
        //   if (groups[j].paramID+'' === textParamArray[i]+'' && groups[j].deviceID+'' === textDeviceArray[i]+'') {
        //     jsonTextArray.push(textParamArray[i])
        //     break;
        //   }
        // }


      }
    },
    error:function (err) {
    }
  })
}

function analysisCompoentsOne() {
  let compoentsArray={}
  // console.log("aaa")
  let xmlFileName='/'+$rootScope.serPath+'/static/assets/comp/data/Components.xml'
  let xmlDoc
  //IE
  if((/Trident\/7\./).test(navigator.userAgent)){
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }else{
    xmlDoc=document.implementation.createDocument("","",null);
  }
  xmlDoc.async=false
  xmlDoc.load(xmlFileName)
  // var Components=xmlDoc.documentElement
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

  return compoentsArray
}

//获取图片数量
function getImgNum(deviceID,nodeName,imageSource) {
  //转动数量
  var runNum = 3
  //转动速率
  var runSpeed = 80
  var alarmSpeed = 910
  var alarmNum=1
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
    // nodeName==="LQB" ||
		nodeName==="RQGL" ||
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
		// console.log(deviceID,'imageSource')
  }else{
    alarmIDArray.push(deviceID+deviceID+deviceID)
  }
  alarmSpeedArray.push(alarmSpeed)
  alarmNumArray.push(alarmNum)

  nodeNameArray.push(nodeName)
}

//运行和报警和绘制文字=============
function runAndAlarm(address) {
  let aa = 2
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
    jsonStatus(address)
    // console.log(jsonTextArray)
    //根据json绘制文字
    // if(group.deviceID===parseInt(deviceID) && group.paramID===parseInt(paramID) ) {
    //   drawTextArray[0].attr({text: jsonTextArray[0]})
    // console.log(drawTextArray[0]);
    //   return false
    // }


    //绘制文字=============================

    //=================
    //alarm===================
    // console.log(alarmIDArray)
    for(let i=0,n=jsonAlarmIDArray.length;i<n;i++){
      // console.log(jsonAlarmIDArray[i])
      for(let j=0,m=alarmIDArray.length;j<m;j++){
        // console.log(alarmIDArray[i],"alarmIDArray[i]")
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
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/"+alarmnum+".png")
							console.log(id,'alarmNumArrayid')
              $("#"+id)[0].setAttribute("src",'/'+$rootScope.serPath+'/static/'+"assets/comp/" + nodeNameArray[j] + "/alarm/1/"+alarmnum+".png")
              alarmnum++
              timerAlarm.push(setTimeout(funcTimeAlarmOne,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmOne()

          }else{
            function funcTimeAlarmTwo() {
              if(alarmnumOne>1) {
                alarmnumOne =0
              }
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // $("#"+id)[0].setAttribute("src","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // console.log($("#"+id)[0])
              $("#"+id)[0].setAttribute("src",'/'+$rootScope.serPath+'/static/'+"assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/1.png")
              alarmnumOne++
              timerAlarm.push(setTimeout(funcTimeAlarmTwo,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmTwo()
          }
          //=======================
          //符合条件就break
          break;
        }


        else if((jsonAlarmIDArray[i]+""+jsonAlarmIDArray[i]+""+jsonAlarmIDArray[i]+"")===alarmIDArray[j]+""){
          let alarmnum=8
          let id=alarmIDArray[j]
          let realJ=j
          let alarmnumOne=0
          if(alarmNumArray[j]===1){
            function funcTimeAlarmThree() {
              if(alarmnumOne>1) {
                alarmnumOne =0
              }
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // $("#"+id)[0].setAttribute("src","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // console.log(id,'id')
              $("#"+id)[0].setAttribute("src",'/'+$rootScope.serPath+'/static/'+"assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
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
              // $("#" + id)[0].setAttribute("href", "assets/comp/" + nodeNameArray[realJ] + "/alarm/1/" + alarmnum + ".png")
              // $("#" + id)[0].setAttribute("src", "assets/comp/" + nodeNameArray[realJ] + "/alarm/1/" + alarmnum + ".png")
              $("#" + id)[0].setAttribute("src", '/'+$rootScope.serPath+'/static/'+"assets/comp/" + nodeNameArray[realJ] + "/alarm/1/" + alarmnum + ".png")
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
            // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[realJ] + "/runing/1/" + runnum + ".png")
            // $("#"+id)[0].setAttribute("src","assets/comp/" + nodeNameArray[realJ] + "/runing/1/" + runnum + ".png")
            $("#"+id)[0].setAttribute("src",'/'+$rootScope.serPath+'/static/'+"assets/comp/" + nodeNameArray[realJ] + "/runing/1/" + runnum + ".png")
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

