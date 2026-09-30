(function(){
  function focusFirst(){
    var autoSec = document.getElementById("autoLaunchSec");
    if(autoSec && autoSec.style.display !== "none"){
      var btnNow = document.getElementById("btnLaunchNow");
      if(btnNow) { btnNow.focus(); return; }
    }
    var first = document.querySelector(".focusable");
    if(first) first.focus();
  }

  document.addEventListener("keydown", function(e){
    var k = e.keyCode;

    // Tecla Backspace (8), ESC (27) ou Círculo: Cancelar auto-launcher se ativo
    if(k === 8 || k === 27){
      if(window.P4App && window.P4App.cancelAutoLaunch){
        var autoSec = document.getElementById("autoLaunchSec");
        if(autoSec && autoSec.style.display !== "none"){
          e.preventDefault();
          window.P4App.cancelAutoLaunch();
          return;
        }
      }
    }

    // Tecla Enter (13) ou botão ✖: Disparar elemento focado
    if(k === 13){
      var a = document.activeElement;
      if(a && a.click) a.click();
    }

    // Teclas direcionais (D-Pad / setas do controle)
    if(k === 38 || k === 40 || k === 37 || k === 39){
      var items = [].slice.call(document.querySelectorAll(".focusable"));
      // Filtra apenas os visíveis
      items = items.filter(function(el){
        return el.offsetParent !== null;
      });
      if(!items.length) return;

      var i = items.indexOf(document.activeElement);
      if(i < 0) i = 0;

      var cols = (window.innerWidth > 720) ? 2 : 1;

      if(k === 38) i -= cols; // Cima
      if(k === 40) i += cols; // Baixo
      if(k === 37) i--;       // Esquerda
      if(k === 39) i++;       // Direita

      if(i < 0) i = items.length - 1;
      if(i >= items.length) i = 0;

      items[i].focus();
      e.preventDefault();
    }
  });

  window.P4Controller = {
    focusFirst: focusFirst
  };
})();
