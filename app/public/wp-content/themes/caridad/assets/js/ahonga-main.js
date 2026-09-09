(function(){
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Counter animation on scroll
  var counters = document.querySelectorAll('.ahonga-counter-number');
  var animated = false;

  function animateCounters() {
    if (animated) return;
    var section = document.querySelector('.ahonga-counters');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      animated = true;
      counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-count'), 10);
        var current = 0;
        var increment = target / 60;
        var timer = setInterval(function() {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current).toLocaleString('fr-FR');
        }, 16);
      });
    }
  }

  window.addEventListener('scroll', animateCounters);
  animateCounters();
})();
