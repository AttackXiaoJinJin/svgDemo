window.onload=function () {
  let shapeInfo={
    all:'width:1428,height:436'
  }

  let selected=null
  //左边和上边的工具栏占的位置
  let gongjuLeft=125
  let gongjuTop=30
  //创建画布
  let paper;
    // paper = new Raphael(document.getElementById("middle"),1800, 600);
  //在元素中创建Raphael对象
  paper =new Raphael(document.querySelector("#middleMid"),1265, 670);
  // console.log(paper)
  $("svg").on("click",function (e) {

    // console.log(e.target)
    selected=e.target
    console.log(selected)
    console.log(selected.getAttribute('width'))
    // $("#changeWidth").val(all.attrs.width)
    //是pic到input,是由内向外显示的值
    $("#changeWidth").val(selected.getAttribute("width"))
    $("#changeHeight").val(selected.getAttribute("height"))
    //外面的矩形边框
    let box=selected.getBBox()
    // let rect=paper.rect(box.x, box.y, box.width, box.height).attr({
    //   "stroke": "red"
    // });



  })
  
  //为每个li绑定拖拽元素
    $(".tool_part").each(function()
    {
      $(this).draggable({helper:"clone",cursor:'move'})
      
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
        // console.log(event)
        //绘制图片
        drawSvg(ui.helper.attr("type"),event.clientX,event.clientY);
        // drawSvg(ui.helper.attr("type"),event.clientX-24,event.clientY-24);
        // console.log(ui.helper)
        
      }
    });

    //绘制svg图片
  function drawSvg(tool_type,x,y)
  { 
    //绘制绿点
    if("green"===tool_type)
    {
      console.log(tool_type)
      //引用图片
      //          paper.image(src,x,y,width,height)
      // let start = paper.image("image/green.png",x-184,y-75,48,48)
      let start = paper.image("../image/green.png",x,y,19,19)
        //设置属性
        .attr({
          cursor:'pointer'
        })
        //设置拖拉属性
        .drag(
          function(){
            myMove()
          },
          function(){
            myStart()
          },
          function(){
            myEnd()
          });

      let moveX,moveY;
      //设置图片的id
      let startId = start.id;

      showStart(startId);
      let myStart = function()
      {
        moveX = event.clientX-24;
        moveY = event.clientY-24;
        console.log("startgreen")
        showStart(startId);
      }
      let myMove = function()
      {
        console.log("mymove")
        //让鼠标处于圆心
        //48 48
        moveX = event.clientX-24;
        // moveX = event.clientX-184;
        moveY = event.clientY-24;
        // moveY = event.clientY-75;
        start.attr({x:moveX});
        start.attr({y:moveY});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)


      }
      let myEnd = function()
      {
        // moveX = event.clientX-184;
        moveX = event.clientX-24;
        // moveY = event.clientY-75;
        moveY = event.clientY-24;
        start.attr({x:moveX});
        start.attr({y:moveY});
      }

      start.dblclick(function()
      {
        if(confirm("确定删除此元素？"))
        {
          console.log(start.id)
          let id = start.id;
          if(document.getElementById(id+"start"))
          {
            $("#"+id+"start").css('display','none');
            $("#"+id+"start").remove();
          }
          this.remove();
        }
        else{}
      });
    }
    //================================================green
    /*
    *绘制picexample
    */
    if("picexample"===tool_type)
    {
      console.log(tool_type)
      let end = paper.image("../image/picexample.png",x,y,235,133)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      let moveX,moveY;
      let endId = end.id;
      showEnd(endId);
      let myStart = function()
      {
        showEnd(endId);
      }
      let myMove = function()
      {
        //235 133
        moveX = event.clientX-117;
        moveY = event.clientY-66;
        end.attr({x:moveX});
        end.attr({y:moveY});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)

      }
      let myEnd = function()
      {
        moveX = event.clientX-117;
        moveY = event.clientY-66;
        end.attr({x:moveX});
        end.attr({y:moveY});
      }

      end.dblclick(function()
      {
        if(confirm("确定删除此元素？"))
        {

          console.log(end.id)
          let id = end.id;
          if(document.getElementById(id+"end"))
          {
            $("#"+id+"end").css('display','none');
            $("#"+id+"end").remove();
          }
          this.remove();
        }
        else{}
      });
    }
    /*
    **绘制红字
    */
    if("redman"===tool_type)
    {
      let redman = paper.image("../image/redman.png",x,y,53,16)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      // let realText = paper.text(x-140,y-50,'Task1').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showTask1(task1Id,realTextId);});
      let moveX,moveY;

      let redmanId = redman.id;
      // let realTextId = realText.id;
      // showTask1(task1Id,realTextId);

      let myMove = function()
      {
        //53 16
        moveX = event.clientX-26;
        moveY = event.clientY-8;
        // task1.attr({x:moveX});
        // task1.attr({y:moveY});
        // realText.attr({x:(moveX+task1.attr("width")/2)});
        // realText.attr({y:(moveY+task1.attr("height")/2)});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)

      }
      let myStart = function()
      {
        moveX = event.clientX-26;
        moveY = event.clientY-8;
        // showTask1(task1Id,realTextId);
      }
      let myEnd = function()
      {
        moveX = event.clientX-26;
        moveY = event.clientY-8;
        // task1.attr({x:moveX});
        // task1.attr({y:moveY});
      }
    }
    /*
   **绘制2013
   */
    if("year2013"===tool_type)
    {
      let year2013 = paper.image("../image/year2013.png",x,y,38,18)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      let realText = paper.text(x-140,y-50,'year2013').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showyear2013(year2013Id,realTextId);});
      let moveX,moveY;

      // let year2013Id = year2013.id;
      // let realTextId = realText.id;
      // showyear2013(year2013Id,realTextId);

      let myMove = function()
      {
        //38 18
        moveX = event.clientX-19;
        moveY = event.clientY-9;
        year2013.attr({x:moveX});
        year2013.attr({y:moveY});
        // realText.attr({x:(moveX+year2013.attr("width")/2)});
        // realText.attr({y:(moveY+year2013.attr("height")/2)});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)

      }
      let myStart = function()
      {
        moveX = event.clientX-19;
        moveY = event.clientY-9;
        // showyear2013(year2013Id,realTextId);
      }
      let myEnd = function()
      {
        moveX = event.clientX-19;
        moveY = event.clientY-9;
        year2013.attr({x:moveX});
        year2013.attr({y:moveY});
      }
    }
    /*
   **红点
   */
    if("red"===tool_type)
    {
      let year2013 = paper.image("../image/red.png",x,y,19,19)
        .attr({cursor:'pointer'})
        .drag(function(){
          myMove()
        },
          function(){
          myStart()
          },
          function(){
          myEnd()
        });
      // let realText = paper.text(x-,y-50,'year2013').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showyear2013(year2013Id,realTextId);});
      let moveX,moveY;

      let year2013Id = year2013.id;
      // let realTextId = realText.id;
      // showyear2013(year2013Id,realTextId);

      let myMove = function()
      {
        //19 19
        moveX = event.clientX-9;
        moveY = event.clientY-9;
        year2013.attr({x:moveX});
        year2013.attr({y:moveY});
        // realText.attr({x:(moveX+year2013.attr("width")/2)});
        // realText.attr({y:(moveY+year2013.attr("height")/2)});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)

      }
      let myStart = function()
      {
        moveX = event.clientX-9;
        moveY = event.clientY-9;
        // showyear2013(year2013Id,realTextId);
      }
      let myEnd = function()
      {
        moveX = event.clientX-9;
        moveY = event.clientY-9;
        year2013.attr({x:moveX});
        year2013.attr({y:moveY});
      }
    }
    /*
   **报警
   */
    if("baojing"===tool_type)
    {
      let year2013 = paper.image("../image/baojing.png",x,y,121,24)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      // let realText = paper.text(x-140,y-50,'year2013').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showyear2013(year2013Id,realTextId);});
      let moveX,moveY;

      // let year2013Id = year2013.id;
      // let realTextId = realText.id;
      // showyear2013(year2013Id,realTextId);

      let myMove = function()
      {
        //121,24
        moveX = event.clientX-60;
        moveY = event.clientY-12;
        year2013.attr({x:moveX});
        year2013.attr({y:moveY});
        // realText.attr({x:(moveX+year2013.attr("width")/2)});
        // realText.attr({y:(moveY+year2013.attr("height")/2)});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)

      }
      let myStart = function()
      {
        moveX = event.clientX;
        moveY = event.clientY;
        // showyear2013(year2013Id,realTextId);
      }
      let myEnd = function()
      {
        //121,24
        moveX = event.clientX-60;
        moveY = event.clientY-12;
        year2013.attr({x:moveX});
        year2013.attr({y:moveY});
      }
    }
    /*
    *绘制客流正常
    */
    if("zhengchang"===tool_type)
    {
      let task3 = paper.image("../image/zhengchang.png",x,y,125,27)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      // let realText = paper.text(x-140,y-50,'Task3').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showTask3(task3Id,realTextId);});
      let moveX,moveY;

      // let task3Id = task3.id;
      // let realTextId = realText.id;
      // showTask3(task3Id,realTextId);

      let myMove = function()
      {
        //125 27
        moveX = event.clientX-62;
        moveY = event.clientY-13;
        task3.attr({x:moveX});
        task3.attr({y:moveY});
        // realText.attr({x:(moveX+task3.attr("width")/2)});
        // realText.attr({y:(moveY+task3.attr("height")/2)});
        $("#moveX").val(moveX)
        $("#moveY").val(moveY)

      }
      let myStart = function()
      {
        moveX = event.clientX-62;
        moveY = event.clientY-13;
        // showTask3(task3Id,realTextId);
      }
      let myEnd = function()
      {
        moveX = event.clientX-62;
        moveY = event.clientY-13;
        task3.attr({x:moveX});
        task3.attr({y:moveY});
      }
    }
    //==============================================
    /*
   *绘制广场大图
   */
    if("all"===tool_type)
    {
      let width=1428
      let height=436
      // console.log(tool_type)
      let all = paper.image("../image/all.png",x,y,width,height)
        // .attr({cursor:'pointer'})
        // .attr({border:'1px red solid',boxSizing:'border-box'})
        .attr({cursor:'pointer'})
        .drag(function(){
          myMove()
        },
          function(){
          myStart()
          }
        //   ,
        //   function(){
        //   myEnd()
        // }
        );



        
      //获取矩形的中心
      let midX=all.attrs.width/2
      let midY=all.attrs.height/2
      // console.log(all)
      // console.log("这是all的offsetleft")
      let moveX,moveY,mouseLeft,mouseTop,picLeft,picTop,goLeft,goTop;

      // let allId = all.id;
      // showall(allId);
      let myStart = function()
      {
        //一开始就画一个矩形，之后就是移动它而不是重复画它

        // let event=event || window.event
        // moveX = event.clientX-714;
        // moveX = event.clientX-midX;
        // ol=event.offsetLeft -event.clientX;
        // moveY = event.clientY-218;
        // ot =event.offsetTop- event.clientY;
        // console.log(selected)
        // $("#changeWidth").val(all.attrs.width)
        // $("#changeHeight").val(all.attrs.height)
        // console.log($("#changeWidth").val())
        // console.log("这是start")
        // console.log(event)
        // console.log(ol)
        // console.log(ot)
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
        // console.log(all.attrs.x)
        // console.log(all.attrs.y)
        // console.log(mouseLeft+"mouseLeft")
        // console.log(mouseTop+"mouseTop")
        // console.log(goLeft+"goLeft")
        // console.log(goTop+"goTop")


        // showall(allId);
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
        // console.log("这是move")
        // console.log(moveX+"moveX")
        // console.log(moveY+"moveY")



      }
      // let myEnd = function()
      // {
      //   // moveX = event.clientX-714;
      //   moveX = event.clientX-midX;
      //   // moveY = event.clientY-218;
      //   moveY = event.clientY-midY;
      //   all.attr({x:moveX});
      //   all.attr({y:moveY});
      //
      //   console.log("这是end")
      // }

      //通过input去改变图片的属性值
      $("#middleTopLeftUl").on('input',function (e) {
        if(e.target.tagName.toLowerCase()!=='input'){
          //终止
          return
        }
        // console.log(e.target)
        let handle=e.target
        // console.log(handle.name)
        // console.log(handle.value)
        //获取焦点选中的图片
        switch(handle.name){
          // case "width":all.attr({width:handle.value});rect.attr({width:handle.value});break;
          case "width":
            selected.setAttribute("width",handle.value);
            // rect.attr({width:handle.value});
            break;
          // case "height":all.attr({height:handle.value});rect.attr({height:handle.value});break;
          case "height":
            selected.setAttribute("height",handle.value);
            // rect.attr({height:handle.value});
            break;
          // case "rotate": all.attr('transform','R'+handle.value);rect.attr('transform','R'+handle.value);break;
          case "rotate":
            selected.setAttribute('transform','R'+handle.value);
            // rect.attr('transform','R'+handle.value);
            break;
        }
        // all.rotate(handle.value);

        //选中的节点设置名称和值

        // all.setAttribute(handle.name,handle.value)
        // console.log(handle.value)
      })
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
          selected.remove()
        // }

      })
    }
  }

  /**
   *显示middle-top的数据
   */



  /*
  * 更新属性值
  * */
  // function updateValue(selected) {
  //   width.value=selected.getAttribute('width')
  //   height.value=selected.getAttribute('height')
  //   let t=decodeTransform(selected.getAttribute('transform'))
  //   translateX.value=t?t.tx:0
  //   translateY.value=t?t.ty:0
  //   rotate.value=t?t.rotate:0
  //   scale.value=t?t.scale:1
  //   fill.value=selected.getAttribute('fill')
  //   stroke.value=selected.getAttribute('stroke')
  // }

/*显示下方表单
  */
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
}