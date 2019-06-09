// function throttle(f, dela) {
//   var timer = null;

//   dela = dela || 500;
//   return function() {
//     if (timer) {
//       clearTimeout(timer);
//     }
//     timer = setTimeout(function() {
//       f();
//     }, dela);
//   };
// }
function buildCagloute() {
  var asideDom = document.getElementById('aside');
  var articleDom = document.querySelector('.m-markdown');
  var hList = articleDom.querySelectorAll('h2,h3,h4,h5,h6');
  var item = null;
  var aTarget = null;
  var level = -1;
  var alink = null;
  var i = 0;
  // var fScroll = throttle(hScroll);

  for (; i < hList.length; i++) {
    item = hList[i];
    aTarget = document.createElement('a');
    level = item.nodeName.substr(1, 1);
    alink = document.createElement('a');
    aTarget.href = '#' + item.innerHTML;
    aTarget.innerHTML = '#';

    aTarget.id = item.innerHTML;
    item.parentNode.insertBefore(aTarget, item);

    alink.innerHTML = item.innerHTML;
    alink.href = '#' + item.innerHTML;
    alink.className = 'pl' + (level - 1) + ' outline-h' + level;
    alink.level = level;
    asideDom.appendChild(alink);
  }
}
window.onload = function() {
  buildCagloute();
};
