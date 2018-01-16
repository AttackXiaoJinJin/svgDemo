//全局变量
var svgLeft=0
var svgTop=0
var paperLeft=0
var paperTop=0
var jsonData=null

window.onload=function () {
  let svg=null
  mouseWheel()
  let cptArray=analysisCompoentsOne()
  analysisXML(svg,cptArray)
  // analysisCompoents("a","a")

}

/*
* 解析导出的xml文件
* */
function analysisXML(svg,cptArray) {
  // let xmlFileName="../lyxtxtjgtOne.xml";
  // let xmlFileName="../0.xml"
  // let xmlFileName="../19.xml"
  // let xmlFileName="../20.xml"
  // let xmlFileName="../readhot.xml"
  // let xmlFileName="../3.xml"
  // let xmlFileName="../22.xml"
  // let xmlFileName="../23.xml"
  // let xmlFileName="../24.xml"
  // let xmlFileName="../1.xml"
  // let xmlFileName="../2.xml"
  let xmlFileName="../0.xml"

  let xmlDoc
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
  //创建svg画布
  svg=new Raphael(document.querySelector("#readSVG"),ConfigWidth, ConfigHeight);
  dragSVG(svg)
  let LIST=xmlDoc.documentElement.childNodes[0]
  let LISTImage=LIST.childNodes[1]
  let LISTImageChildren=LISTImage.childNodes
  // console.log(LISTImage.childNodes.length)
  let Components=xmlDoc.documentElement.childNodes[1]
  let ComponentsChildren=Components.childNodes
  //改变图片
  var changImg=false
  //优化循环
  for (let i=0,m=ComponentsChildren.length;i<m;i++)
  {
    let imageSource=ComponentsChildren[i].getAttribute("source")
    //如果没有source就从listimg中寻找
    if(!imageSource){
      for(let j=0,n=LISTImageChildren.length;j<n;j++){
        if(ComponentsChildren[i].nodeName===LISTImageChildren[j].nodeName){
          imageSource=LISTImageChildren[j].getAttribute("source")
        }
      }
    }
    let nodename=ComponentsChildren[i].nodeName

    // console.log(nodename)
    let group=ComponentsChildren[i].getAttribute("group")
    let image=null
    let width=ComponentsChildren[i].getAttribute("width")
    let height=ComponentsChildren[i].getAttribute("height")
    // console.log(width)
    // console.log(height)
    //匹配大背景图片
    if(group==="map"){
      width=ConfigWidth
      height=ConfigHeight
    }

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
      color=color.indexOf("#")===-1?colorTransformation(parseInt(color)):color
      let fontFamily=ComponentsChildren[i].getAttribute("fontFamily")
      //优先绘制黑色背景框
      if(fontFamily==="digifaw"){
        svg.rect(x, y, width?width-5:40, height?height:20).attr({
          "fill": "black"
        })

      }

      let fontWeight=ComponentsChildren[i].getAttribute("fontWeight")
      let textX=parseInt(x)+parseInt(width?width-5:40)/2
      let textY=parseInt(y)+parseInt(height?height:20)/2
      let text=ComponentsChildren[i].getAttribute("text")
      //绘制文字
      let drawText=svg.text(textX,textY,text)
        drawText.attr({
          "font-size":fontSize+"px",
          "text-align":textAlign,
          cursor:'pointer',
          'fill':color,
          'text-anchor':'middle',
          'font-family':fontFamily,
          'font-weight':fontWeight
        })
      //给文字加id
      drawText.node.setAttribute("deviceId",deviceID)
      drawText.node.setAttribute("paramId",paramID)
      // console.log(deviceID)
      //根据json绘制文字
      $.getJSON("../json/cold1.json", function(data) {
        $.each(data.result, function (key,group) {
          $.each(group, function (key, val) {
            if(group.deviceID===parseInt(deviceID) && group.paramID===parseInt(paramID) ) {
              drawText.attr({text: group.statusEnValue})
              return false
            }
          })
        })
      })

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
         // //切换成自动
         if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/0/1.png"){
           e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/1/1.png")
           handAuto[deviceID]=true
         }
         // //切换成手动
         else if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/1/1.png"){
           e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/0/1.png")
           handAuto[deviceID]=false
         }

       })
       .mouseover(function (e) {
       // .mouseenter(function (e) {
         // time = (new Date()).getTime();
         // console.log(time)
         //鼠标悬停有事件
         if(isMouseOverTip){
           // console.log(deviceID)
           //改变数据
           // $("#deviceName").text(deviceName)
           $("#handAuto").text(handAuto[deviceID]?"自动":"手动")
           // $("#hzStatus").text(hzStatus[deviceID])
           // $("#inStress").text(inStress[deviceID])
           getJSON("../json/cold1.json",deviceID,x,y,width,height,ConfigHeight,ConfigWidth)
           // console.log(parseInt(x)+parseInt(width)+10+parseInt(svgLeft)+parseInt(paperLeft))
         }
       })
       .mouseout(function () {
         $("#infoDiv")
           .css("display","none")
       })

      //添加ID
      //是设备图片
      if(group==="deviceComp"){

        simg.node.setAttribute('id',deviceID)
        simg.node.setAttribute('display','block')
        let runNum=3
        let runSpeed=80
        let alarmNum=16
        // console.log(getImgNum(nodename,runNum,runSpeed,alarmNum))
        let allRun=getImgNum(nodename,runNum,runSpeed,alarmNum)



          //读取json
          // jsonStatus("../json/cold1.json",deviceID,nodename,allRun.runNum,allRun.runSpeed,allRun.alarmNum,cptArray,x,y,scaleX,scaleY,svg,imageSource)
          jsonStatus("../json/cold2.json",deviceID,nodename,allRun.runNum,allRun.runSpeed,allRun.alarmNum,cptArray,x,y,scaleX,scaleY,svg,imageSource)


      }

       //显示运行时间
      // runTime()

     }
     //==========else
  }
  //=============循环

  //设置画布的属性
  let svgEle=document.querySelector("svg")
  svgEle.style.border="1px red solid"
  //居中
  svgEle.style.left='50%'
  svgEle.style.top='50%'
  svgEle.style.marginLeft="-"+parseInt(ConfigWidth)/2+"px"
  svgEle.style.marginTop="-"+parseInt(ConfigHeight)/2+"px"
  paperLeft=parseInt($("#readSVG").css("width"))/2-parseInt(ConfigWidth)/2
  paperTop=parseInt($("#readSVG").css("height"))/2-parseInt(ConfigHeight)/2
