window.onload=function () {
  /*
  *解析xml
  **/
  analysisXML()

  let systemEvent=null
  $("#system").on("click",function (e) {
      // console.log(e.target.nodeName.toLowerCase())
      // console.log(e.target.parentNode.nodeName.toLowerCase())
    //第一个ul
    if(e.target.nodeName.toLowerCase()==="i") {

      // if()
      //为父元素div添加背景颜色
      // e.target.parentNode

      //只要有i就一定有父元素div
      if(e.target.parentNode.parentNode.children[1]){
        // console.log(e.target.parentNode.parentNode.children[1].nodeName)
        //i的父元素div
        systemEvent=e.target.parentNode
        let parent=e.target.parentNode.parentNode
        //自身的图标变换
        $(e.target.parentNode.firstChild).toggleClass("left_i_right")
        $(e.target.parentNode.children[1]).toggleClass("left_file_open")
        //下一个div切换类
        //显示或隐藏
        for(let i=1;i<parent.children.length;i++){
          $(parent.children[i]).toggleClass("leftHide").css("margin-left","13px")
        }

      }
    }else if(e.target.nodeName.toLowerCase()==="div") {
      if (e.target.parentNode.children[1]) {
        systemEvent=e.target
        let parent=e.target.parentNode
        // console.log(parent.children[1].nodeName)
        $(e.target.firstChild).toggleClass("left_i_right")
        $(e.target.children[1]).toggleClass("left_file_open")
        for(let i=1;i<parent.children.length;i++) {
          $(parent.children[i]).toggleClass("leftHide").css("margin-left","13px")

        }
      }
    }else if(e.target.nodeName.toLowerCase()==="p"){
      systemEvent=e.target
    }

  })

  //添加节点按钮
  $("#addBtn").on("click",function () {
    if(systemEvent){

    }

  })



  $(".leftOne").each(function()
  {
    $(this).on("mouseover",function () {
      $(this).css("cursor","pointer").css("backgroundColor","#D1D1D1")
    })
    $(this).on("mouseout",function () {
      $(this).css("backgroundColor","")
    })
  });
  
  //===========================

  //设置z-index属性
  let zIndex=1
  //选中的焦点图形
  let selected=null
  //选中右边图形列表的某个图片
  let rightSelect=null
  //组件名称
  let compname=null
  let mainname=null
  let group=null
  //左边和上边的工具栏占的位置
  //屏幕适配，暂时不做
  let gongjuLeft=125
  let gongjuTop=30

  //创建画布
  let paper=null
    // paper = new Raphael(document.getElementById("middle"),1800, 600);
  //在元素中创建Raphael对象
  paper =new Raphael(document.querySelector("#middleMid"),1265, 670);
  // console.log(paper)
  //选中焦点图片
  $("svg").on("click",function (e) {
    // console.log(e.target)
    selected=e.target
    // console.log(selected)
    if( selected.nodeName==="image" && !selected.getAttribute("z-index")){
      selected.setAttribute("z-index",zIndex++)
    }
    //是pic到input,是由内向外显示的值
    $("#changeWidth").val(selected.getAttribute("width"))
    $("#changeHeight").val(selected.getAttribute("height"))
    //底部的信息
    $("#componentName").text(selected.getAttribute("compname"))
    // console.log()
    //外面的矩形边框
    let box=selected.getBBox()
    // let rect=paper.rect(box.x, box.y, box.width, box.height).attr({
    //   "stroke": "red"
    // });

  })

  //选中右侧图片
  $("#rightTabContent").on("mousedown",function (e) {
    // console.log(rightSelect.nodeName.toLowerCase())
    if(e.target.nodeName.toLowerCase()==="img"){
      rightSelect=e.target

      // console.log(rightSelect.getAttribute("compname"))
    }
  })


  // console.log("bbbbbbbbbbb")
  //为每个li绑定拖拽元素
    $(".tool_part").each(function()
    {
      $(this).draggable({helper:"clone",cursor:'move'})
      // console.log("fffff")
    });
    //为middletopright绑定事件
    $(".middleTopRight").each(function()
    {
      $(this).on("mouseover",function () {
        $(this).css("cursor","pointer").css("backgroundColor","#D1D1D1")
      })
      $(this).on("mouseout",function () {
        $(this).css("backgroundColor","")
      })
    });

    $("#middleMid").droppable({
      accept:".tool_part",
      drop:function(event,ui)
      {

        //绘制图片
        drawSvg(ui.helper.attr("class").slice(0,9),event.clientX,event.clientY)
        let lastChild=event.target.childNodes[0].lastChild
        lastChild.setAttribute("compname",compname)
        lastChild.setAttribute("mainname",mainname)
        lastChild.setAttribute("group",group)


      }
    });

    //绘制svg图片
  function drawSvg(className,x,y)
  {
    /*
   *绘制
   */
    if("tool_part"===className)
    {
      // let width=1428
      let width=null
      if(rightSelect.getAttribute("imgwidth") && rightSelect.getAttribute("imgwidth")!=="null"){
      // if(rightSelect.getAttribute("imgwidth")){
        width=rightSelect.getAttribute("imgwidth")
        // console.log(rightSelect.getAttribute("imgwidth")+"aaaaa")
      }else{
        width=rightSelect.naturalWidth
        // console.log(rightSelect.naturalWidth+"bbbb")
      }
      // let height=436
      let height=null
      if(rightSelect.getAttribute("imgheight") && rightSelect.getAttribute("imgheight")!=="null"){
      // if(rightSelect.getAttribute("imgheight")){
        height=rightSelect.getAttribute("imgheight")
      }else{
        height=rightSelect.naturalHeight
        // console.log(height)
      }
      //设置组件名称
      if(rightSelect.getAttribute("compname") && rightSelect.getAttribute("compname")!=="null"){
        compname=rightSelect.getAttribute("compname")
      }
      if(rightSelect.getAttribute("mainname") && rightSelect.getAttribute("mainname")!=="null"){
        mainname=rightSelect.getAttribute("mainname")
      }
      if(rightSelect.getAttribute("group") && rightSelect.getAttribute("group")!=="null"){
        group=rightSelect.getAttribute("group")
      }

      // let all = paper.image("../image/all.png",x,y,width,height)
      let all = paper.image(rightSelect.getAttribute("src"),x-gongjuLeft-width/2,y-gongjuTop-height/2,width,height)
        .attr({cursor:'pointer'})
        .drag(function(){
          myMove()
        },
          function(){
          myStart()
          }
        );
      let moveX,moveY,mouseLeft,mouseTop,picLeft,picTop,goLeft,goTop;
      let myStart = function()
      {
        //一开始就画一个矩形，之后就是移动它而不是重复画它
        //鼠标刚开始点击时的鼠标的坐标（相对于middleMid即svg坐标系）
        mouseLeft=event.clientX-gongjuLeft
        mouseTop=event.clientY-gongjuTop
        //图片相对于svg坐标系的位置
        picLeft=all.attrs.x
        picTop=all.attrs.y
        goLeft=mouseLeft-picLeft
        goTop=mouseTop-picTop
        //pic相对于鼠标的偏移量
        //鼠标的横纵坐标永远比pic左上角的坐标大
      }
      let myMove = function()
      {
        mouseLeft=event.clientX-gongjuLeft
        mouseTop=event.clientY-gongjuTop
        // let event=event || window.event
        //1428 436
        //先定位鼠标到图片的左上角
        moveX =mouseLeft-goLeft ;
        moveY =mouseTop-goTop ;
        all.attr({x:moveX,y:moveY});
        // rect.attr({x:moveX,y:moveY});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)
      }
      //通过input去改变图片的属性值
      $("#middleTopLeftUl").on('input',function (e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
          //终止
          return
        }
        let handle = e.target
        whrota(handle)
      })
    }
  }

  /*
  * 宽、高、旋转
  * */
  function whrota(handle) {
    if (selected.nodeName === "image") {
      //获取焦点选中的图片
      switch (handle.name) {
        case "width":
          selected.setAttribute("width", handle.value);
          break;
        case "height":
          selected.setAttribute("height", handle.value);
          break;
        case "rotate":
          selected.setAttribute(
            "transform",
            "matrix(" +
            Math.cos(2 * Math.PI / 360 * handle.value).toFixed(4) +
            "," +
            Math.sin(2 * Math.PI / 360 * handle.value).toFixed(4) +
            "," +
            (-1) * Math.sin(2 * Math.PI / 360 * handle.value).toFixed(4) +
            "," +
            Math.cos(2 * Math.PI / 360 * handle.value).toFixed(4) +
            "," +
            0 +
            "," +
            0 +
            ")")
          break;
      }
    }
  }



  /*
  * 通过滚轮去旋转
  * */
  //暂时不考虑FF
