(function(w){
  var App = {
    timerId: null,
    targetRoute: null,
    systemInfo: null,

    launch: function(route){
      if(!route) return;
      if(this.timerId){
        clearInterval(this.timerId);
        this.timerId = null;
      }
      location.href = route;
    },

    cancelAutoLaunch: function(){
      if(this.timerId){
        clearInterval(this.timerId);
        this.timerId = null;
      }
      var autoSec = document.getElementById('autoLaunchSec');
      if(autoSec) autoSec.style.display = 'none';

      var manualSec = document.getElementById('manualSec');
      if(manualSec){
        manualSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(function(){
          var firstBtn = manualSec.querySelector('button');
          if(firstBtn) firstBtn.focus();
        }, 100);
      }
    },

    triggerAutoLaunch: function(f, sys){
      var autoSec = document.getElementById('autoLaunchSec');
      var termDevice = document.getElementById('termDevice');
      var termFw = document.getElementById('termFw');
      var termHost = document.getElementById('termHost');
      var termRoute = document.getElementById('termRoute');
      var timerNum = document.getElementById('timerNum');
      var progressFill = document.getElementById('progressFill');

      this.targetRoute = f.route;

      if(termDevice) termDevice.innerHTML = sys.device;
      if(termFw) termFw.innerHTML = sys.detectedFw || f.label;
      if(termHost) termHost.innerHTML = f.status + ' (' + f.goldhen + ')';
      if(termRoute) termRoute.innerHTML = f.route;

      if(autoSec) autoSec.style.display = 'block';

      // Contador regressivo de 2 segundos para execução automática
      var totalTime = 2000;
      var interval = 50;
      var elapsed = 0;

      if(this.timerId) clearInterval(this.timerId);

      var self = this;
      this.timerId = setInterval(function(){
        elapsed += interval;
        var remaining = Math.max(0, Math.ceil((totalTime - elapsed) / 1000));
        var pct = Math.min(100, (elapsed / totalTime) * 100);

        if(timerNum) timerNum.innerHTML = remaining;
        if(progressFill) progressFill.style.width = pct + '%';

        if(elapsed >= totalTime){
          clearInterval(self.timerId);
          self.timerId = null;
          self.launch(self.targetRoute);
        }
      }, interval);

      // Foco automático imediato no botão de executar agora (para controle de PS4)
      setTimeout(function(){
        var btn = document.getElementById('btnLaunchNow');
        if(btn) btn.focus();
      }, 50);
    },

    renderGrid: function(activeId){
      var grid = document.getElementById('fwGrid');
      if(!grid) return;
      grid.innerHTML = '';

      var self = this;
      for(var i = 0; i < w.P4Firmware.list.length; i++){
        var f = w.P4Firmware.list[i];
        var isMatch = (activeId && f.id === activeId);

        var btn = document.createElement('button');
        btn.className = 'focusable' + (isMatch ? ' btn-matched' : '');
        btn.innerHTML = 
          '<div>' +
            '<span class="btn-lbl">' + f.label + '</span>' +
            '<span class="btn-exp">' + f.status + ' (' + f.goldhen + ')</span>' +
          '</div>' +
          '<div>' +
            '<span class="btn-tag">' + f.exploit + ' ›</span>' +
          '</div>';

        (function(target){
          btn.onclick = function(){
            self.launch(target.route);
          };
        })(f);

        grid.appendChild(btn);
      }
    },

    init: function(){
      var sys = w.P4Firmware.getSystemInfo();
      this.systemInfo = sys;

      var statConsole = document.getElementById('statConsole');
      var valCache = document.getElementById('valCache');

      // Status do cache offline
      var hasCache = (window.applicationCache && window.applicationCache.status === 1);
      if(valCache) valCache.innerHTML = hasCache ? 'Gravado (Offline Pronto)' : 'Modo Web (Online)';

      // Console detectado vs PC
      if(sys.isPS4){
        if(statConsole){
          statConsole.className = 'bar-fw';
          statConsole.innerHTML = 'PS4 DETECTADO: ' + (sys.detectedFw ? 'FW ' + sys.detectedFw : 'CONSOLE');
        }
      } else {
        if(statConsole){
          statConsole.className = 'bar-fw';
          statConsole.innerHTML = 'MODO PC / WEB';
        }
      }

      var matchedId = sys.matchedFw ? sys.matchedFw.id : null;
      this.renderGrid(matchedId);

      // Se for console PS4 ou simulação: dispara o auto-launcher direto!
      if(sys.isPS4 && sys.matchedFw){
        this.triggerAutoLaunch(sys.matchedFw, sys);
      } else {
        // No PC: foco no primeiro botão da lista
        setTimeout(w.P4Controller.focusFirst, 50);
      }

      // Eventos dos botões de controle
      var btnNow = document.getElementById('btnLaunchNow');
      if(btnNow){
        btnNow.onclick = function(){
          App.launch(App.targetRoute);
        };
      }

      var btnCancel = document.getElementById('btnCancelAuto');
      if(btnCancel){
        btnCancel.onclick = function(){
          App.cancelAutoLaunch();
        };
      }

      // Botões de simulação para testes no PC
      var testBtns = document.querySelectorAll('[data-test]');
      for(var i = 0; i < testBtns.length; i++){
        testBtns[i].onclick = function(){
          var fw = this.getAttribute('data-test');
          location.hash = fw;
          var simSys = {
            isPS4: true,
            isRealPS4: false,
            isSimulated: true,
            device: 'Navegador (Simulação)',
            detectedFw: fw,
            matchedFw: w.P4Firmware.find(fw)
          };
          if(simSys.matchedFw){
            App.renderGrid(simSys.matchedFw.id);
            App.triggerAutoLaunch(simSys.matchedFw, simSys);
          }
        };
      }
    }
  };

  w.P4App = App;
  document.addEventListener('DOMContentLoaded', function(){
    App.init();
  });
})(window);