// console.log($("#readSVG").css("height"))
// console.log(ConfigHeight)

  let children=svgEle.childNodes
}
//============解析xml

//缩放

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

function getJSON(address,deviceID,x,y,width,height,ConfigHeight,ConfigWidth) {
  let $infoDiv= $("#infoDiv")
  $infoDiv.empty();//清空内容
  // let tbody.innerHTML=""
  let tbody= document.createElement('tbody');
  tbody.className = 'infoTr';
  // let tbody.innerHTML=
  tbody.innerHTML="<tr><td>设备</td><td>位置</td><td>参数</td><td>参数值</td></tr>"
  
  $.getJSON(address, function(data) {
    $.each(data.result,function(i,group){
      $.each(group,function (key,val) {
        //获取鼠标悬浮的设备
        if(val===parseInt(deviceID)){
          tbody.innerHTML+="<tr><td>"+group.deviceName+"</td><td>位置</td><td>参数</td><td>"+group.statusEnValue+"</td></tr>"
          // switch(group.paramID){
            // case 1:tbody.innerHTML+="<tr><td>"+group.deviceName+"</td>"
            //   +"<td>位置</td><td>运行状态</td><td>"+group.statusEnValue+"</td></tr>";break;
            // case 115:tbody.innerHTML+="压缩机运行小时数";break;
            // case 160:tbody.innerHTML+="冷冻水供水温度";break;
            // case 161:tbody.innerHTML+="冷却水供水温度";break;
            // case 162:tbody.innerHTML+="冷冻水回水温度";break;
            // case 163:tbody.innerHTML+="冷却水回水温度";break;
            // case 17:tbody.innerHTML+="本日运行时间";break;
            // case 171:tbody.innerHTML+="压缩机运行电流百分比";break;
            // case 2:tbody.innerHTML+="报警状态";break;
            // case 201:tbody.innerHTML+="冷机运行时间";break;
            // case 203:tbody.innerHTML+="总运行时间";break;
            // case 253:tbody.innerHTML+="冷冻水出水温度设定值";break;
            // case 69:tbody.innerHTML+="冷凝压力";break;
            // case 70:tbody.innerHTML+="蒸发压力";break;
            // case 11:tbody.innerHTML+="启停控制";break;
            // //大商业冷却泵
            // case 16:tbody.innerHTML+="工作频率低于下限故障报警";break;
            // case 38:tbody.innerHTML+="手自动状态";break;
            // case 62:tbody.innerHTML+="出口分支管压力反馈（bars）";break;
            // case 63:tbody.innerHTML+="频率反馈（Hz）";break;
            // case 659:tbody.innerHTML+="进水压力反馈（bars）";break;
            // case 422:tbody.innerHTML+="风机频率反馈";break;
            // case 50:tbody.innerHTML+="冷却塔出水温度低于冷机保护";break;
            // case 653:tbody.innerHTML+="冷却塔风机工作频率低于下限";break;
          // }
          //================switch
          // tbody.innerHTML+="</td><td>"+group.statusEnValue+"</td></tr>"
          //运行，即动画
          // console.log(group.paramID,group.statusValue)
          return false;
        }
        //==id
      })
    })

    $infoDiv[0].appendChild(tbody)
    //让显示框不出画布
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

  })
  //ajax
}