/*
  let scrollFunc=function(e){
    e = e || window.event;
    // let rotateInput = $("#rotate")
    let rotateInput = document.getElementById("rotate")
    if (e.wheelDelta) {//IE/Opera/Chrome
      rotateInput.value = e.wheelDelta;
    }
    else if (e.detail) {
      //Firefox
      //IE11
      rotateInput.value = e.detail;
      // console.log(rotateInput.value)
    }else if(e.deltaY){
      // console.log("ccccc")
      rotateInput.value = e.deltaY;
    }
  }
  $("#rotate").on("mousescroll",function (e) {
    // W3C
    if(document.addEventListener){
      document.addEventListener('DOMMouseScroll',scrollFunc,false);
      // console.log("dddddddddddd")
    }
    //IE/Opera/Chrome
    window.onmousewheel=document.onmousewheel=scrollFunc;
    // console.log("eeeeeeeeeeee")
  })
*/

  /*
  * 删除
  * */
  //通过中上的删除去删除
  $(".icon-delete").on('click',function (e) {
    // if(confirm("确定删除此元素？"))
    // {
    // console.log(all.id)
    // let id = all.id;
    // if(document.getElementById(id+"all"))
    // {
    //   $("#"+id+"all").css('display','none');
    //   $("#"+id+"all").remove();
    // }
    // rect.remove()
    //
    //   all.remove()
    // console.log(e)
    if(selected.nodeName==="image"){
      //移除svg下的image
      // 兼容ie11
      if((/Trident\/7\./).test(navigator.userAgent)){
        selected.parentNode.removeChild(selected)
      }else{
        selected.remove()
      }
    }

  })

  /*
  * 向上一层
  * */
  $(".icon-toup").on('click',function (e) {
    if(selected.nextSibling && selected.nextSibling.nodeName==="image"){
      //2,3,4,5,6,7,8....
      selected.nextSibling.setAttribute("z-index",parseInt(selected.nextSibling.getAttribute("z-index"))-1)
      selected.setAttribute("z-index",parseInt(selected.getAttribute("z-index"))+1)
      // console.log("向上一层")
      SVG_Z_Index( selected.parentNode.childNodes );
    }

  })
