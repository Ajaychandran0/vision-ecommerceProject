/* eslint-disable no-undef */
; (function () {
  'use strict'

  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i)
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i)
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i)
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i)
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i)
    },
    any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows())
    }
  }

  const mobileMenuOutsideClick = function () {
    $(document).click(function (e) {
      const container = $('#colorlib-offcanvas, .js-colorlib-nav-toggle')
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('offcanvas')) {
          $('body').removeClass('offcanvas')
          $('.js-colorlib-nav-toggle').removeClass('active')
        }
      }
    })
  }

  const offcanvasMenu = function () {
    $('#page').prepend('<div id="colorlib-offcanvas" />')
    $('#page').prepend('<a href="#" class="js-colorlib-nav-toggle colorlib-nav-toggle colorlib-nav-white"><i></i></a>')
    const clone1 = $('.menu-1 > ul').clone()
    $('#colorlib-offcanvas').append(clone1)
    const clone2 = $('.menu-2 > ul').clone()
    $('#colorlib-offcanvas').append(clone2)

    $('#colorlib-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown')
    $('#colorlib-offcanvas')
      .find('li')
      .removeClass('has-dropdown')

    // Hover dropdown menu on mobile
    $('.offcanvas-has-dropdown').mouseenter(function () {
      const $this = $(this)

      $this
        .addClass('active')
        .find('ul')
        .slideDown(500, 'easeOutExpo')
    }).mouseleave(function () {
      const $this = $(this)
      $this
        .removeClass('active')
        .find('ul')
        .slideUp(500, 'easeOutExpo')
    })

    $(window).resize(function () {
      if ($('body').hasClass('offcanvas')) {
        $('body').removeClass('offcanvas')
        $('.js-colorlib-nav-toggle').removeClass('active')
      }
    })
  }

  const burgerMenu = function () {
    $('body').on('click', '.js-colorlib-nav-toggle', function (event) {
      const $this = $(this)

      if ($('body').hasClass('overflow offcanvas')) {
        $('body').removeClass('overflow offcanvas')
      } else {
        $('body').addClass('overflow offcanvas')
      }
      $this.toggleClass('active')
      event.preventDefault()
    })
  }

  const contentWayPoint = function () {
    // eslint-disable-next-line no-unused-vars
    let i = 0
    $('.animate-box').waypoint(function (direction) {
      if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {
        i++

        $(this.element).addClass('item-animate')
        setTimeout(function () {
          $('body .animate-box.item-animate').each(function (k) {
            const el = $(this)
            setTimeout(function () {
              const effect = el.data('animate-effect')
              if (effect === 'fadeIn') {
                el.addClass('fadeIn animated-fast')
              } else if (effect === 'fadeInLeft') {
                el.addClass('fadeInLeft animated-fast')
              } else if (effect === 'fadeInRight') {
                el.addClass('fadeInRight animated-fast')
              } else {
                el.addClass('fadeInUp animated-fast')
              }

              el.removeClass('item-animate')
            }, k * 200, 'easeInOutExpo')
          })
        }, 100)
      }
    }, { offset: '85%' })
  }

  const dropdown = function () {
    $('.has-dropdown').mouseenter(function () {
      const $this = $(this)
      $this
        .find('.dropdown')
        .css('display', 'block')
        .addClass('animated-fast fadeInUpMenu')
    }).mouseleave(function () {
      const $this = $(this)

      $this
        .find('.dropdown')
        .css('display', 'none')
        .removeClass('animated-fast fadeInUpMenu')
    })
  }

  const goToTop = function () {
    $('.js-gotop').on('click', function (event) {
      event.preventDefault()

      $('html, body').animate({
        scrollTop: $('html').offset().top
      }, 500, 'easeInOutExpo')

      return false
    })

    $(window).scroll(function () {
      const $win = $(window)
      if ($win.scrollTop() > 200) {
        $('.js-top').addClass('active')
      } else {
        $('.js-top').removeClass('active')
      }
    })
  }

  // var increment = function(){

  // };

  // Loading page
  const loaderPage = function () {
    $('.colorlib-loader').fadeOut('slow')
  }

  const sliderMain = function () {
    $('#colorlib-hero .flexslider').flexslider({
      animation: 'fade',
      slideshowSpeed: 5000,
      directionNav: true,
      start: function () {
        setTimeout(function () {
          $('.slider-text').removeClass('animated fadeInUp')
          $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp')
        }, 500)
      },
      before: function () {
        setTimeout(function () {
          $('.slider-text').removeClass('animated fadeInUp')
          $('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp')
        }, 500)
      }

    })
  }

  // Owl Carousel
  const owlCrouselFeatureSlide = function () {
    const owl = $('.owl-carousel')
    owl.owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      autoplay: false,
      autoplayHoverPause: true,
      loop: true,
      margin: 0,
      nav: false,
      dots: true,
      autoHeight: false,
      items: 1,
      navText: [
        "<i class='icon-chevron-left owl-direction'></i>",
        "<i class='icon-chevron-right owl-direction'></i>"
      ]
    })

    const owl2 = $('.owl-carousel2')
    owl2.owlCarousel({
      animateOut: 'fadeOut',
      animateIn: 'fadeIn',
      autoplay: true,
      autoplayHoverPause: true,
      loop: true,
      margin: 0,
      nav: false,
      dots: false,
      autoHeight: true,
      items: 1,
      navText: [
        "<i class='icon-chevron-left owl-direction'></i>",
        "<i class='icon-chevron-right owl-direction'></i>"
      ]
    })
  }

  const parallax = function () {
    if (!isMobile.any()) {
      $(window).stellar({
        horizontalScrolling: false,
        hideDistantElements: false,
        responsive: true

      })
    }
  }

  const datePicker = function () {
    // jQuery('#time').timepicker();
    jQuery('.date').datepicker({
      format: 'm/d/yyyy',
      autoclose: true
    })
  }

  $(function () {
    mobileMenuOutsideClick()
    offcanvasMenu()
    burgerMenu()
    contentWayPoint()
    sliderMain()
    dropdown()
    goToTop()
    loaderPage()
    owlCrouselFeatureSlide()
    parallax()
    datePicker()
  })
}())
