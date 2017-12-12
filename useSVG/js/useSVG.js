window.onload=function () {
  //创建画布
  let paper;
    // paper = new Raphael(document.getElementById("middle"),1800, 600);
  //在元素中创建Raphael对象
  paper =new Raphael(document.querySelector("#middle"),1430, 600);
  //为每个li绑定拖拽元素
    $(".tool_part").each(function()
    {
      $(this).draggable({helper:"clone",cursor:'move'})
      console.log("aaaaa")
    });

    $("#middle").droppable({
      accept:".tool_part",
      drop:function(event,ui)
      {
        console.log(event)
        // drawSvg(ui.helper.attr("type"),event.clientX,event.clientY);
        drawSvg(ui.helper.attr("type"),event.clientX-24,event.clientY-24);
        console.log(ui.helper)
        
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
      let start = paper.image("image/green.png",x,y,48,48)
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
        showStart(startId);
      }
      let myMove = function()
      {
        console.log("mymove")
        //让鼠标处于圆心
        moveX = event.clientX-24;
        // moveX = event.clientX-184;
        moveY = event.clientY-24;
        // moveY = event.clientY-75;
        start.attr({x:moveX});
        start.attr({y:moveY});
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
    //================================================
    /*
    *绘制end
    */
    if("end"===tool_type)
    {
      console.log(tool_type)
      let end = paper.image("image/picexample.png",x-184,y-75,48,48)
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
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        end.attr({x:moveX});
        end.attr({y:moveY});
      }
      let myEnd = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
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
    **绘制task1
    */
    if("task1"===tool_type)
    {
      let task1 = paper.image("image/redman.png",x-184,y-75,100,50)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      let realText = paper.text(x-140,y-50,'Task1').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showTask1(task1Id,realTextId);});
      let moveX,moveY;

      let task1Id = task1.id;
      let realTextId = realText.id;
      showTask1(task1Id,realTextId);

      let myMove = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        task1.attr({x:moveX});
        task1.attr({y:moveY});
        realText.attr({x:(moveX+task1.attr("width")/2)});
        realText.attr({y:(moveY+task1.attr("height")/2)});
      }
      let myStart = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        showTask1(task1Id,realTextId);
      }
      let myEnd = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        task1.attr({x:moveX});
        task1.attr({y:moveY});
      }
    }
    /*
   **绘制task2
   */
    if("task2"===tool_type)
    {
      let task2 = paper.image("image/year2013.png",x-184,y-75,100,50)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      let realText = paper.text(x-140,y-50,'Task2').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showTask2(task2Id,realTextId);});
      let moveX,moveY;

      let task2Id = task2.id;
      let realTextId = realText.id;
      showTask2(task2Id,realTextId);

      let myMove = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        task2.attr({x:moveX});
        task2.attr({y:moveY});
        realText.attr({x:(moveX+task2.attr("width")/2)});
        realText.attr({y:(moveY+task2.attr("height")/2)});
      }
      let myStart = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        showTask2(task2Id,realTextId);
      }
      let myEnd = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        task2.attr({x:moveX});
        task2.attr({y:moveY});
      }
    }
    /*
    *绘制task3
    */
    if("task3"==tool_type)
    {
      let task3 = paper.image("image/zhengchang.png",x-184,y-75,100,50)
        .attr({cursor:'pointer'})
        .drag(function(){myMove()},function(){myStart()},function(){myEnd()});

      let realText = paper.text(x-140,y-50,'Task3').attr({'font-size':14,cursor:'pointer','font-family':'微软雅黑'}).click(function(){showTask3(task3Id,realTextId);});
      let moveX,moveY;

      let task3Id = task3.id;
      let realTextId = realText.id;
      showTask3(task3Id,realTextId);

      let myMove = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        task3.attr({x:moveX});
        task3.attr({y:moveY});
        realText.attr({x:(moveX+task3.attr("width")/2)});
        realText.attr({y:(moveY+task3.attr("height")/2)});
      }
      let myStart = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        showTask3(task3Id,realTextId);
      }
      let myEnd = function()
      {
        moveX = event.clientX-184;
        moveY = event.clientY-75;
        task3.attr({x:moveX});
        task3.attr({y:moveY});
      }
    }
    /*
   *绘制judge
   */
    // if("judge"==tool_type)
    // {
    //   console.log(tool_type)
    //   let judge = paper.image("js/designer/images/48/task_wait.png",x-184,y-75,48,48)
    //     .attr({cursor:'pointer'})
    //     .drag(function(){myMove()},function(){myStart()},function(){myEnd()});
    //
    //   let moveX,moveY;
    //   let judgeId = judge.id;
    //   showJudge(judgeId);
    //   let myStart = function()
    //   {
    //     showJudge(judgeId);
    //   }
    //   let myMove = function()
    //   {
    //     moveX = event.clientX-184;
    //     moveY = event.clientY-75;
    //     judge.attr({x:moveX});
    //     judge.attr({y:moveY});
    //   }
    //   let myEnd = function()
    //   {
    //     moveX = event.clientX-184;
    //     moveY = event.clientY-75;
    //     judge.attr({x:moveX});
    //     judge.attr({y:moveY});
    //   }

      // judge.dblclick(function()
      // {
      //   if(confirm("确定删除此元素？"))
      //   {
      //
      //     console.log(judge.id)
      //     let id = judge.id;
      //     if(document.getElementById(id+"judge"))
      //     {
      //       $("#"+id+"judge").css('display','none');
      //       $("#"+id+"judge").remove();
      //     }
      //     this.remove();
      //   }
      //   else{}
      // });
    // }
  }

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
//task2
//task1文本
  function showTask2(task2Id,textId)
  {
    $("#info div").each(function()
    {
      $(this).css('display','none');
    });

    if(document.getElementById(task2Id+"task2"))
    {
      $("#"+task2Id+"task2").css('display',"block");
    }
    else
    {
      let htmlStr = "<div id="+task2Id+"task2 ><table style=text-align:center>"+
        "<tr><td > 属性： </td><td>权限设置</td></tr>"+
        "<tr><td>开始编号：<input type=text value="+task2Id+"task2 readOnly /></td><td>显示名称：<input type=text value='' onblur=javascript:changeText('"+textId+"') id="+textId+"text /></td></tr>"+
        "</table></div>";
      $("#info").append(htmlStr);
      $("#"+task2Id+"task2").css('display','block');
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
//judge文本
//   function showJudge(judgeId)
//   {
//     $("#info div").each(function()
//     {
//       $(this).css('display','none');
//     });
//
//     if(document.getElementById(judgeId+"judge"))
//     {
//       $("#"+judgeId+"judge").css('display',"block");
//     }
//     else
//     {
//       let htmlStr = "<div id="+judgeId+"judge ><table style=text-align:center>"+
//         "<tr><td > 属性： </td><td>权限设置</td></tr>"+
//         "<tr><td>开始编号：<input type=text value="+judgeId+"judge readOnly /></td><td>注解：<input type=text value='' /></td></tr>"+
//         "</table></div>";
//       $("#info").append(htmlStr);
//       $("#"+judgeId+"judge").css('display','block');
//     }
//   }

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