//===================向上一层
  /*
  * 向下一层
  * */
  $(".icon-todown").on('click',function (e) {
    // if( !selected.previousSibling.getAttribute("z-index") || parseInt(selected.getAttribute("z-index"))===1  ){
    if( !selected.previousSibling.getAttribute("z-index") && selected.previousSibling.nodeName!=="image"){
      return
    }else{
      selected.previousSibling.setAttribute("z-index",parseInt(selected.previousSibling.getAttribute("z-index"))+1)
      selected.setAttribute("z-index",parseInt(selected.getAttribute("z-index"))-1)
      SVG_Z_Index( selected.parentNode.childNodes);
      // console.log("向下一层")
    }

  })

  /*
  *置顶
  * */
  $(".icon-totop").on('click',function (e) {
    // console.log(selected.parentNode.lastChild.getAttribute("z-index"))
    if(selected.parentNode.lastChild && selected.parentNode.lastChild.nodeName==="image"){
      selected.setAttribute("z-index",parseInt(selected.parentNode.lastChild.getAttribute("z-index"))+1)
      SVG_Z_Index( selected.parentNode.childNodes);
    }

    // console.log("置顶")
  })
  /*
  * 置底
  * */
  $(".icon-tobottom").on('click',function (e) {
    if(selected.parentNode.childNodes[2] && selected.parentNode.childNodes[2].nodeName==="image"){
      selected.setAttribute("z-index",parseInt(selected.parentNode.childNodes[2].getAttribute("z-index"))-1)
      SVG_Z_Index( selected.parentNode.childNodes);
      // console.log(selected.parentNode.childNodes[2])
    }

  })


  
  /*
  * 读取xml
  * */
  $(".icon-save").on('click',function (e) {




  })


  /*
   * 解析SVG元素z-index属性，并根据其值定义元素的层级
   * 规则：z-index越大，层级越高
   *
   * @param {elements} elements 一个包含DOM节点的类数组对象或者数组
   * @return {void}
   */
  function SVG_Z_Index( elements ) {
    let elements_arr = [];
    // 遍历节点列表，初始化一些设置
    for( let i = 0, len = elements.length; i < len; i++ ) {
      //svg下的每一个子节点
      let elem = elements[ i ];
      // 某些类型的节点可能没有getAttribute属性，你也可以根据nodeType属性来判断
      // if( ! elem.getAttribute ) continue;

      // 递归子节点
      // if( elem.childNodes ) {
      //   SVG_ZIndex( elem.childNodes );
      // }
      // 如果元素没有z-index属性，则默认所有元素都处于第1级
      if( ! elem.getAttribute( "z-index" ) ) {
        elem.setAttribute( "z-index", 1 );
      }
      //将元素按顺序添加进数组中
      elements_arr.push( elem );
    }

    if( elements_arr.length === 0 ) return;

    // 根据z-index属性进行排序
    elements_arr.sort( function( e1, e2 ) {
      let z1 = e1.getAttribute( "z-index" );
      let z2 = e2.getAttribute( "z-index" );
      if( z1 === z2 ) {
        return 0;
      } else if( z1 < z2 ) {
        return -1;
      } else {
        return 1;
      }

    } );
    // 排序完成后，按顺序移动这些元素
    let parent = elements_arr[0] && elements_arr[0].parentNode;
    for( let i = 0, len = elements_arr.length; i < len; i++ ) {
      let elem = elements_arr[ i ];
      // 提示：appendChild里的elem节点如果在页面中已经存在
      // 那么表示这个节点从原来的地方移动到parent最后的地方，而不是以一个新节点插入
      parent.appendChild( elem );
    }
  }



