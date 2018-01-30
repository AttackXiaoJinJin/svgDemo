var app=angular.module('XCXY');
//视频监控
app.controller('videoCtrl',['$scope','$rootScope','$http','$interval',function($scope,$rootScope,$http,$interval){
  //cj
	deviceIDArray.unshift('');
	  //更新界面
    $scope.curMenu = null;
    //切换菜单重新绘图
    $scope.switchMenu = function(event,data){
    	$scope.curMenu = data;
    	// $interval.cancel(timer1);
    	if(data.mapUrl){
    		// console.log(data.mapUrl)
        $('#readSVG').empty();
        //XMl文件路径
        // var httpUrl = '/'+$rootScope.serPath+'/static/'+$scope.curMenu.mapUrl;
        var httpUrl = '/'+$rootScope.serPath+'/static/'+data.mapUrl

        if(arguments.length !== 0){
        	// console.log(arguments)
          // httpUrl = '/'+$rootScope.serPath+'/static/'+arguments[0].url
          httpUrl = '/'+$rootScope.serPath+'/static/'+data.mapUrl
        }
        // deviceIDArray=[]
        drawTextArray=[]
        // alarmIDArray=[]
        // runIDArray=[]
        jsonRunIDArray=[]
        jsonAlarmIDArray=[]
        //同步
        $.ajaxSettings.async = false;
        // mouseWheel();
        let cptArray=analysisCompoentsOne();
        // console.log(cptArray)
        //画图
        partXML(cptArray,httpUrl)
        //动图
        runAndAlarm($rootScope.reqPath+'/configurationService/getDeviceParam'+'?flag='+Math.random());

			}

    }
    
	  //更新组态
    $scope.currentdevice = "";
	 function refreshConfig(svg,cptArray,httpUrl){
	 	/*
    var can = document.getElementById('drawGroup');
    var $Passenger_flow = $('.Passenger_flow');
    //设置画布100%填充
		can.width = $Passenger_flow.innerWidth();
		can.height = $Passenger_flow.innerHeight();
*/

    //获取XML文件
		/*
		$http({
			method:'GET',
			url:httpUrl
		}).then(function (result){
		  //处理获取到的xml文件
			if(result.data){
				var xmlString = result.data;
				var xmlDoc=null;
				//判断是否是ie浏览器
				if(!!window.ActiveXObject || "ActiveXObject" in window){
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
					xmlDoc.async = "false";
					xmlDoc.loadXML(xmlString);
				}
				//xml对象转化为json对象
				var xmlObj = xmlToJson(xmlDoc);
				var confData = xmlObj.Configration.compAttribute;
				if(confData){
					$scope.configrationWidth = confData.Width;
					$scope.configrationHeight = confData.Height;
				}
				var xmlArray = xmlObj.Configration.Components;
				//object对象转化为Array
				var arrayData = treeObjArrayToArray(xmlArray);
				var url = '/'+$scope.serPath+'/static/';
				$scope.xmlList = arrayData;
				ergodicData($scope,$rootScope.gcID.toLowerCase(),url,arrayData,'',$rootScope.componentXMl);
			}
		});
*/
    }

    // $scope.refreshConfigData = function() {
    // 	var param = {},httpUrl;
    // 	param.gcID = $rootScope.gcID;
    // 	param.device = $scope.deviceParam ;
    // 	httpUrl = $rootScope.reqPath+'/configurationService/getDeviceParam'+'?flag='+Math.random();
    // 	$http({
	   //          method:'GET',
	   //          url:httpUrl,
	   //          params:{'str':JSON.stringify(param)}
	   //      }).then(function (obj){
	   //          if(obj.data){
	   //          	$scope.paramValues = JSON.parse(obj.data).result;
	   //          	if(JSON.parse(obj.data).errorID === 0){
	   //          		ergodicData($scope,$rootScope.gcID.toLowerCase(),'/'+$scope.serPath+'/static/',$scope.xmlList,obj.data,$rootScope.componentXMl);
	   //          	}
	   //          }
	   //      });
    // };

    var timer1;
    $scope.$watch("deviceParam",function(){
    	if($scope.deviceParam){
    		// $interval.cancel(timer1);
    		// $scope.refreshConfigData();
        //组态刷新
        // timer1 = $interval($scope.refreshConfigData, 10000, -1);
    	}
    });


    //更改三级菜单就执行一次
   $scope.$on('changeThirdMenu',$scope.switchMenu)

     $scope.$on('$destroy',function(){		//清除定时器
          // $interval.cancel(timer1);
      });


		//首次进入，或者刷新界面
     $scope.$on('$destroy',function(){	//清除定时器
          // $interval.cancel(timer1);
	      for(var key in $scope){
	      	if(key.indexOf('$')<0){
          		$scope[key] = null;
          	}
	      }
      })
	//首次进入，或者刷新界面
	  $scope.curMenu=null;
    if($rootScope.selSecondMenu){
    	getInitMenu([$rootScope.selSecondMenu],'mapID',$rootScope.config.welcomepage.cctvModel);
    	if($scope.curMenu){
    		$scope.isConfig = true;
    		// setTimeout($scope.refreshConfig,100);
    	}
    }else{
    	getInitMenu([JSON.parse(window.localStorage.getItem('selSecondMenu'))],'mapID',$rootScope.config.welcomepage.cctvModel);
    	if($scope.curMenu){
    		$scope.isConfig = true;
    		// setTimeout($scope.refreshConfig,100);
    	}
    }

    function getInitMenu(arr,key,value){
    	for(var i=0;i<arr.length;i++){
    		if($scope.curMenu){
    			break;
    		}
    		if(!arr[i].hasOwnProperty('children')){
    			if(arr[i][key] === value){
    				$scope.curMenu = arr[i];
    				var $sub_menu = $('#sub_menu .sub_second>li>a>span');
    				for(var j = 0;j < $sub_menu.length; j++){
						if($sub_menu[j].innerHTML === $scope.curMenu.mapName){
							$('#sub_menu .sub_second').css('display','block');
              $sub_menu[j].className = 'subMenuFont';
						}
					}
    			}
    			
    		}else{
    			getInitMenu(arr[i].children,key,value);
    		}
    	}
    }

}]);
