window.onload=function () {

  let SVG_NS='http://www.w3.org/2000/svg'
  //设置默认图形及其属性
  let shapeInfo={
    rect:'x:10,y:10,width:200,height:100,rx:0,ry:0',
    circle:'cx:200,cy:200,r:100',
    ellipse:'cx:200,cy:200,rx:80,ry:30',
    line:'x1:10,y1:10,x2:100,y2:100'
  }
  //设置公共的填充色和边框颜色
  let defaultAttrs={
    fill:'#FFB6C1',
    stroke:'#ff0000'
  }

  let canvas=document.querySelector("#canvas")
  //创建
  let createShape=document.querySelector("#createShape")
  //设置形状
  let shapeAttribute=document.querySelector('#shapeAttrs')
  //设置变换
  let lookTransform=document.querySelector('#look-and-transform')
  //创建svg图形
  let svg=createSVG()
  //默认选中为空
  let selected=null
  //1、先判断点击的是按钮
  //2、然后判断点击的是哪个按钮文本
  createShape.addEventListener('click',function (e) {
    console.log(e.target)
    console.log(e.target.tagName)
    if(e.target.tagName.toLowerCase() ==='button'){
      console.log(e.target.innerText.toLowerCase())
      // create(e.target.getAttribute('create'))
      create(e.target.innerText.toLowerCase())
    }
  })

  shapeAttribute.addEventListener('input',function (e) {
    if(e.target.tagName.toLowerCase()!=='input'){
      //终止
      return
    }
    console.log(e.target)
    let handle=e.target
    //选中的节点设置名称和值
    console.log(handle.name)
    console.log(handle.value)
    selected.setAttribute(handle.name,handle.value)
    console.log(handle.value)
  })

  lookTransform.addEventListener('input',function (e) {
    if(e.target.tagName.toLowerCase()!=='input'){
      return
    }
    //如果未选中
    if(!selected){
      return
    }
    selected.setAttribute('fill',fill.value)
    selected.setAttribute('stroke',stroke.value)
    selected.setAttribute('stroke-width',strokeWidth.value)
    selected.setAttribute('transform',encodeTransform({
      tx:translateX.value,
      ty:translateY.value,
      scale:scale.value,
      rotate:rotate.value
    }))
  })

  //创建图形
  function create(name) {
    let shape=document.createElementNS(SVG_NS,name)
    svg.appendChild(shape)
    select(shape)
  }
  //创建svg图形
  function createSVG() {
    //NS即namespace
    let svg=document.createElementNS(SVG_NS,'svg')
    svg.setAttribute('width','100%')
    svg.setAttribute('height','100%')
    canvas.appendChild(svg)
    svg.addEventListener('click',function (e) {
      if(e.target.tagName.toLowerCase() in shapeInfo){
        // 选中
        select(e.target)
      }
    })
    return svg
  }

  //选中图形
  function select(shape) {
    let attrs=shapeInfo[shape.tagName].split(',')
    let attr,name,value
    shapeAttribute.innerHTML=""
    while(attrs.length){
      //shift删除第一个元素并返回该元素
      attr=attrs.shift().split(':')
      name=attr[0]
      //没有则是默认值
      value=shape.getAttribute(name) || attr[1]
      createHandle(shape,name,value)
      shape.setAttribute(name,value)
    }
    for(name in defaultAttrs){
      value=shape.getAttribute(name) || defaultAttrs[name]
      shape.setAttribute(name,value)
    }
    selected=shape
    updateLookHandle()
  }
  function createHandle(shape,name,value) {
    let label=document.createElement('label')
    label.textContent=name
    //滑块
    let handle=document.createElement('input')
    handle.setAttribute('name',name)
    handle.setAttribute('type','range')
    handle.setAttribute('value',value)
    handle.setAttribute('min',0)
    handle.setAttribute('max',800)
    shapeAttribute.appendChild(label)
    shapeAttribute.appendChild(handle)
  }

  //更新属性值
  function updateLookHandle() {
    fill.value=selected.getAttribute('fill')
    stroke.value=selected.getAttribute('stroke')
    let t=decodeTransform(selected.getAttribute('transform'))
    translateX.value=t?t.tx:0
    translateY.value=t?t.ty:0
    rotate.value=t?t.rotate:0
    scale.value=t?t.scale:1
  }
  //解码变换
  function decodeTransform(transString) {
    var match = /translate\((-?\d+),(-?\d+)\)\srotate\((-?\d+)\)\sscale\((-?\d+\.\d{0,2})\)/.exec(transString)
    return match?{
      tx:+match[1],
      ty:+match[2],
      rotate:+match[3],
      scale:+match[4],
    }:null
  }

  //编码变换
  function encodeTransform(transObject) {
    return [
      'translate(',transObject.tx,',',transObject.ty,')',
      'rotate(',transObject.rotate,')',
      'scale(',transObject.scale,')'
    ].join('')
  }










}