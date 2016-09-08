$(function(){
    function $get(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null) {
            return  unescape(r[2]);
        }
        return false;
    }
    document.getElementById('currentDomain').innerHTML = 'current domain is ' + ( $get('url') ? $get('url') : 'www.baidu.com' );
    document.getElementById('form').url.value = $get('url') ? $get('url') : 'www.baidu.com';
    var myChart = echarts.init(document.getElementById('test'));
    var firstReqLength = 0;

    function getData(time) {
        var data = [];
        var str = 'time' + Math.round(new Date().getTime()) + time;
        $.get('data.txt?' + str, function(msg){
            var lineArr = msg.split('\n');
            var len = lineArr.length;
            var displayNum = 200;
            if(len === firstReqLength){
                return false;
            }else{
                firstReqLength = len;
            }
            for(var i=len-displayNum, len=lineArr.length; i < len; i++){
                var time_index = lineArr[i].indexOf('time=') + 5;
                var end_index = lineArr[i].indexOf(' ms');
                var num = 1;
                if(time_index !== 4){
                    num = lineArr[i].substring(time_index, end_index); 
                }
                num = parseInt(num);
                if(isNaN(num)){
                    num = 1;
                }
                data[i] = [i, num];
            }
            option.series[0].data = data;
            myChart.setOption(option);
        });
    }

    option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            formatter: 'delay:{c}'
        },
        xAxis: {
            type: 'value',
            min: 'dataMin',
            max: 'dataMax'
        },
        yAxis: {
            type: 'value',
            name: '延迟时间ms'
        },
        series: [{
            name: 'Netword Recard',
            type: 'line',
            symbol: 'none',
            data: []
        }]
    };
    var timestrap = 0;
    setInterval(function(){
        getData(timestrap++);
    }, 1000);
});