function jsonStatus(address,deviceID,nodename,runNum,runSpeed,alarmNum,cptArray,x,y,scaleX,scaleY,svg,trueImgSource) {
  // console.log("bbb")
  // let jsonArray={}
  $.getJSON(address, function(data) {
    $.each(data.result,function(i,group){
    // let deciceID=
    //   jsonArray[deviceID]["paramID"]={}
    //   jsonArray[deviceID]["statusValue"]={}
      $.each(group,function (key,val) {

        // jsonArray[group.deviceID]={}
        // jsonArray[group.deviceID]["paramID"]=group.paraID
        // jsonArray[group.deviceID]["statusValue"]=group.statusValue
        //获取鼠标悬浮的设备
        if(val===parseInt(deviceID)){
          //===================alarm
          if(group.paramID===2 && group.statusValue ==="1" ){
            //读取配置文件
            //在添加好图片的基础上再去添加它的运行，报警图片
            // analysisCompoents(nodename,svg,x,y,scaleX,scaleY,deviceID)
            if(cptArray[nodename]){
              //有的图是用alarm画的，有alarm就不画报警图了
              if(cptArray[nodename]["alarm"] && trueImgSource.indexOf("alarm")===-1){
                let imgSource=cptArray[nodename]["alarm"]["imgSource"]
                let imgX=parseInt(cptArray[nodename]["alarm"]["imgX"])*parseFloat(scaleX)+parseInt(x)
                let imgY=parseInt(cptArray[nodename]["alarm"]["imgY"])*parseFloat(scaleY)+parseInt(y)
                let imgWidth=parseInt(cptArray[nodename]["alarm"]["imgWidth"])*parseFloat(scaleX)
                let imgHeight=parseInt(cptArray[nodename]["alarm"]["imgHeight"])*parseFloat(scaleY)
                //画图
                let imgRun=svg.image(imgSource,imgX,imgY,imgWidth,imgHeight)
                  .attr({cursor:'pointer',
                  })
                imgRun.node.setAttribute("id",deviceID+deviceID+deviceID)
              }
            }
            clearInterval(bb)
            let j=1
            //==============================
            if($("#"+deviceID+deviceID+deviceID)[0]){
              if(alarmNum===1){
                $("#"+deviceID+deviceID+deviceID)[0].href.baseVal="assets/comp/"+nodename+"/alarm/1/1.png"
              }else{
                var bb=setInterval(function () {
                  j++
                  if(j>alarmNum){
                    j=1
                  }
                  $("#"+deviceID+deviceID+deviceID)[0].href.baseVal="assets/comp/"+nodename+"/alarm/1/"+j+".png"
                },runSpeed)
              }
            }else{
              if(alarmNum===1){
                $("#"+deviceID)[0].href.baseVal="assets/comp/"+nodename+"/alarm/1/1.png"
              }else{
                var bb=setInterval(function () {
                  j++
                  if(j>alarmNum){
                    j=1
                  }
                  $("#"+deviceID)[0].href.baseVal="assets/comp/"+nodename+"/alarm/1/"+j+".png"
                },runSpeed)
              }
            }
            //======================
            /*
            function frame4() {
              j=j+1
              if(j===13){
                j=5
              }
              // if($("#"+deviceID+deviceID+deviceID)[0]){
              //   $("#"+deviceID+deviceID+deviceID)[0].href.baseVal="assets/comp/"+nodeName+"/alarm/1/"+j+".png"
              // }else{
                $("#"+deviceID)[0].href.baseVal="assets/comp/"+nodeName+"/alarm/1/"+j+".png"
              // }

              requestAnimationFrame(frame4)
            }
            frame4()
            */
            //==========================

          }
          else
          //运行，即动画
          // console.log(group.paramID,group.statusValue)
          //=============run
          if(group.paramID===1 && group.statusValue ==="1" ){
            if(cptArray[nodename]) {
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
            }
            clearInterval(aa)
            let i=1
            // //================================
            var aa=setInterval(function () {
              i=i+1
              if(i>runNum){
                i=1
              }
              $("#"+deviceID+deviceID)[0].href.baseVal="assets/comp/"+nodename+"/runing/1/"+i+".png"
            },runSpeed)

            //===================================
            //frame====================================
            /*
            function frame3() {
              i=i+1
              if(i===5){
                i=1
              }
              $("#"+deviceID+deviceID)[0].href.baseVal="assets/comp/"+nodeName+"/runing/1/"+i+".png"
              requestAnimationFrame(frame3)
            }
            frame3()
            */
            //=======================================
          }

          return false;
        }
        // ==id

    })

  })
    })

  // console.log(jsonArray)
  // return jsonArray
}


