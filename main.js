/* CANVAS PARTICLES */
;((window, document)=>{
  
  
    const numberOfParticles = 15,
          maxSpeed = 0.5,
          minSize = 1,
          maxSize = 5,
          minMouseDistance = 150,
          minNewParticlesOnClick = 2,
          maxNewParticlesOnClick = 4,
          newParticleSpeedMultiplier = 25;
    
    var canvas, ctx, width, height,
        resizeDebouncer, particles, newParticles;
      
    document.addEventListener("DOMContentLoaded", init);
      
    function init(){
        canvas = document.querySelector("canvas");
          ctx = canvas.getContext("2d");
          //
          window.addEventListener("resize", handleResize);
          canvas.addEventListener("click", handleClick);
          canvas.addEventListener("mousemove", handleMousemove);
          //
          setup();
          requestAnimationFrame(loop);
    }
      
    function setup(){
        width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight * 2;
          particles = Array(numberOfParticles).fill().map(getParticle);
          newParticles = [];
    }
      
    function getParticle(){
        return {
            x: Math.random() * width,
              y: Math.random() * height,
              vx: Math.random() * maxSpeed * 2 - maxSpeed,
              vy: Math.random() * maxSpeed * 2 - maxSpeed,
              s: Math.random() * (maxSize - minSize + 1) + minSize,
              c: "white"
        };
    }
      
    function updateParticles(){
        for (let i=0; i<particles.length; i++){
            let p = particles[i];
              updateParticle(p);
              drawParticle(p);
        }
    }
      
    function updateNewParticles(){
        for (let i=newParticles.length-1; i>=0; i--){
            let p = newParticles[i];
              updateParticle(p);
              drawParticle(p);
              if (dist(p, p.mouse) > minMouseDistance){
                newParticles.splice(i, 1);
                  p.vx /= newParticleSpeedMultiplier;
                  p.vy /= newParticleSpeedMultiplier;
                  particles.push(p);
            }
        }
    }
      
    function updateParticle(p){
        p.x += p.vx;
          p.y += p.vy;
          if (p.x < -p.s) p.x = width + p.s; //wrap from left edge to right edge
          if (p.x > width + p.s) p.x = -p.s; //wrap from right edge to left edge
          if (p.y < -p.s) p.y = height + p.s; //wrap from top edge to bottom edge
          if (p.y > height + p.s) p.y = -p.s; //wrap from bottom edge to top edge
    }
      
    function moveParticle(p, mouse){
        //get angle between p and mouse
          var a = Math.atan2(p.y - mouse.y, p.x - mouse.x),
          //get new x,y coordinates
              x = mouse.x + Math.cos(a) * minMouseDistance,
            y = mouse.y + Math.sin(a) * minMouseDistance;
          //set p.x and p.y to new coordinates
          p.x = x;
          p.y = y;
    }
      
    function drawParticle(p){
        ctx.fillStyle = p.c;
          ctx.fillRect(p.x-p.s/2, p.y-p.s/2, p.s, p.s);
    }
    
    function loop(){
        ctx.clearRect(0, 0, width, height);
          updateParticles();
          updateNewParticles();
          requestAnimationFrame(loop);
    }
      
    function handleResize(){
        if (resizeDebouncer) clearTimeout(resizeDebouncer);
          resizeDebouncer = setTimeout(setup, 100);
    }
      
    function handleClick(e){
        var newParticleCount = Math.floor(Math.random() * (maxNewParticlesOnClick - minNewParticlesOnClick + 1) + minNewParticlesOnClick);
          for (let i=0; i<newParticleCount; i++){
            let p = getParticle();
              p.x = e.clientX;
              p.y = e.clientY;
              p.vx *= newParticleSpeedMultiplier;
              p.vy *= newParticleSpeedMultiplier;
              p.mouse = {x: e.clientX, y: e.clientY};
              newParticles.push(p);
        }
    }
      
    function handleMousemove(e){
          var mouse = {x: e.clientX, y: e.clientY};
        for (let i=0; i<particles.length; i++){
            let p = particles[i],
                d = dist(p, mouse);
              if (d < minMouseDistance) moveParticle(p, mouse);
        }
    }
      
    /* helper functions */
      
    function dist(p1, p2){
        var dx = p2.x - p1.x,
            dy = p2.y - p1.y;
          return Math.sqrt(dx * dx + dy * dy);
    }
      
    
    })(window, document);
    /*************************************************/
          
    /*************************************************/
    /* SCROLL CONTROL */
    ;((window, document)=>{
    
    const scrollController = [
        {
            el: null,
              selector: "main > div:last-of-type",
              startTop: null,
              endTop: 0,
              changes: [
                {
                    cssRule: "opacity",
                      startVal: 1,
                      endVal: 0
                }
            ]
        },
    ];
      
    document.addEventListener("DOMContentLoaded", init);
      
    function init(){
        div1 = document.querySelector("main div:first-of-type");
          div2 = div1.nextElementSibling;
          //
          setup();
          //
          window.addEventListener("scroll", handleScroll);
    }
      
    function setup(){
        scrollController.forEach(sc => {
            sc.el = document.querySelector(sc.selector);
              sc.startTop = sc.el.getBoundingClientRect().top;
        });
    }
      
    function handleScroll(){
        scrollController.forEach(sc => {
              //get percentage between start and end
            let top = sc.el.getBoundingClientRect().top,
                adjustedTop = top - Math.min(sc.startTop, sc.endTop),
                range = Math.abs(sc.startTop - sc.endTop),
                percent = adjustedTop / range;
              sc.el.style = "";
              sc.changes.forEach(ch => {
                //change CSS based on percentage
                  let val = Math.abs(ch.startVal - ch.endVal) * percent + Math.min(ch.startVal, ch.endVal);
                ch.el.style += ch.cssRule + ": " + val + ";";
            });
        });
    }
      
    
    })(window, document);