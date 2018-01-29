var module = angular.module('XCXY');

module.run(['$http','$rootScope',function ($http,$rootScope) {
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
			var xmlString = result.data;
			var xmlDoc=null;
			if(!!window.ActiveXObject || "ActiveXObject" in window){
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(xmlString);
			}
			var xmlObj = xmlToJson(xmlDoc);
			var compObj = xmlObj.Components.Component;
			var componentXMlArray = objectToArray(compObj);
			$rootScope.componentXMlArray = componentXMlArray;
		}
	});

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

}]);


/*module.controller('ReadComponentXMl',['$http','$rootScope','$scope',function ($http,$rootScope,$scope) {
	////加载组态文件信息(测试数据)
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
		if($scope.componentXMlArray&&$scope.mapXMLArray){
			var mapArray = $scope.mapXMLArray;
			var compArray = $scope.componentXMlArray;
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
}]);*/

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
	for(var m=0;m<compCList.length;m++){
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
	// runNumArray = [];
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
												if(compBindParam==paramEnName&&deviceID==paramDeviceID){
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
											if(compBindParam==paramEnName&&deviceID==paramDeviceID){
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
							drawBindDeviceComp(nodeName,url,compData,deviceType,stateName);
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
						drawBindDeviceComp(nodeName, url, compData, 'bgComp',paramType);
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
			myctx.fillText(compData.text, parseInt(compData.x)*confScalex+scaleWidthX+18, parseInt(compData.y)*confScaley+scaleHeightY+15);
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
		var lyzgMark = compData.mark;
		if(nodeName.indexOf('LYZKSB')>-1||nodeName.indexOf('RYZKSB')>-1){
			return;
		}
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
function drawBindDeviceComp(nodeName,url,compData,type,paramType){
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
			//var paramType = compData.param;
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

//绑定设备鼠标点击事件
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
				window.$rootScope.$broadcast('SELECTED_BINDDEVICE_COMP',clickObj)
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
            console.log(clickObj)
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
              console.log(clickObj)
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
		myctx.fillRect(compData.x*confScalex+scaleWidthX,compData.y*confScaley+scaleHeightY+3,width*confScalex,height*confScaley);
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
function clearCanvas(){
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
			if(height>550){
				scaleWidthX = Math.abs(width-confWidth)*confScalex+300;
				confScalex = confScaley = Math.min(width/confWidth,height/confHeight)-0.04;
			}else{
				if(width>1000){
					scaleWidthX = Math.abs(width-confWidth)*confScalex*5;
					scaleHeightY =50;
					confScalex = confScaley = Math.min(width/confWidth,height/confHeight)-0.04;
				}else{
					scaleWidthX = Math.abs(width-confWidth)*confScalex/8;
					scaleHeightY =50;
					confScalex = confScaley = Math.min(width/confWidth,height/confHeight)-0.04;
				}
			}
		}else if(gcID=='jxncwy'){
			if(scalNum<0.527&&scalNum>0.51){
				if(confWidth<1400){
					confScalex = confScaley = Math.min(width/confWidth,height/confHeight)*1.5;
				}else{
					confScalex = confScaley = Math.min(width/confWidth,height/confHeight)*1.2;
				}

				scaleWidthX = Math.abs(width-confWidth)*confScalex;
				scaleHeightY = 10;
			}else{
					if(width<800){
						confScalex = confScaley = Math.min(width/confWidth,height/confHeight);
						scaleWidthX =20;
						scaleHeightY = 10;
					}else{
						if( Math.abs(width-confWidth)<100||Math.abs(width-confWidth)>150){
							confWidth = 1628;
							confScalex = confScaley = Math.min(width/confWidth,height/confHeight);
							scaleWidthX = Math.abs(width-confWidth)*confScalex*7.5;
							scaleHeightY = 10;
						}else{
							confScalex = confScaley = Math.min(width/confWidth,height/confHeight);
							scaleWidthX = Math.abs(width-confWidth)*confScalex/3.5;
							scaleHeightY = 10;
						}

					}

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
			confScalex = confScaley = Math.min(width/confWidth,height/confHeight)-0.05;
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
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2;
				scaleHeightY = 50;
			}else if(scalNum>0.7&&scalNum<=0.8){
				if(height>600){
					scaleWidthX = Math.abs(width-confWidth)*confScalex/2;
					scaleHeightY = 10;
				}else{
					scaleWidthX = Math.abs(width-confWidth)*confScalex*2.2;
					scaleHeightY = 30;
				}

			}
			else if(scalNum<0.7&&scalNum>=0.6){
				//if(height>600){
					scaleWidthX = Math.abs(width-confWidth)*confScalex/2.5+150;
					scaleHeightY = 30;
				/*}else{
					scaleWidthX = Math.abs(width-confWidth)*confScalex/2.5;
					scaleHeightY = 10;
				}*/
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
				if(confWidth<1500||confWidth>1800){
					confWidth = 1624;
				}
				scaleWidthX = Math.abs(width-confWidth)*confScalex*3;
				scaleHeightY = 40;
			}else if(scalNum>0.7&&scalNum<=0.8){
				if(confWidth<1500||confWidth>1800){
					confWidth = 1624;
				}if(scalNum<0.75){
					confWidth = 1700;
				}
				scaleWidthX = Math.abs(width-confWidth)*confScalex*3;
				scaleHeightY = Math.abs(width-confWidth)*confScalex-10;
			}
			else if(scalNum<0.7&&scalNum>=0.6){
				scaleWidthX = Math.abs(width-confWidth)*confScalex/2.5+150;
			}else if(scalNum<0.6&&scalNum>0.5){
				if( Math.abs(width-confWidth)<50||Math.abs(width-confWidth)>150){
					confWidth = 1628;
				}
				scaleWidthX = Math.abs(width-confWidth)*confScalex*7.5;
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
	}else if(colorLen==1){
		colorStr = '00000'+colorStr;
	}
	return colorStr.toString();
}

//组件状态集合组装（统一组件同一种状态的不同param命名）
function deviceStateFun(compBindParam){
	var deviceStateStr='';
	if(compBindParam.indexOf('runing')>-1){
		deviceStateStr = 'runing';
	}else if(compBindParam.indexOf('alarm')>-1){
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
}

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
};

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



// 陈进写的模块
//全局变量
var svgLeft=0
var svgTop=0
var paperLeft=0
var paperTop=0
var jsonData=null
var bigTime=null
var timerAll=null
var timerAlarm=[]
var timerRun=[]
var timerArray=[]
//======
var runIDArray=[]
var runNumArray=[]
var runSpeedArray=[]
//======
var alarmIDArray=[]
var alarmNumArray=[]
var alarmSpeedArray=[]
//===============
var jsonRunIDArray=[]
var jsonAlarmIDArray=[]
//==================
var nodeNameArray=[]
//===============
var deviceIDArray=[]
//装文字对象的数组
var drawTextArray=[]
//文字对象的deviceID
var textDeviceArray=[]
//文字对象的paramID
var textParamArray=[]
//json文字的值
var jsonTextArray=[]
var timer1
var timer2
var timer3
/*
* 部分解析导出的xml文件
* */
function partXML(cptArray,xmlAddress){
  //创建svg画布
  var xmlFileName=xmlAddress
	// console.log(xmlFileName)
  var xmlDoc
  //IE
  if((/Trident\/7\./).test(navigator.userAgent)){
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }else{
    xmlDoc=document.implementation.createDocument("","",null);
  }
  xmlDoc.async=false
  xmlDoc.load(xmlFileName)
  var Configration=xmlDoc.documentElement
  var ConfigWidth=Configration.getAttribute("Width")
  var ConfigHeight=Configration.getAttribute("Height")
  //创建svg画布
  let svg=new Raphael(document.querySelector("#readSVG"),ConfigWidth, ConfigHeight)
  var LIST=xmlDoc.documentElement.childNodes[0]
  var LISTImage=LIST.childNodes[1]
  var LISTImageChildren=LISTImage.childNodes
  // console.log(LISTImage.childNodes.length)
  var Components=xmlDoc.documentElement.childNodes[1]
  var ComponentsChildren=Components.childNodes
  //总长
  var alllength=0
  //第一
  var firstlength=0
  //第二
  var secondlength=0
  var lastlength=0
  alllength=ComponentsChildren.length
  firstlength=parseInt(alllength/6)
  secondlength=firstlength*2
  lastlength=firstlength*4
  // console.time()
  let ai=0
  analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,firstlength,ai)
  // console.timeEnd()
  clearTimeout(timer1)
  clearTimeout(timer2)
  clearTimeout(timer3)
  //第一次延时
  timer1=setTimeout(function () {
    ai=firstlength
    analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,secondlength,ai)
  },60)
	//第二次延时
  timer2=setTimeout(function () {
    ai=secondlength
    analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,lastlength,ai)
  },80)
	//第三次延时
  timer3=setTimeout(function () {
    ai=lastlength
    analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,alllength,ai)

  },100)



}