//十进制颜色转换为十六进制
function colorTransformation(colorStr){
  colorStr = colorStr.toString(16);
 let colorLen = colorStr.length;
  // if(colorLen===6){
  //   colorStr = colorStr;
  // }
  if(colorLen===5){
    colorStr = '#0'+colorStr;
  }else if(colorLen===4){
    colorStr = '#00'+colorStr;
  }else if(colorLen===3){
    colorStr = '#000'+colorStr;
  }else if(colorLen===2){
    colorStr = '#0000'+colorStr;
  }
  return colorStr.toString();
}


function analysisCompoents(nodeName,svg,x,y,scaleX,scaleY,deviceID) {
  let compoentsArray=[]
  console.log("aaa")
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
    let childName=ComponentChildren[i].nodeName
    let child=ComponentChildren[i].childNodes
    if(nodeName===childName && child){
      //读取除第一个子节点的图片，如运行和报警
      for(let j=1,n=child.length;j<n;j++){
        let imgSource=child[j].getAttribute("source")
        // let imgX=parseInt(child[j].getAttribute("x"))+parseInt(x)
        let imgX=parseInt(child[j].getAttribute("x"))*parseFloat(scaleX)+parseInt(x)
        let imgY=parseInt(child[j].getAttribute("y"))*parseFloat(scaleY)+parseInt(y)
        let imgWidth=parseInt(child[j].getAttribute("width"))*parseFloat(scaleX)
        let imgHeight=parseInt(child[j].getAttribute("height"))*parseFloat(scaleY)
        //画图
        let imgRun=svg.image(imgSource,imgX,imgY,imgWidth,imgHeight)
        // let imgRun=svg.image(imgSource,imgX,imgY,width,height)
          .attr({cursor:'pointer',
          })
        if(child[j].getAttribute("param")==="runing"){
          imgRun.node.setAttribute("id",deviceID+deviceID)
        }else if(child[j].getAttribute("param")==="alarm"){
          imgRun.node.setAttribute("id",deviceID+deviceID+deviceID)
        }
      }
    }
  }
}

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

    compoentsArray[childName]={}
    compoentsArray[childName]["running"]={}
    compoentsArray[childName]["alarm"]={}
    //节点名下的孩子
    let child=ComponentChildren[i].childNodes
    if(child){
      // console.log(childName)
      //读取除第一个子节点的图片，如运行和报警
      for(let j=0,n=child.length;j<n;j++){

        // if(childName==="LQT7"){
        //   console.log(childName,child[j].getAttribute("param")==="runing")
        // }

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
function getImgNum(nodeName,runNum,runSpeed,alarmNum) {
  //定义对象
  // let allRun={}
  //转动数量
  runNum = 3;
  //转动速率
  runSpeed = 80;
  if(nodeName.indexOf('LQT')>-1){
    runNum = 10;
    runSpeed = 40;
  }else if(nodeName.indexOf('LQB')>-1){
    runNum = 3;
    runSpeed = 80;
  }else if(nodeName.indexOf('LGJZ')>-1){
    runNum = 12;
    runSpeed = 90;
  }else if(nodeName.indexOf('LXJZ')>-1){
    runNum = 5;
    runSpeed = 60;
  }
  if(nodeName==="BSB2" || nodeName==="BSB1" ||
     nodeName==="DRFM" || nodeName==="EAF" ||
     nodeName==="EAF1" || nodeName==="EAF2" ||
     nodeName==="FPG" || nodeName==="PWB" ||
     nodeName==="PWB1" || nodeName==="RGSHU" ||
     nodeName==="LQB" || nodeName==="RQGL" ||
     nodeName==="SAF" || nodeName==="SAF1" ||
     nodeName==="SAF2"){
    alarmNum=16
    // console.log(alarmNum)
  }else{
    alarmNum=1
  }
  return {"runNum":runNum,
          "runSpeed":runSpeed,
          "alarmNum":alarmNum}
}




