(function(){
  function focusFirst(){
    var el = document.querySelector(".screen.active #btnOpenHost") || 
             document.querySelector(".screen.active .focusable, .screen.active .fw-card");
    if(el) el.focus();
  }

  document.addEventListener("keydown", function(e){
    var k = e.keyCode;

    // Tecla Backspace (8) ou ESC (27) ou Círculo no controle: Voltar para Home
    if(k === 8 || k === 27){
      e.preventDefault();
      var home = document.querySelector("#home");
      if(!home.classList.contains("active")){
        if(window.P4App && window.P4App.show){
          window.P4App.show("home");
        }
        return;
      }
    }

    // Tecla Enter (13) ou botão ✖ do PS4: Ativar elemento focado
    if(k === 13){
      var a = document.activeElement;
      if(a && a.click) a.click();
    }

    // Teclas direcionais (D-Pad / Analógico do controle: Cima, Baixo, Esquerda, Direita)
    if(k === 38 || k === 40 || k === 37 || k === 39){
      var items = [].slice.call(document.querySelectorAll(".screen.active .focusable, .screen.active .fw-card"));
      if(!items.length) return;

      var i = items.indexOf(document.activeElement);
      if(i < 0) i = 0;

      var cols = 1;
      if(window.innerWidth > 900) cols = 4;
      else if(window.innerWidth > 540) cols = 2;

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
