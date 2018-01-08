var module = angular.module('XCXY');

module.run(['$http','$rootScope',function ($http,$rootScope) {
	//读取路径名
	var pathname = window.document.location.pathname;
	$rootScope.serPath = pathname.match(/\/(\S*)\//)[1];
	var paramJsonStr = '';
	//var paramObj = JSON.parse(paramJsonStr);
	//$rootScope.paramDataArray=paramObj.result;
	$http({
		method:'GET',
		url:'/'+$rootScope.serPath+'/static/assets/comp/data/Components.xml'
	}).then(function (result){
		if(result.data){
			// 读取xml
			var xmlString = result.data;
			var xmlDoc=null;
			if(!!window.ActiveXObject || "ActiveXObject" in window){
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(xmlString);
			}
			//xml对象转化为json对象
			var xmlObj = xmlToJson(xmlDoc);
			var compObj = xmlObj.Components.Component;
			//Object对象转化为数组,并添加节点名称
			var componentXMlArray = objectToArray(compObj);
			$rootScope.componentXMlArray = componentXMlArray;

		}
	});

	//读取map.xml
	$http({
		method:'GET',
		url:'/'+$rootScope.serPath+'/static/retailers/'+$rootScope.gcID.toLowerCase()+'/mapAssets/map.xml'
	}).then(function (result){
		if(result.data){
			var xmlString = result.data;
			var xmlDoc=null;
			if(!!window.ActiveXObject || "ActiveXObject" in window){
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(xmlString);
			}
			var mapXmlObj = xmlToJson(xmlDoc);
			var mapObj = mapXmlObj.maps.mapList;
			var mapXMLArray = objectToArray(mapObj);
			$rootScope.mapXMLArray = mapXMLArray;
		}
	});
	//同上
}]);


module.controller('ReadComponentXMl',['$http','$rootScope','$scope',function ($http,$rootScope,$scope) {
	//加载组态文件信息(测试数据)
	$http({
		method:'GET',
		url:'/'+$scope.serPath+'/static/data/lyxtxtjgt.xml'
	}).then(function (result){
		if(result.data){
			var xmlString = result.data;
			var xmlDoc=null;
			if(!!window.ActiveXObject || "ActiveXObject" in window){
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(xmlString);
			}
			//xml对象转化为json对象
			var xmlObj = xmlToJson(xmlDoc);
			var xmlArray = xmlObj.Configration.Components;
			//object对象转化为Array
			var arrayData = treeObjArrayToArray(xmlArray);
			$scope.xmlList = arrayData;

		}
	});

	//公共组件和特定组件数组拼接
	$scope.loadXMLCompent = function(){
		if($scope.componentXMlArray && $scope.mapXMLArray){
			var mapArray = $scope.mapXMLArray;
			var compArray = $scope.componentXMlArray;
			//将特定组件添加到公共组件中
			for(var i = 0;i < mapArray.length;i++){
				compArray.push(mapArray[i]);
			}
			$scope.componentXMl = compArray;
		}

		//存放组态文件数据
		var compCList = $scope.xmlList;
		var url = '/'+$scope.serPath+'/static/';
		ergodicData($rootScope.gcID.toLowerCase(),url,compCList,$scope.paramDataArray,$scope.componentXMl);
	}
}]);


//遍历所有组件数据,管道放置在最下层,文本放置在最上层
var paramDataArray;
var confScalex;
var confScaley;
var confScope;
var scaleWidthX;//组件相对画布缩放后偏移量
var scaleHeightY=1;//组件相对画布缩放后偏移量
var componList;//夜景照明专用
var serviceURl;
var gcid;

//存放组态文件数据
function ergodicData(scope,gcID,url,compCList,paramDataArrayResult,componentXMl){
	componList = compCList;
	serviceURl = url;
	gcid = gcID;
	//夜景照明特殊处理
	if(window.$rootScope.isCoolHashData==0){
		return;
	}
	clearCanvas();
	confScope = scope;
	deviceClickDataArray = [];
	//oldDeviceID='';
	//isOpenWinInt = 0;
	IS_MOVE_FLAGE=true;
	isOpenWinInt=10;
	/////////////////
	if(paramDataArrayResult){
		var paramObj = JSON.parse(paramDataArrayResult);
		paramDataArray=paramObj.result;
	}else{
		paramDataArray = paramDataArrayResult;
	}
	//第一层，先放置管道;第二层，放置设备组件;第三层，放置文本组件
	var width = $('#drawGroup').innerWidth();
	var height = $('#drawGroup').innerHeight();
	var confWidth = scope.configrationWidth;
	var confHeight = scope.configrationHeight;
	scalXYFunction(gcID,width,height,confWidth,confHeight);

	var compCArray = [];//组装好的array
	var compGDArray = [];//管道组件
	var textCompArray = [];//文本组件
	var device = "''";
	for(var m=0;m<compCList.length;m++)
	{
		var compChildren = compCList[m];
		var nodeName = compChildren.nodeName;
		var compData = compChildren.compAttribute;
		var deviceId = compData.deviceID;
		if(deviceId){
			device = device+",'"+deviceId+"'";
			setDeviceID(compChildren);
		}
		var topObj={};
		topObj.nodeName = nodeName;
		topObj.data = compChildren.compAttribute;
		if(nodeName=='PIPELINE2'||nodeName=='PIPELINE'){
			compGDArray.push(topObj);
		}else if(nodeName=='TEXT'||nodeName=='LABEL'){
			textCompArray.push(topObj);
		}else{
			compCArray.push(topObj);
		}
	}
	//回调devicID数据
	//scope.$emit('CALL_BACE_DEVICEID_PARAM',device);
	runNumArray = [];
	scope.deviceParam = device;
	//////////////////
	/*for(var n=0;n<secondFloorArray.length;n++){
		var secondFloorObj = secondFloorArray[n];
		compCArray.push(secondFloorObj);
	}*/
	for(var gd=0;gd<compGDArray.length;gd++){
		var gdObj = compGDArray[gd];
		var gdData = gdObj.data;
		var gdNodeName = gdObj.nodeName;
		drawBeautyEquipment(gdNodeName,url,gdData);
	}

	//设置绑定设备组件状态
	for(var i=0;i<compCArray.length;i++){
		var compObj = compCArray[i];
		var compData = compObj.data;
		compData.gcId = gcID;
		var deviceID = compData.deviceID;
		var nodeName = compObj.nodeName;
		if(deviceID){
			if(deviceID!=''){
				for(var o=0;o<componentXMl.length;o++){
					var componentObj = componentXMl[o];
					var popType = componentObj.compAttribute.popType;
					var isPopFlage;
					var isToolTipFlage;
					//获取配置弹窗、浮窗配置参数
					if(componentObj.compAttribute.isPop){
						isPopFlage = componentObj.compAttribute.isPop;
					}else{
						isPopFlage = 'false';
					}
					if(componentObj.compAttribute.isToolTip){
						isToolTipFlage = componentObj.compAttribute.isToolTip;
					}else{
						isToolTipFlage = 'false';
					}
					//获取配置弹窗、浮窗配置参数
					var compononentNodeName = componentObj.compAttribute.nodeName;
					if(nodeName==compononentNodeName){
						var compBindArray= componentObj.Image;
						if(compBindArray){
							var deviceStatesArray=[];//设备组件状态集
							if(compBindArray.length){
								for(var p=0;p<compBindArray.length;p++){
									var compBindParam = compBindArray[p].compAttribute.param;
									var compBindData = compBindArray[p].compAttribute;
									compData.popType = popType;
									compData.isPop = isPopFlage;
									compData.isToolTip = isToolTipFlage;
									if(compBindParam!='bg'){
										compData.param = compBindParam;
										if(paramDataArray){
											for(var q=0;q<paramDataArray.length;q++){
												var paramOBj = paramDataArray[q];
												var paramEnName = paramOBj.paramEnName;
												var paramDeviceID = paramOBj.deviceID;
												if(compBindParam==paramEnName && deviceID==paramDeviceID){
													var deviceSatae = deviceStateFun(compBindParam);
													paramOBj['x'] = compBindData.x;
													paramOBj['y'] = compBindData.y;
													paramOBj['width'] = compBindData.width;
													paramOBj['height'] = compBindData.height;
													var deviceStateObj = {};//设备组件状态对象
													deviceStateObj.stateName = deviceSatae;
													deviceStatesArray.push(deviceStateObj);
													compData[deviceSatae] = paramOBj;
													break;
												}
											}
										}else{

										}
									}
								}
							}else{
								var compBindParam = compBindArray.compAttribute.param;
								var compBindData = compBindArray.compAttribute;
								compData.popType = popType;
								compData.isPop = isPopFlage;
								compData.isToolTip = isToolTipFlage;
								if(compBindParam!='bg'){
									compData.param = compBindParam;
									if(paramDataArray){
										for(var q=0;q<paramDataArray.length;q++){
											var paramOBj = paramDataArray[q];
											var paramEnName = paramOBj.paramEnName;
											var paramDeviceID = paramOBj.deviceID;
											if(compBindParam==paramEnName && deviceID==paramDeviceID){
												var deviceSatae = deviceStateFun(compBindParam);
												paramOBj['x'] = compBindData.x;
												paramOBj['y'] = compBindData.y;
												paramOBj['width'] = compBindData.width;
												paramOBj['height'] = compBindData.height;
												var deviceStateObj = {};//设备组件状态对象
												deviceStateObj.stateName = deviceSatae;
												deviceStatesArray.push(deviceStateObj);
												compData[deviceSatae] = paramOBj;
												break;
											}
										}
									}else{

									}
								}
							}
							compData.deviceStateArray = deviceStatesArray;
						}else{

						}
						break;
					}
				}
			}
		}
		drawBeautyEquipment(nodeName,url,compData);
	}

	setTimeout(function drawTextErgodicData(){
		//画文本组件
		for(var l=0;l<textCompArray.length;l++){
			var textObj = textCompArray[l];
			var textData = textObj.data;
			var deviceID = textData.deviceID;
			var nodeName = textObj.nodeName;
			if(deviceID){
				if(deviceID!=''){
					for(var o=0;o<componentXMl.length;o++){
						var componentObj = componentXMl[o];
						var compononentNodeName = componentObj.compAttribute.nodeName;
						if(nodeName==compononentNodeName){
							var labelParam = textData.param;
							var comentLabelInfoObj = componentObj.compAttribute;
							textData.comentLabelInfoObj = comentLabelInfoObj;
							if(labelParam!=''){
								var textBindValueFLage=false;
								for(var r=0;r<paramDataArray.length;r++){
									var paramLabelOBj = paramDataArray[r];
									var paramLabelEnName = paramLabelOBj.paramEnName;
									if(labelParam == paramLabelEnName&&deviceID==paramLabelOBj.deviceID){
										textData.text = paramLabelOBj.statusValue;
										textBindValueFLage = true;
										break;
									}
								}
								if(!textBindValueFLage){
									textData.text = "0";
								}

							}
							break;
						}
					}
				}
			}
			drawBeautyEquipment(nodeName,url,textData);
		}
	},0);

}


//canvas上画出所有设备组件
function drawBeautyEquipment (nodeName,url,compData){0
	var devicesID = compData.deviceID;
	if(devicesID&&paramDataArray){
		if(devicesID!=''){
			//绑定设备组件
			var group = compData.group;
			if(group=='deviceComp'){//绑定设备组件
				var stateArray = compData.deviceStateArray;
				if(stateArray.length>0){
					var deviceType = '';
					for(var i=0;i<stateArray.length;i++){
						var stateObj = stateArray[i];
						var stateName = stateObj.stateName;
						if(stateName=='runing'||stateName=='alarm'){
							deviceType = stateName;
						}else{
							deviceType = 'bgComp';
						}
						var deviceObj = compData[stateName];
						var statusValue = deviceObj.statusValue;
						//if(statusValue=='1'){
							drawBindDeviceComp(nodeName,url,compData,deviceType);
						//}else{
						//	drawNoBindDeviceComp(nodeName,url,compData);
						//}
					}
				}else{
					drawNoBindDeviceComp(nodeName,url,compData);
				}
			}else if(group=='commonComp'&&compData.param!=''){//公共组件
				if(nodeName=='TEXT'||nodeName=='LABEL'){
					drawBindTextComp(nodeName,url,compData);
				}
				//绑定公共设备组件类
				//else if(nodeName=='HANDAUTO'||nodeName=='BQSX'||nodeName=='QSX'||nodeName=='ZNSX'){
				else {
					var paramType = compData.param;
					var statusOBj = compData[paramType]
					if (statusOBj) {
						drawBindDeviceComp(nodeName, url, compData, 'bgComp');
					} else {
						drawNoBindDeviceComp(nodeName, url, compData);
					}
				}

				/*}
				else{
					drawNoBindDeviceComp(nodeName,url,compData);
				}*/
			}else{
				drawNoBindDeviceComp(nodeName,url,compData);
			}
		}else{
			drawNoBindDeviceComp(nodeName,url,compData);
		}
	}
	else{//未绑定设备组件
		drawNoBindDeviceComp(nodeName,url,compData);
	}
}

//画出未绑定的组件
function drawNoBindDeviceComp(nodeName,url,compData){
	var mycv = document.getElementById("drawGroup");
	var myctx = mycv.getContext("2d");
	if(nodeName=='TEXT'||nodeName=='TEXT2'||nodeName=='LABEL'){//文本组件
		var backgroundColorValue = compData.contentBackgroundColor;
		if(nodeName=='LABEL'&&(compData.mark.indexOf('KL')>-1||compData.mark.indexOf('CWYD')>-1)){
			var width = '45';
			var height= '20';
			var backgroundColor = colorTransformation(backgroundColorValue);
			myctx.fillStyle= '#'+backgroundColor;
			myctx.lineWidth=1;
			//myctx.globalAlpha=0.5;
			myctx.fillRect(compData.x*confScalex+scaleWidthX,compData.y*confScaley+scaleHeightY+3,width*confScalex+5,height*confScaley);
		}
		else if(backgroundColorValue&&compData.text.indexOf('大商业')<0){
			var backgroundColor = colorTransformation(parseInt(backgroundColorValue));
			myctx.fillStyle= '#'+backgroundColor;
			//myctx.fillStyle= '#B848FF';
			myctx.lineWidth=1;
			//myctx.globalAlpha=0.5;
			myctx.fillRect(compData.x*confScalex+scaleWidthX,compData.y*confScaley+scaleHeightY+3,compData.width*confScalex+5,compData.height*confScaley);
		}
		var colorStr = colorTransformation(parseInt(compData.color));
		if(colorStr=="0"){
			myctx.fillStyle = '#000000';
		}else{
			myctx.fillStyle = '#'+colorStr;
		}
		if(compData.deviceID){
			myctx.font = compData.fontSize+'px '+compData.fontFamily;
			myctx.fillText(compData.text, parseInt(compData.x)*confScalex+scaleWidthX+20, parseInt(compData.y)*confScaley+scaleHeightY+15);
		}else{
			myctx.font = compData.fontSize*confScalex+'px '+compData.fontFamily;
			myctx.fillText(compData.text, parseInt(compData.x)*confScalex+scaleWidthX+3, parseInt(compData.y)*confScaley+scaleHeightY+15);
		}



	}else{//非文本组件
		var x = compData.x;
		var y = compData.y;
		var width = compData.width;
		var roationValue = compData.rotation;
		var scalexValue = compData.scaleX;
		var scaleyValue = compData.scaleY;
		var height='20'
		var scalex='1';
		var scaley='1';
		var rotation='0';
		if(compData.deviceID&&compData.group!='map'&&compData.group!='tuli') {
			//获得事件集合列表
			compData.nodeName = nodeName;
			deviceClickDataArray.push(compData);
			//添加clicck事件监听
			mycv.addEventListener('click', bindCompClickFun, false);
			mycv.addEventListener('mousemove', bindCompMouseMove, false);
		}
		//判断是否包含有次变量属性，无此属性用默认值
		if(compData.height){
			height = compData.height;
		}
		if(compData.rotation){
			rotation = compData.rotation;
		}
		if(compData.scaleX){
			scalex=compData.scaleX;
		}
		if(compData.scaleY){
			scaley=compData.scaleY;
		}
		var group = compData.group;
		//特殊处理
		if(!width){
			if(group=='tuli'){
				if(nodeName=='TULI'){
					width ='225';
					height='124';
				}else{
					width ='80';
					height='80';
				}
			}
			else if(group=='map'){
				width = confScope.configrationWidth;
				height = confScope.configrationHeight;
			}else{
				width ='80';
				height='80';
			}
		}
		//开始加载组件
		var beauty = new Image();
		if(group=='map'){
			beauty.src = url+'retailers/'+compData.gcId+'/'+compData.source;
		}else{
			beauty.src = url+compData.source;
		}
		if(rotation&&rotation!='0')
		{
			beauty.onload = function(){
				myctx.save();
				myctx.translate(x*confScalex+scaleWidthX,y*confScaley+scaleHeightY);
				myctx.rotate(parseInt(rotation)*Math.PI/180);
				myctx.drawImage(beauty,0,0,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
				myctx.restore();
			}
		}else{
			beauty.onload = function(){
				myctx.drawImage(beauty,x*confScalex+scaleWidthX,y*confScaley+scaleHeightY,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
			}
		}
	}

}

//画出绑定的设备组件
var deviceClickDataArray = [];
function drawBindDeviceComp(nodeName,url,compData,type){
	var mycv = document.getElementById("drawGroup");
	var myctx = mycv.getContext("2d");
	compData.nodeName = nodeName;
	//添加clicck事件监听
	deviceClickDataArray.push(compData);
	mycv.addEventListener('click', bindCompClickFun, false);
	mycv.addEventListener('mousemove', bindCompMouseMove, false);

	var x = compData.x;
	var y = compData.y;
	var paramX = '';
	var paramY = '';
	var width = compData.width;
	var height = compData.height;
	drawBindDeviceRuning(x,y,width,height,'bg',compData,url+compData.source);
	setTimeout(function drawDynamicComp(){
		if(type=='runing'){
			paramX = Number(x)+Number(compData.runing.x)*Number(compData.scaleX);
			paramY = Number(y)+Number(compData.runing.y)*Number(compData.scaleY);
			width = Number(compData.runing.width);
			height = Number(compData.runing.height);
			var statuValue = compData.runing.statusValue;
			if(Number(statuValue)==1){
				var runPath = url+'assets/comp/'+nodeName+'/runing/'+statuValue;
				drawBindDeviceRuning(paramX,paramY,width,height,'runing',compData,runPath);
			}
		}else if(type=='alarm'){
			paramX = Number(x)+Number(compData.alarm.x);
			paramY = Number(y)+Number(compData.alarm.y);
			if(nodeName.indexOf('LQT')>-1){
				width = Number(compData.alarm.width);
				height = Number(compData.alarm.height);
			}else{
				width = Number(compData.width);
				height = Number(compData.height);
			}
			var statuValue = compData.alarm.statusValue;//alarm注意改下alarm注意改下alarm注意改下alarm注意改下alarm注意改下
			if(Number(statuValue)==1){
				var path = url+'assets/comp/'+nodeName+'/alarm/'+statuValue+'/1.png';
				drawBindDeviceRuning(paramX,paramY,width,height,'alarm',compData,path);
			}
		}else if(type=='bgComp'){
			var paramType = compData.param;
			var statusValue = compData[paramType].statusValue;
			var isPrivate = compData.isPrivate;
			if(isPrivate&&statusValue=='0'){
				var urlPath = "retailers/"+compData.gcId+"/mapAssets/mapImages/"+nodeName+"/"+paramType+"/0/1.png";
				drawBindDeviceRuning(compData.x,compData.y,compData.width,compData.height,'bg',compData,url+urlPath);
			}else{
				var urlPath = "assets/comp/"+nodeName+"/"+paramType+"/"+statusValue+"/1.png";
				drawBindDeviceRuning(compData.x,compData.y,compData.width,compData.height,'bg',compData,url+urlPath);
			}
		}
		else{

		}
	},300);
}

//绑定设备鼠标点击时间
function bindCompClickFun(ev){
	var mouseX, mouseY;
	/*if (ev.layerX || ev.layerX == 0){
	 mouseX = ev.layerX;
	 mouseY = ev.layerY;
	 }else if(ev.offsetX || ev.offsetX == 0){*/
	mouseX = ev.offsetX;
	mouseY = ev.offsetY;
	//}
	for(var i=0;i<deviceClickDataArray.length;i++){
		var clickObj = deviceClickDataArray[i];
		var paramId = clickObj.paramID;
		clickObj.controlParamID =paramId;
		var scalex='1';
		var scaley='1';
		if(clickObj.scaleX){
			scalex=clickObj.scaleX;
		}
		if(clickObj.scaleY){
			scaley=clickObj.scaleY;
		}
		devicCanX = Number(clickObj.x)*confScalex+scaleWidthX;
		devicCanXW = Number(clickObj.x)*confScalex+Number(clickObj.width)*Number(scalex)*confScalex+scaleWidthX;
		devicCanY = Number(clickObj.y)*confScaley+scaleHeightY;
		devicCanYH = Number(clickObj.y)*confScaley + Number(clickObj.height)*Number(scaley)*confScaley+scaleHeightY;
		if((mouseX>devicCanX&&mouseX<devicCanXW)&&(mouseY>devicCanY&&mouseY<devicCanYH)){
			//alert(clickObj.deviceName);
			//confScope.$emit('SELECTED_BINDDEVICE_COMP',clickObj);
			var isPopFlage = clickObj.isPop;
			if(isPopFlage=='true'){
				//alert('click');
				window.$rootScope.$broadcast('SELECTED_BINDDEVICE_COMP',clickObj);
			}
			break;
		}

	}

}

function setDeviceID(data){

	var confObj = data.compAttribute;
	switch(data.nodeName){
		case "LYZKSB":
			confScope.lyDeviceID = confObj.deviceID ;
			break;
		case "LYZKSB1":
			confScope.lyDeviceID1 = confObj.deviceID ;
			break;
		case "LYZKSB2":
			confScope.lyDeviceID2 = confObj.deviceID ;
			break;
		case "RYZKSB":
			confScope.ryDeviceID = confObj.deviceID ;
			break;
		case "RYZKSB1":
			confScope.ryDeviceID1 = confObj.deviceID ;
			break;
	}

}


//绑定设备鼠标浮动事件
var IS_MOVE_FLAGE=false;
var oldDeviceID='';
var isOpenWinInt;
var oldMouseX=0;
var oldMouseY=0;
function bindCompMouseMove(ev){
	var mouseMoveX, mouseMoveY;
	mouseMoveX = ev.offsetX;
	mouseMoveY = ev.offsetY;
	///////////////////////////////
	//IS_MOVE_FLAGE = false;
	//isOpenWinInt = 0;

	///////////////////////////////
	for(var i=0;i<deviceClickDataArray.length;i++){
		var clickObj = deviceClickDataArray[i];
		var paramId = clickObj.paramID;
		clickObj.controlParamID =paramId;
		var scalex='1';
		var scaley='1';
		if(clickObj.scaleX){
			scalex=clickObj.scaleX;
		}
		if(clickObj.scaleY){
			scaley=clickObj.scaleY;
		}
		devicCanX = Number(clickObj.x)*confScalex+scaleWidthX;
		devicCanXW = Number(clickObj.x)*confScalex+Number(clickObj.width)*Number(scalex)*confScalex+scaleWidthX;
		devicCanY = Number(clickObj.y)*confScaley+scaleHeightY;
		devicCanYH = Number(clickObj.y)*confScaley + Number(clickObj.height)*Number(scaley)*confScaley+scaleHeightY;
		if((mouseMoveX>devicCanX&&mouseMoveX<devicCanXW)&&(mouseMoveY>devicCanY&&mouseMoveY<devicCanYH)){
			oldMouseX = mouseMoveX;
			oldMouseY = mouseMoveY;
			clickObj.mouseX = mouseMoveX;
			clickObj.mouseY = mouseMoveY;
			var isControls = clickObj.isControl;
			isOpenWinInt=0;
			var isToolTipFlage = clickObj.isToolTip;
			var isMouseOverTipFlage = clickObj.isMouseOverTip;
			//夜景照明预览特殊处理
			if(window.$rootScope.isCoolHashData==0){
				var clickNodeName = clickObj.mark;
				var comCList = componList;
				for(var n=0;n<componList.length;n++){
					var nlObj = componList[n];
					var nlNodeName = nlObj.nodeName;
					var isPrivates = nlObj.compAttribute.isPrivate;
					if(nlNodeName=='YJZM'){
						drawNLCOmmonDeviceComp(nlObj.compAttribute,2);
					}
					if(isPrivates) {
						if(clickNodeName==nlNodeName){
							//drawNLCOmmonDeviceComp(nlObj.compAttribute,0);
						}else{
							drawNLCOmmonDeviceComp(nlObj.compAttribute,0);
						}
					}
				}
				return;
			}
			//夜景照明预览特殊处理
			if(isToolTipFlage=='true'&&isMouseOverTipFlage=='true'){
				clickObj.isMouseOverTip = false;
			}
			if(isToolTipFlage=='true'||isMouseOverTipFlage=='true'||isControls){
				//alert('in');
				var deviceId = clickObj.deviceID;
				if(oldDeviceID==''){
					oldDeviceID = clickObj.deviceID;
					IS_MOVE_FLAGE = true;
					//isOpenWinInt = 0;
					if(isControls){
						//alert('NLCOMMON');
						window.$rootScope.$broadcast('MOUSEMOVE_NLCOMMON_EVENT',clickObj);
					}else{
						window.$rootScope.$broadcast('MOUSEMOVE_BINDDEVICE_COMP',clickObj);
					}
				}else{
					if(oldDeviceID==deviceId){

					}else{
						//alert('1');
						window.$rootScope.$broadcast('MOUSE_OUT_BINDDEVICE_COMP',clickObj);
						IS_MOVE_FLAGE = true;
						//isOpenWinInt = 0;
						if(isControls){
							//alert('NLCOMMON');
							window.$rootScope.$broadcast('MOUSEMOVE_NLCOMMON_EVENT',clickObj);
						}else{
							window.$rootScope.$broadcast('MOUSEMOVE_BINDDEVICE_COMP',clickObj);
						}
						oldDeviceID = clickObj.deviceID;
					}
				}
			}
			break;
		}
		else{
			isOpenWinInt++;
		}
	}
	if(IS_MOVE_FLAGE&&isOpenWinInt>0){
		//alert('2');
		//confScope.$emit('MOUSE_OUT_BINDDEVICE_COMP',clickObj);
		isOpenWinInt = 0;
		IS_MOVE_FLAGE = false;
		oldDeviceID = '';
		window.$rootScope.$broadcast('MOUSE_OUT_BINDDEVICE_COMP',clickObj);
	}
}

//夜景照明预览特殊处理
function drawNLCOmmonDeviceComp(compData,num){
	var mycv = document.getElementById("drawGroup");
	var myctx = mycv.getContext("2d");
	var x = compData.x;
	var y = compData.y;
	var width = compData.width;
	var roationValue = compData.rotation;
	var scalexValue = compData.scaleX;
	var scaleyValue = compData.scaleY;
	var height='20'
	var scalex='1';
	var scaley='1';
	var rotation='0';
	//判断是否包含有次变量属性，无此属性用默认值
	if(compData.height){
		height = compData.height;
	}
	if(compData.rotation){
		rotation = compData.rotation;
	}
	if(compData.scaleX){
		scalex=compData.scaleX;
	}
	if(compData.scaleY){
		scaley=compData.scaleY;
	}
	var url='';
	if(num==2){
		url = serviceURl+'/retailers/'+gcid+'/'+compData.source;
	}else if(num==0){
		url = serviceURl+'retailers/'+gcid+'/mapAssets/mapImages/'+compData.nodeName+'/'+compData.param+'/0/1.png';
	}

	//开始加载组件
	var beauty = new Image();
	beauty.src = url;
	if(rotation&&rotation!='0')
	{
		beauty.onload = function(){
			myctx.save();
			myctx.translate(x*confScalex+scaleWidthX,y*confScaley+scaleHeightY);
			myctx.rotate(parseInt(rotation)*Math.PI/180);
			myctx.drawImage(beauty,0,0,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
			myctx.restore();
		}
	}else{
		beauty.onload = function(){
			myctx.drawImage(beauty,x*confScalex+scaleWidthX,y*confScaley+scaleHeightY,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
		}
	}

}

//画出绑定的文本组件
function drawBindTextComp(nodeName,url,compData){
	var mycv = document.getElementById("drawGroup");
	var myctx = mycv.getContext("2d");
	var backgroundColorValue = compData.contentBackgroundColor;
	var fontColor = '16777215';
	var fontSize = '12';
	var fontFamily = '微软雅黑';
	var width = '45';
	var height= '20';
	if(compData.fontFamily){
		fontFamily = compData.fontFamily;
	}
	if(backgroundColorValue&&(compData.mark.indexOf('KL')>-1||compData.mark.indexOf('CWYD')>-1)){
		if(compData.width){
			width = compData.width;
		}
		if(compData.height){
			height = compData.height;
		}
		var backgroundColor = colorTransformation(backgroundColorValue);
		myctx.fillStyle='#'+backgroundColor;
		//myctx.fillStyle= '#B848FF';
		myctx.lineWidth=1;
		myctx.fillRect(compData.x*confScalex+scaleWidthX,compData.y*confScaley+scaleHeightY,width*confScalex,height*confScaley);
	}
	if(compData.color){
		fontColor = compData.color;
	}
	var colorStr = colorTransformation(parseInt(fontColor));
	myctx.fillStyle = '#'+colorStr;
	if(backgroundColorValue&&compData.mark.indexOf('KL')>-1){
		myctx.font = 'bold '+fontSize+'px LcdD';
	}else{
		myctx.font = fontSize+'px '+fontFamily;
	}
	myctx.fillText(compData.text, parseInt(compData.x)*confScalex+scaleWidthX+10, parseInt(compData.y)*confScaley+scaleHeightY+15);
}

//画出绑定的设备组件
//存放setInterval回调int的数组
var runNumArray;
function drawBindDeviceRuning(x,y,width,height,type,compData,url){
	var mycv = document.getElementById("drawGroup");
	var myctx = mycv.getContext("2d");
	var scalexValue = compData.scaleX;
	var scaleyValue = compData.scaleY;
	var scalex='1';
	var scaley='1';
	var rotation='0';
	//判断是否包含有次变量属性，无此属性用默认值
	if(compData.rotation){
		rotation = compData.rotation;
	}
	if(compData.scaleX){
		scalex=compData.scaleX;
	}
	if(compData.scaleY){
		scaley=compData.scaleY;
	}
	if(type=='alarm'||type=='bg'){
		var beauty = new Image();
		beauty.src = url;
		if(rotation&&rotation!='0')
		{
			beauty.onload = function(){
				myctx.save();
				myctx.translate(x*confScalex+scaleWidthX,y*confScaley+scaleHeightY);
				myctx.rotate(parseInt(rotation)*Math.PI/180);
				myctx.drawImage(beauty,0,0,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
				myctx.restore();
			}
		}else{
			beauty.onload = function(){
				myctx.drawImage(beauty,x*confScalex+scaleWidthX,y*confScaley+scaleHeightY,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
			}
		}
	}
	else if(type=='runing'){
		var runNumObj={};
		var beauty = new Image();
		var indx = 1;
		var runContent = 3;//组件运行状态
		var runMin = 80;//运转速率
		if(compData.nodeName.indexOf('LQT')>-1){
			runContent = 10;
			runMin = 40;
		}else if(compData.nodeName.indexOf('LQB')>-1){
			runContent = 3;
			runMin = 80;
		}else if(compData.nodeName.indexOf('LGJZ')>-1){
			runContent = 12;
			runMin = 90;
		}else if(compData.nodeName.indexOf('LXJZ')>-1){
			runContent = 5;
			runMin = 60;
		}
		var runRotNum;//setInterval返回参数
		if(rotation&&rotation!='0')
		{
			runRotNum = setInterval(function(){
							beauty.src = url+'/'+indx+'.png';
							beauty.onload = function(){
								myctx.save();
								myctx.translate(x*confScalex+scaleWidthX,y*confScaley+scaleHeightY);
								myctx.rotate(parseInt(rotation)*Math.PI/180);
								myctx.drawImage(beauty,0,0,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
								myctx.restore();
								indx++;
								if(indx==runContent){
									indx=1;
								}
							}
						}, runMin);
		}else{
			runRotNum = setInterval(function(){
							beauty.src = url+'/'+indx+'.png';
							beauty.onload = function(){
								myctx.drawImage(beauty,x*confScalex+scaleWidthX,y*confScaley+scaleHeightY,width*Number(scalex)*confScalex,height*Number(scaley)*confScaley);
								indx++;
								if(indx==runContent){
									indx=1;
								}
							}
						}, runMin);
		}
		runNumObj.runNum = runRotNum;
		runNumArray.push(runNumObj);
	}
}


//清除画布和事件
function clearCanvas()
{
	var mycv = document.getElementById("drawGroup");
	var myctx = mycv.getContext("2d");
	if(myctx){
		myctx.clearRect(0,0,mycv.width,mycv.height);
	}
	//清楚事件集
	if(runNumArray){
		for(var i=0;i<runNumArray.length;i++){
			var obj = runNumArray[i];
			var runNums = obj.runNum;
			window.clearInterval(runNums);
		}
	}
}


function scalXYFunction(gcID,width,height,confWidth,confHeight){
	//组件缩放比计算
	var clickObj={};
	var scalNum = Math.min(width/confWidth,height/confHeight);
	if(scalNum<0.55){
		if(gcID=='ahaqwy'){
			scaleWidthX = Math.abs(width-confWidth)*confScalex+150;
			confScalex = confScaley = Math.min(width/confWidth,height/confHeight)-0.04;
		}else if(gcID=='jxncwy'){
			if(scalNum<0.527){
				confScalex = confScaley = Math.min(width/confWidth,height/confHeight)+0.3;
			}else{
				confScalex = confScaley = Math.min(width/confWidth,height/confHeight);
			}
		}
		else{
			confScalex = confScaley = Math.max(width/confWidth,height/confHeight)/1.35;
			scaleWidthX = 15;
			scaleHeightY = 45;
		}
	}else{
		//缩放比
		if(scalNum>1){
			confScalex = confScaley = Math.min(width/confWidth,height/confHeight)-0.1;
		}else{
			confScalex = confScaley = Math.min(width/confWidth,height/confHeight);
		}
		//偏移量
		if(gcID=='ahaqwy'){
			scaleWidthX = 50;
			if(scalNum>1&&scalNum<=1.1){
				scaleHeightY = 50;
				scaleWidthX = 200;
			}else if(scalNum>1.1){
				scaleHeightY = 30;
			}else if(scalNum>0.8&&scalNum<=1){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2.5;
				scaleHeightY = 20;
			}else if(scalNum>0.7&&scalNum<=0.8){scaleWidthX = Math.abs(width-confWidth)*confScalex/2;}
			else if(scalNum<0.7&&scalNum>=0.6){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2.5+150;
			}else if(scalNum<0.6&&scalNum>0.5){
				scaleWidthX = Math.abs(width-confWidth)*confScalex;
			}
			else{
				scaleHeightY = 1;
			}
		}else if(gcID=='jxncwy'){
			scaleWidthX = 50;
			if(scalNum>1&&scalNum<=1.1){
				scaleHeightY = 50;
				scaleWidthX = 200;
			}else if(scalNum>1.1){
				scaleHeightY = 30;
			}else if(scalNum>0.8&&scalNum<=1){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2+100;
				scaleHeightY = 30;
			}else if(scalNum>0.7&&scalNum<=0.8){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2+100;
				scaleHeightY = 35;
			}
			else if(scalNum<0.7&&scalNum>=0.6){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2.5+150;
			}else if(scalNum<0.6&&scalNum>0.5){
				scaleWidthX = Math.abs(width-confWidth)*confScalex+200;
				scaleHeightY = 20;
			}
		}
		else{
			scaleHeightY = 1;
			if(scalNum<1&&scalNum>=0.8){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2.5;
			}
			else if(scalNum<0.8&&scalNum>=0.6){
				scaleWidthX = Math.abs(width-confWidth)*confScalex;
			}
			else if(scalNum<0.6){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/3;
			}else{
				scaleWidthX = 120;
				scaleHeightY = 30;
			}
		}
	}

}

//十进制颜色转换为十六进制
function colorTransformation(colorStr){
	colorStr = colorStr.toString(16);
	var colorLen = colorStr.length;
	if(colorLen==6){
		colorStr = colorStr;
	}
	if(colorLen==5){
		colorStr = '0'+colorStr;
	}else if(colorLen==4){
		colorStr = '00'+colorStr;
	}else if(colorLen==3){
		colorStr = '000'+colorStr;
	}else if(colorLen==2){
		colorStr = '0000'+colorStr;
	}
	return colorStr.toString();
}

//组件状态集合组装（统一组件同一种状态的不同param命名）
function deviceStateFun(compBindParam){
	var deviceStateStr='';
	if(compBindParam.indexOf('runing') > -1){
		deviceStateStr = 'runing';
	}else if(compBindParam.indexOf('alarm') > -1){
		deviceStateStr = 'alarm';
	}else{
		deviceStateStr = compBindParam;
	}
	return deviceStateStr;
}

//xml对象转化为json对象
function xmlToJson(xml){
	var obj = {};
	if (xml.nodeType == 1) { // element
		if (xml.attributes.length > 0) {
			obj["compAttribute"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["compAttribute"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	}
	else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}
	if(xml.hasChildNodes()){
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined"){
				obj[nodeName] = xmlToJson(item);
			}else {
				if (typeof(obj[nodeName].push) == "undefined"){
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


//Object对象转化为数组,并添加节点名称
var objectToArray = function(dataObj){
	var arrayData = [];
	for(i in dataObj){
		var obj = dataObj[i].compAttribute;
		if(i != '#comment'&&obj){
			//特殊处理，IE对数据集添加节点名称
			obj['nodeName'] = i;
			arrayData.push(dataObj[i]);
		}
	}
	return arrayData;
}


//多层树结果对象转化为数组,并添加节点名称
function treeObjArrayToArray(xmlArray){
	var arrayData = [];
	for(i in xmlArray){
		var nodeName = i;
		var a = xmlArray[i];
		if(a.length>0){
			for(var i=0;i<a.length;i++){
				var obj = a[i];
				obj['nodeName'] = nodeName;
				arrayData.push(obj);
			}
		}else{
			a['nodeName'] = nodeName;
			arrayData.push(a);
		}
	}
	return arrayData;
}


//数据转化为数组工具类
var makeArray = function(obj){
	return Array.prototype.slice.call(obj,0);
}
try{
	Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType;
}catch(e){
	makeArray = function(obj){
		var res = [];
		for(var i=0,len=obj.length; i<len; i++){
			res.push(obj[i]);
		}
		return res;
	}
}



