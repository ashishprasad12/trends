window.onload = buildUrlList;

var startIndex = 0;

var maxCount = -1;
var maxTime = -1;
var minTime = 10000000000000000;

var radioButtons = [];
var urlofButtons = [];

// Search history to find up to ten links that a user has typed in,
// and show those links in a popup.
function buildUrlList() {
  // To look for history items visited in the last week,
  // subtract a week of microseconds from the current time.
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 102;
  var oneWeekAgo = (new Date).getTime() - microsecondsPerWeek;

  // Track the number of callbacks from chrome.history.getVisits()
  // that we expect to get.  When it reaches zero, we have all results.
  var numRequestsOutstanding = 0;
  var objs = [];

  var options;

  
	options = {
      	'text': '',
      	'maxResults' : 5000,
		'startTime' : 0
    	}

  chrome.history.search(options,
    function(historyItems) {


	maxCount = -1;
	maxTime = -1;
	minTime = 10000000000000000;	

      // For each history item, get details on all visits.
      for (var i = 0; i < historyItems.length; ++i) {
        if(historyItems[i].title != ''){	

	  	objs[i] = new historyobj();
	  	objs[i].count = historyItems[i].visitCount;
	  	objs[i].name = historyItems[i].title;
	  	objs[i].time = historyItems[i].lastVisitTime; 
	  	objs[i].url = historyItems[i].url; 

		


		maxCount = Math.max(maxCount, objs[i].count);
		maxTime = Math.max(maxTime, objs[i].time);
	  	minTime = Math.min(minTime, objs[i].time);
	  }	
	
      }

	drawPanel(objs);

    });

}

var paper = null;
var sortValue = 1;

