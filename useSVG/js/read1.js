window.onload=function () {
  // console.log(parseInt("-180"))
  analysisXML()
  scale()

  $("#readSVG").on("click",function (e) {




  })

}

/*
* 解析导出的xml文件
* */
function analysisXML() {
  // let xmlFileName="../lyxtxtjgtOne.xml";
  let xmlFileName="../lyxtxtjgt.xml";
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
  let svg=new Raphael(document.querySelector("#readSVG"),ConfigWidth, ConfigHeight);

  let LIST=xmlDoc.documentElement.childNodes[0]
  let Components=xmlDoc.documentElement.childNodes[1]

  // console.log(Configration.nodeName)
  let ComponentsChildren=Components.childNodes
  //一共两个List Components
  // console.log(ComponentsChildren.length)
  // console.log(Components.nodeName)
  //改变图片
  var changImg=false

  for (let i=0;i<ComponentsChildren.length;i++)
  // for (let i=4;i<ComponentsChildren.length;i++)
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
    var handAuto=new Array()
    var hzStatus=new Array()
    var inStress=new Array()


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
      if(ComponentsChildren[i].getAttribute("color")==="#00FF00"){
        svg.rect(x, y, width-5, height).attr({
          // "stroke": "red",
          "fill": "black"
        })
      }
      let color=ComponentsChildren[i].getAttribute("color")
      let fontFamily=ComponentsChildren[i].getAttribute("fontFamily")
      let fontWeight=ComponentsChildren[i].getAttribute("fontWeight")
      let textX=parseInt(x)+parseInt(width)/2
      let textY=parseInt(y)+parseInt(height)/2
      let text=ComponentsChildren[i].getAttribute("text")

      // drawText(svg,textX,textY,text,fontSize,textAlign,color,fontFamily,fontWeight)
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


      if(mark==="LSJ"){
        setInterval(function () {

          //创建随机数
          let lt0=parseInt(Math.random()*25+15)
          let lt2=parseInt(Math.random()*25+15)
          let lt3=parseInt(Math.random()*25+15)
          switch(paramID){
            case "160":drawText.attr({text: lt0});break;
            case "162":drawText.attr({text: lt2});break;
            case "163":drawText.attr({text: lt3});break;
          }

        }, 3000);
      }
      //=============================
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
            case "2000363":drawText.attr({text: lb3});hzStatus[20003]=lb3;console.log(lb3);showLb3(lb3,lb3img);break;
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



        }, 3000);
      }

    }
    //===========上面是文字
    else{

      // console.log(isMouseOverTip)

     let simg=svg.image(imageSource,x,y,width,height)
       .attr({cursor:'pointer',
         'transform':'r'+rotate+','+x+','+y,
       })

       .click(function (e) {
         // console.log("aaaaaa")
         //切换成自动
         if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/0/1.png"){
           e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/1/1.png")
           handAuto[deviceID]=true
           // console.log(handAuto[deviceID])

         }
         //切换成手动
         else if(param==="handAuto" && e.target.getAttribute("href")==="assets/comp/HANDAUTO/handAuto/1/1.png"){
           e.target.setAttribute("href","assets/comp/HANDAUTO/handAuto/0/1.png")
           handAuto[deviceID]=false
         }
       })
       .mouseover(function (e) {
         if(isMouseOverTip){
           //显示栏
           $("#infoDiv")
             .css("left",(parseInt(x)+parseInt(width)+10)+"px")
             .css("top",(parseInt(y)+parseInt(height)+10)+"px")
             .css("display","block")
           //改变数据
           $("#deviceName").text(deviceName)
           $("#handAuto").text(handAuto[deviceID]?"自动":"手动")
           $("#hzStatus") .text(hzStatus[deviceID])
           $("#inStress") .text(inStress[deviceID])
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

      //改变图片状态================
      // setInterval(function () {
      //     if(changImg){
      //       console.log(x)
      //       console.log(deviceID)
      //     }
      //
      // },1000)
      
      
      if(isMouseOverTip && changImg && deviceName==="大商业3#冷却泵"){
     //    svg.image("assets/comp/LQB/alarm/1/9.png",x,y,width,height)
     //    .attr({cursor:'pointer',
     //    'transform':'r'+rotate+','+x+','+y,
     //    })
     //    console.log("aaa")
      }else{
     //    svg.image("assets/comp/LQB/alarm/0/1.png",x,y,width,height)
     //    .attr({cursor:'pointer',
     //    'transform':'r'+rotate+','+x+','+y,
     // })
      }


      //绘制旋转动画
      if(mark==="LQT"){
        let i=1
      //   setInterval(function () {
      //     // i=i+1
      //     i=i+3
      //     // if(i===11){
      //     if(i===10){
      //     i=1
      //   }
      //   // svg.image("assets/comp/LQT7/runing1/1/"+i+".png",x,y,parseInt(width)*parseInt(scaleX),parseInt(height)*parseInt(scaleY))
      //   svg.image("assets/comp/LQT7/runing1/1/"+i+".png",x,y,parseInt(width),parseInt(height))
      //     .attr({cursor:'pointer'
      //     })
      //   console.log(i)
      //
      // }, 50);
/*
        function frame() {
          // i=i+1
          i=i+2
          if(i===11){
            i=1
          }
          svg.image("assets/comp/LQT7/runing1/1/"+i+".png",x,y,parseInt(width)*parseFloat(scaleX)*1.8,parseInt(height)*parseFloat(scaleY)/2.3)
            .attr({cursor:'pointer'
            })
          requestAnimationFrame(frame)
        }
        frame()
*/

      }
      //============上面风扇



     }
     //==========else

  }
  //=============循环


  let svgEle=document.querySelector("svg")
  svgEle.style.border="1px red solid"
  let children=svgEle.childNodes
  // console.log(children[2])
  // setInterval(function () {
  //   //创建随机数
  //   num1=parseInt(Math.random()*500)
  //   num2=parseInt(Math.random()*500)
  //   num3=parseInt(Math.random()*500)
  //   num4=parseInt(Math.random()*500)
  //   //0~100,50以上报警
  //   temp1=parseInt(Math.random()*100)
  //   temp2=parseInt(Math.random()*100)
  //   temp3=parseInt(Math.random()*100)
  //   temp4=parseInt(Math.random()*100)
  //
  //   if(temp1>50){
  //     children[6].style.display="none";
  //   }else{
  //     children[6].style.display="block";
  //   }
  //   if(temp2>50){
  //     children[7].style.display="none";
  //   }else{
  //     children[7].style.display="block";
  //   }
  //   if(temp3>50){
  //     children[8].style.display="none";
  //   }else{
  //     children[8].style.display="block";
  //   }
  //   if(temp4>50){
  //     children[9].style.display="none";
  //   }else{
  //     children[9].style.display="block";
  //   }
  //
  // }, 5000);
  
  
}
//============解析xml
//缩放
function scale() {
  let r = document.body.offsetWidth / window.screen.availWidth;
  $(document.body).css("-ms-transform","scale("+r+")");

  $(window).resize(function() {
    let r = document.body.offsetWidth / window.screen.availWidth;
    $(document.body).css("-ms-transform","scale("+r+")");
  });
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

function runTime() {
  let i=0
  setInterval(function () {
    i++
    $("#runTime").text(i)
  },1000)

}

function showLb3(lb3,lb3img) {
  if(lb3>60){
    lb3img.node.setAttribute('display','block')
    $("#20003").css("display","none")
    // document.querySelector("#20003").style.display="none";
  }
  else{
    $("#20003").css("display","block")
    // console.log(lb3img)
    lb3img.node.setAttribute('display','none')
    // document.querySelector("#20003").style.display="block";
  }
}