// 解析导入的xml文件
function analysisXML(svg,cptArray,xmlAddress,ComponentsChildren,ConfigWidth,ConfigHeight,alength,ai) {
  for (var i=ai,m=alength;i<m;i++){
    // var imageSource=ComponentsChildren[i].getAttribute("source");
    var imageSource= '/'+$rootScope.serPath+'/static/'+ComponentsChildren[i].getAttribute("source")
		// console.log(imageSource)
    //如果没有source就从listimg中寻找
    if(!imageSource){
      for(var j=0,n=LISTImageChildren.length;j<n;j++){
        if(ComponentsChildren[i].nodeName===LISTImageChildren[j].nodeName){
          imageSource='/'+$rootScope.serPath+'/static/'+LISTImageChildren[j].getAttribute("source")

        }
      }
    }

    var nodename=ComponentsChildren[i].nodeName
    // console.log(nodename)
    var group=ComponentsChildren[i].getAttribute("group")
    var image=null
    var width=ComponentsChildren[i].getAttribute("width")
    var height=ComponentsChildren[i].getAttribute("height")


    var scaleX=ComponentsChildren[i].getAttribute("scaleX")
    var scaleY=ComponentsChildren[i].getAttribute("scaleY")
    var param=ComponentsChildren[i].getAttribute("param")
    //风扇
    var mark=ComponentsChildren[i].getAttribute("mark")

    var fontSize
    if(ComponentsChildren[i].getAttribute("fontSize")){
      fontSize=ComponentsChildren[i].getAttribute("fontSize")
    }
    var textAlign
    if(ComponentsChildren[i].getAttribute("textAlign")){
      textAlign=ComponentsChildren[i].getAttribute("textAlign")
    }

    var compname=ComponentsChildren[i].getAttribute("compname")
    var deviceID="d"+ComponentsChildren[i].getAttribute("deviceID")
    var deviceName=ComponentsChildren[i].getAttribute("deviceName")
    var isMouseOverTip=ComponentsChildren[i].getAttribute("isMouseOverTip")

    var x=ComponentsChildren[i].getAttribute("x")
    var y=ComponentsChildren[i].getAttribute("y")
    // 文字以paramid标识
    var paramID=ComponentsChildren[i].getAttribute("paramID")
    //20001 63
    var deviceParam=deviceID+paramID
    //组件宽高缩放
    if(scaleX){
      width=parseInt(width)*parseFloat(scaleX)
    }
    if(scaleY){
      height=parseInt(height)*parseFloat(scaleY)
    }

    var rotate=0
    if(ComponentsChildren[i].getAttribute("rotation")){
      rotate=parseInt(ComponentsChildren[i].getAttribute("rotation"))
    }
    // var clonedrawText=document.createElement('span')
    //匹配大背景图片
    if(group==="map"){
      imageSource='/'+$rootScope.serPath+'/static/retailers/'+$rootScope.gcID.toLowerCase()+'/'+ComponentsChildren[i].getAttribute("source")
      width=!width?ConfigWidth:width
      // console.log(width,"width")
      // console.log("aaaaa")
      height=!height?ConfigHeight:height
      var simg = new Image();
      simg.src=imageSource
      // console.log(simg.src)
      $(simg).css({
        cursor:'pointer',
        position:'absolute',
        left:x+"px",
        top:y+"px",
        width:width,
        height:height
      })
      document.querySelector("#readSVG").appendChild(simg)
    }


    //图片====================================
    if(!ComponentsChildren[i].getAttribute("text")) {
      if(group!=="map"){
      // imgnum++
      // console.log(imgnum)
      // var simg=svg.image(imageSource,x,y,width,height)
      var simg = new Image()
      simg.src = imageSource
      // console.log(simg.src)
      $(simg).css({
        cursor: 'pointer',
        position: 'absolute',
        left: x + "px",
        top: y + "px",
        width: width,
        height: height
      })
      //	能不加就不加
      if (rotate) {
        // simg.attr({
        // cursor:'pointer',
        //没有x,y即绕自身中心旋转
        //以坐标x,y进行旋转
        // 'transform':'r'+rotate+','+x+','+y,
        // })
      }
      // simg.mouseover(function (e) {
      //   // .mouseenter(function (e) {
      //   // time = (new Date()).getTime();
      //   // console.log(time)
      //   //鼠标悬停有事件
      //   // if(isMouseOverTip){
      //     // console.log(deviceID)
      //     //改变数据
      //     // $("#deviceName").text(deviceName)
      //     // $("#handAuto").text(handAuto[deviceID]?"自动":"手动")
      //     // $("#hzStatus").text(hzStatus[deviceID])
      //     // $("#inStress").text(inStress[deviceID])
      //     //=======================================
      //     //读取单个json
      //     //getJSON(deviceID,x,y,width,height,ConfigHeight,ConfigWidth)
      //     //======================================
      //   // }
      // })
      // .mouseout(function () {
      //   // $("#infoDiv")
      //   //   .css("display","none")
      // })
      //添加ID
      //是设备图片

      document.querySelector("#readSVG").appendChild(simg)
      if (group === "deviceComp" || group === "commonComp") {
        // simg.node.setAttribute('id',deviceID)
        simg.setAttribute('id', deviceID)
				// console.log($("#"+deviceID))
        // simg.node.setAttribute('display','block')
        $(simg).css('display','block')
        if (deviceID) {
          deviceIDArray.push(deviceID.toString())
        }
        //添加id,速度,数量
        getImgNum(deviceID, nodename, imageSource)
        drawRunAndAlarm(deviceID, nodename, cptArray, x, y, scaleX, scaleY, svg, imageSource, simg)
        //=================================
        $(simg).click(function (e) {
          //  弹窗
          if (e.target.getAttribute("isPop")) {
            //弹窗类型
            let mouseEvent = ""
						let clickObj={}

            switch (e.target.getAttribute("popType")) {
              //  视频
              case "video":
                mouseEvent = "video"
                clickObj.deviceID=e.target.getAttribute("id").substr(1)
                clickObj.popType = "video"
								// console.log(clickObj)
                window.$rootScope.$broadcast('SELECTED_BINDDEVICE_COMP',clickObj);
                // cjbindCompMouseMove(deviceID)
                // console.log("videooooooooooo")
                break;
              //空调
              case "redirect":
                mouseEvent = "redirect"
                break;
              //门禁管理
              case "list":
                mouseEvent = "list"
                deviceID = 1390069
                // getJSON(deviceID,x,y,width,height,ConfigHeight,ConfigWidth,mouseEvent)
                break;
              //  CO探测器
              case "line":
                mouseEvent = "line"
                break;
              //  温度探测器
              case "chart":
                mouseEvent = "chart";
                break;
              //  退出按钮
              case "btn":
                mouseEvent = "btn";
                break;
              //消防摄像机
              case "videoSub":
                mouseEvent = "videoSub";
                break;
              //客流黄色按钮
              case "yBtn":
                mouseEvent = "yBtn";
                break;
              //  客流橙色按钮
              case "oBtn":
                mouseEvent = "oBtn";
                break;
              //客流红色按钮
              case "rBtn":
                mouseEvent = "rBtn";
                break;
              //方法按钮
              case "funcBtn":
                mouseEvent = "funcBtn";
                break;


            }

          }
        })
        //click===========end
      }
      // else{
      // $("#readSVG")[0].innerHTML+=
      //   '<img style="left:'+x+'px; top:'+
      //   y+'px; width:'+ width+'px; height:'+
      //   height+'px; position: absolute; cursor: pointer;" src="'+
      //   imageSource+'">'
      // }


      // $("#readSVG")[0].appendChild(simg)




    }
    }
    //==========else
    //如果是要绘制文字的话===========================================
    else{
      var color=ComponentsChildren[i].getAttribute("color")
      var contentBackgroundColor=ComponentsChildren[i].getAttribute("contentBackgroundColor")
      var contentBackgroundAlpha=ComponentsChildren[i].getAttribute("contentBackgroundAlpha")
			color=color.toString()
      color=color.indexOf("#")===-1?colorTransformation(parseInt(color)):color
      contentBackgroundColor=contentBackgroundColor.indexOf("#")===-1?colorTransformation(parseInt(contentBackgroundColor)):contentBackgroundColor
      // console.log(contentBackgroundColor)
      var fontFamily=ComponentsChildren[i].getAttribute("fontFamily")
      //优先绘制黑色背景框
      // if(fontFamily==="digifaw" || (parseInt(contentBackgroundAlpha)===1 && parseInt(contentBackgroundColor)===0)){
      //   svg.rect(x, y, width?width-5:40, height?height:20).attr({
      //     "fill": "black"
      //   })
      // }
      // svg.rect(x, y, width, height).attr({
      //       "fill": "#"+contentBackgroundColor
      //     })

      var fontWeight=ComponentsChildren[i].getAttribute("fontWeight")
      // var textX=parseInt(x)+parseInt(width?width-5:40)/2
      var textX=parseInt(x)
      // var textY=parseInt(y)+parseInt(height?height:20)/2
      var textY=parseInt(y)
      var text=ComponentsChildren[i].getAttribute("text")
      //绘制文字
      var drawText=document.createElement('span')
      drawText.innerText=text
      $(drawText).css({
        "font-size":fontSize+"px",
        "text-align":textAlign,
        cursor:'pointer',
        color:'#'+color,
        'text-anchor':'middle',
        'font-family':fontFamily,
        'font-weight':fontWeight,
        position:'absolute',
        left:textX+"px",
        top:textY+"px",
        backgroundColor:'#'+contentBackgroundColor
      })
      // drawText.attr({
      //   "font-size":fontSize+"px",
      //   "text-align":textAlign,
      //   cursor:'pointer',
      //   'fill':color,
      //   'text-anchor':'middle',
      //   'font-family':fontFamily,
      //   'font-weight':fontWeight
      // })
      //给文字加id
      // drawText.node.setAttribute("deviceId",deviceID)
      // drawText.node.setAttribute("paramId",paramID)

      if(deviceID){
        drawText.setAttribute("deviceId",deviceID)
      }
      if(paramID){
        drawText.setAttribute("paramId",paramID)
      }
      // $("#readSVG")[0].appendChild(drawText)
      document.querySelector("#readSVG").appendChild(drawText)

      //=================================
      //根据json绘制文字
      // if(fontFamily==="digifaw"){
      // drawTextArray.push(drawText)
      // textDeviceArray.push(deviceID)
      // textParamArray.push(paramID)
      // if(paramID == 63 && deviceID==30005){
      // console.log("aaa")
      // drawTextArray.push(drawText)
      // }
      // }
    }
    //====================================上面是文字





  }
  //=============循环

  //设置画布的属性
  // var svgEle=document.querySelector("svg")
  // svgEle.style.border="1px red solid"
  //居中
  // svgEle.style.left='50%'
  // svgEle.style.top='50%'
  // svgEle.style.marginLeft="-"+parseInt(ConfigWidth)/2+"px"
  // svgEle.style.marginTop="-"+parseInt(ConfigHeight)/2+"px"
  // paperLeft=parseInt($("#readSVG").css("width"))/2-parseInt(ConfigWidth)/2
  // paperTop=parseInt($("#readSVG").css("height"))/2-parseInt(ConfigHeight)/2
  // var children=svgEle.childNodes
}

