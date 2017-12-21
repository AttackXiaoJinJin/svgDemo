window.onload=function () {
  analysisXML()



}

/*
* 解析导出的xml文件
* */
function analysisXML() {
  let xmlFileName="../svgDemo.xml";
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
  console.log(Configration)
  let ConfigWidth=Configration.getAttribute("Width")
  // console.log(ConfigWidth)
  let ConfigHeight=Configration.getAttribute("Height")
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
  {
    // console.log()
    let nodename=ComponentsChildren[i].nodeName
    // console.log(nodename)
    let group=ComponentsChildren[i].getAttribute("group")
    let image=null
    // let imageSource=null
    // let compname=ComponentsChildren[i].getAttribute("compName")
    //  imgwidth=null,imgheight=null
    // if(componentChildren[i].getAttribute("width") && componentChildren[i].getAttribute("height")){
     let width=ComponentsChildren[i].getAttribute("width")
     let height=ComponentsChildren[i].getAttribute("height")
     let compname=ComponentsChildren[i].getAttribute("compname")
    // }
    // console.log(componentChildren[i].nodeName)
    //如果BSHX有子节点Image
    // if(componentChildren[i].childNodes[0]){
    //   image=componentChildren[i].childNodes[0]
    //   imageSource=componentChildren[i].childNodes[0].getAttribute("source")
    //   // console.log(imageSource)
    // }else{
     let imageSource=ComponentsChildren[i].getAttribute("source")
      // console.log(imageSource)
    // }
     let x=ComponentsChildren[i].getAttribute("x")
     let y=ComponentsChildren[i].getAttribute("y")

     svg.image(imageSource,x,y,width,height)
       .attr({cursor:'pointer'})
    
     console.log(ComponentsChildren[i].getAttribute("compname"))



    // switch(group){
    //   case "deviceComp":$("#deviceComp").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
    //   case "commonComp":$("#commonComp").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
    //   case "bg":$("#bg").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
    //   case "tuli":$("#tuli").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
    //   case "pipe":$("#pipe").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
    //   case "spetial":$("#spetial").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
    //   // case "deviceComp":$("#deviceComp").append($("<li><img src='"+imageSource+"' width='68px' height='80px'/></li>"))
    //   // case "deviceComp":$("#deviceComp").append($("<li><img src='"+imageSource+"' width='68px' height='80px'/></li>"))
    // }
  }
}
//============解析xml