/*显示下方表单
  */
/*
  //当前时间
  let newTime = (new Date).getTime();
//start文本
  function showStart(startId)
  {
    //在info下队生成的每个div遍历
    $("#info div").each(function()
    {
      //设置为不可见
      $(this).css('display','none');
    });
    //如果存在
    if(document.getElementById(startId+"start"))
    // if(document.querySelector("#"+startId+"start"))
    {
      //设置为可见
      $("#"+startId+"start").css('display',"block");
    }
    else
    {
      //新建菜单
      let htmlStr = "<div id="+startId+"start ><table style=text-align:center>"+
        "<tr><td > 属性： </td><td>权限设置</td></tr>"+
        "<tr><td>开始编号：<input type=text value="+startId+"start readOnly /></td><td>注解：<input type=text value='' /></td></tr>"+
        "</table></div>";
      $("#info").append(htmlStr);
      $("#"+startId+"start").css('display','block');
    }
  }
//end文本
  function showEnd(endId)
  {
    $("#info div").each(function()
    {
      $(this).css('display','none');
    });

    if(document.getElementById(endId+"end"))
    {
      $("#"+endId+"end").css('display',"block");
    }
    else
    {
      let htmlStr = "<div id="+endId+"end ><table style=text-align:center>"+
        "<tr><td > 属性： </td><td>权限设置</td></tr>"+
        "<tr><td>开始编号：<input type=text value="+endId+"end readOnly /></td><td>注解：<input type=text value='' /></td></tr>"+
        "</table></div>";
      $("#info").append(htmlStr);
      $("#"+endId+"end").css('display','block');
    }
  }
//task1文本
  function showTask1(task1Id,textId)
  {
    $("#info div").each(function()
    {
      $(this).css('display','none');
    });

    if(document.getElementById(task1Id+"task1"))
    {
      $("#"+task1Id+"task1").css('display',"block");
    }
    else
    {
      let htmlStr = "<div id="+task1Id+"task1 ><table style=text-align:center>"+
        "<tr><td > 属性： </td><td>权限设置</td></tr>"+
        "<tr><td>开始编号：<input type=text value="+task1Id+"task1 readOnly /></td><td>显示名称：<input type=text value='' onblur=javascript:changeText('"+textId+"') id="+textId+"text /></td></tr>"+
        "</table></div>";
      $("#info").append(htmlStr);
      $("#"+task1Id+"task1").css('display','block');
    }
  }
//year2013
//task1文本
  function showyear2013(year2013Id,textId)
  {
    $("#info div").each(function()
    {
      $(this).css('display','none');
    });

    if(document.getElementById(year2013Id+"year2013"))
    {
      $("#"+year2013Id+"year2013").css('display',"block");
    }
    else
    {
      let htmlStr = "<div id="+year2013Id+"year2013 ><table style=text-align:center>"+
        "<tr><td > 属性： </td><td>权限设置</td></tr>"+
        "<tr><td>开始编号：<input type=text value="+year2013Id+"year2013 readOnly /></td><td>显示名称：<input type=text value='' onblur=javascript:changeText('"+textId+"') id="+textId+"text /></td></tr>"+
        "</table></div>";
      $("#info").append(htmlStr);
      $("#"+year2013Id+"year2013").css('display','block');
    }
  }
//task3文本
  function showTask3(task3Id,textId)
  {
    $("#info div").each(function()
    {
      $(this).css('display','none');
    });

    if(document.getElementById(task3Id+"task3"))
    {
      $("#"+task3Id+"task3").css('display',"block");
    }
    else
    {
      let htmlStr = "<div id="+task3Id+"task3 ><table style=text-align:center>"+
        "<tr><td > 属性： </td><td>权限设置</td></tr>"+
        "<tr><td>开始编号：<input type=text value="+task3Id+"task3 readOnly /></td><td>显示名称：<input type=text value='' onblur=javascript:changeText('"+textId+"') id="+textId+"text /></td></tr>"+
        "</table></div>";
      $("#info").append(htmlStr);
      $("#"+task3Id+"task3").css('display','block');
    }
  }
//all文本
  function showall(allId)
  {
    $("#info div").each(function()
    {
      $(this).css('display','none');
    });

    if(document.getElementById(allId+"all"))
    {
      $("#"+allId+"all").css('display',"block");
    }
    else
    {
      let htmlStr = "<div id="+allId+"all ><table style=text-align:center>"+
        "<tr><td > 属性： </td><td>权限设置</td></tr>"+
        "<tr><td>开始编号：<input type=text value="+allId+"all readOnly /></td><td>注解：<input type=text value='' /></td></tr>"+
        "</table></div>";
      $("#info").append(htmlStr);
      $("#"+allId+"all").css('display','block');
    }
  }
*/
  /*
  *修改文本域内容
  */
  function changeText(text_id)
  {
    let text_value = document.getElementById(text_id+"text").value;
    let element = paper.getById(text_id);
    element.attr({
      text:text_value
    });
  }

  /*
  * 导出xml
  * */
  $(".icon-export").on("click",function () {
    /*
    **生成xml
    **/
    // console.log("aaaaa")
    let xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
    //创建两条处理指令     
    let newPI=xmlDoc.createProcessingInstruction("xml","version=\"1.0\" encoding=\"utf-8\"")
    //xml版本

    //创建根元素     
    let Configration=xmlDoc.createElement("Configration")
    //创建CDATA     
    //let newCD=xmlDoc.createCDATASection("This is a CDATASection node");     
    //xmlDoc.documentElement.appendChild(newCD);     

    //创建元素LIST,其子元素Component,Image
    let LIST=xmlDoc.createElement("LIST")
    let Components=xmlDoc.createElement("Components")
    let Component=xmlDoc.createElement("Component")
    let Image=xmlDoc.createElement("Image")

    xmlDoc.appendChild(newPI)
    xmlDoc.appendChild(Configration)

    Configration.appendChild(LIST)
    Configration.appendChild(Components)

    LIST.appendChild(Component)
    LIST.appendChild(Image)

    Configration.setAttribute("Width",$("svg").attr("width"))
    Configration.setAttribute("Height",$("svg").attr("height"))

    // console.log(document.querySelector("svg").childNodes)
    // console.log($("svg").children)
    let children=document.querySelector("svg").childNodes
    for(let i=0;i<children.length;i++){
      if(children[i].nodeName==="image"){
        let nodename=children[i].getAttribute("mainname")
        let source=children[i].getAttribute("href")
        let height=children[i].getAttribute("height")
        let width=children[i].getAttribute("width")
        let x=parseInt(children[i].getAttribute("x"))
        let y=parseInt(children[i].getAttribute("y"))
        let group=children[i].getAttribute("group")
        //components
        let bq2=xmlDoc.createElement(nodename)
        //component
        let bq1=xmlDoc.createElement(nodename)
        //image
        let bq3=xmlDoc.createElement(nodename)
        bq2.setAttribute("x",x)
        bq2.setAttribute("y",y)
        bq2.setAttribute("height",height)
        bq2.setAttribute("width",width)
        bq2.setAttribute("source",source)
        bq2.setAttribute("group",group)
        bq2.setAttribute("deviceID","")

        bq3.setAttribute("source",source)
        bq3.setAttribute("group",group)
        Components.appendChild(bq2);
        switch(group){
          //设备库
          case "deviceComp":
            Component.appendChild(bq1)
            break;
            //基本组件
          case "commonComp":
            Component.appendChild(bq1)
            break;
            //背景
          case "bg":
            Image.appendChild(bq3)
            break;
            //图例
          case "tuli":
            Image.appendChild(bq3)
            break;
            //管道
          case "pipe":
            Image.appendChild(bq3)
            break;
          //特殊设备
          case "spetial":
            Image.appendChild(bq3)

            break;
          // case "deviceComp":$("#deviceComp").append($("<li><img src='"+imageSource+"' width='68px' height='80px'/></li>"))
          // case "deviceComp":$("#deviceComp").append($("<li><img src='"+imageSource+"' width='68px' height='80px'/></li>"))

        }
      }
    }

    console.log(xmlDoc.xml);

    /*
    * 导出xml
    * */





    
  })






}
//===============window.onload

