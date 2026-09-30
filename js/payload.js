(function(w){
var CATALOG=[
{id:"goldhen",name:"GoldHEN",type:"HEN",version:"2.4b18",source:"Official GoldHEN release",status:"cataloged",firmwares:["5.05","6.72","7.00–8.52","9.00–9.60","10.00–11.02"]},
{id:"ftp",name:"FTP Server",type:"UTILITY",version:"GoldHEN integrated",source:"GoldHEN",status:"integrated",firmwares:["5.05","6.72","7.00–8.52","9.00–9.60","10.00–11.02"]},
{id:"ps4debug",name:"PS4Debug",type:"UTILITY",version:"external payload",source:"GoldHEN ecosystem",status:"requires verified binary",firmwares:["5.05","6.72","7.00–8.52","9.00–9.60","10.00–11.02"]},
{id:"app2usb",name:"App2USB",type:"UTILITY",version:"external payload",source:"Host-specific",status:"requires verified binary",firmwares:["5.05","6.72","7.00–8.52","9.00–9.60"]},
{id:"backup",name:"Backup / Restore",type:"UTILITY",version:"external payload",source:"Host-specific",status:"requires verified binary",firmwares:["5.05","6.72","7.00–8.52","9.00–9.60"]}
];
function compatible(id){var f=window.P4Firmware.find(localStorage.getItem("p4_fw")||"");if(!f)return CATALOG;return CATALOG.filter(function(p){return p.firmwares.indexOf(f.range)>=0||p.id==="goldhen"})}
w.P4Payloads={catalog:CATALOG,compatible:compatible};
})(window);
