(function() {
  var Level = {
    h2: 0,
    h3: 0,
    h4: 0,
    h5: 0,
    currLev: 0,
    lastLev: 0,
    toString: function() {
      var str = `${this.h2}.${this.h3}.${this.h4}.${this.h5}`;
      var s = str.replace(/(\.0)*$/g, '');
      return s == '0' ? '' : s;
    },
    setCurrLev: function(lev) {
      this.lastLev = this.currLev;
      this.currLev = lev;
      if (this.lastLev > this.currLev) {
        this.reset(lev);
      }
      this['h' + lev]++;
    },
    reset: function(lev = 1) {
      lev++;
      while (lev <= 5) {
        this['h' + lev] = 0;
        lev++;
      }
    }
  };

  function drawPath() {
    /* 缓存元素参考和测量 */
    linkItems = linkItems.map(function(item) {
      var anchor = item;
      var target = document.getElementById(
        anchor.getAttribute('href').slice(1)
      );
      return {
        listItem: item,
        anchor: item,
        target: target,
        yStart: target.offsetTop
      };
    });
    /* 删除丢失的目标 */
    linkItems = linkItems.filter(function(item) {
      return !!item.target;
    });
    var path = [];
    var pathIndent;
    linkItems.forEach(function(item, i) {
      var x = item.anchor.offsetLeft,
        y = item.anchor.offsetTop,
        height = item.anchor.offsetHeight;
      x = parseInt(window.getComputedStyle(item.anchor).paddingLeft)+8;
      if (i !== linkItems.length - 1) {
        item.yEnd = linkItems[i + 1].yStart;
      } else {
        item.yEnd = document.documentElement.offsetHeight;
      }
      if (i === 0) {
        path.push('M', x, y, 'L', x, y + height);
        item.pathStart = 0;
      } else {
        /*  当有一个变化时，再画一条线  缩进级别 */
        if (pathIndent !== x) {
          path.push('L', pathIndent, y);
        }
        path.push('L', x, y);
        /* 设置当前路径，以便我们可以测量它 */
        pathDom.setAttribute('d', path.join(' '));
        item.pathStart = pathDom.getTotalLength() || 0;
        path.push('L', x, y + height);
      }
      pathIndent = x;
      pathDom.setAttribute('d', path.join(' '));
      item.pathEnd = pathDom.getTotalLength();
    });
    pathLength = pathDom.getTotalLength();
    sync();
  }

  function isDiff(x1, y1, x2, y2) {
    var d1 = Math.abs(x1 - y1);
    var d2 = Math.abs(x2 - y2);
    var arr = [x1, y1, x2, y2].sort((x, y) => x - y);
    return Math.abs(arr[0] - arr[3]) < d1 + d2;
  }
  function sync() {
    var windowHeight = window.innerHeight;
    var pathStart = pathLength,
      pathEnd = 0;
    var visibleItems = 0;
    console.log(linkItems);
    linkItems.forEach(function(item) {
      /* var targetBounds = item.target.getBoundingClientRect();
        console.log( targetBounds.bottom,  windowHeight * TOP_MARGIN, targetBounds.top,windowHeight * (1 - BOTTOM_MARGIN))                      if (targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)) {                          pathStart = Math.min(item.pathStart, pathStart);                          pathEnd = Math.max(item.pathEnd, pathEnd);                            visibleItems += 1;                            item.listItem.classList.add('visible');                      }                      window.pageYOffset ： 在edge中使用                      document.documentElement.scrollTop: 在chrome中使用 */

      var _start = window.pageYOffset || document.documentElement.scrollTop;
      var _end = _start + window.innerHeight;
      console.log(_start, _end);
      if (isDiff(_start, _end, item.yStart, item.yEnd)) {
        pathStart = Math.min(item.pathStart, pathStart);
        pathEnd = Math.max(item.pathEnd, pathEnd);
        console.log('isDiff', pathStart, pathEnd);
        visibleItems += 1;
        item.listItem.classList.add('visible');
      } else {
        item.listItem.classList.remove('visible');
      }
    });
    /* S指定可见路径或完全隐藏路径 如果没有可见的项目 */

    if (visibleItems > 0 && pathStart < pathEnd) {
      pathDom.setAttribute('stroke-dashoffset', '1');
      pathDom.setAttribute(
        'stroke-dasharray',
        '1, ' + pathStart + ', ' + (pathEnd - pathStart) + ', ' + pathLength
      );
      pathDom.setAttribute('opacity', 1);
    } else {
      pathDom.setAttribute('opacity', 0);
    }
  }
  /* 节流函数 */
  function _throttle(f, t = 100) {
    var temp = 0;
    var timer = null; 
    return function() {
      var _arg  = arguments;
      var now = Date.now();
      clearInterval(timer);
      if (now - temp >= t) {
        f.apply(this, _arg);
        temp = now;
      } else {
        timer = setTimeout(()=>{
          f.apply(this,_arg);
        },t);
      }
    };
  }
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var pathDom = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.appendChild(pathDom);
  var linkItems = [];
  var pathLength;

  function set_aside_style(dom, width_rem, top) {
    Object.assign(dom.style, {

      width: `${width_rem}rem`,
      top: `${top}px`
    });
  }
  function Catalogue(settings = {}) {
    var defult = {
      selector: 'article',
      catalogueClass: 'catalogue',
      isPadding: true,
      width_rem: 16
    };
    Object.assign(settings, defult);

    var { selector, isPadding, catalogueClass, width_rem } = settings;
    var aside = document.createElement('div');
    aside.innerHTML = '<h2 class=\'tc\'>目录</h2>';
    var asideDom = document.createElement('div');
    aside.append(asideDom);
    var articleDom = document.querySelector(selector);
    aside.className = catalogueClass;
    
    var parent = articleDom.parentNode;
    parent.insertBefore(aside, articleDom);
    set_aside_style(aside, width_rem, parent.offsetTop);

    var hList = articleDom.querySelectorAll('h1,h2,h3,h4,h5,h6');
    var item = null;
    var aTarget = null;
    var level = -1;
    var alink = null;
    var i = 0;
    for (; i < hList.length; i++) {
      item = hList[i];
      aTarget = document.createElement('a');
      level = item.nodeName.substr(1, 1);
      Level.setCurrLev(level);
      alink = document.createElement('a');
     
      linkItems.push(alink);
      
      aTarget.href = '#' + item.innerHTML;
      aTarget.innerHTML = '';
      aTarget.id = item.innerHTML;
      item.parentNode.insertBefore(aTarget, item);
      alink.innerHTML = Level + item.innerHTML;
      if(alink.innerHTML.length > 20){
        alink.innerHTML = alink.innerHTML.substr(0,17)+'...';
      }
      alink.href = '#' + item.innerHTML;
      alink.classList.add('catalogue_link');
      if (isPadding) {
        alink.classList.add('pl' + (level - 1));
      }
      alink.level = level;
      asideDom.appendChild(alink);
    }
    pathDom.setAttribute('stroke', '#444');
    pathDom.setAttribute('stroke-width', '3');
    pathDom.setAttribute('fill', 'transparent');
    pathDom.setAttribute('stroke-linecap', 'round');
    pathDom.setAttribute('stroke-linejoin', 'round');
    pathDom.setAttribute('transform', 'translate(-0.5, -0.5)');
    svg.classList.add('toc-marker');
    svg.setAttribute('width', 200);
    svg.setAttribute('height', 200);
    asideDom.appendChild(svg);
  }
  window.Catalogue = Catalogue;
  window.addEventListener('load', function() {
    new Catalogue();
    window.addEventListener('resize', _throttle(drawPath), false);

    window.addEventListener('scroll', _throttle(sync), false);
    drawPath();
  });


  var nod = document.createElement('style'),   
str = `
.visible {
  font-weight: bold;
  transform: translate(5px);
}
path {
  -webkit-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
.toc-marker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.catalogue{
  background-color:#fff;
  overflow-y: auto;
  position: fixed;
  left: 0;
  bottom:0;
  padding:1em;
}
.catalogue_link {
    display: block;
    line-height: 2;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
`;

nod.type='text/css';  
if(nod.styleSheet){         //ie下  
　　nod.styleSheet.cssText = str;  
} else {  
　　nod.innerHTML = str;       
//或者写成 nod.appendChild(document.createTextNode(str))  
}  
document.getElementsByTagName('head')[0].appendChild(nod);
})();

