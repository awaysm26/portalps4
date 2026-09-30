(function(w){
  var FIRMWARES = [
    {
      id: "505",
      label: "FW 5.05",
      range: "5.05",
      status: "Host Dedicado",
      route: "505/index.html",
      goldhen: "GoldHEN v2.4b18",
      exploit: "WebKit Direct"
    },
    {
      id: "672",
      label: "FW 6.72",
      range: "6.72",
      status: "Host Dedicado",
      route: "672/index.html",
      goldhen: "GoldHEN v2.4b18",
      exploit: "WebKit Direct"
    },
    {
      id: "700",
      label: "FW 7.00 - 8.52",
      range: "7.00-8.52",
      status: "PSFree + Lapse",
      route: "700/index.html",
      goldhen: "GoldHEN v2.4b18",
      exploit: "PSFree WebKit"
    },
    {
      id: "900",
      label: "FW 9.00 - 9.60",
      range: "9.00-9.60",
      status: "POOBS4 + GoldHEN",
      route: "900/index.html",
      goldhen: "GoldHEN v2.4b18",
      exploit: "exfathax USB"
    },
    {
      id: "css",
      label: "FW 10.00 - 11.02",
      range: "10.00-11.02",
      status: "CSS FontFace UAF",
      route: "css/version-selector.html",
      goldhen: "Stable / Latest",
      exploit: "WebKit UAF"
    },
    {
      id: "1300",
      label: "FW 11.00 - 13.00",
      range: "11.00-13.00",
      status: "SlopKit WebKit",
      route: "1300/version-selector.html",
      goldhen: "Rota de Pesquisa",
      exploit: "SlopKit"
    },
    {
      id: "1352",
      label: "FW 13.02 - 13.52",
      range: "13.02-13.52",
      status: "SlopKit WebKit",
      route: "1352/index.html",
      goldhen: "v2.4b18.12",
      exploit: "Pesquisa"
    }
  ];

  function parse(v){
    if(!v) return null;
    var m = String(v).match(/(\d+)\.(\d+)/);
    if(!m) return null;
    var maj = parseInt(m[1], 10);
    var minStr = m[2];
    if(minStr.length === 1) minStr += "0";
    var min = parseInt(minStr.substring(0, 2), 10);
    return maj * 100 + min;
  }

  function detectRaw(){
    var ua = navigator.userAgent || "";
    // Parâmetro na URL para testes imediatos: ?fw=9.00 ou #9.00
    var q = (location.search || "").match(/[?&]fw=([0-9]+(?:\.[0-9]+)?)/i);
    if(q && q[1]) return { fw: q[1], simulated: true };

    var hash = (location.hash || "").replace("#", "").match(/^([0-9]+(?:\.[0-9]+)?)$/);
    if(hash && hash[1]) return { fw: hash[1], simulated: true };

    // Detecção no navegador nativo do PlayStation 4:
    // Ex: "Mozilla/5.0 (PlayStation 4 9.00) AppleWebKit/605.1.15..."
    // Ex: "Mozilla/5.0 (PlayStation 4/9.00) AppleWebKit/605.1.15..."
    var m = ua.match(/(?:PlayStation\s*4)[\s/]+([0-9]+(?:\.[0-9]+)?)/i);
    if(m && m[1]) return { fw: m[1], simulated: false };

    if(/PlayStation\s*4/i.test(ua)) return { fw: "PS4", simulated: false };

    return null;
  }

  function getSystemInfo(){
    var ua = navigator.userAgent || "";
    var isRealPS4 = /PlayStation\s*4/i.test(ua);
    var raw = detectRaw();
    var fw = raw ? raw.fw : null;
    var simulated = raw ? raw.simulated : false;

    var matched = null;
    if(fw && fw !== "PS4"){
      matched = find(fw);
    } else if(isRealPS4){
      matched = find("9.00");
    }

    return {
      isPS4: isRealPS4 || simulated,
      isRealPS4: isRealPS4,
      isSimulated: simulated,
      device: isRealPS4 ? "PlayStation 4" : "PC / Navegador",
      detectedFw: fw,
      matchedFw: matched
    };
  }

  function find(v){
    var n = parse(v);
    if(n === null) return null;
    for(var i = 0; i < FIRMWARES.length; i++){
      var f = FIRMWARES[i];
      var parts = f.range.split("-");
      var a = parse(parts[0]);
      var b = parse(parts[1] || parts[0]);
      if(n >= a && n <= b) return f;
    }
    return null;
  }

  w.P4Firmware = {
    list: FIRMWARES,
    getSystemInfo: getSystemInfo,
    find: find,
    parse: parse
  };
})(window);
