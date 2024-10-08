gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

let scroll;
let transitionOffset = 25;

initPageTransitions();

// Animation - Page Loader
function initLoaderShort() {

    var tl = gsap.timeline();

    tl.set($('.loading-screen'), {
        yPercent: -100,
        rotate: 0.001,
    });

    tl.call(function() {
        scroll.stop();
        pageTransitionOut();
    }, null, 0);

    tl.call(function() {
        initCheckWindowHeight();
    }, null, 0.1);

}

// Animation - Page Loader
function initLoader() {

    var tl = gsap.timeline();

    tl.set($('.loading-screen'), {
        yPercent: 0,
        rotate: 0.001,
    });

    tl.set($('.header-image-img'), {
        scale: 1.5,
        rotate: 0.001,
    });

    tl.to($('.loading-screen'), {
        yPercent: -100,
        rotate: 0.001,
        ease: "Expo.easeInOut",
        duration: 1.75
    });

    tl.to($('.header-image-img'), {
        scale: 1,
        rotate: 0.001,
        ease: "Expo.easeInOut",
        duration: 1.75
    }, "<");

    tl.call(function() {
        scroll.stop();
        pageTransitionOut();
    }, null, 0);

    tl.call(function() {
        initCheckWindowHeight();
    }, null, 0.1);

}

// Animation - Page Leave
function pageTransitionIn() {
    var tl = gsap.timeline();

    if (document.querySelector('.lorem-ipsum')) {}

    tl.call(function() {
        scroll.stop();
    });
}

// Animation - Page Enter
function pageTransitionOut() {
    var tl = gsap.timeline();

    tl.set($('.section-header .single-char'), {
        yPercent: 110,
        rotate: 0.001,
    });

    tl.to($('.section-header .single-char'), {
        yPercent: 0,
        rotate: 0.001,
        ease: "Expo.easeOut",
        duration: 1.5,
        stagger: 0.05,
        clearProps: "all",
        delay: 0.75
    });

    tl.from($('.header-p'), {
        yPercent: 100,
        rotate: 0.001,
        autoAlpha: 0,
        ease: "Expo.easeOut",
        duration: 2.5,
        stagger: 0.05,
        clearProps: "all"
    }, "< 0.5");

    tl.call(function() {
        scroll.start();
    }, null, 0);

}

function initPageTransitions() {

    // Reset scroll on page next
    history.scrollRestoration = "manual";

    barba.hooks.afterEnter(() => {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
    });

    barba.hooks.leave(() => {
        initBasicFunctions();
    });

    // Functions Before
    function initResetDataBefore() {
        $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
    }

    // Functions After
    function initResetDataAfter() {
        $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
        $('[data-scrolling-direction]').attr('data-scrolling-direction', 'down');
        $('[data-scrolling-started]').attr('data-scrolling-started', 'false');
    }

    barba.init({
        sync: true,
        debug: true,
        timeout: 7000,
        transitions: [{
            name: 'self',
            async leave(data) {
                pageTransitionIn(data.current);
                initResetDataBefore();
                await delay(transitionOffset);
                initBarbaNavUpdate(data);
                initResetDataAfter();
                scroll.destroy();
                data.current.container.remove();
            },
            async enter(data) {
                pageTransitionOut(data.next);
            },
            async beforeEnter(data) {
                ScrollTrigger.getAll().forEach(t => t.kill());
                initResetWebflow(data);
                initSmoothScroll(data.next.container);
                initScript();
            },
        }, {
            name: 'default',
            once(data) {
                initSmoothScroll(data.next.container);
                initScript();
                initLoader();
            },
            async leave(data) {
                pageTransitionIn(data.current);
                initResetDataBefore();
                await delay(transitionOffset);
                initBarbaNavUpdate(data);
                initResetDataAfter();
                scroll.destroy();
                data.current.container.remove();
            },
            async enter(data) {
                pageTransitionOut(data.next);
            },
            async beforeEnter(data) {
                ScrollTrigger.getAll().forEach(t => t.kill());
                initResetWebflow(data);
                initSmoothScroll(data.next.container);
                initScript();
            },
        }]
    });

    function initSmoothScroll(container) {
        initLenis();
        ScrollTrigger.refresh();
    }
}