//缩放
// function scale(r) {
//   var readSVG=$("#readSVG")
//   // $(document.body).css("-ms-transform","scale("+r+")")
//   readSVG.css("-ms-transform","scale("+r+")")
//   $(window).resize(function() {
//     // $(document.body).css("-ms-transform","scale("+r+")")
//     readSVG.css("-ms-transform","scale("+r+")")
//   })
// }

//滚轮滚动
// function mouseWheel() {
//   var r=1
//   window.addEventListener("mousewheel",function(event){
//     event.delta = event.wheelDelta /120
//     //1为向上滚动，放大
//     if(event.delta===1){
//       r+=0.1
//     }else if(event.delta===-1){
//       r-=0.1
//     }
//     // scale(r)
//   },false)
//   // dragSVG()
// 	// console.log("drag")
// }

//拖拽画布
// function dragSVG() {
//   var readSVG=document.querySelector("#readSVG")
//   readSVG.onmousedown=function (event) {
//     readSVG.setCapture && readSVG.setCapture()
//     event=event || window.event
//     //求div的偏移量
//     var ol=event.clientX - readSVG.offsetLeft
//     var ot=event.clientY-readSVG.offsetTop
//     document.onmousemove=function (event) {
//       // console.log("onmousemove")
//       event=event || window.event
//       var mouseLeft=event.clientX
//       var mouseTop=event.clientY
//       var divLeft=mouseLeft-ol
//       var divTop=mouseTop-ot
//       svgLeft=divLeft
//       svgTop=divTop
//       readSVG.style.left=divLeft+"px"
//       readSVG.style.top=divTop+"px"
//     }
//     //若给box1绑定，若有其他兄弟div，则会触发其他div的点击
//     //事件，而不是box1的
//     document.onmouseup=function () {
//       document.onmousemove=null;
//       //当onmousemove销毁后，onmouseup仍然存在，故要销毁
//       document.onmouseup=null;
//       //当鼠标松开取消捕获
//       //兼容IE8
//       readSVG.releaseCapture && readSVG.releaseCapture();
//     }
//     //拖拽时取消浏览器搜索引擎的行为
//     return false
//   }
// }

