window.onload=function () {
  //创建文档
  // var xmlDoc=document.implementation.createDocument("","",null);
  var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  //是否异步 true同步  false 异步
  xmlDoc.async=false;
  //xml文件
  xmlDoc.load("analysisXML.xml");

  //解析文档中的内容
  console.log(xmlDoc);
  //获取文档中标签元素对象
  var names = xmlDoc.getElementsByTagName('name');
  console.log(names);
  var arr  = [];
  for (var i = 0; i < names.length; i++) {
    arr[arr.length] = names[i].innerHTML;
    console.log(names[i].getAttribute('class'))
  }
  console.log(arr);

  //获取属性
  console.log(names[0].getAttribute('class'));






}