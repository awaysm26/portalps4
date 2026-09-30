(function(w){
  var FIRMWARES = [
    {
      id: "505",
      label: "5.05",
      range: "5.05",
      status: "HOST DEDICADO",
      tag: "ESTÁVEL",
      route: "505/index.html",
      goldhen: "GoldHEN v2.4b18",
      confidence: "publicado",
      desc: "Exploit WebKit direto. Rápido e estável sem necessidade de pendrive USB."
    },
    {
      id: "672",
      label: "6.72",
      range: "6.72",
      status: "HOST DEDICADO",
      tag: "ESTÁVEL",
      route: "672/index.html",
      goldhen: "GoldHEN v2.4b18",
      confidence: "publicado",
      desc: "Exploit WebKit direto. Alta taxa de sucesso sem necessidade de pendrive USB."
    },
    {
      id: "700",
      label: "7.00 a 8.52",
      range: "7.00-8.52",
      status: "PSFREE + LAPSE",
      tag: "COMPATÍVEL",
      route: "700/version-selector.html",
      goldhen: "Seletor Stable / Latest",
      confidence: "publicado",
      desc: "Execução via WebKit PSFree. Inclui seletor de versão do GoldHEN."
    },
    {
      id: "900",
      label: "9.00 a 9.60",
      range: "9.00-9.60",
      status: "PSFREE + POOBS4",
      tag: "RECOMENDADO",
      route: "900/version-selector.html",
      goldhen: "GoldHEN v2.4b18",
      confidence: "publicado",
      desc: "Firmware mais popular. Utiliza pendrive exfathax para carregar o GoldHEN."
    },
    {
      id: "css",
      label: "10.00 a 11.02",
      range: "10.00-11.02",
      status: "CSSFONTFACE UAF",
      tag: "AVANÇADO",
      route: "css/version-selector.html",
      goldhen: "Seletor Stable / Latest",
      confidence: "publicado",
      desc: "Exploit WebKit via CSS Font Face UAF para consoles 10.00 até 11.02."
    },
    {
      id: "1300",
      label: "11.00 a 13.00",
      range: "11.00-13.00",
      status: "SLOPKIT WEBKIT",
      tag: "PESQUISA",
      route: "1300/version-selector.html",
      goldhen: "Rota de Pesquisa",
      confidence: "pesquisa",
      desc: "Ambiente experimental SlopKit para análise e pesquisa de vulnerabilidades."
    },
    {
      id: "1352",
      label: "13.02 a 13.52",
      range: "13.02-13.52",
      status: "SLOPKIT WEBKIT",
      tag: "PESQUISA",
      route: "1352/index.html",
      goldhen: "v2.4b18.12 no PSX8",
      confidence: "pesquisa",
      desc: "Ambiente experimental de pesquisa para firmwares 13.02 a 13.52."
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
    // Parâmetro de teste na URL: ?fw=9.00
    var q = (location.search || "").match(/[?&]fw=([0-9]+(?:\.[0-9]+)?)/i);
    if(q && q[1]) return { fw: q[1], simulated: true };

    // Hash na URL: #9.00
    var hash = (location.hash || "").replace("#", "").match(/^([0-9]+(?:\.[0-9]+)?)$/);
    if(hash && hash[1]) return { fw: hash[1], simulated: true };

    // Detecção no navegador nativo do PlayStation 4:
    // Ex: "Mozilla/5.0 (PlayStation 4 9.00) AppleWebKit/605.1.15..."
    // Ex: "Mozilla/5.0 (PlayStation 4/5.05) AppleWebKit/537.78..."
    var m = ua.match(/(?:PlayStation\s*4)[\s/]+([0-9]+(?:\.[0-9]+)?)/i);
    if(m && m[1]) return { fw: m[1], simulated: false };

    // Caso o console envie apenas "PlayStation 4" sem versão explícita no UA
    if(/PlayStation\s*4/i.test(ua)) return { fw: "PS4", simulated: false };

    return null;
  }

  function detect(){
    var info = detectRaw();
    return info ? info.fw : null;
  }

  function getSystemInfo(){
    var ua = navigator.userAgent || "";
    var isPS4 = /PlayStation\s*4/i.test(ua);
    var isPS5 = /PlayStation\s*5/i.test(ua);
    var raw = detectRaw();
    var fw = raw ? raw.fw : null;
    var simulated = raw ? raw.simulated : false;

    var matched = null;
    if(fw && fw !== "PS4"){
      matched = find(fw);
    }

    var device = "PC / Navegador Web";
    if(isPS4) device = "PlayStation 4 Console";
    else if(isPS5) device = "PlayStation 5 Console";
    else if(/Mobile|Android|iPhone|iPad/i.test(ua)) device = "Dispositivo Móvel";

    return {
      isPS4: isPS4,
      isPS5: isPS5,
      isSimulated: simulated,
      device: device,
      detectedFw: fw,
      matchedFw: matched,
      userAgent: ua
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
    detect: detect,
    getSystemInfo: getSystemInfo,
    find: find,
    parse: parse
  };
})(window);