function getJSON(deviceID,x,y,width,height,ConfigHeight,ConfigWidth) {
  var $infoDiv= $("#infoDiv")
  $infoDiv.empty();//清空内容
  var tbody= document.createElement('tbody');
  tbody.className = 'infoTr';
  tbody.innerHTML="<tr><td>设备</td><td>位置</td><td>参数</td><td>参数值</td></tr>"
  //ajax======================
  var param={}
  var httpUrl
  param.gcID='JSCZJTWY'
  param.device=deviceID.toString()
  httpUrl=$rootScope.reqPath+'/configurationService/getDeviceParam?falg='+Math.random()
  //请求
  $.ajax({
    type:'get',
    // type:'post',
    url:httpUrl,
    data:{'str':JSON.stringify(param) },
    success:function (data) {
      data=JSON.parse(data)
      // console.log(data)
      for(var j=0,groups=data.result,n=groups.length;j<n;j++){
        tbody.innerHTML+="<tr><td>"+groups[j].deviceName+"</td><td>位置</td><td>"+groups[j].paramName+"</td><td>"+groups[j].statusEnValue+"</td></tr>"
        $infoDiv[0].appendChild(tbody)
      }
    },
    error:function (err) {
    }
  })
  //=========================

  //让显示框不出画布
  var showHeight=parseInt(y)+parseInt(height)+10+parseInt(svgTop)+parseInt(paperTop)
  var showWidth=parseInt(x)+parseInt(width)+10+parseInt(svgLeft)+parseInt(paperLeft)
  var cha1=showHeight+parseInt($infoDiv.css("height"))-parseInt(paperTop)-ConfigHeight
  var cha2=showWidth+parseInt($infoDiv.css("width"))-parseInt(paperLeft)-ConfigWidth
  if(cha1>0 && cha2>0){
    $infoDiv
      .css("left",showWidth-cha2+"px")
      .css("top",showHeight-cha1+"px")
      .css("display","block")
  } else if(cha1>0 && cha2<=0)
  {
    $infoDiv
      .css("left",showWidth+"px")
      .css("top",showHeight-cha1+"px")
      .css("display","block")

  }else if(cha1<=0 && cha2>0){
    $infoDiv
      .css("left",showWidth-cha2+"px")
      .css("top",showHeight+"px")
      .css("display","block")
  }
  else{
    //显示栏
    $infoDiv
    //位置
      .css("left",showWidth+"px")
      .css("top",showHeight+"px")
      .css("display","block")
  }



}

