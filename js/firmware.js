(function(w){
var FIRMWARES=[
{id:"505",label:"5.05",range:"5.05",status:"HOST DEDICADO",route:"505/index.html",goldhen:"GoldHEN na pagina",confidence:"publicado"},
{id:"672",label:"6.72",range:"6.72",status:"HOST DEDICADO",route:"672/index.html",goldhen:"GoldHEN na pagina",confidence:"publicado"},
{id:"700",label:"7.00 a 8.52",range:"7.00-8.52",status:"PSFREE + LAPSE",route:"700/version-selector.html",goldhen:"seletor Stable / Latest",confidence:"publicado"},
{id:"900",label:"9.00 a 9.60",range:"9.00-9.60",status:"PSFREE + LAPSE",route:"900/version-selector.html",goldhen:"seletor Stable / Latest",confidence:"publicado"},
{id:"css",label:"10.00 a 11.02",range:"10.00-11.02",status:"CSSFONTFACE UAF",route:"css/version-selector.html",goldhen:"seletor Stable / Latest",confidence:"publicado"},
{id:"1300",label:"11.00 a 13.00",range:"11.00-13.00",status:"SLOPKIT WEBKIT",route:"1300/version-selector.html",goldhen:"rota de pesquisa",confidence:"pesquisa"},
{id:"1352",label:"13.02 a 13.52",range:"13.02-13.52",status:"SLOPKIT WEBKIT",route:"1352/index.html",goldhen:"v2.4b18.12 no PSX8",confidence:"pesquisa"}
];
function parse(v){var m=String(v).match(/(\d+)\.(\d+)/);return m?parseInt(m[1],10)*100+parseInt(m[2],10):null}
function detect(){var ua=navigator.userAgent;var m=ua.match(/(?:PlayStation 4|PS4)[\s\S]*?([0-9]+)\.([0-9]+)/i);return m?m[1]+"."+m[2]:null}
function find(v){var n=parse(v);if(n===null)return null;for(var i=0;i<FIRMWARES.length;i++){var f=FIRMWARES[i],parts=f.range.split("-"),a=parse(parts[0]),b=parse(parts[1]||parts[0]);if(n>=a&&n<=b)return f}return null}
w.P4Firmware={list:FIRMWARES,detect:detect,find:find,parse:parse};
})(window);
