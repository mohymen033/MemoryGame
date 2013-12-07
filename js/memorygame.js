
//create all the variables
var gametimer;
var playerscore=0;
var cardsmatched;
var cardcolor="[]";

var uiIntro = $("#gameIntro");
var uiComplete = $("#gameComplete");
var uiCards= $("#cards");
var uiTimer = $(".gametimer");
var uiPlayerScore=$(".score");
var uiPlay = $("#gamePlay");
var uiGameInfo=$("#gameinfo");
var uiGamerestart=$("#gamerestart");
var uiLogo=$("#logo");

var tagelementcount=0;
var count=0;

//create deck array
var matchingGame = {};
matchingGame.deck = ['color1', 'color1','color2', 'color2','color3', 'color3','color4', 'color4','color5', 'color5','color6', 'color6',
'color7', 'color7','color8', 'color8']

//on document load the lazy way
$(function(){

	init();		
});

//read config file
$.ajax({
   type: 'GET',
   url:'curl.php?url=http://labs.funspot.tv/worktest_color_memory/colours.conf',
     success: function(data){
	 
	 if(data=="[]"){
	   alert("Empty color data");
	     uiIntro.show();
		
		}
	else{
		
	   cardcolor = JSON.parse(data); 
	   }
   },
   error:function(data, status, error) {
		uiIntro.show();
        alert(error);
    }
});


//initialise game
function init() {


					uiComplete.hide();
					uiCards.hide();
					uiGameInfo.hide();
					uiGamerestart.hide();
					uiLogo.hide();
					playGame = false;
			
			var intro = document.getElementById("gameIntro").getElementsByClassName("button");
			//default select play button
			$(intro).addClass("active");	
			tagelementcount=tagelementcount+1;
			
			var keys = {up: 38, down: 40, left: 37, right: 39,enter:13,tab:9};
			var cards = document.getElementById("cards").getElementsByClassName("card");
			$(document).keydown(function (e)
			{
			// get key press in cross browser way
			var code = e.which || e.keyCode;
			// number of items across
			var width = 4;
			var increment, index, newIndex, active;
		
			switch(code) {
                
				//Use tab to change tab focus
				 case keys.tab:{
                
				if ($(".card-flipped").size() == 2) {
				return;
					}
					
				var gamerestart = document.getElementsByClassName("gamerestart")[0];
								
				if(count==0){
				
				$(gamerestart).addClass("active");
				count=count+1;
				}
				else
				{
				$(gamerestart).removeClass("active");
				
				count=0;
				}				
                break;
				
				}
				
				//enter key event fired to menupulate two flipped card
                case keys.enter:{				  
				if (tagelementcount==1)
				{
				 e.preventDefault();
						
						if(cardcolor=="[]"){
						alert("Empty color data");
						uiIntro.show();
						return;
						}
						uiGamerestart.show();
						uiGameInfo.show();
						uiLogo.show();
						uiIntro.hide();
						startGame();
				 tagelementcount=tagelementcount+1;
				 return;
				 }
				if( tagelementcount==3){
					e.preventDefault();
						
						uiComplete.hide();	
										
						reStartGame();
					tagelementcount=0;
					return;					
				}
				 if (count!=0)
				{
				 
				e.preventDefault();
				uiComplete.hide();	
				reStartGame();	
				return;
				}
				 
				if (count==0)
				{
				 if ($(".card-flipped").size() > 1) {
				 return;
				}
					
				var active = document.getElementById("cards").getElementsByClassName("active")[0];
				$(active).addClass("card-flipped");
				// check the pattern of both flipped card 2s later.
				if ($(".card-flipped").size() == 2) {
					setTimeout(checkPattern,2000);
				}
					
				}		
                break;
				}
               
            case keys.up:{
			
			if ($(".card-flipped").size() == 2) {
				return;
				}
               increment = -width;
               break;
			   }
			case keys.down:{
			  if ($(".card-flipped").size() == 2) {
				return;
				}
				increment = width;
				break;
				}
			
			case keys.left:{
			if ($(".card-flipped").size() == 2) {
				return;
			}
				increment = -1;
				break;
			}
			
			case keys.right:{
			if ($(".card-flipped").size() == 2) {
				return;
			}
				increment = 1;
				break;
			}
			
			default:
				increment = 0;
				break;
		}
		
		if (increment !== 0) {
			active = document.getElementById("cards").getElementsByClassName("active")[0];
			index = findItem(cards, active);
			newIndex = index + increment;
			if (newIndex >= 0 && newIndex < cards.length) {
				removeClass(active, "active");
				addClass(cards[newIndex], "active");
			}
			
			// prevent default handling of up, down, left, right keys
			return false;
		}
  });
  
    // play event fired
					uiPlay.click(function(e) {
						e.preventDefault();
						
						if(cardcolor=="[]"){
						alert("Empty color data");
						uiIntro.show();
						return;
						}
						uiGamerestart.show();
						uiGameInfo.show();
						uiLogo.show();
						uiIntro.hide();
						startGame();
					});

    //reset event fired			
					uiGamerestart.click(function(e) {
						e.preventDefault();
						uiComplete.hide();	
						reStartGame();
					});
   }

			
