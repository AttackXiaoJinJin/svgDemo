window.onload=function () {
  let SVG_NS='http://www.w3.org/2000/svg'
  //设置默认图形及其属性
  let shapeInfo={
    rect:'x:10,y:10,width:200,height:100,rx:0,ry:0',
    circle:'cx:200,cy:200,rx:80,ry:30',
    ellipse:'cx:200,cy:200,rx:80,ry:30',
    line:'x1:10,y1:10,x2:100,y2:100'
  }
  //设置公共的填充色和边框颜色
  let defaultAttrs={
    fill:'#ffffff',
    stroke:'#ff0000'
  }
  //创建
  let createForm=document.getElementById('create-shape')
  //设置形状
  let attrForm=document.getElementById('shape-attrs')
  //设置变换
  let lookForm=document.getElementById('look-and-transform')
  //创建svg图形
  let svg=createSVG()
  //默认选中为空
  let selected=null

  createForm.addEventListener('click',function (e) {
    if(e.target.tagName.toLowerCase() ==='button'){
      create(e.target.getAttribute('create'))
    }
  })

  attrForm.addEventListener('input',function (e) {
    if(e.target.tagName.toLowerCase()!=='input'){
      //终止
      return
    }
    var handle=e.target
    //选中的节点设置名称和值
    selected.setAttribute(handle.name,handle.value)
  })

  lookForm.addEventListener('input',function (e) {
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

  //创建svg图形
  function createSVG() {
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
  //创建图形
  function create(name) {
    let shape=document.createElementNS(SVG_NS,name)
    svg.appendChild(shape)
    select(shape)
  }
  //选中图形
  function select(shape) {
    let attrs=shapeInfo[shape.tagName].split(',')
    let attr,name,value
    attrForm.innerHTML=""
    while(attrs.length){
      //shift删除第一个元素并返回该元素
      attr=attrs.shift().split(':')
      name=attr[0]
      //没有则是默认值
      value=shape.getAttribute(name) || attr[1]
      createHandle(shape,name,value)
      shape.setAttribute(name,value)
    }
    for(name in defalutAttrs){
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
    attrForm.appendChild(label)
    attrForm.appendChild(handle)
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

  }












}