/*
* 解析xml文件
* */
function analysisXML() {
  let xmlFileName="../Components.xml";
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
  let component=xmlDoc.documentElement.childNodes[0]
  let componentChildren=component.childNodes
  // console.log(component.nodeName)
  // console.log(component.childNodes[3].nodeName)
  // console.log(component.childNodes.length)
  for (let i=1;i<componentChildren.length;i++)
  {
    // console.log()
    let nodename=componentChildren[i].nodeName
    // console.log(nodename)
    let group=componentChildren[i].getAttribute("group")
    let image=null
    let imageSource=null
    let compname=componentChildren[i].getAttribute("compName")
    let imgwidth=null,imgheight=null
      if(componentChildren[i].getAttribute("width") && componentChildren[i].getAttribute("height")){
        imgwidth=componentChildren[i].getAttribute("width")
        imgheight=componentChildren[i].getAttribute("height")
      }
    // console.log(componentChildren[i].nodeName)
    //如果BSHX有子节点Image
    if(componentChildren[i].childNodes[0]){
      image=componentChildren[i].childNodes[0]
      imageSource=componentChildren[i].childNodes[0].getAttribute("source")
      // console.log(imageSource)
    }else{
      imageSource=componentChildren[i].getAttribute("source")
      // console.log(imageSource)
    }

    switch(group){
      case "deviceComp":$("#deviceComp").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
      case "commonComp":$("#commonComp").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
      case "bg":$("#bg").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
      case "tuli":$("#tuli").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
      case "pipe":$("#pipe").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
      case "spetial":$("#spetial").append($("<li class='tool_part'><img src='"+imageSource+"' width='68px' height='80px' imgwidth='"+imgwidth+"' imgheight='"+imgheight+"' compname='"+compname+"' mainname='"+nodename+"' group='"+group+"'/></li>"));break;
      // case "deviceComp":$("#deviceComp").append($("<li><img src='"+imageSource+"' width='68px' height='80px'/></li>"))
      // case "deviceComp":$("#deviceComp").append($("<li><img src='"+imageSource+"' width='68px' height='80px'/></li>"))

    }

  }

// console.log("cccccccc")
}
//============解析xml