//画配置图片
function drawRunAndAlarm(deviceID,nodename,cptArray,x,y,scaleX,scaleY,svg,trueImgSource,simg) {
// console.log(document.getElementById(deviceID))
// console.log(deviceID)
	//读取配置文件
  //在添加好图片的基础上再去添加它的运行，报警图片
  //背景是bg的，画新的alarm
  //背景是alarm的，不用画
  // if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID+deviceID) && document.getElementById(deviceID).getAttribute("href").indexOf("alarm")===-1) {
  if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID+deviceID) && document.getElementById(deviceID).getAttribute("src").indexOf("alarm")===-1) {
    if (cptArray[nodename]) {
      //有的图是用alarm画的，有alarm就不画报警图了
      if (cptArray[nodename]["alarm"] && trueImgSource.indexOf("alarm") === -1) {
        var imgSource = cptArray[nodename]["alarm"]["imgSource"]
        var imgX = parseInt(cptArray[nodename]["alarm"]["imgX"]) * parseFloat(scaleX) + parseInt(x)
        var imgY = parseInt(cptArray[nodename]["alarm"]["imgY"]) * parseFloat(scaleY) + parseInt(y)
        var imgWidth = parseInt(cptArray[nodename]["alarm"]["imgWidth"]) * parseFloat(scaleX)
        var imgHeight = parseInt(cptArray[nodename]["alarm"]["imgHeight"]) * parseFloat(scaleY)
        //画图
        var imgRun = svg.image(imgSource, imgX, imgY, imgWidth, imgHeight)
          .attr({
            cursor: 'pointer',
          })
        // imgRun.node.setAttribute("id", deviceID + deviceID + deviceID)
        imgRun.setAttribute("id", deviceID + deviceID + deviceID)
      }
    }
  }
  //=====================画报警图end
  // console.log($("#"+deviceID))
  //防止重新绘画=====================
  if(document.getElementById(deviceID) && !document.getElementById(deviceID+deviceID)){
  // if($("#"+deviceID) && !$("#"+deviceID+deviceID)){
  //   console.log("aaaaa")
  	// if($("#"+deviceID) && !$("#"+deviceID+deviceID)){
    if(cptArray[nodename]) {
      //run
      if (cptArray[nodename]["running"]) {
        var imgSource = cptArray[nodename]["running"]["imgSource"]
        var imgX = parseInt(cptArray[nodename]["running"]["imgX"]) * parseFloat(scaleX) + parseInt(x)
        var imgY = parseInt(cptArray[nodename]["running"]["imgY"]) * parseFloat(scaleY) + parseInt(y)
        var imgWidth = parseInt(cptArray[nodename]["running"]["imgWidth"]) * parseFloat(scaleX)
        var imgHeight = parseInt(cptArray[nodename]["running"]["imgHeight"]) * parseFloat(scaleY)
        //画图
        var imgRun = svg.image(imgSource, imgX, imgY, imgWidth, imgHeight)
          .attr({
            cursor: 'pointer',
          })
        imgRun.node.setAttribute("id", deviceID + deviceID)
      }
    //  run===end============
      //  设置悬浮，点击属性==================
      if (cptArray[nodename]["mouseEvent"]) {
        // console.log(cptArray[nodename]["mouseEvent"])
        let isPop=cptArray[nodename]["mouseEvent"]["isPop"]
        let popType=cptArray[nodename]["mouseEvent"]["popType"]
        let isToolTip=cptArray[nodename]["mouseEvent"]["isToolTip"]
        // console.log(isPop)
        //设置mouse属性
        if(isPop){
          // simg.node.setAttribute('isPop',"true")
          simg.setAttribute('isPop',"true")
          // simg.node.setAttribute('popType',popType)
          simg.setAttribute('popType',popType)
					// console.log("aaaaa")
        }
        if(isToolTip){
          // simg.node.setAttribute('isToolTip',"true")
          simg.setAttribute('isToolTip',"true")
        }
      }


    }
  }
