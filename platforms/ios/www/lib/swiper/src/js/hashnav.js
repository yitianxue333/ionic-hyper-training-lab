/*=========================
  Hash Navigation
  ===========================*/
s.hashnav = {
    init: function () {
        if (!s.params.hashnav || s.params.history) return;
        s.hashnav.initialized = true;
        var hash = document.location.hash.replace('#', '');
        if (!hash) return;
        var speed = 0;
        for (var i = 0, length = s.slides.length; i < length; i++) {
            var slide = s.slides.eq(i);
            var slideHash = slide.attr('data-hash') || slide.attr('data-history');
            if (slideHash === hash && !slide.hasClass(s.params.slideDuplicateClass)) {
                var index = slide.index();
                s.slideTo(index, speed, s.params.runCallbacksOnInit, true);
            }
        }
    },
    setHash: function () {
        if (!s.hashnav.initialized || !s.params.hashnav) return;
        if (s.params.replaceState && window.history && window.history.replaceState) {
            window.history.replaceState(null, null, ('#' + s.slides.eq(s.activeIndex).attr('data-hash') || ''));
        } else {
            var slide = s.slides.eq(s.activeIndex);
            var hash = slide.attr('data-hash') || slide.attr('data-history');
            document.location.hash = hash || '';
        }
    }
};