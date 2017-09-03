
/*****
 * A no frills tooltip implementation.
 *****/


(function() {

  window.viswrap = {};
  var viswraptooltip = window.viswrap.tooltip = {};

  viswraptooltip.show = function(pos, content, gravity, dist) {

    var container = document.createElement("div");
        container.className = "viswraptooltip";

    gravity = gravity || 's';
    dist = dist || 20;

    var body = document.getElementsByTagName("body")[0];

    container.innerHTML = content;
    container.style.left = 0;
    container.style.top = 0;
    container.style.opacity = 0;

    body.appendChild(container);

    var height = parseInt(container.offsetHeight),
        width = parseInt(container.offsetWidth),
        /*
          First major Change, changing the window heights to be jquery powered
        */
        windowWidth = $(window).width(),
        windowHeight = $(window).height(),
        scrollTop = body.scrollTop,
        scrollLeft = body.scrollLeft,
        left, top;


    switch (gravity) {
      case 'e':
        left = pos[0] - width - dist;
        top = pos[1] - (height / 2);
        if (left < scrollLeft) left = pos[0] + dist;
        if (top < scrollTop) top = scrollTop + 5;
        if (top + height > scrollTop + windowHeight) top = scrollTop - height - 5;
        break;
      case 'w':
        left = pos[0] + dist;
        top = pos[1] - (height / 2);
        if (left + width > windowWidth) left = pos[0] - width - dist;
        if (top < scrollTop) top = scrollTop + 5;
        if (top + height > scrollTop + windowHeight) top = scrollTop - height - 5;
        break;
      case 'n':
        left = pos[0] - (width / 2);
        top = pos[1] + dist;
        if (left < scrollLeft) left = scrollLeft + 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (top + height > scrollTop + windowHeight) top = pos[1] - height - dist;
        break;
      case 's':
        left = pos[0] - (width / 2);
        top = pos[1] - height - dist;
        if (left < scrollLeft) left = scrollLeft + 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (scrollTop > top) top = pos[1] + 20;
        break;
    }


    container.style.left = left+"px";
    container.style.top = (top+100)+"px";
    container.style.opacity = 1;
    container.style.position = "absolute"; //fix scroll bar issue
    container.style.pointerEvents = "none"; //fix scroll bar issue

    return container;
  };

  viswraptooltip.cleanup = function() {

      // Find the tooltips, mark them for removal by this class (so others cleanups won't find it)
      var tooltips = document.getElementsByClassName('viswraptooltip');
      var purging = [];
      while(tooltips.length) {
        purging.push(tooltips[0]);
        tooltips[0].style.transitionDelay = "0 !important";
        tooltips[0].style.opacity = 0;
        tooltips[0].className = "viswraptooltip-pending-removal";
      }


      setTimeout(function() {

          while (purging.length) {
             var removeMe = purging.pop();
              removeMe.parentNode.removeChild(removeMe);
          }
    }, 500);
  };

})();