//======================

}

function jsonStatus(address) {

  //注意清空
  jsonAlarmIDArray=[]
  jsonRunIDArray=[]
  jsonTextArray=[]
  var param={}
  var httpUrl
  param.gcID='JSCZJTWY'
  param.device=deviceIDArray.toString()
  httpUrl='http://192.168.1.15:8888/XYCloudService/configurationService/getDeviceParam?falg='+Math.random()
  //请求
  $.ajax({
    type:'get',
    // type:'post',
    url:httpUrl,
    data:{'str':JSON.stringify(param) },
    success:function (data) {
      data=JSON.parse(data)
      // console.log(data)
      for(var j=0,groups=data.result,n=groups.length;j<n;j++){
        //===================alarm
        if (groups[j].paramID === 2 && groups[j].statusValue === "1") {
          var id = groups[j].deviceID
          jsonAlarmIDArray.push(id)
          // console.log(jsonAlarmIDArray)
        }else
        //运行，即动画
        //=============run
        if (groups[j].paramID === 1 && groups[j].statusValue === "1") {
          var id = groups[j].deviceID
          jsonRunIDArray.push(id)
        }

        if(groups[j].paramID === 63 && groups[j].deviceID===30005){
          jsonTextArray.push(groups[j].statusEnValue)
        }

        // for(var i=0,m=textParamArray.length;i<m;i++){
        //   if (groups[j].paramID+'' === textParamArray[i]+'' && groups[j].deviceID+'' === textDeviceArray[i]+'') {
        //     jsonTextArray.push(textParamArray[i])
        //     break;
        //   }
        // }


      }
    },
    error:function (err) {
    }

  })


}