//start game and create cards from deck array
function startGame(){
				
				uiTimer.html("0 seconds");
				uiPlayerScore.html("");
				uiGameInfo.show();
				uiGamerestart.show();
				uiLogo.show();
				uiCards.show();
				
				gametimer = 0;
				palyerscore=0;
				cardsmatched = 0;
			   	
				if (playGame == false) {
			   			playGame = true;
						matchingGame.deck.sort(shuffle);
						for(var i=0;i<15;i++){
								$(".card:first-child").clone().appendTo("#cards");
							}
							// initialize each card's position
							uiCards.children().each(function(index) {
								// align the cards to be 4x4 ourselves.
								$(this).css({
									"left" : ($(this).width() + 10) * (index % 4),
									"top" : ($(this).height() + 10) * Math.floor(index / 4)
								});
								
								// get a pattern from the shuffled deck
								var pattern = matchingGame.deck.pop();
								// visually apply the pattern on the card's back side.
								
								if(pattern=="color1"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[0]+""});
								}
																
								if(pattern=="color2"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[1]+""});
								}
								if(pattern=="color3"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[2]+""});
								}
								if(pattern=="color4"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[3]+""});
								}
								if(pattern=="color5"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[4]+""});
								}
								if(pattern=="color6"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[5]+""});
								}
								
								if(pattern=="color7"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[6]+""});
								}
								
								if(pattern=="color8"){
								$(this).find(".back").addClass(pattern).css({"background-color":""+cardcolor[7]+""});
								}
																
								
								// embed the pattern data into the DOM element.
								$(this).attr("data-pattern",pattern);
																								
							});	
		
			var cards = document.getElementById("cards").getElementsByClassName("card");
			//default select first card
			$(cards[0]).addClass("active");					
				   	timer();
				};			   
			  }
		

function addClass(elem, cls) {
        var oldCls = elem.className;
        if (oldCls) {
            oldCls += " ";
        }
        elem.className = oldCls + cls;
    }
    
function removeClass(elem, cls) {
        var str = " " + elem.className + " ";
        elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
    }
 
//element index find
 function findItem(items, target) {
        for (var i = 0; i < items.length; i++) {
            if (items[i] === target) {
                return(i);
            }
        }
        return(-1);
 }

		
//timer for game
function timer() {
				
				if (playGame) {
					scoreTimeout = setTimeout(function() {
						uiTimer.html(++gametimer + " seconds");		
						timer();
					}, 1000);
				};
		};

//shuffle cards
function shuffle() {
	return 0.5 - Math.random();
}


//if pattern is same remove cards otherwise flip back
function checkPattern() {
	if (isMatchPattern()) {
		$(".card-flipped").removeClass("card-flipped").addClass("card-removed");
			if(document.webkitTransitionEnd){
				$(".card-removed").bind("webkitTransitionEnd",	removeTookCards);
			}else{
			
				removeTookCards();
			}
			
			var remainingactive = document.getElementById("cards").getElementsByClassName("card");
			
			$(remainingactive[0]).addClass("active");
			
			uiPlayerScore.html(++playerscore + " points ");
		} 
		else {
		$(".card-flipped").removeClass("card-flipped");
		uiPlayerScore.html(--playerscore + " points ");
	}
}

//put 2 flipped cards in an array then check the image to see if it's the same.
function isMatchPattern() {
	var cards = $(".card-flipped");
	var pattern = $(cards[0]).data("pattern");
	var anotherPattern = $(cards[1]).data("pattern");
	return (pattern == anotherPattern);
}

//check to see if all cardmatched variable is less than 7 if so remove card only otherwise remove card and end game 
function removeTookCards() {
	if (cardsmatched < 7){
	
		cardsmatched++;
		$(".card-removed").remove();
	}else{
		$(".card-removed").remove();
		uiCards.hide();
		uiGamerestart.hide();
		uiGameInfo.hide();
		uiLogo.hide();
		uiComplete.show();
		var gamecomplete = document.getElementById("gameComplete").getElementsByClassName("button");
			//default select first card
		$(gamecomplete).addClass("active");
		tagelementcount=3;
		clearTimeout(scoreTimeout);
	}	
}

//recreate the original card , stop the timer and re populate the array with class names
function reStartGame(){
				
				playGame = false;
				uiCards.html("<div class='card'><div class='face front'></div><div class='face back'></div></div>");
				clearTimeout(scoreTimeout);
				matchingGame.deck = ['color1', 'color1','color2', 'color2','color3', 'color3','color4', 'color4','color5', 'color5','color6', 'color6',
				'color7', 'color7','color8', 'color8']			
				startGame();

}
				