function initLenis() {

    // Lenis: https://github.com/studio-freight/lenis
    scroll = new Lenis({
        duration: 1
    });

    scroll.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        scroll.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

// Don't touch
function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

/**
 * Fire all scripts on page load
 */
function initScript() {
    initResetWebflow();
    initCheckWindowHeight();
    initBasicFunctions();
    initSplitText();
    initScrollTriggerPlayVideoInview();
    initLenisCheckScrollUpDown();
    initScrollToAnchorLenis();
    initCheckTheme();
    initMarqueeScrollV2();
    initFlickitySlider();
    initScrolltriggerAnimations();
}

/**
 * Reset Webflow
 */
function initResetWebflow(data) {
    // let parser = new DOMParser();
    // let dom = parser.parseFromString(data.next.html, "text/html");
    // let webflowPageId = dom.querySelector("html").getAttribute("data-wf-page");
    // document.documentElement.setAttribute("data-wf-page", webflowPageId);
    // window.Webflow.destroy();
    // window.Webflow.ready();
    // window.Webflow.require("ix2").init();
}

/**
 * Barba Update Links outside Main on page Transition
 */
function initBarbaNavUpdate(data) {

    const updateItems = $(data.next.html).find('[data-barba-update]');

    $('[data-barba-update]').each(function(index) {
        if ($(updateItems[index]).get(0)) {
            const newLinkStatus = $(updateItems[index]).get(0).getAttribute('data-link-status');
            $(this).attr('data-link-status', newLinkStatus);
        }
    });
}

/**
 * Window Inner Height Check
 */
function initCheckWindowHeight() {
    // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh-in-px', `${vh}px`);
}

/**
 * Basic Functions
 */
function initBasicFunctions() {

    // Toggle Navigation
    $('[data-navigation-toggle="toggle"]').click(function() {
        if ($('[data-navigation-status]').attr('data-navigation-status') == 'not-active') {
            $('[data-navigation-status]').attr('data-navigation-status', 'active');
        } else {
            $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
        }
    });

    // Close Navigation
    $('[data-navigation-toggle="close"]').click(function() {
        $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
    });

    // Key ESC - Close Navigation
    $(document).keydown(function(e) {
        if (e.keyCode == 27) {
            if ($('[data-navigation-status]').attr('data-navigation-status') == 'active') {
                $('[data-navigation-status]').attr('data-navigation-status', 'not-active');
            }
        }
    });
}

/**
 * GSAP Split Text
 */
function initSplitText() {

    $('[data-text-change]').each(function() {
        $(this).text($(this).attr('data-text-change'));
    });

    var splitChars = new SplitText('[data-split-text="chars"]', {
        type: "words, chars",
        wordsClass: "single-word",
        charsClass: "single-char"
    });

    var splitWords = new SplitText('[data-split-text="words"]', {
        type: "words",
        wordsClass: "single-word",
        tag: "span"
    });

    $('[data-split-text="words"] .single-word').wrapInner('<div class="single-word-inner">');

}

/**
 * Play Video Inview
 */
function initScrollTriggerPlayVideoInview() {

    let allVideoDivs = gsap.utils.toArray('.playpauze');

    allVideoDivs.forEach((videoDiv, i) => {

        let videoElem = videoDiv.querySelector('video')

        ScrollTrigger.create({
            trigger: videoElem,
            start: '0% 120%',
            end: '100% -20%',
            onEnter: () => videoElem.play(),
            onEnterBack: () => videoElem.play(),
            onLeave: () => videoElem.pause(),
            onLeaveBack: () => videoElem.pause(),
        });
    });
}

/**
 * Lenis - Check Scroll up or Down
 */

function initLenisCheckScrollUpDown() {

    var lastScrollTop = 0
    var threshold = 50;
    var thresholdTop = 50;

    function startCheckScroll() {
        scroll.on('scroll', (e) => {
            var nowScrollTop = e.targetScroll;

            if (Math.abs(lastScrollTop - nowScrollTop) >= threshold) {

                // Check Scroll Direction
                if (nowScrollTop > lastScrollTop) {
                    $("[data-scrolling-direction]").attr('data-scrolling-direction', 'down');
                } else {
                    $("[data-scrolling-direction]").attr('data-scrolling-direction', 'up');
                }
                lastScrollTop = nowScrollTop;

                // Check if Scroll Started
                if (nowScrollTop > thresholdTop) {
                    $("[data-scrolling-started]").attr('data-scrolling-started', 'true');
                } else {
                    $("[data-scrolling-started]").attr('data-scrolling-started', 'false');
                }
            }
        });
    }
    startCheckScroll();

    // Reset instance
    barba.hooks.after(() => {
        startCheckScroll();
    });
}

/**
 * Lenis - ScrollTo Anchor Links
 */
function initScrollToAnchorLenis() {

    $("[data-anchor-target]").click(function() {

        let targetScrollToAnchorLenis = $(this).attr('data-anchor-target');
        scroll.scrollTo(targetScrollToAnchorLenis, {
            duration: 1,
            easing: (x) => (x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2),
        });

    });
}

/**
 * Check Theme of Sections
 */
function initCheckTheme() {

    function checkThemeSection() {
        var themeSections = document.querySelectorAll("[data-theme-section]");

        for (var i = 0; i < themeSections.length; i++) {
            var themeSection = themeSections[i];
            var themeSectionTop = themeSection.getBoundingClientRect().top;
            var themeSectionBottom = themeSection.getBoundingClientRect().bottom;
            var themeObserverOffset = $(".main-nav-bar .nav-bar-links.right").innerHeight() / 2;

            if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {

                // Check [data-theme-section]
                var themeSectionActive = $(themeSection).attr('data-theme-section');
                if ($('[data-theme-nav]').attr('data-theme-nav') == themeSectionActive) {} else {
                    $('[data-theme-nav]').attr('data-theme-nav', themeSectionActive);
                }

                // Check [data-bg-section]
                var bgSectionActive = $(themeSection).attr('data-bg-section');
                if ($('[data-bg-nav]').attr('data-bg-nav') == bgSectionActive) {} else {
                    $('[data-bg-nav]').attr('data-bg-nav', bgSectionActive);
                }

                // Check id
                var idSectionActive = $(themeSection).attr('data-id-section');
                if ($('[data-id-nav]').attr('data-id-nav') == idSectionActive) {} else {
                    $('[data-id-nav]').attr('data-id-nav', idSectionActive);
                    $('.nav-bar-link').attr('data-nav-item-status', 'not-active');
                    $('.nav-bar-link[data-nav-item-id="' + idSectionActive + '"]').attr(
                        'data-nav-item-status', 'active');
                }
            }
        }
    }

    // Page load init
    checkThemeSection();

    // Check when scrolling
    document.addEventListener("scroll", function() {
        checkThemeSection();
    });

    // Check on page-transition
    barba.hooks.after(() => {
        checkThemeSection();
    });

}

/**
 * Marquee on Scroll Direction
 */
function initMarqueeScrollV2() {

    $('[data-marquee-target]').each(function() {

        let marquee = $(this);

        let marqueeItemsWidth = marquee.find(".marquee-content").width();
        let marqueeSpeed = marquee.attr('data-marquee-speed') * (marqueeItemsWidth / $(window)
            .width());

        // Duplicate .marquee-content
        if (marquee.attr('data-marquee-duplicate')) {
            var marqueeDuplicateAmount = marquee.attr('data-marquee-duplicate');
            // Custom function to clone / append
            for (var i = 0; i < marqueeDuplicateAmount; i++) {
                var clonedMarqueeContent = marquee.find(".marquee-content").first().clone();
                marquee.find(".marquee-scroll").append(clonedMarqueeContent);
            }
        }

        // Speed up Marquee on Tablet & Mobile
        if ($(window).width() <= 540) {
            marqueeSpeed = marqueeSpeed * 0.25;
        } else if ($(window).width() <= 1024) {
            marqueeSpeed = marqueeSpeed * 0.5;
        }

        let marqueeDirection;
        if (marquee.attr('data-marquee-direction') == 'right') {
            marqueeDirection = -1;
        } else {
            marqueeDirection = 1;
        }

        let marqueeContent = gsap.to(marquee.find('.marquee-content'), {
            xPercent: -100,
            repeat: -1,
            duration: marqueeSpeed,
            ease: "linear",
            paused: true
        }).totalProgress(0.5);

        gsap.set(marquee.find(".marquee-content"), {
            xPercent: 50
        });

        ScrollTrigger.create({
            trigger: marquee,
            start: "top bottom",
            end: "bottom top",
            onUpdate(self) {
                if (self.direction !== marqueeDirection) {
                    marqueeDirection *= -1;
                    if (marquee.attr('data-marquee-direction') == 'right') {
                        gsap.to([marqueeContent], {
                            timeScale: (marqueeDirection * -1),
                            overwrite: true
                        });
                    } else {
                        gsap.to([marqueeContent], {
                            timeScale: marqueeDirection,
                            overwrite: true
                        });
                    }
                }
                self.direction === -1 ? marquee.attr('data-marquee-status', 'normal') : marquee
                    .attr('data-marquee-status', 'inverted');
            },
            onEnter: () => marqueeContent.play(),
            onEnterBack: () => marqueeContent.play(),
            onLeave: () => marqueeContent.pause(),
            onLeaveBack: () => marqueeContent.pause()
        });

        // Extra speed on scroll
        marquee.each(function() {

            let triggerElement = $(this);
            let targetElement = $(this).find('.marquee-scroll');
            let marqueeScrollSpeed = $(this).attr('data-marquee-scroll-speed');

            let tl = gsap.timeline({
                scrollTrigger: {
                    trigger: $(this),
                    start: "0% 100%",
                    end: "100% 0%",
                    scrub: 0
                }
            });

            if (triggerElement.attr('data-marquee-direction') == 'left') {
                tl.fromTo(targetElement, {
                    x: marqueeScrollSpeed + "vw",
                }, {
                    x: marqueeScrollSpeed * -1 + "vw",
                    ease: "none"
                });
            }

            if (triggerElement.attr('data-marquee-direction') == 'right') {
                tl.fromTo(targetElement, {
                    x: marqueeScrollSpeed * -1 + "vw",
                }, {
                    x: marqueeScrollSpeed + "vw",
                    ease: "none"
                });
            }
        });
    });
}

/**
 * Flickity Slider
 */
function initFlickitySlider() {

    // Source
    // https://flickity.metafizzy.co/

    // Slider type: Cards

    $('[data-flickity-slider-type="cards"]').each(function(index) {

        var sliderIndexID = 'flickity-slider-type-cards-id-' + index;
        $(this).attr('id', sliderIndexID);

        var sliderThis = $(this);

        var flickitySliderGroup = document.querySelector('#' + sliderIndexID +
            ' .flickity-carousel');
        var flickitySlider = sliderThis.find('.flickity-carousel').flickity({
            // options
            watchCSS: true,
            contain: true,
            wrapAround: false,
            dragThreshold: 10,
            prevNextButtons: false,
            pageDots: false,
            cellAlign: 'left',
            selectedAttraction: 0.015,
            friction: 0.25,
            percentPosition: true,
            freeScroll: false,
        });

        // Flickity instance
        var flkty = flickitySlider.data('flickity');

    });

}

/**
 * Scrolltrigger Animations Desktop + Mobile
 */
function initScrolltriggerAnimations() {

    $('.section-header').each(function() {
        let triggerElement = $(this);
        let targetElement = $('.header-image');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 0%",
                end: "100% 0%",
                scrub: 0
            }
        });

        tl.to(targetElement, {
            yPercent: 15,
            rotate: 0.001,
            ease: "none",
        });

    });

    $('[data-scroll-animation="words"]').each(function() {
        let triggerElement = $(this);
        let targetElement = $(this).find('.single-word-inner');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 80%",
                end: "100% 0%",
                toggleActions: "play none none none",
            }
        });

        gsap.set(targetElement, {
            yPercent: 110,
            rotate: 0.001,
        });

        tl.to(targetElement, {
            yPercent: 0,
            rotate: 0.001,
            ease: "Expo.easeOut",
            duration: 1.5,
            stagger: 0.05,
            clearProps: "all"
        });

    });

    $('[data-scroll-animation="fade-in"]').each(function() {
        let triggerElement = $(this);
        let targetElement = $(this);

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 80%",
                end: "100% 0%",
                toggleActions: "play none none none",
            }
        });

        gsap.set(targetElement, {
            y: "2em",
            rotate: 0.001,
            opacity: 0,
        });

        tl.to(targetElement, {
            y: "0em",
            rotate: 0.001,
            opacity: 1,
            ease: "Expo.easeOut",
            duration: 2,
            clearProps: "all"
        });

    });

    $('[data-scroll-animation="group-fade-in"]').each(function() {
        let triggerElement = $(this);
        let targetElement = $(this).find('[data-scroll-animation-target]');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 80%",
                end: "100% 0%",
                toggleActions: "play none none none",
            }
        });

        gsap.set(targetElement, {
            y: "2em",
            rotate: 0.001,
            opacity: 0,
        });

        tl.to(targetElement, {
            y: "0em",
            rotate: 0.001,
            opacity: 1,
            ease: "Expo.easeOut",
            duration: 2,
            stagger: 0.2,
            clearProps: "all"
        });

    });

    $('.row-westoost-arrows').each(function() {
        let triggerElement = $(this);
        let targetElementOriginal = $(this).find('.svg-vector-line-curl-left.original path');
        let targetElementDuplicate = $(this).find('.svg-vector-line-curl-left.duplicate path');
        let targetElementTip = $(this).find('.svg-arrow-tip.westoost-left path');
        let targetElementTag = $(this).find('.single-tag');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 90%",
                end: "100% 0%",
                toggleActions: "play none none none",
            }
        });

        tl.set(targetElementDuplicate, {
            drawSVG: "0%"
        });

        tl.set(targetElementOriginal, {
            drawSVG: "0%"
        });

        tl.set(targetElementTip, {
            drawSVG: "0%"
        });

        tl.fromTo(targetElementDuplicate, {
            drawSVG: "0%"
        }, {
            duration: 0.75,
            drawSVG: "100%",
            ease: "none"
        });

        tl.fromTo(targetElementOriginal, {
            drawSVG: "0%"
        }, {
            duration: 2.25,
            drawSVG: "-101%",
            ease: Expo.easeOut
        });

        tl.fromTo(targetElementTip, {
            drawSVG: "0%"
        }, {
            duration: 0.15,
            drawSVG: "100%",
            ease: "none"
        }, "< 1.5");

        tl.fromTo(targetElementTag, {
            y: "1em",
            rotate: 0.001,
            opacity: 0,
        }, {
            y: "0em",
            rotate: 0.001,
            opacity: 1,
            ease: "Expo.easeOut",
            duration: 0.6,
            stagger: 0.6,
            clearProps: "all",
        }, "0.3");

    });

    $('[data-scroll-animation="trackrecord-line"]').each(function() {
        let triggerElement = $(this);
        let targetElementLine = $(this).find('.arrow-line-inner');
        let targetElementTip = $(this).find('.svg-arrow-tip path');
        let targetElementText = $(this).find('.p-captials');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 95%",
                end: "100% 0%",
                toggleActions: "play none none none",
            }
        });

        gsap.set(targetElementLine, {
            scaleX: 0,
            rotate: 0.001,
        });

        gsap.set(targetElementText, {
            y: "1em",
            rotate: 0.001,
            opacity: 0,
        });

        tl.set(targetElementTip, {
            drawSVG: "0%"
        });

        tl.to(targetElementLine, {
            scaleX: 1,
            rotate: 0.001,
            ease: "Expo.easeOut",
            duration: 1,
            stagger: 0.05,
            clearProps: "all"
        });

        tl.fromTo(targetElementTip, {
            drawSVG: "0%"
        }, {
            duration: 0.15,
            drawSVG: "100%",
            ease: "none"
        }, "< 0.85");

        tl.to(targetElementText, {
            y: "0em",
            rotate: 0.001,
            opacity: 1,
            ease: "Expo.easeOut",
            duration: 0.6,
            stagger: 0.8,
            clearProps: "all"
        }, 0);

    });

    $('.col-footer-arrow').each(function() {
        let triggerElement = $(this);
        let targetElementLine = $(this).find('.svg-arrow-line-footer path');
        let targetElementTip = $(this).find('.svg-arrow-tip path');

        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerElement,
                start: "0% 90%",
                end: "100% 0%",
                toggleActions: "play none none none",
            }
        });

        tl.set(targetElementLine, {
            drawSVG: "0%"
        });

        tl.set(targetElementTip, {
            drawSVG: "0%"
        });

        tl.fromTo(targetElementLine, {
            drawSVG: "0%"
        }, {
            duration: 1.5,
            drawSVG: "100%",
            ease: Expo.easeOut
        });

        tl.fromTo(targetElementTip, {
            drawSVG: "0%"
        }, {
            duration: 0.15,
            drawSVG: "100%",
            ease: "none"
        }, "< 1.35");

    });

}