(function(){
function focusFirst(){var el=document.querySelector(".screen.active .focusable,.screen.active .fw-card");if(el)el.focus()}
document.addEventListener("keydown",function(e){
var k=e.keyCode;
if(k===8||k===27){e.preventDefault();var home=document.querySelector("#home");if(!home.className.match(/active/)){window.P4App.show("home");return}}
if(k===13){var a=document.activeElement;if(a&&a.click)a.click()}
if(k===38||k===40||k===37||k===39){
var items=[].slice.call(document.querySelectorAll(".screen.active .focusable,.screen.active .fw-card"));
if(!items.length)return;var i=items.indexOf(document.activeElement);if(i<0)i=0;var cols=1;if(window.innerWidth>850)cols=4;else if(window.innerWidth>520)cols=2;
if(k===38)i-=cols;if(k===40)i+=cols;if(k===37)i--;if(k===39)i++;if(i<0)i=items.length-1;if(i>=items.length)i=0;items[i].focus();e.preventDefault();
}});
window.P4Controller={focusFirst:focusFirst};
})();
