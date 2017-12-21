window.onload=function () {
  // console.log(parseInt("-180"))
  analysisXML()
  scale()


}

/*
* 解析导出的xml文件
* */
function analysisXML() {
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
  // console.log(ConfigWidth)
  let ConfigHeight=Configration.getAttribute("Height")
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


  for (let i=0;i<ComponentsChildren.length;i++)
  // for (let i=4;i<ComponentsChildren.length;i++)
  {
    // console.log()
    let nodename=ComponentsChildren[i].nodeName
    // console.log(nodename)
    let group=ComponentsChildren[i].getAttribute("group")
    let image=null
    let width=0,height=0
    if(ComponentsChildren[i].getAttribute("scaleX")){
      width=parseInt(ComponentsChildren[i].getAttribute("width"))*parseFloat(ComponentsChildren[i].getAttribute("scaleX"))
      // console.log(width)
    }else{
      width=ComponentsChildren[i].getAttribute("width")
    }
    if(ComponentsChildren[i].getAttribute("scaleY")){
      height=parseInt(ComponentsChildren[i].getAttribute("height"))*parseFloat(ComponentsChildren[i].getAttribute("scaleY"))
      // console.log(height)
    }else{
      height=ComponentsChildren[i].getAttribute("height")
    }


     let compname=ComponentsChildren[i].getAttribute("compname")
     let deviceID=ComponentsChildren[i].getAttribute("deviceID")
     let imageSource=ComponentsChildren[i].getAttribute("source")
     let x=ComponentsChildren[i].getAttribute("x")
     let y=ComponentsChildren[i].getAttribute("y")
     let rotate=0
       if(ComponentsChildren[i].getAttribute("rotation")){
        rotate=parseInt(ComponentsChildren[i].getAttribute("rotation"))
       }

      console.log(rotate)

     // svg.image(imageSource,x,y,width,height)
     svg.image(imageSource,x,y,width,height)
       .attr({cursor:'pointer',
         'transform':'R'+rotate
       })
       .mouseover(function (e) {
         $("#compname").text(compname)
         // switch (deviceID){
         //   case "1":$("#temp").text(temp1);$("#num").text(num1);break;
         //   case "2":$("#temp").text(temp2);$("#num").text(num2);break;
         //   case "3":$("#temp").text(temp3);$("#num").text(num3);break;
         //   case "4":$("#temp").text(temp4);$("#num").text(num4);break;
         //   case "5":$("#temp").text(temp1);$("#num").text(num1);break;
         //   case "6":$("#temp").text(temp2);$("#num").text(num2);break;
         //   case "7":$("#temp").text(temp3);$("#num").text(num3);break;
         //   case "8":$("#temp").text(temp4);$("#num").text(num4);break;
         // }

         // console.log(e.target)

         
       //   $("#infoDiv")
       //     .css("left",(parseInt(x)+parseInt(width)+10)+"px")
       //     .css("top",(parseInt(y)+parseInt(height)+10)+"px")
       //     .css("display","block")
       //
       })
       .mouseout(function () {
         $("#infoDiv")
           .css("display","none")
       })



     // console.log(ComponentsChildren[i].getAttribute("compname"))
  }
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

function scale() {
  let r = document.body.offsetWidth / window.screen.availWidth;
  $(document.body).css("-ms-transform","scale(" + r + ")");

  $(window).resize(function() {
    let r = document.body.offsetWidth / window.screen.availWidth;
    $(document.body).css("-ms-transform","scale(" + r + ")");
  });
}















