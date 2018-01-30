var app=angular.module('XCXY');
//暖通空调
app.controller('hvacCtrl',['$scope','$rootScope','$http','$interval','$compile','$templateCache',function($scope,$rootScope,$http,$interval,$compile,$templateCache){
	//主控台部分====================
	for(var j=0;j<$('#sub_menu .sub_first>li>a>span').length;j++){
		if($('#sub_menu .sub_first>li>a>span')[j].innerHTML == '主控台'){
			$('#sub_menu .sub_first').css('display','block');
			$('#sub_menu .sub_first>li>a>span')[j].className = 'subMenuFont';
		}
	}
  //默认显示主控台
	if(!($scope.hasOwnProperty('isHomePage') || $scope.hasOwnProperty('isHomePage'))){
		$scope.isHomePage = true;
		$scope.isDeviceList = false;
		$scope.isConfig = false;
	}

  //从其他菜单切换至暖通
    if($rootScope.config){
    	$scope.homePageContent = $rootScope.config.hvacHomePage.flag.split(',');
    }
  //暖通空调系统刷新
    $scope.$on('configUpdateFinished',function(){
		$scope.homePageContent = $rootScope.config.hvacHomePage.flag.split(',');
	})

	$scope.fjpgParamHome = {handAuto:'1',deviceName:'风机盘管',startStop:'-1'};   //风机盘管参数
	$scope.$watch('fjpgParamHome.handAuto',function(){if($scope.fjpgParamHome.handAuto==1){$scope.fjpgParamHome = {handAuto:'1',deviceName:'风机盘管',startStop:'-1'}; }});
	$scope.dzktParamHome = {handAuto:'1',deviceName:'吊装式空调机组',startStop:'-1',snwd:''};   //吊装式空调机组参数
	$scope.$watch('dzktParamHome.handAuto',function(){if($scope.dzktParamHome.handAuto==1){$scope.dzktParamHome = {handAuto:'1',deviceName:'吊装式空调机组',startStop:'-1',snwd:''}; }});
	$scope.xfjzParamHome = {handAuto:'1',deviceName:'新风机组',startStop:'-1',sfwd:''};   //新风机组参数
	$scope.$watch('xfjzParamHome.handAuto',function(){if($scope.xfjzParamHome.handAuto==1){$scope.xfjzParamHome = {handAuto:'1',deviceName:'新风机组',startStop:'-1',sfwd:''}; }});
	$scope.spfjParamHome = {handAuto:'1',deviceName:'送排风机',startStop:'-1'};   //送排风机参数
	$scope.$watch('spfjParamHome.handAuto',function(){if($scope.spfjParamHome.handAuto==1){$scope.spfjParamHome = {handAuto:'1',deviceName:'送排风机',startStop:'-1'};}});
	$scope.zhsktParamHome = {handAuto:'1',deviceName:'组合式空调机组',startStop:'-1',sfwd:'',hfwd:'',co2_1:''};   //组合式空调机组参数
	$scope.$watch('zhsktParamHome.handAuto',function(){if($scope.zhsktParamHome.handAuto==1){$scope.zhsktParamHome = {handAuto:'1',deviceName:'组合式空调机组',startStop:'-1',sfwd:'',hfwd:'',co2_1:''};}});
	$scope.rjhxfjParamHome = {handAuto:'1',device:'热交换新风机组',startStop:'-1',sfwd:'',co2_2:''};   //热交换新风机组参数
	$scope.$watch('rjhxfjParamHome.handAuto',function(){if($scope.rjhxfjParamHome.handAuto==1){$scope.rjhxfjParamHome = {handAuto:'1',device:'热交换新风机组',startStop:'-1',sfwd:'',co2_2:''};}});
	//暖通空调主控台的设定===========================
	$scope.homePageApply = function(obj){
		$scope.curHomePage = obj;
		if($scope.curHomePage.startStop == '-1'){
			alert('启停设定不能为空');
			return;
		}
		if($scope.curHomePage === $scope.dzktParamHome){
			if($scope.dzktParamHome.snwd == ''){
				alert('室内温度设定不能为空');
				return;
			}
		}
		if($scope.curHomePage === $scope.xfjzParamHome){
			if($scope.dzktParamHome.sfwd == ''){
				alert('送风温度设定不能为空');
				return;
			}
		}
		if($scope.curHomePage === $scope.zhsktParamHome){
			if($scope.zhsktParamHome.sfwd == ''){
				alert('送风温度设定不能为空');
				return;
			}
			if($scope.zhsktParamHome.hfwd == ''){
				alert('回风温度设定不能为空');
				return;
			}
			if($scope.zhsktParamHome.co2_1 == ''){
				alert('回风CO2浓度设定不能为空');
				return;
			}
		}
		if($scope.curHomePage === $scope.rjhxfjParamHome){
			if($scope.rjhxfjParamHome.sfwd == ''){
				alert('送风温度设定不能为空');
				return;
			}
			if($scope.rjhxfjParamHome.co2_2 == ''){
				alert('回风CO2浓度设定不能为空');
				return;
			}
		}
		var contain = angular.element(document.querySelector("#popUp")).css('display','block');//显示弹窗
    	contain.append($compile($templateCache.get('hvacConfirm'))($scope));
	}

  //关闭弹窗
	$scope.popOff = function(){
		angular.element(document.querySelector("#popUp")).css('display','none').empty();
	}

	//温度控制命令
	$scope.homdPageOK =function(){
		if($('#opreasonSel').prop('selectedIndex') == 0){
			alert('请先选择修改原因');
			return;
		}
		var param = {};
		param.gcID = $rootScope.gcID;
		if($scope.curHomePage === $scope.fjpgParamHome){
			param.deviceName = $scope.curHomePage.deviceName;
			param.deviceTypeID = 17;
			param.paramArray='['+'{"paramID":'+11+',"statusValue":'+parseInt($scope.fjpgParamHome.startStop)+'}]';
		}
		if($scope.curHomePage === $scope.dzktParamHome){
			if($scope.dzktParamHome.snwd == ''){
				alert('室内温度设定不能为空');
				return;
			}
			param.deviceName = $scope.curHomePage.deviceName;
			param.deviceTypeID = 112;
			param.paramArray='['+'{"paramID":'+11+',"statusValue":'+parseInt($scope.dzktParamHome.startStop)+'},'
								+'{"paramID":'+10+',"statusValue":'+$scope.dzktParamHome.snwd+'}]';
		}
		if($scope.curHomePage === $scope.xfjzParamHome){
			if($scope.dzktParamHome.sfwd == ''){
				alert('送风温度设定不能为空');
				return;
			}
			param.deviceName = $scope.curHomePage.deviceName;
			param.deviceTypeID = 111;
			param.paramArray='['+'{"paramID":'+11+',"statusValue":'+parseInt($scope.xfjzParamHome.startStop)+'},'
								+'{"paramID":'+7+',"statusValue":'+$scope.dzktParamHome.sfwd+'}]';
		}
		if($scope.curHomePage === $scope.spfjParamHome){
			param.deviceName = $scope.curHomePage.deviceName;
			param.deviceTypeID = 108;
			param.paramArray='['+'{"paramID":'+11+',"statusValue":'+parseInt($scope.spfjParamHome.startStop)+'}]';
		}
		if($scope.curHomePage === $scope.zhsktParamHome){
			if($scope.zhsktParamHome.sfwd == ''){
				alert('送风温度设定不能为空');
				return;
			}
			if($scope.zhsktParamHome.hfwd == ''){
				alert('回风温度设定不能为空');
				return;
			}
			if($scope.zhsktParamHome.co2_1 == ''){
				alert('回风CO2浓度设定不能为空');
				return;
			}
			param.deviceName = $scope.curHomePage.deviceName;
			param.deviceTypeID = 110;
			var str = "[";
			str += '{"paramID":'+11+',"statusValue":'+parseInt($scope.zhsktParamHome.startStop)+'},';
			str += '{"paramID":'+42+',"statusValue":'+$scope.zhsktParamHome.sfwd+'},';
			str += '{"paramID":'+41+',"statusValue":'+$scope.zhsktParamHome.hfwd+'},';
			str += '{"paramID":'+40+',"statusValue":'+$scope.zhsktParamHome.co2_1+'}]';
			param.paramArray=str;
		}
		if($scope.curHomePage === $scope.rjhxfjParamHome){
			if($scope.rjhxfjParamHome.sfwd == ''){
				alert('送风温度设定不能为空');
				return;
			}
			if($scope.rjhxfjParamHome.co2_2 == ''){
				alert('回风CO2浓度设定不能为空');
				return;
			}
			param.deviceName = $scope.curHomePage.deviceName;
			param.deviceTypeID = 111;
			var str = "[";
			str += '{"paramID":'+11+',"statusValue":'+parseInt($scope.rjhxfjParamHome.startStop)+'},';
			str += '{"paramID":'+10+',"statusValue":'+$scope.rjhxfjParamHome.sfwd+'},';
			str += '{"paramID":'+40+',"statusValue":'+$scope.rjhxfjParamHome.co2_2+'}]';
			param.paramArray=str;
		}
		var logData={};
		logData.gcID = $rootScope.gcID;
		logData.oldValue="";
		logData.newValue="";
		logData.logTypeID=1;
		logData.logItemID=7;
		logData.userID=$rootScope.curUser.userID;
		logData.opReason=$scope.curHomePage.opReason;
		logData.opTypeName='主控台应用下发';
		logData.opName='主控台应用下发';
		logData.opTypeID=6;//下发指令
		logData.userIP=$rootScope.userClientIP;
		logData.systemID = 2;
		logData.deviceID=0;
		logData.logContent=$rootScope.curUser.userName + "在主控台对"+$scope.curHomePage.deviceName+"应用下发"; 
		
		param.logData=logData;
		console.log(param);
		$http({
            method:'GET',
            url:$rootScope.reqPath+'/configurationService/ConsoledispatchCommand'+'?flag='+Math.random(),
            params:{'deviceStr':JSON.stringify(param)}
        }).then(function (obj){
            if(obj.data){
            	if(!JSON.parse(obj.data).errorID){
            		alert('命令下发成功');
            		$scope.popOff();
            	}
            } 
        });
	}

	//获取输出设备的值==================
	$scope.getConsoleparamStatusValue =function(){
        $http({
            method:'GET',
            url:$rootScope.reqPath+'/configurationService/consoleparamStatusValue'+'?flag='+Math.random(),
            params:{'consolestr':JSON.stringify({"gcID":$rootScope.gcID})}
        }).then(function (obj){
            if(obj.data){
            	if(!JSON.parse(obj.data).errorID == 0){
            		var temp = JSON.parse(obj.data);
            		$scope.fjpgjson = temp.fjpgjson;
            		$scope.dzjson = temp.dzjson;
            		$scope.xfjson = temp.xfjson;
            		$scope.zzktObj = temp.zzktObj;
            		$scope.zkajson = temp.zkajson;
            		$scope.spfjson = temp.spfjson;
            	}
            } 
        });
    }

    $scope.getConsoleparamStatusValue();
  //设置定时器，主控台刷新，每5秒刷新一次数据
  //   var timer=$interval($scope.getConsoleparamStatusValue, 60000, -1);
    
    //更新界面
    $scope.curMenu = {};
  //切换菜单重新绘图
    $scope.switchMenu = function(event,data){
    	$('#mousePopUp').css('display','none');
    	$scope.curMenu = data;
    	// console.log(data,'data')
    	// $interval.cancel(timer);
    	$interval.cancel(timer1)
      //系统结构图？======
    	if(data.sysType != 1){
    		$scope._type = 0;
    		$scope.isHomePage = false;
    		$scope.isConfig = true;
    		$scope.isDeviceList = false;
    		if(data.mapUrl){
          $scope.refreshConfig()
    			// setTimeout(,100);
    		}
    	}
    	//系统平面图？========
    	else{
    		$scope.isHomePage = true;
    		$scope.isConfig = false;
    		$scope.isDeviceList = false;
    		// console.log('系统平面图')
    		timer=$interval($scope.getConsoleparamStatusValue, 60000, -1);
    	}
    }

    //更新组态
   	// 冷源
		$scope.lyDeviceID = 1720001;
    $scope.lyDeviceID1 = 2270001;
    $scope.lyDeviceID2 = 2390001;
    //热源
    $scope.ryDeviceID = 2320001;
    $scope.ryDeviceID1 = 2500001;
    $scope._type = -1 ; //0表示平面图，1表示单设备结构图
    $scope.currentdevice = "";
    //画图=================
    $scope.refreshConfig = function(){
      $('#readSVG').empty()

    	// let can = document.getElementById('drawGroup');
      // can.width = $('.hvac_config').innerWidth();
      // can.height = $('.hvac_config').innerHeight();
      //创建svg画布
      let svg=new Raphael(document.querySelector("#readSVG"),$('.hvac_config').innerWidth(), $('.hvac_config').innerHeight())
			let httpUrl = '/'+$rootScope.serPath+'/static/'+$scope.curMenu.mapUrl;
		if(arguments.length !== 0){
			httpUrl = '/'+$rootScope.serPath+'/static/'+arguments[0].url;
		}
      // deviceIDArray=[]
			drawTextArray=[]
      // alarmIDArray=[]
      // runIDArray=[]
      jsonRunIDArray=[]
      jsonAlarmIDArray=[]
      //同步
      $.ajaxSettings.async = false;
      let cptArray=analysisCompoentsOne();
      //画图
      partXML(cptArray,httpUrl,svg)
      //动图
      runAndAlarm($rootScope.reqPath+'/configurationService/getDeviceParam'+'?flag='+Math.random());

      console.log(httpUrl,'httpUrl')
		// 从后台获取xml数据========

		// $http({
		// 	method:'GET',
		// 	url:httpUrl
		// }).then(function (result){
		// 	if(result.data){
		// 		var xmlString = result.data;
		// 		var xmlDoc=null;
		// 		if(!!window.ActiveXObject || "ActiveXObject" in window){
		// 			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		// 			xmlDoc.async = "false";
		// 			xmlDoc.loadXML(xmlString);
		// 		}
		// 		//xml对象转化为json对象
		// 		var xmlObj = xmlToJson(xmlDoc);
		// 		var confData = xmlObj.Configration.compAttribute;
		// 		if(confData){
		// 			$scope.configrationWidth = confData.Width;
		// 			$scope.configrationHeight = confData.Height;
		// 		}
		// 		var xmlArray = xmlObj.Configration.Components;
		// 		//object对象转化为Array
		// 		var arrayData = treeObjArrayToArray(xmlArray);
		// 		var url = '/'+$scope.serPath+'/static/';
		// 		$scope.xmlList = arrayData;
		// 		ergodicData($scope,$rootScope.gcID.toLowerCase(),url,arrayData,'',$rootScope.componentXMl);
		// 	}
		// })

    }

    // end=======================
    // $scope.refreshConfigData = function() {
    // 	var param = {},httpUrl
    // 	param.gcID = $rootScope.gcID
    // 	if($scope._type == 1){
    // 		param.device = "'"+$scope.currentdevice+"'"
    // 		httpUrl = $rootScope.reqPath+'/configurationService/getNodeParam'+'?flag='+Math.random()
    // 	}else{
    // 		param.device = $scope.deviceParam
    // 		httpUrl = $rootScope.reqPath+'/configurationService/getDeviceParam'+'?flag='+Math.random()
    // 	}
    // 	$http({
	   //          method:'GET',
	   //          url:httpUrl,
	   //          params:{'str':JSON.stringify(param)}
	   //      }).then(function (obj){
	   //          if(obj.data){
	   //          	$scope.paramValues = JSON.parse(obj.data).result
			// 					console.log(JSON.parse(obj.data).result,"aaaa")
	   //          	$scope.refreshParamData()
	   //          	if(JSON.parse(obj.data).errorID == 0){
	   //          		ergodicData($scope,$rootScope.gcID.toLowerCase(),'/'+$scope.serPath+'/static/',$scope.xmlList,obj.data,$rootScope.componentXMl)
	   //          	}
	   //          }
	   //      })
		 //  }

    var timer1

    $scope.$watch("deviceParam",function(){
    	if($scope.deviceParam){
    		// $interval.cancel(timer1);
    		// $scope.refreshConfigData();
    		// timer1 = $interval($scope.refreshConfigData, 10000, -1);  //组态刷新
    	}
    })

    $scope.$on('changeThirdMenu',$scope.switchMenu)
  	//清除定时器
	  $scope.$on('$destroy',function(){
	  	  // $interval.cancel(timer1);
	      $interval.cancel(timer2);
	      // $interval.cancel(timer);
	      for(let key in $scope){
	      	if(key.indexOf('$')<0){
          		$scope[key] = null;
          	}
	      }
	  });

    //组态点击=======================
    // $scope.$on('SELECTED_BINDDEVICE_COMP',function(event,data){
    // 	if(data.popType === "redirect"){
    // 		$('#mousePopUp').css('display','none');
    // 		if(data.url){
    // 			$scope.jumpNodeMap(data);
    // 		}else{
    // 			var param = {};
    // 			param.gcID = $rootScope.gcID;
    // 			param.deviceID = data.deviceID;
    // 			$http({
		 //            method:'GET',
		 //            url:$rootScope.reqPath+'/systemService/getMapUrlByDeviceID'+'?flag='+Math.random(),
		 //            params:{'str':JSON.stringify(param)}
		 //        }).then(function (obj){
		 //            if(obj.data){
		 //            	if(JSON.parse(obj.data).errorID == 0){
		 //            		data.url = JSON.parse(obj.data).mapUrl
		 //            		$scope.jumpNodeMap(data);
		 //            	}
		 //            }
		 //        });
    // 		}
    // 	}
    // })
    //click end==================

		//跳进节点图
    $scope.jumpNodeMap=function(data){
    	data.deviceTypeID = parseInt(data.deviceID/10000).toString();
    	$scope.selDeviceObj = data;
    	$scope._type = 1
    	$scope.refreshConfigData();
    	$scope.currentdevice =(data.deviceID).toString();
    	$interval.cancel(timer1);
    	$scope.refreshConfig(data);
    }
  	//节点图返回
    $scope.returnToConfig = function(){
    	$scope._type = 0;
    	$scope.selDeviceObj = null;
    	$interval.cancel(timer1);
    	$scope.refreshConfig();
    }
    //手自动切换部分
  	//为0表示自动，为1表示手动
    //默认是自动
    $scope.handAutoStatus=0 ;

    $scope.getSystemModel = function(){
    	var param = {};
    	param.gcID = $rootScope.gcID;
    	param.systemID = 2;
    	$http({
	            method:'GET',
	            url:$rootScope.reqPath+'/systemService/getSystemModels'+'?flag='+Math.random(),
	            params:{'systemIdStr':JSON.stringify(param)}
	        }).then(function (obj){
	            if(obj.data){
	            	if(JSON.parse(obj.data).errorID == 0){
	            		var temp = JSON.parse(obj.data).result;

	            		for(var i =0;i<temp.length;i++){
	            			if(temp[i].modelState==1){
	            				$scope.curModelID = temp[i].modelID;
	            				$scope.curModelName = temp[i].modelName;
	            				$scope.handAutoStatus=temp[i].handAuto
	            			}
	            		}
	            	}
	            }
	        })
    }

    $scope.getSystemModel();
  	//手自动刷新

    // $interval($scope.getSystemModel, 10000, -1)

    //切换手自动模式
    $scope.changToStatus = function(flag){
    	var param = {};
    	param.gcID = $rootScope.gcID;
    	param.systemID = 2;
    	param.modelID = $scope.curModelID;
    	param.userID = $rootScope.curUser.userID;
    	if(flag==1){
    		let confirmFlag = window.confirm("模式切换成手动模式?");
    		if(confirmFlag){
    			param.handAuto = 1;
    		}
    	}else{
    		let confirmFlag = window.confirm("模式切换成自动模式?");
    		if(confirmFlag){
    			param.handAuto = 0;
    		}
    	}

    //日志部分=============
		let logData=new Object();
		logData.gcID = $rootScope.gcID;
		logData.systemID= 2;
		logData.userID= $rootScope.curUser.userID;
		logData.logTypeID=7;
		logData.logItemID=7;
		logData.opTypeName='模式控制';
		logData.opName='模式修改';
		logData.opTypeID=5;//修改
		logData.logItemID=11;
		logData.userIP=$rootScope.userClientIP;
		logData.opReason="";
		logData.logContent=$rootScope.curUser.userName+'手动模式切换至自动模式';
		if(flag) {
			logData.logContent=$rootScope.curUser.userName+'自动模式切换至手动模式';
		}
		param.logData = logData;
		// console.log(param)

    	$http({
	            method:'GET',
	            url:$rootScope.reqPath+'/systemService/saveModelState'+'?flag='+Math.random(),
	            params:{'str':JSON.stringify(param)}
	        }).then(function (obj){
	            if(obj.data){
	            	if(JSON.parse(obj.data).errorID == 0){
	            		$scope.getSystemModel();
	            		alert('切换成功！');
	            	}else{
	            		alert('切换失败！');
	            	}
	            }
	        })
    }
    //切换手自动模式end==============

    //监控手自动模式=============
    $scope.$watch('handAutoStatus',function(){
    	if($scope.handAutoStatus==0){
    		$scope.lyParam.editable = false;
    		$scope.ryParam.editable = false;
    		$scope.dzjdParam.editable = false;
    		$scope.zkjdParam.editable = false;
    		$scope.xfjParam.editable = false;
    		$scope.pfjParam.editable = false;
    		$scope.sfjParam.editable = false;
    		$scope.drfmParam.editable = false;
    		$scope.fjpgParam.editable = false;
    		$scope.qrjhParam.editable = false;
    	}
    })
    //监控手自动模式end============
    //跳入组套图======
    $scope.jumpToConfig = function(){
    	if(arguments.length != 0 && arguments[0]){
    		return;
    	}
    	$scope.isDeviceList = false;
    	$scope.isConfig = true;
    	$scope.isHomePage = false;
      //组态刷新
      // timer1 = $interval($scope.refreshConfigData, 10000, -1);
    }
    
    //跳进设备列表
    $scope.searDeviceStr = '';
    var timer2;
    $scope.jumpToList =function(){
    	$('#mousePopUp').css('display','none');
    	// $interval.cancel(timer);
        $interval.cancel(timer1);
    	$scope.isDeviceList = true;
    	$scope.isConfig = false;
    	$scope.isHomePage = false;

    	// timer2=$interval($scope.getDeviceList, 60000, -1);
    	$scope.getDeviceList();
    }

    //获取设备列表==================
    $scope.getDeviceList = function(){
    	let tmpo={};
			tmpo.deviceTypeID=$scope.curMenu.deviceTypeID;
			tmpo.gcID = $rootScope.gcID.toUpperCase();
    	$http({
	            method:'GET',
	            url:$rootScope.reqPath+'/configurationService/getDeviceListByTypeID'+'?flag='+Math.random(),
	            params:{'str':JSON.stringify(tmpo)}
	        }).then(function (obj){
	            if(obj.data){
	            	if(JSON.parse(obj.data).errorID == 0){
	            		$scope.deviceInfo=[];
	            		let temp = angular.copy(JSON.parse(obj.data).result);
						for(let i=0;i<temp.length;i++){
							if($scope.searDeviceStr == ''){
								$scope.deviceInfo.push(temp[i]);
							}else{
								if(temp[i].deviceName.indexOf($scope.searDeviceStr)>=0){
									$scope.deviceInfo.push(temp[i]);
								}
							}
						}
						if(temp.length == 0){
							for(let i = 0; i < 18; i++){
								$scope.deviceInfo.push({});
							}
						}else if(temp.length > 0 && temp.length < 12){
							for(let i = 0; i < 8; i++){
								$scope.deviceInfo.push({});
							}
						}
						if($scope.deviceInfo.length<19){
							$('.hvacTable_head').css('width','100%');
						}else{
							$('.hvacTable_head').css('width','calc( 100% - 1em )');
						}
	            	}else{
	            	}
	            }
	        });
    }
    //获取设备列表end=====================

    //开或者关==============
    $scope.openOrClose = function(obj){
    	var param = {};
			param.deviceID = obj.deviceID;
			param.statusValue =  obj.control =="1" ? "0":"1" ;
			param.paramID = obj.controlParamID;
			param.gcID = $rootScope.gcID.toUpperCase();
		
			var logData = {};
			logData.logItemID=7;// sysLogItem 表中logItemID 字段
			logData.gcID = $rootScope.gcID;
			logData.userID=$rootScope.curUser.userID;
			logData.opReason='暖通空调指令下发';
			logData.systemID = 2;
			logData.deviceID= obj.deviceID;
			var newControl = obj.control =="1" ? "0":"1" ;
			var  newControlValue;
			if(newControl){
			newControlValue="开启";
			}else{
			newControlValue="关闭";
			}
			logData.logContent=$rootScope.curUser.userName+"将"+obj.deviceName+"修改为"+newControlValue;
			logData.paramID=obj.controlParamID;
			logData.oldValue=obj.state;
			logData.newValue = newControlValue;
			logData.userIP=$rootScope.userClientIP;
			param.logData=logData;

			$http({
	            method:'GET',
	            url:$rootScope.reqPath+'/configurationService/dispatchCommand'+'?flag='+Math.random(),
	            params:{'deviceStr':JSON.stringify(param)}
	        }).then(function (obj){
	            if(obj.data){
	            	if(JSON.parse(obj.data).errorID == 0){
	            		alert("下发成功");
	            		$scope.getDeviceList();
	            	}else{
	            		alert(JSON.parse(obj.data).errorString);
	            	}
	            }
	        });
    	};

    //手自动========
    $scope.handOrAuto = function(obj){
    	var param = {};
    	
    	var logData = {};
		logData.logItemID=7;// sysLogItem 表中logItemID 字段
		logData.gcID = $rootScope.gcID;
		logData.userID=$rootScope.curUser.userID;
		logData.opReason='暖通空调指令下发';
		logData.systemID = 2;
		logData.deviceID= obj.deviceID;
		newValue = obj.handAuto ? "0":"1" ;
		var  newControlValue;
		if(newValue){
			newControlValue="自动";
		}else{
			newControlValue="手动";
		}
		
		logData.logContent=$rootScope.curUser.userName+"将"+obj.deviceName+"修改为"+newControlValue;
		logData.paramID=obj.controlParamID;
		logData.oldValue=obj.state;
		logData.newValue = newControlValue;
		logData.userIP=$rootScope.userClientIP;
					
		param.logData=logData;
		param.deviceID = obj.deviceID;
		param.statusValue =  obj.handAuto =="1" ? "0":"1" ;
		param.paramID = obj.controlParamID;
		param.gcID = $rootScope.gcID;

		$http({
			method:'GET',
			url:$rootScope.reqPath+'/configurationService/updateautoHandState'+'?flag='+Math.random(),
			params:{'str':JSON.stringify(param)}
			}).then(function (obj){
				if(obj.data){
					if(JSON.parse(obj.data).errorID == 0){
						alert("下发成功");
						$scope.getDeviceList();
					}else{
						alert(JSON.parse(obj.data).errorString);
							}
						}
	        })
    }
    
    //刷新界面所有参数
    $scope.refreshParamData = function(){
    	if($scope.curMenu.sysType == 2){
    		$scope.refreshLyParam();
    	}else if($scope.curMenu.sysType == 3){
    		$scope.refreshRyParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '112'){
    		$scope.refreshdzjdParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '110'){
    		$scope.refreshdzkdParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '111'){
    		$scope.refreshxfjParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '107'){
    		$scope.refreshpfjParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '108'){
    		$scope.refreshsfjParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '378'){
    		$scope.refreshdrfmParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '17'){
    		$scope.refreshfjpgParam();
    	}else if($scope.selDeviceObj!=null && $scope.selDeviceObj.deviceTypeID == '5'){
    		$scope.refreshqrfjParam();
    	}
    }

    //下发命令================
    $scope.dispatchCommandForArray = function(str){
    	var param = {};
    	if(str == 'lyParam'){
    		var logData=new Object();
			logData.gcID = $rootScope.gcID;
			logData.userID=$rootScope.curUser.userID;
			logData.opReason='冷源指令下发';
			logData.logItemID=7;  
			logData.userIP=$rootScope.userClientIP;
			logData.systemID=2;
			// logData.deviceID=$scope.lyDeviceID2;
			
			var ztstr="开启";
			if($scope.lyParam.start=='0')
			{
				ztstr="关闭";
			}
			
			logData.logContent=$rootScope.curUser.userName + "启停设定值改为:"+ztstr + "下发了冷源参数指令,"+"温度设定为:"+$scope.lyParam.ewSetTemp+";冷冻温差设定为:"+$scope.lyParam.yaChaSet+";冷却塔出水温度为:"+$scope.lyParam.badYaCha+";新云/BA切换为:"+($scope.lyParam.control == '0'?'新云':'BA')+';';
			logData.oldValue="";
			logData.newValue = "";
			if($scope.lyParam.ewSetTemp==''||$scope.lyParam.yaChaSet==''||$scope.lyParam.badYaCha==''){
				alert('参数不能为空');
				return;
			}
    		var str ='{"gcID":'+$rootScope.gcID.toUpperCase()+ ',"deviceArray":[{"deviceID":'+$scope.lyDeviceID1+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.lyParam.start)+'}]},';
			str += '{"deviceID":'+$scope.lyDeviceID2+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.lyParam.start)+'},';
			str += '{"paramID":"253","statusValue":'+$scope.lyParam.ewSetTemp+'},';
			str += '{"paramID":"443","statusValue":'+$scope.lyParam.yaChaSet+'},';
			str += '{"paramID":"74","statusValue":'+$scope.lyParam.badYaCha+'},';
			str += '{"paramID":"252","statusValue":'+parseInt($scope.lyParam.control)+'}]}]}';
			param.str = str;
			param.logData=logData;
    	}
    	if(str == 'ryParam'){
    		var logData=new Object();
			logData.gcID = $rootScope.gcID;
			logData.userID=$rootScope.curUser.userID;
			logData.opReason='热源指令下发.';
			logData.logItemID=7;
			logData.userIP=$rootScope.userClientIP;
			logData.systemID=2;
			logData.deviceID=$scope.ryDeviceID1;
			logData.logContent=$rootScope.curUser.userName + "下发了热源参数指令,"+"二次侧供水温度设定值设定为:"+$scope.ryParam.hotSetTemp+";二次侧压差设定值设定为:"+$scope.ryParam.yaChaSet;
			logData.oldValue="";
			logData.newValue = "";
			if($scope.ryParam.hotSetTemp==''||$scope.ryParam.yaChaSet==''||$scope.ryParam.yaChaSet==undefined||$scope.ryParam.hotSetTemp==undefined){
				alert('参数不能为空');
				return;
			}
    		var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.ryDeviceID1+',"paramArray":[{"paramID":"441","statusValue":'+$scope.ryParam.hotSetTemp+'},';
			str += '{"paramID":"442","statusValue":'+$scope.ryParam.yaChaSet+'}]}]}';
    		param.str = str;
    		param.logData=logData;
    	}
    	if(str == 'dzjdParam'){
    		var logData=new Object();
			logData.gcID = $rootScope.gcID;
			logData.userID=$rootScope.curUser.userID;
			logData.opReason='吊装节点图指令下发';
			logData.systemID=2;
			logData.deviceID=$scope.selDeviceObj.deviceID;
			var ztstr="开启";
			if($scope.dzjdParam.start=='0')
			{
				ztstr="关闭";
			}
			logData.logContent=$rootScope.curUser.userName + "下发了吊装节点图指令" + ",启停设定值改为:"+ztstr+";室内温度设定值设定为:"+$scope.dzjdParam.setTemp;
			logData.oldValue="";
			logData.newValue = "";
			logData.logItemID=7;
			logData.userIP=$rootScope.userClientIP;
    		if($scope.dzjdParam.setTemp==''){
				alert('参数不能为空');
				return;
			}
    		var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.dzjdParam.start)+'},';
			str += '{"paramID":"10","statusValue":'+$scope.dzjdParam.setTemp+'}]}]}';
    		param.str = str;
    		param.logData=logData;
    	}
    	if(str == 'zkjdParam'){
    		var logData=new Object();
			logData.gcID = $rootScope.gcID;
			logData.userID=$rootScope.curUser.userID;
			logData.opReason='组空节点图指令下发';
			logData.logItemID=7;
			logData.userIP=$rootScope.userClientIP;
			logData.systemID=2;
			logData.deviceID=$scope.selDeviceObj.deviceID;
			var ztstr="开启";
			if($scope.zkjdParam.start=='0')
			{
				ztstr="关闭";
			}
			logData.logContent=$rootScope.curUser.userName + "启停设定值改为:"+ztstr+";送风温度设定值设定为:"+$scope.zkjdParam.sAirSetTemp+";回风温度设定值设定为:"+$scope.zkjdParam.eAirSetTemp+";二氧化碳浓度值设定为:"+$scope.zkjdParam.setCO2;
			logData.oldValue="";
			logData.newValue = "";
			if($scope.zkjdParam.sAirSetTemp==''||$scope.zkjdParam.sAirSetTemp==''||$scope.zkjdParam.setCO2==""){
				alert('参数不能为空');
				return;
			}	
    		var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.zkjdParam.start)+'},';
			str += '{"paramID":"42","statusValue":'+$scope.zkjdParam.sAirSetTemp+'},';
			str += '{"paramID":"41","statusValue":'+$scope.zkjdParam.eAirSetTemp+'},';
			str += '{"paramID":"40","statusValue":'+$scope.zkjdParam.setCO2+'}]}]}';
			param.str = str;
			param.logData=logData;
    	}
    	if(str == 'xfjParam'){
    		var logData=new Object();
			logData.gcID = $rootScope.gcID;
			logData.userID=$rootScope.curUser.userID;
			logData.opReason='新风节点图指令下发';
			logData.logItemID=7;
			logData.userIP=$rootScope.userClientIP;
			logData.systemID=2;
			logData.deviceID=$scope.selDeviceObj.deviceID;
			var ztstr="开启";
			if($scope.xfjParam.start=='0')
			{
				ztstr="关闭";
			}
			logData.logContent=$rootScope.curUser.userName + "下发了新风节点图指令,"+"启停设定值改为:"+ztstr+";回风温度设定值设定为:"+$scope.xfjParam.setTemp;
			logData.oldValue="";
			logData.newValue = "";
			if($scope.xfjParam.setTemp==''){
				alert('参数不能为空');
				return;
			}	
    		var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.xfjParam.start)+'},';
			str += '{"paramID":"10","statusValue":'+$scope.xfjParam.setTemp+'}]}]}';
			param.str = str;
			param.logData=logData;
    	}
    	if(str == 'pfjParam'){
    		var logData=new Object();
				logData.gcID = $rootScope.gcID;
				logData.userID=$rootScope.curUser.userID;
				logData.opReason='排风机节点图指令下发';
				logData.logItemID=7;
				logData.userIP=$rootScope.userClientIP;
				logData.systemID=2;
				logData.deviceID=$scope.selDeviceObj.deviceID;
			var ztstr="开启";
			if($scope.pfjParam.start=='0')
			{
				ztstr="关闭";
			}
			logData.logContent=$rootScope.curUser.userName + "下发了排风机节点图指令," + "启停设定值改为:"+ztstr;
			logData.oldValue="";
			logData.newValue = "";
			
    		var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.pfjParam.start)+'}]}]}';
			param.str = str;
			param.logData=logData;
    	}
    	if(str == 'sfjParam'){
    		var logData=new Object();
			logData.gcID = $rootScope.gcID;
			logData.userID=$rootScope.curUser.userID;
			logData.opReason='送风机节点图指令下发';
			logData.logItemID=7;
			logData.userIP=$rootScope.userClientIP;
			logData.systemID=2;
			logData.deviceID=$scope.selDeviceObj.deviceID;
			var ztstr="开启";
			if($scope.sfjParam.start=='0')
			{
				ztstr="关闭";
			}
			logData.logContent=$rootScope.curUser.userName + "下发了送风机节点图指令," + "启停设定值改为:"+ztstr;
			logData.oldValue="";
			logData.newValue = "";
			
    		var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.sfjParam.start)+'}]}]}';
			param.str = str;
			param.logData=logData;
    	}
    	if(str == 'drfmParam'){
    		var logData=new Object();
        logData.gcID = $rootScope.gcID;
        logData.userID=$rootScope.curUser.userID;
        logData.opReason='电热风幕节点图指令下发';
        logData.logItemID=7;
        logData.userIP=$rootScope.userClientIP;
        logData.systemID=2;
        logData.deviceID=$scope.selDeviceObj.deviceID;
        var ztstr="开启";
			if($scope.drfmParam.start=='0') {
				ztstr="关闭";
			}
			logData.logContent=$rootScope.curUser.userName + "下发了电热风幕节点图指令," + "启停设定值改为:"+ztstr;
			logData.oldValue="";
			logData.newValue = "";
					
			var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.drfmParam.start)+'}]}]}';
			param.str = str;
			param.logData=logData;
    	}
    	if(str == 'fjpgParam'){
    		var logData=new Object();
        logData.gcID = $rootScope.gcID;
        logData.userID=$rootScope.curUser.userID;
        logData.opReason='风机盘管节点图指令下发';
        logData.logItemID=7;
        logData.userIP=$rootScope.userClientIP;
        logData.systemID=2;
        logData.deviceID=$scope.selDeviceObj.deviceID;
        var ztstr="开启";
			if($scope.fjpgParam.start=='0') {
				ztstr="关闭";
			}
			
			logData.logContent=$rootScope.curUser.userName + "下发了风机盘管节点图指令," + "启停设定值改为:"+ztstr;
			logData.oldValue="";
			logData.newValue = "";
			if($scope.fjpgParam.setTemp==''){
				alert('参数不能为空');
				return;
			}		
			var str = '{"gcID":'+$rootScope.gcID.toUpperCase();
			str += ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"11","statusValue":'+parseInt($scope.fjpgParam.start)+'}'+',{"paramID":"10","statusValue":'+ $scope.fjpgParam.setTemp +'}'+']}]}';
			param.str = str;
			param.logData=logData;
    	}
    	if(str == 'qrjhParam'){
    		var logData=new Object();
				logData.gcID = $rootScope.gcID;
				logData.userID=$rootScope.curUser.userID;
				logData.opReason='全热交换新风机指令下发';
				logData.logItemID=7;
				logData.userIP=$rootScope.userClientIP;
				logData.systemID=2;
				logData.deviceID=$scope.selDeviceObj.deviceID;
			
			var ztstr="开启";
			var ztstr1="开启";
			if($scope.qrjhParam.sfstart=='0')
			{
				ztstr="关闭";
			}
			if($scope.qrjhParam.sfstart=='0')
			{
				ztstr1="关闭";
			}
			
			logData.logContent=$rootScope.curUser.userName + "将送风机启停设定值改为:"+ztstr + ";送风机启停设定值改为:" + ztstr1+ ",下发了全热交换新风机参数指令";
			logData.oldValue="";
			logData.newValue = "";
					
			var str ='{"gcID":'+$rootScope.gcID.toUpperCase()+ ',"deviceArray":[{"deviceID":'+$scope.selDeviceObj.deviceID+',"paramArray":[{"paramID":"1","statusValue":'+parseInt($scope.qrjhParam.sfstart)+'},{"paramID":"6","statusValue":'+ parseInt($scope.qrjhParam.pfstart) +'}]}]}';
			param.str = str;

			param.logData=logData;
    	}
      console.log(param)
    	$http({
	            method:'GET',
	            url:$rootScope.reqPath+'/configurationService/dispatchCommandForArray'+'?flag='+Math.random(),
	            params:{'deviceStr':JSON.stringify(param)}
	        }).then(function (obj){
	            if(obj.data){
	            	if(JSON.parse(obj.data).errorID == 0){
	            		$scope.refreshConfigData();
	            		$scope.resetEdit();
	            		alert('命令下发成功!');
	            	}else{
	            		alert(JSON.parse(obj.data).errorString);
	            	}
	            }
	        });
    };
    //重置,均不可编辑===========
    $scope.resetEdit = function(){
    	$scope.lyParam.editable=false;
    	$scope.ryParam.editable=false;
    	$scope.zkjdParam.editable=false;
    	$scope.xfjParam.editable=false;
    	$scope.pfjParam.editable=false;
    	$scope.sfjParam.editable=false;
    	$scope.drfmParam.editable=false;
    	$scope.dzjdParam.editable=false;
    	$scope.fjpgParam.editable=false;
    	$scope.qrjhParam.editable=false;
    };
    //冷源部分=======================
    $scope.lyParam = {
    	editable:false,
    	start:'0',
    	ewSetTemp:'',
    	yaChaSet:'',
    	badYaCha:'',
    	control:'0'
    }
    $scope.refreshLyParam = function(){
    	if(!$scope.lyParam.editable){
    		$scope.lyParam.start = String($scope.paramValues.indexOfObj({'deviceID':$scope.lyDeviceID1,'paramEnName':'start'}).statusValue);
    		$scope.lyParam.ewSetTemp = $scope.paramValues.indexOfObj({'deviceID':$scope.lyDeviceID2,'paramEnName':'ewSetTemp'}).statusValue;
    		$scope.lyParam.yaChaSet = $scope.paramValues.indexOfObj({'deviceID':$scope.lyDeviceID2,'paramEnName':'yaChaSet'}).statusValue;
    		$scope.lyParam.badYaCha = $scope.paramValues.indexOfObj({'deviceID':$scope.lyDeviceID2,'paramEnName':'badYaCha'}).statusValue;
    	}
    }
    //热源部分==============
    $scope.ryParam = {
    	editable:false,
    	hotSetTemp:'',
    	yaChaSet:''
    };
    $scope.refreshRyParam = function(){
    	if(!$scope.ryParam.editable){
    		$scope.ryParam.hotSetTemp = $scope.paramValues.indexOfObj({'deviceID':$scope.ryDeviceID1,'paramEnName':'hotSetTemp'}).statusValue;
    		$scope.ryParam.yaChaSet = $scope.paramValues.indexOfObj({'deviceID':$scope.ryDeviceID1,'paramEnName':'yaChaSet'}).statusValue;
    	}
    }
    //设备平面图============================
    $scope.getDeviceName = function(){
    	var devicetypename;
    	switch($scope.curMenu.deviceTypeID)
		{
			case "110":devicetypename="组空"
				break;
			case "111":
				devicetypename="新风";
				break;
			case "107,108":
				devicetypename="送排风";
				break;
			case "112":
				devicetypename="吊装";
				break;
			case "108":
				devicetypename="送风";
				break;
			case "378":
				devicetypename="电热风幕";
				break;
			case "17":
				devicetypename="风机盘管";
				break;
			case "5":
				devicetypename="全热交换新风机";
				break;
		}
		return devicetypename;
    }
    //组空节点图
    $scope.zkjdParam = {
    	editable:false,
    	start:'0',
    	sAirSetTemp:'',
    	eAirSetTemp:'',
    	setCO2:''
    };
    $scope.refreshdzkdParam = function(){
    	if(!$scope.zkjdParam.editable){
    		$scope.zkjdParam.start = String($scope.paramValues.indexOfObj({'paramEnName':'start'}).statusValue);
    		$scope.zkjdParam.sAirSetTemp = $scope.paramValues.indexOfObj({'paramEnName':'setTemp'}).statusValue;
    		$scope.zkjdParam.eAirSetTemp = $scope.paramValues.indexOfObj({'paramEnName':'setTemp'}).statusValue;
    		$scope.zkjdParam.setCO2 = $scope.paramValues.indexOfObj({'paramEnName':'setTemp'}).statusValue;
    	}
    }
    //新风节点图
    $scope.xfjParam = {
    	editable:false,
    	start:'0',
    	setTemp:''
    };
    $scope.refreshxfjParam = function(){
    	if(!$scope.xfjParam.editable){
    		$scope.xfjParam.start = String($scope.paramValues.indexOfObj({'paramEnName':'start'}).statusValue);
    		$scope.xfjParam.setTemp = $scope.paramValues.indexOfObj({'paramEnName':'setTemp'}).statusValue;
    	}
    }
    //排风机节点图
    $scope.pfjParam = {
    	editable:false,
    	start:'0',
    };
    $scope.refreshpfjParam = function(){
    	if(!$scope.pfjParam.editable){
    		$scope.pfjParam.start = String($scope.paramValues.indexOfObj({'paramEnName':'start'}).statusValue);
    	}
    }
    //送风机节点图
    $scope.sfjParam = {
    	editable:false,
    	start:'0',
    }
    $scope.refreshsfjParam = function(){
    	if(!$scope.sfjParam.editable){
    		$scope.sfjParam.start = String($scope.paramValues.indexOfObj({'paramEnName':'start'}).statusValue);
    	}
    }
    //电热风幕节点图
    $scope.drfmParam = {
    	editable:false,
    	start:'0',
    }
    $scope.refreshdrfmParam = function(){
    	if(!$scope.drfmParam.editable){
    		$scope.drfmParam.start = String($scope.paramValues.indexOfObj({'paramEnName':'start'}).statusValue);
    	}
    }
    //吊装空调节点图======================
    $scope.dzjdParam = {
    	editable:false,
    	setTemp:''
    }
    $scope.refreshdzjdParam = function(){
    	if(!$scope.dzjdParam.editable){
    		$scope.dzjdParam.start = String($scope.paramValues.indexOfObj({'paramEnName':'start'}).statusValue);
    		$scope.dzjdParam.setTemp = $scope.paramValues.indexOfObj({'paramEnName':'setTemp'}).statusValue;
    	}
    }
    //风机盘管节点图===================
    $scope.fjpgParam = {
    	editable:false,
    	start:'0',
    	setTemp:''
    };
    $scope.refreshfjpgParam = function(){
    	if(!$scope.fjpgParam.editable){
    		$scope.fjpgParam.start = String($scope.paramValues.indexOfObj({'paramEnName':'start'}).statusValue);
    		$scope.fjpgParam.setTemp = $scope.paramValues.indexOfObj({'paramEnName':'setTemp'}).statusValue;
    	}
    }
    //全热交换新风机节点图====================
    $scope.qrjhParam = {
    	editable:false,
    	sfstart:'0',
    	pfstart:'0'
    };
    $scope.refreshqrfjParam = function(){
    	if(!$scope.qrjhParam.editable){
    		$scope.qrjhParam.sfstart = String($scope.paramValues.indexOfObj({'paramEnName':'SFStart'}).statusValue);
    		$scope.qrjhParam.pfstart = String($scope.paramValues.indexOfObj({'paramEnName':'PFStart'}).statusValue);
    	}
    }
    //趋势图部分====================
  	//停车场柱状图信息===============
    $scope.chartOption  = {
	    color: ['#3398DB'],
	    tooltip : {
	        trigger: 'axis',
        // 坐标轴指示器，坐标轴触发有效
        // 默认为直线，可选为：'line' | 'shadow'
	        axisPointer : {
	            type : 'shadow'
	        }
	    },
	    grid: {
	        left: '0',
	        top:'0',
	        width: '100%',
	        height: '100%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : [],
	            axisTick: {
	                alignWithLabel: true
	            }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	    series : [
	        {
	            name:'记录',
	            type:'bar',
	            barWidth: '60%',
	            data:[]
	        }
	    ]
	}
    //=====================

    $scope.qstParam={
    	paramName:'',
    	cbxData:[]
    }

    $scope.btnQst = function(arr,deviceID){
    	$scope.qstParam.cbxData = arr;
    	$scope.qstParam.paramName=arr[0].paramName;
    	var contain = angular.element(document.querySelector("#popUp")).css('display','block');//显示弹窗
    	contain.append($compile($templateCache.get('qst'))($scope));
    	var param = {};
    	param.gcID = $rootScope.gcID;
    	param.deviceID = deviceID;
    	param.paramID = arr[0].paramID;
    	$scope.qstVisible = false;
    	$http({
	            method:'GET',
	            url:$rootScope.reqPath+'/countService/getQst'+'?flag='+Math.random(),
	            params:{'str':JSON.stringify(param)}
	        }).then(function (obj){
	            if(obj.data){
	            	if(JSON.parse(obj.data).errorID == 0){
	            		$('#qst_chart').css('width',$('.hvac_qst>.content>.thirdLine')[0].clientWidth+'px');
	            		$('#qst_chart').css('height',$('.hvac_qst>.content>.thirdLine')[0].clientHeight+'px')
	            		$scope.qstChart = echarts.init(document.getElementById('qst_chart'));
            			var arr = JSON.parse(obj.data).result;
	            		$scope.chartOption.xAxis[0].data = [];
	            		$scope.chartOption.series[0].data = [];
	            		for(var i=0;i<arr.length;i++){
	            			$scope.chartOption.xAxis[0].data.push(arr[i].date);
	            			$scope.chartOption.series[0].data.push(arr[i].value);
	            		}
	            		$scope.qstVisible = true;
	            		$scope.qstChart.setOption($scope.chartOption);
	            		
	            	}else{
//	            		alert(JSON.parse(obj.data).errorString);
						$scope.qstVisible = false;
	            	}
	            }
	        });
    }

    $scope.changeQst = function(){
    	var temp= {};
    	for(var i=0;i<$scope.qstParam.cbxData.length;i++){
    		if($scope.qstParam.cbxData[i].paramName == $scope.qstParam.paramName){
    			temp = $scope.qstParam.cbxData[i]
    		}
    	}
    	var param = {};
    	param.gcID = $rootScope.gcID;
    	param.deviceID = temp.deviceID;
    	param.paramID = temp.paramID;
    	$http({
	            method:'GET',
	            url:$rootScope.reqPath+'/countService/getQst'+'?flag='+Math.random(),
	            params:{'str':JSON.stringify(param)}
	        }).then(function (obj){
	            if(obj.data){
	            	if(JSON.parse(obj.data).errorID == 0){
	            		$('#qst_chart').css('width',$('.hvac_qst>.content>.thirdLine')[0].clientWidth+'px');
	            		$('#qst_chart').css('height',$('.hvac_qst>.content>.thirdLine')[0].clientHeight+'px')
	            		$scope.qstChart = echarts.init(document.getElementById('qst_chart'));
            			var arr = JSON.parse(obj.data).result;
	            		$scope.chartOption.xAxis[0].data = [];
	            		$scope.chartOption.series[0].data = [];
	            		for(var i=0;i<arr.length;i++){
	            			$scope.chartOption.xAxis[0].data.push(arr[i].date);
	            			$scope.chartOption.series[0].data.push(arr[i].value);
	            		}
	            		$scope.qstVisible = true;
	            		$scope.qstChart.setOption($scope.chartOption);
	            		
	            	}else{
//	            		alert(JSON.parse(obj.data).errorString);
										$scope.qstVisible = false;
	            	}
	            }
	        });
    }


}]);
