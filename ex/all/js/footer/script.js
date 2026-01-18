;(function ($, window, document, undefined) {
	'use strict';

	$('body').fitVids({ignore: '.vimeo-video, .youtube-simple-wrap iframe, .iframe-video.for-btn iframe, .post-media.video-container iframe'});

	/*=================================*/
	/* PAGE CALCULATIONS */
	/*=================================*/
	/**
	 *
	 * PageCalculations function
	 * @since 1.0.0
	 * @version 1.0.0
	 * @var winW
	 * @var winH
	 * @var winS
	 * @var pageCalculations
	 * @var onEvent
	 **/
	if (typeof pageCalculations !== 'function') {

		var winW, winH, winS, pageCalculations, onEvent = window.addEventListener;

		pageCalculations = function (func) {

			winW = window.innerWidth;
			winH = window.innerHeight;
			winS = document.body.scrollTop;

			if (!func) return;

			onEvent('load', func, true); // window onload
			onEvent('resize', func, true); // window resize
			onEvent("orientationchange", func, false); // window orientationchange

		}; // end pageCalculations

		pageCalculations(function () {
			pageCalculations();
		});
	}

	/*=================================*/
	/* FULL HEIGHT BANNER */
	/*=================================*/
	function topBannerHeight() {
		var headerH = $('.header_top_bg').not('.header_trans-fixed, .fixed-header').outerHeight() || 0;
		var windowH = $(window).height();
		var wpadmin = $('#wpadminbar').outerHeight() || 0;
		var offsetTop = headerH + wpadmin;

		$('.height-window-hard').css('height', (windowH - wpadmin) + 'px');
		$('.full-height-window').css('min-height', (windowH - offsetTop) + 'px');
		$('.full-height-window-hard').css('height', (windowH - offsetTop) + 'px');
		$('.middle-height-window-hard').css('height', (windowH - offsetTop) * 0.8 + 'px');

		if( $(window).width() > 767 ){
			$('.full-height-window-not-mobile').css('height', (windowH - offsetTop) + 'px');
		}

		$('body, .main-wrapper').css('min-height', $(window).height());
	}

	/*=================================*/
	/* VIDEO POPUP */
	/*=================================*/
	$(window).on('load', function () {
		if($('.a-btn-2, .js-video-play').length) {
			$('.a-btn-2, .js-video-play').each(function() {
				$(this).magnificPopup({
					disableOn: 700,
					type: 'iframe',
					mainClass: 'mfp-fade',
					removalDelay: 160,
					preloader: false,
					fixedContentPos: true,
					fixedBgPos: true
				});
			});
		}
	});

	if ($('.js-bg-text').length) {
		$('.js-bg-text').each(function () {
			$(this).closest('.wpb_column').css('position', 'static');
		});
	}

	/*=================================*/
	/* IS TOUCH DEVICE */
	/*=================================*/
	function isTouchDevice() {
		return 'ontouchstart' in document.documentElement;
	}

	/*=================================*/
	/* SWIPER SLIDER */
	/*=================================*/
	var swipers = [];
	function initSwiper() {
		var initIterator = 0;

		$('.swiper-container:not(".gallery-thumbs"):not(".gallery-top")').each(function () {
			var $t = $(this);

			var index = 'swiper-unique-id-' + initIterator;
			$t.addClass('swiper-' + index + ' initialized').attr('id', index);
			$t.parent().find('.swiper-pagination').addClass('swiper-pagination-' + index);

			if($t.hasClass('outer-pagination')){
				$t.closest('.swiper-container-wrap').find('.swiper-pagination').addClass('swiper-pagination-' + index);
			}else{
				$t.parent().find('.swiper-pagination').addClass('swiper-pagination-' + index);
			}

			$t.parent().find('.swiper-button-next').addClass('swiper-button-next-' + index);
			$t.parent().find('.swiper-button-prev').addClass('swiper-button-prev-' + index);

			var setThumb = function (parent) {
				var slidesNum = parent.find('.swiper-slide:not(.swiper-slide-duplicate)').length,
					activeIndex = loopVar ? parent.find('.swiper-slide.swiper-slide-active').attr('data-swiper-slide-index') : $t.find('.swiper-slide.swiper-slide-active').index(),
					customSliderCurrent = parent.find('.number-slides .current'),
					customSliderTotal = parent.find('.number-slides .total');

				activeIndex++;
				activeIndex = activeIndex < 10 ? '0' + activeIndex : activeIndex;
				slidesNum = slidesNum < 10 ? '0' + slidesNum : slidesNum;

				customSliderCurrent.text(activeIndex);
				customSliderTotal.text(slidesNum);
			};

			if (isTouchDevice() && $t.data('mode') == 'vertical') {
				$t.attr('data-noswiping', 1);
				$(this).find('.swiper-slide').addClass('swiper-no-swiping');
			}

			var autoPlayVar = parseInt($t.attr('data-autoplay'), 10);
			var mode = $t.attr('data-mode') ? $t.attr('data-mode') : 'horizontal';
			var effect = $t.attr('data-effect') ? $t.attr('data-effect') : 'slide';
			var paginationType = $t.attr('data-pagination-type') ? $t.attr('data-pagination-type') : 'bullets';
			var loopVar = parseInt($t.attr('data-loop'), 10) ? parseInt($t.attr('data-loop'), 10) : false;
			var noSwipingVar = $t.attr('data-noSwiping') ? parseInt($t.attr('data-noSwiping'), 10) : true;
			var mouse = parseInt($t.attr('data-mouse'), 10) ? parseInt($t.attr('data-mouse'), 10) : false;
			var speedVar = parseInt($t.attr('data-speed'), 10) ? parseInt($t.attr('data-speed'), 10) : '1500';
			var centerVar = parseInt($t.attr('data-center'), 10) ? parseInt($t.attr('data-center'), 10) : false;
			var centerMobileVar = parseInt($t.attr('data-center-mobile'), 10) ? parseInt($t.attr('data-center-mobile'), 10) : centerVar;
			var spaceBetweenVar = parseInt($t.attr('data-space'), 10) ? parseInt($t.attr('data-space'), 10) : 0;
			var slidesPerView = isNaN($t.attr('data-slidesPerView')) ? 'auto' : +$t.attr('data-slidesPerView');
			var slidesPerColumn = parseInt($t.attr('data-slidesPerColumn'), 10) ? parseInt($t.attr('data-slidesPerColumn'), 10) : 1;
			var heightVar = parseInt($t.attr('data-height'), 10) ? parseInt($t.attr('data-height'), 10) : false;
			var grabCursorVar = parseInt($t.attr('data-grab-cursor'), 10) ? parseInt($t.attr('data-grab-cursor'), 10) : false;
			var slideToClickedSlideVar = parseInt($t.attr('data-slide-to-clicked'), 10) ? parseInt($t.attr('data-slide-to-clicked'), 10) : false;
			var breakpoints = {};
			var responsive = parseInt($t.attr('data-responsive'), 10) ? parseInt($t.attr('data-responsive'), 10)  : false;
			var lazyVar = parseInt($t.attr('data-lazy'), 10) ? parseInt($t.attr('data-lazy'), 10)  : false;
			var lazyAmountVar = parseInt($t.attr('data-lazy-amount'), 10) ? parseInt($t.attr('data-lazy-amount'), 10)  : 3;
			if (lazyVar) {
				lazyVar = {
					loadPrevNext: true,
					loadPrevNextAmount: lazyAmountVar,
				};
			}

			if (autoPlayVar) {
				var autoPlayObject = {
					delay: autoPlayVar,
					waitForTransition: false,
				};
			} else {
				var autoPlayObject = false;
			}

			if (responsive) {

				slidesPerView = $t.attr('data-add-slides');
				var lg = $t.attr('data-lg-slides') ? $t.attr('data-lg-slides') : slidesPerView;
				lg = isNaN(lg) ? 'auto' : +lg;
				var md = $t.attr('data-md-slides') ? $t.attr('data-md-slides') : lg;
				md = isNaN(md) ? 'auto' : +md;
				var sm = $t.attr('data-sm-slides') ? $t.attr('data-sm-slides') : md;
				sm = isNaN(sm) ? 'auto' : +sm;
				var xs = $t.attr('data-xs-slides') ? $t.attr('data-xs-slides') : sm;
				xs = isNaN(xs) ? 'auto' : +xs;



				slidesPerColumn = $t.attr('data-add-column');
				var lg_col = $t.attr('data-lg-column') ? $t.attr('data-lg-column') : slidesPerColumn;
				var md_col = $t.attr('data-md-column') ? $t.attr('data-md-column') : lg_col;
				var sm_col = $t.attr('data-sm-column') ? $t.attr('data-sm-column') : md_col;
				var xs_col = $t.attr('data-xs-column') ? $t.attr('data-xs-column') : sm_col;

				var spaceLg = $t.attr('data-lg-space') ? $t.attr('data-lg-space') : spaceBetweenVar;
				var spaceMd = $t.attr('data-md-space') ? $t.attr('data-md-space') : spaceLg;
				var spaceSm = $t.attr('data-sm-space') ? $t.attr('data-sm-space') : spaceMd;
				var spaceXs = $t.attr('data-xs-space') ? $t.attr('data-xs-space') : spaceSm;

				breakpoints = {
					767: {
						slidesPerView: xs,
						slidesPerColumn: parseInt(xs_col, 10),
						spaceBetween: parseInt(spaceXs, 10),
						centeredSlides: centerMobileVar
					},
					991: {
						slidesPerView: sm,
						slidesPerColumn: parseInt(sm_col, 10),
						spaceBetween: parseInt(spaceSm, 10),
						centeredSlides: centerMobileVar
					},
					1200: {
						slidesPerView: md,
						slidesPerColumn: parseInt(md_col, 10),
						spaceBetween: parseInt(spaceMd, 10)
					},
					1600: {
						slidesPerView: lg,
						slidesPerColumn: parseInt(lg_col, 10),
						spaceBetween: parseInt(spaceLg, 10)
					}
				};


			}

			if($t.hasClass('vertical-testimonials')){
				breakpoints = {
					1200: {
						slidesPerView: 1,
						direction: 'horizontal',
						noSwiping: 0
					},
				};
			}

			if($t.hasClass('vertical-items')){
				breakpoints = {
					767: {
						slidesPerView: 1,
						spaceBetween: 30,
						direction: 'horizontal',
						noSwiping: 0
					},
					991: {
						slidesPerView: 3,
						direction: 'vertical'
					},
					1200: {
						slidesPerView: 3,
						direction: 'vertical'
					},
					1600: {
						slidesPerView: 3,
						direction: 'vertical'
					},
				};
			}

			if ($t.closest('.cs-slider.horizontal')) {
				$t.closest('.vc_row[data-vc-full-width]').css('overflow', 'visible');
			}

			swipers['swiper-' + index] = new Swiper('.swiper-' + index, {
				pagination: {
					el: '.swiper-pagination-' + index,
					clickable: true,
					type: paginationType,
					renderBullet: function (index, className) {
						if($t.hasClass('outer-pagination')){
							return '<span class="' + className + '">' + (index + 1) + '</span>';
						}else{
							return '<span class="' + className + '"></span>';
						}
					},
				},
				navigation: {
					nextEl: '.swiper-button-next-' + index,
					prevEl: '.swiper-button-prev-' + index,
				},
				direction: mode || 'horizontal',
				slidesPerView: slidesPerView,
				slidesPerColumn: slidesPerColumn,
				breakpoints: breakpoints,
				centeredSlides: centerVar,
				noSwiping: noSwipingVar,
				noSwipingClass: 'swiper-no-swiping',
				watchSlidesVisibility: true,
				spaceBetween: spaceBetweenVar,
				slideToClickedSlide: slideToClickedSlideVar,
				loop: loopVar,
				speed: speedVar,
				grabCursor: grabCursorVar,
				autoplay: autoPlayObject,
				effect: effect,
				mousewheel: mouse,
				iOSEdgeSwipeDetection: true,
				autoHeight: heightVar,
				preloadImages: false,
				lazy: lazyVar,
				//
				parallax: true,
				on: {
					init: function(){
						if ($t.closest('.banner-slider-wrap.simple').length) {
							setThumb($t);
						}
					},
					slideChange: function () {
						if ($.fn.foxlazy) {
							$t.find('img[data-lazy-src]').foxlazy();
						}
						paginationScroll($t, lg);
						if ($t.find('.swiper-slide-visible[data-css-animation]:not(.animated)').length) {
							var delay = 200;
							$t.find('.swiper-slide-visible[data-css-animation]:not(.animated)').addClass('animated').each(function () {
								$(this)
									.css('animation-delay', delay + 'ms')
									.css('transition-delay', delay + 'ms');

								delay += 200;
							});
						}
					},
					transitionStart: function () {
						if (autoPlayVar && $t.closest('.banner-slider-wrap.simple').length) {
							$t.find('.swiper-button-next .circle2').css('transition-duration', '100ms').css('stroke-dashoffset', '239');
						}
					},
					transitionEnd: function () {
						if ($t.closest('.banner-slider-wrap.simple').length) {
							setThumb($t);
						}
						if (autoPlayVar && $t.closest('.banner-slider-wrap.simple').length) {
							$t.find('.swiper-button-next .circle2').css('transition-duration', autoPlayVar + 'ms').css('stroke-dashoffset', '0');
						}
					},
				},
			});

			initIterator++;
		});
	}

	/*=================================*/

	function paginationScroll(parent) {
		if (parent.attr('data-pagination-scroll')) {
			var pagination = parent.parent().find('.swiper-pagination'),
				active = $(pagination).find('.swiper-pagination-bullet-active')[0];
			if (active) {
				$(pagination).animate({
					scrollTop: $(active).offset().top - $(pagination).offset().top + $(pagination).scrollTop()
				}, 500)
			}
		}
	}

	/*=================================*/

	function swiperEqualHeight() {
		$('.swiper-container[data-equal-height]').each(function () {
			var $t = $(this),
				max_height = 0,
				eq_height = parseInt($t.attr('data-equal-height'), 10),
				id = 'swiper-' + $t.attr('id');

			if (eq_height) {
				$t.find('.swiper-slide').each(function () {
					var swiperHeight = $(this).css('height', 'auto').outerHeight();
					max_height = (swiperHeight > max_height) ? swiperHeight : max_height;
				});

				$t.css('height', max_height);
				swipers[id].update();
			}
		});
	}

	/*=================================*/
	function initSwiperThumbs() {
		if ($('.gallery-thumbs').length) {

			var galleryTop = new Swiper('.gallery-top', {
				spaceBetween: 0,
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				},
				loop: true,
				loopedSlides: 4
			});
			var galleryThumbs = new Swiper('.gallery-thumbs', {
				spaceBetween: 10,
				centeredSlides: true,
				breakpoints: {
					767: {
						slidesPerView: 3
					},
					991: {
						slidesPerView: 5
					},
					1200: {
						slidesPerView: 4
					},
					1440: {
						slidesPerView: 4
					}
				},
				slidesPerView: 5,
				touchRatio: 0.2,
				slideToClickedSlide: true,
				loop: true,
				loopedSlides: 4
			});
			galleryTop.controller.control = galleryThumbs;
			galleryThumbs.controller.control = galleryTop;
		}
	}

	// ==============================
	// INIT SHOP
	// ==============================
	function initShop() {
		if ($('.woocommerce.archive .products').length) {
			var self = $('.woocommerce.archive .products');
			var layoutM = 'masonry';
			self.isotope({
				itemSelector: '.product',
				layoutMode: layoutM,
				masonry: {
					columnWidth: '.product',
					'gutter': 30
				}
			});
		}

		if ($('.wpb_wrapper .woocommerce .products').length) {
			var self = $('.wpb_wrapper .woocommerce .products');
			var layoutM = 'masonry';
			self.isotope({
				itemSelector: '.product',
				layoutMode: layoutM,
				masonry: {
					columnWidth: '.product',
					'gutter': 30
				}
			});
		}

		if ($('.woocommerce-product-gallery__wrapper').length) {
			$('.woocommerce-product-gallery__wrapper').lightGallery({
				selector: '.woocommerce-product-gallery__wrapper a',
				mode: 'lg-slide',
				closable: true,
				iframeMaxWidth: '80%',
				download: false,
			});
		}
	}

	// ==============================
	// PORTFOLIO ISOTOPE
	// ==============================
	function portfolioIsotope() {
		if ($('.portfolio-izotope-container:not(.adjusted_grid)').length) {
			$('.portfolio-izotope-container').each(function () {
				var self = $(this);
				self.isotope({
					itemSelector: '.gallery-item',
					layoutMode: 'masonry',
					masonry: {
						columnWidth: '.gallery-item, .grid-sizer',
					}
				});
			});
		}


		if ($('.adjusted_grid .img-list-gallery').length) {
			if ($(window).width() > 767) {
				$('.adjusted_grid .img-list-gallery').css('height', 'auto').equalHeights();
			} else {
				$('.adjusted_grid .img-list-gallery').css('height', 'auto');
			}
		}

		if ($('.adjusted_grid').length) {
			$('.adjusted_grid').each(function () {
				var self = $(this);
				var layoutM = self.attr('data-layout') || 'masonry';
				self.isotope({
					itemSelector: '.item',
					layoutMode: layoutM,
					masonry: {
						columnWidth: '.item',
						gutter: '.gutter'
					}
				});
			});
		}
	}
	// ==============================
	// ACCORDEON
	// ==============================
	if ( $('.simple_gallery').length ) {
		$('.simple_gallery .accordeon .toggle').on('click', function (e) {
			e.preventDefault();
			var $this = $(this);
			if ($this.next().hasClass('is-show')) {
				$this.next().removeClass('is-show');
				$this.next().slideUp(350);
				$this.find('i').removeClass('ion-minus').addClass('ion-plus');
			} else {
				$this.parent().parent().find('li .list-drop').removeClass('is-show');
				$this.parent().parent().find('li .list-drop').slideUp(350);
				$this.next().toggleClass('is-show');
				$this.next().slideToggle(350);
				$this.closest('.simple_gallery .accordeon').find('.toggle i').removeClass('ion-minus').addClass('ion-plus');
				$this.find('.ion-plus').addClass('ion-minus').removeClass('ion-plus');
			}
		});
	}

	// ==============================
	// LIGHT GALLERY
	// ==============================
	if ($('.light-gallery').length) {
		$('.light-gallery').each(function () {
			var thumb = (typeof $(this).attr('data-thumb') !== undefined) && (typeof $(this).attr('data-thumb') !== false) ? $(this).attr('data-thumb') : true;
			thumb = thumb === 'false' ? false : true;

			$(this).lightGallery({
				selector: '.gallery-item:not(.popup-details)',
				mode: 'lg-slide',
				closable: true,
				iframeMaxWidth: '80%',
				download: false,
				thumbnail: true,
				showThumbByDefault: thumb
			});
		});
	}

	// ==============================
	// SHARE POPUP
	// ==============================
	$('[data-share]').on('click',function () {
		var w = window,
			url = this.getAttribute('data-share'),
			title = '',
			w_pop = 600,
			h_pop = 600,
			scren_left = w.screenLeft ? w.screenLeft : screen.left,
			scren_top = w.screenTop ? w.screenTop : screen.top,
			width = w.innerWidth,
			height = w.innerHeight,
			left = ((width / 2) - (w_pop / 2)) + scren_left,
			top = ((height / 2) - (h_pop / 2)) + scren_top,
			newWindow = w.open(url, title, 'scrollbars=yes, width=' + w_pop + ', height=' + h_pop + ', top=' + top + ', left=' + left);
		if (w.focus) {
			newWindow.focus();
		}
		return false;
	});

	/*=================================*/
	/* ICON FILTER */
	/*=================================*/
	if( $('.header_style').length ){
		$('.filter').css("display", "flex");
	} else {
		$('.filter').css("display", "none");
	}

	/*=================================*/
	/* MAIN WRAPPER */
	/*=================================*/
	function calcPaddingMainWrapper() {
		var footer = $('#footer');
		var paddValue = footer.outerHeight();
		footer.bind('heightChange', function () {
			if (!$("#footer.fix-bottom").length && $("#footer.footer-parallax").length) {
				$('.main-wrapper').css('margin-bottom', paddValue);
			} else if (!$("#footer.fix-bottom").length) {
				$('.main-wrapper').css('padding-bottom', paddValue);
			}
		});

		footer.trigger('heightChange');
	}

	/*=================================*/
	/* ADD IMAGE ON BACKGROUND */
	/*=================================*/
	function wpc_add_img_bg(img_sel, parent_sel) {
		if (!img_sel) {
			return false;
		}

		var $parent, $imgDataHidden, _this;
		$(img_sel).each(function () {
			_this = $(this);
			$imgDataHidden = _this.data('s-hidden');
			$parent = _this.closest(parent_sel);
			$parent = $parent.length ? $parent : _this.parent();
			$parent.css('background-image', 'url(' + this.src + ')').addClass('s-back-switch');
			if ($imgDataHidden) {
				_this.css('visibility', 'hidden');
				_this.show();
			}
			else {
				_this.hide();
			}
		});
	}

	/*=================================*/
	/* BLOG ISOTOPE */
	/*=================================*/
	function initBlogIsotope() {
		if ($('.js-blog-masonry').length) {
			var self = $('.js-blog-masonry');
			self.isotope({
				itemSelector: '.col-12',
				layoutMode: 'masonry',
			});

			self.find("[data-lazy-src]").foxlazy('', function () {
				self.isotope('layout');
			});

			$(window).on('scroll', function () {
				self.isotope('layout');
			});
		}
	}

	pageCalculations(function () {
		if (!window.enable_foxlazy) {
			wpc_add_img_bg('.s-img-switch');
		}
	});

	/*=================================*/
	/* SHARE POPUP */
	/*=================================*/
	$('[data-share]').on('click', function (e) {
		e.preventDefault();

		const w           = window,
			  url         = this.getAttribute('data-share'),
			  title       = '',
			  w_pop       = 600,
			  h_pop       = 600,
			  screen_left = w.screenLeft ? w.screenLeft : screen.left,
			  screen_top  = w.screenTop ? w.screenTop : screen.top,
			  width       = w.innerWidth,
			  height      = w.innerHeight,
			  left        = ((width / 2) - (w_pop / 2)) + screen_left,
			  top         = ((height / 2) - (h_pop / 2)) + screen_top,
			  newWindow   = w.open(url, title, 'scrollbars=yes, width=' + w_pop + ', height=' + h_pop + ', top=' + top + ', left=' + left);

		if (w.focus) {
			newWindow.focus();
		}

		return false;
	});

	/*=================================*/
	/* COPYRIGHT */
	/*=================================*/
	if ($('.ono_copyright_overlay').length) {
		$(document).on('contextmenu',function(event){
			if($('.ono_copyright_overlay').hasClass('copy')){
				event.preventDefault();
			}else if(event.target.tagName != 'A'){
				event.preventDefault();
			}
			$('.ono_copyright_overlay').addClass('active');
		}).on('click', function(){
			$('.ono_copyright_overlay').removeClass('active').removeAttr('style');
		});
	}

	/*=================================*/
	/* MOUSE ANIMATION */
	/*=================================*/
	function animationMouse(e) {
		var mouseY = e.pageY;
		var mouseX = e.pageX;
		var windowCenterX = window.innerWidth / 2;
		var windowCenterY = window.innerHeight / 2;

		$('.js-animation-figure').each(function () {
			var mouseY_item = mouseY - $(this).closest('.js-cs-animation').offset().top;
			var mouseX_item = mouseX;

			var move_x = parseFloat($(this).attr('data-move-x'));
			var move_y = parseFloat($(this).attr('data-move-y'));

			move_x = (mouseX_item / windowCenterX - 1) * move_x * -100;
			move_y = (mouseY_item / windowCenterY - 1) * move_y * -100;

			TweenMax.to($(this), 0.35, { x: move_x, y: move_y, ease: Power2.easeOut });
		});
	}

	/*=================================*/
	/* SCROLL ANIMATION */
	/*=================================*/
	function animationScroll() {
		$('.js-animation-scroll').each(function () {
			var parentTop = $(this).closest('.js-animation-parent').offset().top;
			var winScroll = $(window).scrollTop();
			var winH = window.innerHeight;
			var winW = window.innerWidth;
			var thisLeft = $(this).parent().offset().left / winW * 100;

			var offset = (winScroll - parentTop) / winH * -50 - 0.5 * thisLeft;

			TweenMax.to($(this), 0.35, { xPercent: offset, ease: Power2.easeOut });
		});
	}



	function megaMenuImage(){
		if($('.mega-menu > .sub-menu').length){
			var image = $('header').data('img-url');

			$('.mega-menu > .sub-menu').append('<span class="mega-menu-image"></span>').find('.mega-menu-image').css({
				'background-image' : 'url("' + image + '")'
			});

		}
	}

	/*=================================*/

	$(window).on('load', function () {
		megaMenuImage();
		wpc_add_img_bg('.s-img-switch');
		initSwiper();
		swiperEqualHeight();
		animationScroll();
		portfolioIsotope();
		initSwiperThumbs();
		initShop();
		initBlogIsotope();
		if ($('.cs-preloader').length) {
			$('.cs-preloader').fadeOut(400);
		}
	});

	/*=================================*/

	$(window).on('resize', function () {
		swiperEqualHeight();
		portfolioIsotope();
	});

	/*=================================*/

	$(window).on('scroll resize', function () {
		animationScroll();
	});

	/*=================================*/

	$(window).on('load resize', function () {
		calcPaddingMainWrapper();
		topBannerHeight();
	});

	/*=================================*/

	window.addEventListener("orientationchange", function () {
		animationScroll();
		swiperEqualHeight();
		calcPaddingMainWrapper();
		topBannerHeight();
		portfolioIsotope();
	});

	/*=================================*/

	document.addEventListener("mousemove", function (event) {
		animationMouse(event);
	});

})(jQuery, window, document);