function analysisCompoentsOne() {
  var compoentsArray={}
  // console.log("aaa")
  var xmlFileName='/'+$rootScope.serPath+'/static/assets/comp/data/Components.xml'
  var xmlDoc
  //IE
  if((/Trident\/7\./).test(navigator.userAgent)){
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }else{
    xmlDoc=document.implementation.createDocument("","",null);
  }
  xmlDoc.async=false
  xmlDoc.load(xmlFileName)
  // var Components=xmlDoc.documentElement
  var Component=xmlDoc.documentElement.childNodes[0]
  var ComponentChildren=Component.childNodes
  for(var i=0,m=ComponentChildren.length;i<m;i++){
    //节点名
    var childName=ComponentChildren[i].nodeName
    //节点名下的孩子
    var child=ComponentChildren[i].childNodes
    compoentsArray[childName]={}
    compoentsArray[childName]["running"]={}
    compoentsArray[childName]["alarm"]={}
    compoentsArray[childName]["mouseEvent"]={}
    //==========获取点击，悬浮属性
    if(ComponentChildren[i].childNodes[0] && ComponentChildren[i].getAttribute("isPop")==="true"){
      compoentsArray[childName]["mouseEvent"]["isPop"]=ComponentChildren[i].getAttribute("isPop")
      compoentsArray[childName]["mouseEvent"]["popType"]=ComponentChildren[i].getAttribute("popType")
    }
    if(ComponentChildren[i].childNodes[0] && ComponentChildren[i].getAttribute("isToolTip")==="true"){
      compoentsArray[childName]["mouseEvent"]["isToolTip"]=ComponentChildren[i].getAttribute("isToolTip")
    }
    //=====================
    if(child){
      // console.log(childName)
      //读取除第一个子节点的图片，如运行和报警
      for(var j=0,n=child.length;j<n;j++){
        if(child[j].getAttribute("param")==="runing"){
          compoentsArray[childName]["running"]["imgX"]=child[j].getAttribute("x")
          compoentsArray[childName]["running"]["imgY"]=child[j].getAttribute("y")
          compoentsArray[childName]["running"]["imgWidth"]=child[j].getAttribute("width")
          compoentsArray[childName]["running"]["imgHeight"]=child[j].getAttribute("height")
          compoentsArray[childName]["running"]["imgSource"]=child[j].getAttribute("source")
        }
        if(child[j].getAttribute("param")==="alarm"){
          compoentsArray[childName]["alarm"]["imgX"]=child[j].getAttribute("x")
          compoentsArray[childName]["alarm"]["imgY"]=child[j].getAttribute("y")
          compoentsArray[childName]["alarm"]["imgWidth"]=child[j].getAttribute("width")
          compoentsArray[childName]["alarm"]["imgHeight"]=child[j].getAttribute("height")
          compoentsArray[childName]["alarm"]["imgSource"]=child[j].getAttribute("source")
        }
      }
    }
  }

  return compoentsArray
}

//获取图片数量
function getImgNum(deviceID,nodeName,imageSource) {
  //转动数量
  var runNum = 3
  //转动速率
  var runSpeed = 80
  var alarmSpeed = 910
  var alarmNum=1
  if(nodeName.indexOf('LQT')>-1){
    runNum = 10
    runSpeed = 40
    alarmSpeed = 910
  }else if(nodeName.indexOf('LQB')>-1){
    runNum = 3;
    runSpeed = 80;
    alarmSpeed = 910
  }else if(nodeName.indexOf('LGJZ')>-1){
    runNum = 12;
    runSpeed = 90
    alarmSpeed = 910
  }else if(nodeName.indexOf('LXJZ')>-1){
    runNum = 5;
    runSpeed = 60
    alarmSpeed = 910
  }else if(nodeName.indexOf('RQGL')>-1){
    runNum = 30
    runSpeed = 80
    alarmSpeed = 910
  }else if(nodeName.indexOf('BSHX')>-1){
    runNum = 6
    runSpeed = 60
    alarmSpeed = 910
  }

  if(nodeName==="BSB2" || nodeName==="BSB1" ||
    nodeName==="DRFM" || nodeName==="EAF" ||
    nodeName==="EAF1" || nodeName==="EAF2" ||
    nodeName==="FPG" || nodeName==="PWB" ||
    nodeName==="PWB1" || nodeName==="RGSHU" ||
    nodeName==="LQB" || nodeName==="RQGL" ||
    nodeName==="SAF" || nodeName==="SAF1" ||
    nodeName==="SAF2"){
    // alarmNum=16
    alarmNum=2
    // console.log(alarmNum)
  }else{
    alarmNum=1
  }

  runIDArray.push(deviceID+deviceID)
  runSpeedArray.push(runSpeed)
  runNumArray.push(runNum)

  //有alarm
  if(imageSource.indexOf("alarm")>-1){
    alarmIDArray.push(deviceID)
  }else{
    alarmIDArray.push(deviceID+deviceID+deviceID)
  }
  alarmSpeedArray.push(alarmSpeed)
  alarmNumArray.push(alarmNum)

  nodeNameArray.push(nodeName)
}