function drawPanel(objs){

    	var screenW = 1000;
 	var screenH = (20 + 4)*30;
	if(paper == null)
		var paper = Raphael(0, 0, screenW, screenH);

	paper.clear();
	var background = paper.rect(0, 0, screenW, screenH);
	background.attr("fill", "#000");
	background.attr("stroke", "#222");

	var startTime = (new Date()).getTime();

	if(sortValue == 1)
		objs.sort(sortByCount);
	else if(sortValue == 2)
		objs.sort(sortByCountDecrease);
	else if(sortValue == 3)
		objs.sort(sortByTime);
	else if(sortValue == 4)
		objs.sort(sortByTimeDecrease);

	var counter = 2;
	var names = new Array();
	names.push('');
	var nowValue = (new Date()).getTime();

	paper.text(20, 45, "URL").attr({"text-anchor" : 'start', fill: "#fff", stroke: "#fff", "font-family": 'Arial', "font-size": "20px"});
	paper.text(500, 45, "Visit Count").attr({"text-anchor" : 'start', fill: "#fff", stroke: "#fff", "font-family": 'Arial', "font-size": "20px"});

	//var strPth = 'M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001';

	var strPth = 'M15,10 25,30 35,10';

	var sortCountUp = paper.path(strPth).attr({fill: "#bbb", stroke: "none", "rotation" : 180,"scale" : "0.7,0.5", translation : "585,25"});
	sortCountUp.mousedown(function (event) {
    		this.attr({fill: "#fff"});
		sortValue = 1;
		startIndex = 0;
		drawPanel(objs);
	});
	sortCountUp.mouseover(function (event) {
    		this.attr({fill: "#fff"});
	});
	sortCountUp.mouseout(function (event) {
    		this.attr({fill: "#bbb"});
	});

	var sortCountDown = paper.path(strPth).attr({fill: "#bbb", stroke: "none", "rotation" : 0,"scale" : "0.7,0.5", translation : "600,25"});
	sortCountDown.mousedown(function (event) {
    		this.attr("fill", "#fff");
		sortValue = 2;
		startIndex = 0;
		drawPanel(objs);
	});
	sortCountDown.mouseover(function (event) {
    		this.attr({fill: "#fff"});
	});
	sortCountDown.mouseout(function (event) {
    		this.attr({fill: "#bbb"});
	});


	var sortTimeUp = paper.path(strPth).attr({fill: "#bbb", stroke: "none", "rotation" : 180,"scale" : "0.7,0.5", translation : "842,25"});
	sortTimeUp.mousedown(function (event) {
    		sortValue = 3;
		startIndex = 0;
		drawPanel(objs);
	});
	sortTimeUp.mouseover(function (event) {
    		this.attr({fill: "#fff"});
	});
	sortTimeUp.mouseout(function (event) {
    		this.attr({fill: "#bbb"});
	});

	var sortTimeDown = paper.path(strPth).attr({fill: "#bbb", stroke: "none", "rotation" : 0,"scale" : "0.7,0.5", translation : "857,25"});
	sortTimeDown.mousedown(function (event) {
    		sortValue = 4;
		startIndex = 0;
		drawPanel(objs);
	});
	sortTimeDown.mouseover(function (event) {
    		this.attr({fill: "#fff"});
	});
	sortTimeDown.mouseout(function (event) {
    		this.attr({fill: "#bbb"});
	});

	paper.text(700, 45, "Last Time Visited").attr({"text-anchor" : 'start', fill: "#fff", stroke: "#fff", "font-family": 'Arial', "font-size": "20px"});


	var outlineA = paper.rect(1, 1, screenW - 1, screenH - 1);
	outlineA.attr("stroke", "#222");

	var outlineB = paper.rect(1, 1, 494, screenH - 1);
	outlineB.attr("stroke", "#222");

	var outlineC = paper.rect(695, 1, 305, screenH - 1);
	outlineC.attr("stroke", "#222");

	var endTime = (new Date()).getTime();

	radioButtons = new Array();
	urlofButtons = new Array();

	var i = startIndex;

	while(i < objs.length && counter < 22){
		


			var selectionCircle = paper.circle(30, counter*30 + 15, 5);
			selectionCircle.attr("stroke", "#bbb");
			selectionCircle.attr("fill", "#000");
			radioButtons[counter - 2] = selectionCircle;
			urlofButtons[counter - 2] = objs[i].url;
			addSelectionListener(selectionCircle);




			var outline = paper.rect(1, counter*30, screenW - 1, 30);
			outline.attr("stroke", "#222");
			var linkText = paper.text(50, counter*30 + 15, objs[i].url.substring(0,50)).attr({"text-anchor" : 'start', fill: "#bbb", stroke: "#bbb", "font-family": 'Arial', "font-size": "15px", href : ''});		
		
			addListener(linkText, objs[i].url);

			var countRect = paper.rect(500, counter*30 + 5, 150*(objs[i].count/maxCount), 20);
			countRect.attr("stroke", "#222");
			countRect.attr("fill", getColor(objs[i].count/maxCount));

			paper.text(500 + 150*(objs[i].count/maxCount), counter*30 + 15, objs[i].count + '').attr({"text-anchor" : 'start', fill: "#bbb", stroke: "#bbb", "font-family": 'Arial', "font-size": "12px"});

			var days = (nowValue - objs[i].time)/(1000 * 60 * 60 * 24); 
			var positionDays = 1 - (objs[i].time - minTime)/(maxTime - minTime);


			var historyCir = paper.circle(850 - 140*positionDays, counter*30 + 15, 5);
			historyCir.attr("stroke", "#222");
			historyCir.attr("fill", "#f0f");
	
			var lineString = 'M710 ' + (counter*30 + 15) + 'L850 ' + (counter*30 + 15);
			var c = paper.path(lineString);
			c.attr("stroke", "#bbb");
			
			var histStr = '';
			if(days < (1.0/24))
				histStr = (days*24.0*60).toFixed(2) + ' minutes ago';
			else if(days < 1.0)
				histStr = (days*24.0).toFixed(2) + ' hours ago';
			else
				histStr = days.toFixed(2) + ' days ago';

			paper.text(870, counter*30 + 15, histStr).attr({"text-anchor" : 'start', fill: "#bbb", stroke: "#bbb", "font-family": 'Arial', "font-size": "12px"});
				
			counter++;
		
			i++;

	}

	var selectAll = paper.circle(20, counter*30 + 15, 5).attr({fill: "#fff", stroke: "#bbb"});
	selectAll.mousedown(function (event) {
    		for(var i = 0 ; i < radioButtons.length ; i++){
			radioButtons[i].attr({fill: "#fff"});
		}
	});

	var deselectAll = paper.circle(40, counter*30 + 15, 5).attr({fill: "#000", stroke: "#bbb"});
	deselectAll.mousedown(function (event) {
    		for(var i = 0 ; i < radioButtons.length ; i++){
			radioButtons[i].attr({fill: "#000"});
		}
	});
	var deleteSelected = paper.text(80, counter*30 + 15, 'Delete Selected').attr({"text-anchor" : 'start', fill: "#fff", stroke: "#fff", "font-family": 'Arial', "font-size": "12px", href : ""});
	deleteSelected.mousedown(function (event) {
    		var answer = confirm ("Delete Selected ?")
		if (answer){
			var changed = 0;
			for(var i = 0 ; i < radioButtons.length ; i++){
				if(radioButtons[i].attr("fill") == "#fff"){
					chrome.history.deleteUrl({url : urlofButtons[i]});
					changed++;
				} 
			}
			if(changed > 0){
				buildUrlList();
				if(changed >= 5){
					alert('Page will refresh when items have been deleted\n(url deletion may take a long time for large history files)');
				}
			}
		}
	});



	if(startIndex > 1){

		var previous = paper.text(840, counter*30 + 15, 'Previous').attr({"text-anchor" : 'start', fill: "#fff", stroke: "#fff", "font-family": 'Arial', "font-size": "15px", href : ""});
		previous.mousedown(function (event) {
    			startIndex -= counter;
			startIndex = Math.max(startIndex, 0);
			drawPanel(objs);
		});

		var previousStr = '800,' + (counter*30 - 4);

		var previousButton = paper.path(strPth).attr({fill: "#bbb", stroke: "none", "rotation" : 90,"scale" : "0.7,0.7", translation : previousStr });

		previousButton.mousedown(function (event) {
    			startIndex -= counter;
			startIndex = Math.max(startIndex, 0);
			drawPanel(objs);
		});
		previousButton.mouseover(function (event) {
    			this.attr({fill: "#fff"});
		});
		previousButton.mouseout(function (event) {
    			this.attr({fill: "#bbb"});
		});

	}

	if(startIndex < objs.length){

		var next = paper.text(940, counter*30 + 15, 'Next').attr({"text-anchor" : 'start', fill: "#fff", stroke: "#fff", "font-family": 'Arial', "font-size": "15px", href : ""});
		next.mousedown(function (event) {
    			startIndex += counter;
			startIndex = Math.min(startIndex, objs.length);
			drawPanel(objs);
		});

		var transStr = '960,' + (counter*30 - 4);

		var nextButton = paper.path(strPth).attr({fill: "#bbb", stroke: "none", "rotation" : 270,"scale" : "0.7,0.7", translation : transStr });

		nextButton.mousedown(function (event) {
    			startIndex += counter;
			startIndex = Math.min(startIndex, objs.length);
			drawPanel(objs);
		});
		nextButton.mouseover(function (event) {
    			this.attr({fill: "#fff"});
		});
		nextButton.mouseout(function (event) {
    			this.attr({fill: "#bbb"});
		});

	}

	document.getElementsByTagName("body")[0].scrollTop = 0;

}

