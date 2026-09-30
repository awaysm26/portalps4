(function(w){
var KEY="P4_PORTAL_CACHE_VERSION",VERSION="2026.09.001";
function has(){return window.applicationCache&&window.applicationCache.status===1}
function init(){var el=document.getElementById("cacheBadge"),txt=document.getElementById("cardCache"),pct=document.getElementById("cachePercent"),title=document.getElementById("cacheTitle"),info=document.getElementById("infoCache");var ok=has();el.innerHTML="CACHE "+(ok?"READY":"WEB");txt.innerHTML=ok?"Available":"Online / not installed";pct.innerHTML=ok?"100%":"—";title.innerHTML=ok?"Cache available":"Cache not installed";if(info)info.innerHTML=ok?"READY":"NOT INSTALLED";localStorage.setItem(KEY,VERSION);return ok}
w.P4Cache={version:VERSION,init:init,has:has};
})(window);
