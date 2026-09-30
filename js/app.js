(function(w){
  var App = {
    selected: null,
    systemInfo: null,

    show: function(screenId){
      var screens = document.querySelectorAll('.screen');
      for(var i = 0; i < screens.length; i++){
        screens[i].classList.remove('active');
      }
      var target = document.getElementById(screenId);
      if(target){
        target.classList.add('active');
        window.scrollTo(0, 0);
        setTimeout(w.P4Controller.focusFirst, 30);
      }
    },

    updateDetectionUI: function(){
      var info = this.systemInfo || w.P4Firmware.getSystemInfo();
      var pill = document.getElementById('detectPill');
      var pillText = document.getElementById('detectPillText');
      var statusTag = document.getElementById('detectStatusTag');
      var fwBig = document.getElementById('detectFwBig');
      var title = document.getElementById('detectTitle');
      var desc = document.getElementById('detectDesc');
      var simBar = document.getElementById('simBar');
      var hostName = document.getElementById('routeHostName');
      var ghText = document.getElementById('routeGoldHen');
      var btnHostText = document.getElementById('btnHostText');
      var caption = document.getElementById('consoleIdCaption');

      var f = this.selected;

      if(info.isPS4){
        // Console PlayStation 4 detectado nativamente
        if(pill) pill.className = 'hub-pill ps4-live';
        if(pillText) pillText.innerHTML = 'CONSOLE PLAYSTATION 4 IDENTIFICADO';
        if(statusTag){
          statusTag.className = 'hub-tag tag-success';
          statusTag.innerHTML = 'AUTO-DETECTADO';
        }
        if(caption) caption.innerHTML = 'PS4 CONSOLE ONLINE';
        if(simBar) simBar.style.display = 'none';
      } else if(info.isSimulated){
        // Modo de simulação para testes
        if(pill) pill.className = 'hub-pill sim-live';
        if(pillText) pillText.innerHTML = 'MODO DE TESTE (SIMULAÇÃO)';
        if(statusTag){
          statusTag.className = 'hub-tag tag-warning';
          statusTag.innerHTML = 'SIMULADO: FW ' + info.detectedFw;
        }
        if(caption) caption.innerHTML = 'MODO SIMULADOR';
        if(simBar) simBar.style.display = 'flex';
      } else {
        // Dispositivo externo (PC / Celular)
        if(pill) pill.className = 'hub-pill web-live';
        if(pillText) pillText.innerHTML = info.device.toUpperCase() + ' (MODO WEB)';
        if(statusTag){
          statusTag.className = 'hub-tag tag-info';
          statusTag.innerHTML = 'SELEÇÃO MANUAL';
        }
        if(caption) caption.innerHTML = 'MODO DEMO / PC';
        if(simBar) simBar.style.display = 'flex';
      }

      if(f){
        if(fwBig) fwBig.innerHTML = (info.isPS4 && info.detectedFw ? info.detectedFw : f.label);
        if(title){
          if(info.isPS4 && info.detectedFw){
            title.innerHTML = 'Firmware <b>' + info.detectedFw + '</b> pronto para o exploit';
          } else {
            title.innerHTML = 'Firmware selecionado: <b>' + f.label + '</b>';
          }
        }
        if(desc){
          desc.innerHTML = f.desc + ' ' + (info.isPS4 ? 'Host verificado especificamente para este console.' : 'Para usar no PS4, abra este link no navegador do videogame.');
        }
        if(hostName) hostName.innerHTML = f.label + ' (' + f.status + ')';
        if(ghText) ghText.innerHTML = f.goldhen;
        if(btnHostText) btnHostText.innerHTML = 'ABRIR HOST DO FW ' + f.label;
      }
    },

    selectFirmware: function(f, updateStorage){
      if(!f) return;
      this.selected = f;
      if(updateStorage !== false){
        localStorage.setItem('p4_fw', f.range);
      }

      // Atualiza badges no cabeçalho e rodapé
      var fwBadge = document.getElementById('fwBadge');
      var ghBadge = document.getElementById('ghBadge');
      var cardFw = document.getElementById('cardFw');
      var footerFw = document.getElementById('footerFw');

      if(fwBadge) fwBadge.innerHTML = '<i class="dot"></i> FW ' + f.label;
      if(ghBadge) ghBadge.innerHTML = '<i class="dot"></i> ' + f.goldhen;
      if(cardFw) cardFw.innerHTML = f.label + ' - ' + f.status;
      if(footerFw) footerFw.innerHTML = 'FW ATUAL: ' + f.label;

      // Painel de detalhes na tela de firmwares
      var d = document.getElementById('fwDetail');
      if(d){
        d.innerHTML = '<div class="detail-header">' +
          '<div class="detail-title"><b>FIRMWARE ' + f.label + '</b> <span class="tag-status">' + f.status + '</span></div>' +
          '<div class="detail-badge">' + f.tag + '</div>' +
          '</div>' +
          '<p class="detail-desc">' + f.desc + '</p>' +
          '<div class="detail-meta">' +
          '<span><b>Rota do Arquivo:</b> <code>' + f.route + '</code></span>' +
          '<span><b>Carga GoldHEN:</b> ' + f.goldhen + '</span>' +
          '<span><b>Estabilidade:</b> ' + f.confidence.toUpperCase() + '</span>' +
          '</div>' +
          '<div class="detail-actions">' +
          '<button class="btn-primary focusable" data-action="host"><span>⚡ ABRIR HOST AGORA (' + f.label + ')</span></button>' +
          '</div>';
      }

      this.updateDetectionUI();
      this.renderFirmwareCards();
      bindEvents();
    },

    renderFirmwareCards: function(){
      var g = document.getElementById('firmwareGrid');
      if(!g) return;
      g.innerHTML = '';

      var currentRange = this.selected ? this.selected.range : '';
      var detectedFw = this.systemInfo ? this.systemInfo.detectedFw : null;
      var matchedDetected = this.systemInfo ? this.systemInfo.matchedFw : null;

      for(var i = 0; i < w.P4Firmware.list.length; i++){
        var f = w.P4Firmware.list[i];
        var isSelected = (f.range === currentRange);
        var isConsoleMatch = (matchedDetected && matchedDetected.id === f.id);

        var card = document.createElement('button');
        card.className = 'fw-card focusable' + (isSelected ? ' selected-fw' : '') + (isConsoleMatch ? ' detected-fw' : '');

        var badgeHtml = isConsoleMatch ? '<span class="fw-detected-badge">★ DETECTADO NO CONSOLE</span>' : '<span class="fw-tag">' + f.tag + '</span>';

        card.innerHTML = 
          '<div class="fw-card-top">' +
            '<span class="fw-num">' + f.label + '</span>' +
            badgeHtml +
          '</div>' +
          '<div class="fw-card-mid">' +
            '<b>' + f.status + '</b>' +
            '<small>' + f.goldhen + '</small>' +
          '</div>' +
          '<div class="fw-card-bottom">' +
            '<span>' + (isSelected ? '✓ SELECIONADO' : 'SELECIONAR') + '</span>' +
            '<i>›</i>' +
          '</div>';

        (function(targetFw){
          card.onclick = function(){
            App.selectFirmware(targetFw, true);
          };
        })(f);

        g.appendChild(card);
      }
    },

    renderPayloads: function(){
      var g = document.getElementById('payloadGrid');
      if(!g) return;
      var list = w.P4Payloads.compatible();
      g.innerHTML = '';

      for(var i = 0; i < list.length; i++){
        var p = list[i];
        var card = document.createElement('div');
        card.className = 'payload-card';
        card.innerHTML = 
          '<div class="payload-head">' +
            '<b>' + p.name + '</b>' +
            '<span class="payload-tag">' + p.type + '</span>' +
          '</div>' +
          '<div class="payload-body">' +
            '<small class="payload-ver">Versão: ' + p.version + '</small>' +
            '<small class="payload-src">Origem: ' + p.source + '</small>' +
          '</div>' +
          '<div class="payload-status">' +
            '<span class="status-pill">' + p.status.toUpperCase() + '</span>' +
          '</div>';
        g.appendChild(card);
      }
    },

    start: function(){
      var f = this.selected || w.P4Firmware.find(localStorage.getItem('p4_fw') || '');
      if(!f){
        this.show('firmware');
        return;
      }

      var loader = document.getElementById('loader');
      var loaderTitle = document.getElementById('loaderTitle');
      var loaderText = document.getElementById('loaderText');

      if(loaderTitle) loaderTitle.innerHTML = 'INICIANDO HOST ' + f.label;
      if(loaderText) loaderText.innerHTML = 'Carregando ' + f.status + ' (' + f.route + ')...';
      if(loader) loader.className = 'loader active';

      setTimeout(function(){
        location.href = f.route;
      }, 1000);
    },

    init: function(){
      this.systemInfo = w.P4Firmware.getSystemInfo();

      // Seleção prioritária:
      // 1. Firmware correspondente ao detectado nativamente no PS4
      // 2. Firmware salvo no localStorage
      // 3. Fallback: 9.00 (versão padrão mais comum de exploit)
      var targetFw = null;
      if(this.systemInfo.matchedFw){
        targetFw = this.systemInfo.matchedFw;
      } else {
        var savedRange = localStorage.getItem('p4_fw');
        if(savedRange){
          targetFw = w.P4Firmware.find(savedRange);
        }
      }

      if(!targetFw){
        targetFw = w.P4Firmware.find('9.00') || w.P4Firmware.list[3];
      }

      this.selectFirmware(targetFw, false);
      this.renderFirmwareCards();
      this.renderPayloads();
      w.P4Cache.init();
      bindEvents();
    }
  };

  function bindEvents(){
    var elements = document.querySelectorAll('[data-action]');
    for(var i = 0; i < elements.length; i++){
      elements[i].onclick = function(e){
        var action = this.getAttribute('data-action');
        if(action === 'home') App.show('home');
        else if(action === 'firmware') App.show('firmware');
        else if(action === 'payloads'){
          App.renderPayloads();
          App.show('payloads');
        }
        else if(action === 'cache'){
          w.P4Cache.init();
          App.show('cache');
        }
        else if(action === 'cacheRefresh'){
          w.P4Cache.init();
        }
        else if(action === 'guide') App.show('guide');
        else if(action === 'info') App.show('info');
        else if(action === 'host') App.start();
        else if(action === 'simulate'){
          var simFw = this.getAttribute('data-fw');
          if(simFw){
            location.hash = simFw;
            App.systemInfo = {
              isPS4: false,
              isPS5: false,
              isSimulated: true,
              device: 'Navegador (Simulação ' + simFw + ')',
              detectedFw: simFw,
              matchedFw: w.P4Firmware.find(simFw)
            };
            var matched = w.P4Firmware.find(simFw);
            if(matched) App.selectFirmware(matched, true);
          }
        }
      };
    }
  }

  w.P4App = App;
  document.addEventListener('DOMContentLoaded', function(){
    App.init();
  });
})(window);