//运行和报警和绘制文字
function runAndAlarm() {
  var aa = 2
  var address
  var bb = 8

  timerAll=setInterval(function () {
    //清除运行定时器
    for(var aa in timerRun){
      clearTimeout(timerRun[aa])
    }
    //清除报警定时器
    for(var bb in timerAlarm){
      clearTimeout(timerAlarm[bb])
    }

    //获取运行，报警数组和文字
    jsonStatus()
    // console.log(jsonTextArray)
    //根据json绘制文字
    // if(group.deviceID===parseInt(deviceID) && group.paramID===parseInt(paramID) ) {
    //   drawTextArray[0].attr({text: jsonTextArray[0]})
    // console.log(drawTextArray[0]);
    //   return false
    // }

    //绘制文字=============================

    //alarm===================
    // console.log(alarmIDArray)
    for(var i=0,n=jsonAlarmIDArray.length;i<n;i++){
      // console.log(jsonAlarmIDArray[i])
      for(var j=0,m=alarmIDArray.length;j<m;j++){

        //本来背景是报警图
        if((jsonAlarmIDArray[i]+"")===alarmIDArray[j]+""){

          var id=alarmIDArray[j]

          var realJ=j
          var alarmnum=8
          var alarmnumOne=0
          //配置里报警有
          if(alarmNumArray[j]===2){
            // console.log(id,alarmNumArray[j])
            // if(id===20001){
            //   console.log(address)
            // }

            function funcTimeAlarmOne() {
              if(alarmnum>9) {
                alarmnum = 8
              }
              $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/"+alarmnum+".png")
              alarmnum++
              timerAlarm.push(setTimeout(funcTimeAlarmOne,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmOne()

          }else{
            function funcTimeAlarmTwo() {
              if(alarmnumOne>1) {
                alarmnumOne =0
              }
              $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/1.png")
              alarmnumOne++
              timerAlarm.push(setTimeout(funcTimeAlarmTwo,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmTwo()
          }
          //=======================
          //符合条件就break
          break;
        }else if((jsonAlarmIDArray[i]+""+jsonAlarmIDArray[i]+""+jsonAlarmIDArray[i]+"")===alarmIDArray[j]+""){
          var alarmnum=8
          var id=alarmIDArray[j]
          var realJ=j
          var alarmnumOne=0
          if(alarmNumArray[j]===1){

            function funcTimeAlarmThree() {
              if(alarmnumOne>1) {
                alarmnumOne =0
              }
              $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/"+alarmnumOne+"/1.png")
              // $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[j] + "/alarm/1/1.png")
              alarmnumOne++
              timerAlarm.push(setTimeout(funcTimeAlarmThree,alarmSpeedArray[realJ]))
            }
            funcTimeAlarmThree()
          }else {
            function funcTimeAlarm() {
              if (alarmnum > 9) {
                alarmnum = 8
              }
              $("#" + id)[0].setAttribute("href", "assets/comp/" + nodeNameArray[realJ] + "/alarm/1/" + alarmnum + ".png")
              alarmnum++
              timerAlarm.push(setTimeout(funcTimeAlarm, alarmSpeedArray[realJ]))
            }

            funcTimeAlarm()
            //=======================
            //符合条件就break
          }
          break;
        }
      }
    }
    //alarm===============================


    //  run=====================
    for(var i=0,n=jsonRunIDArray.length;i<n;i++){
      // console.log(jsonRunIDArray[i]+jsonRunIDArray[i])
      for(var j=0,m=runIDArray.length;j<m;j++){
        //拼接看有没有在运行数组里面
        if((jsonRunIDArray[i]+""+jsonRunIDArray[i]+"")===runIDArray[j]+""){
          // console.log(address)
          var runnum=1
          var id=runIDArray[j]
          var realJ=j

          //  =====================
          function funcTimeRun() {
            if(runnum>runNumArray[realJ]) {
              runnum = 1
            }
            $("#"+id)[0].setAttribute("href","assets/comp/" + nodeNameArray[realJ] + "/runing/1/" + runnum + ".png")
            runnum++
            timerRun.push(setTimeout(funcTimeRun,runSpeedArray[realJ]))
          }
          funcTimeRun()
          //=======================
          //符合条件就break
          break;
        }
      }
    }
    //run=====================

    aa++
  }, 6000)


}

function cjbindCompMouseMove(deviceId){
	let clickObj={}
	clickObj.deviceID=deviceId
  if(IS_MOVE_FLAGE&&isOpenWinInt>0){
    //alert('2');
    //confScope.$emit('MOUSE_OUT_BINDDEVICE_COMP',clickObj);
    isOpenWinInt = 0;
    IS_MOVE_FLAGE = false;
    oldDeviceID = '';
    window.$rootScope.$broadcast('MOUSE_OUT_BINDDEVICE_COMP',clickObj);

  }
}