function sortByCount(a, b) {
    var x = a.count;
    var y = b.count;
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

function sortByTime(a, b) {
    var x = a.time;
    var y = b.time;
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

function sortByCountDecrease(a, b) {
    var x = a.count;
    var y = b.count;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function sortByTimeDecrease(a, b) {
    var x = a.time;
    var y = b.time;
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

function getColor(val){
	if(val > (4.0/5.0))
		return '#f00';
	else if(val > (3.0/5.0))
		return '#f60';
	else if(val > (2.0/5.0))
		return '#ff0';
	else if(val > (1.0/5.0))
		return '#0f0';
	else if(val > 0)
		return '#0ff';
	else
		return '#00f';
}

function openNewTab(urlString){
	chrome.tabs.create({url : urlString}, tab)
}

function tab(){
}

function addListener(linkText, str){
	linkText.mousedown(function (event) {
    		openNewTab(str);
	});
}

function addSelectionListener(selectionCircle){
	var fillText = selectionCircle.attr("fill");
	selectionCircle.mousedown(function (event) {
		if(fillText == "#fff")
			fillText = "#000";
		else
			fillText = "#fff";

		this.attr({fill : fillText});	
	});
	selectionCircle.mouseover(function (event) {
		fillText = selectionCircle.attr("fill");
		this.attr({fill: "#bbb"});
	});
	selectionCircle.mouseout(function (event) {
    		this.attr({fill: fillText});
	});
}
