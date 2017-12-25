
  var range=function(start,end)
  {
    var array=[];
    for(var i=start;i<end;++i) array.push(i);
    // console.log(array)
    return array;
  }
  


  var randomstr = range(0,4).map(function(x){
    return Math.floor(Math.random()*10);
  }).join('');
  console.log(randomstr);