;(function ($, window, document) {
	'use strict';

	let justify;

	/*********************/
	/*** Init ISOTOPE ****/
	/*********************/
	function portfolioIsotope() {
		if ($('.js-portfolio-list').length) {
			$('.js-portfolio-list').each(function (key) {
				var self = $(this);
				self.attr('id', 'js-portfolio-list-' + key);
				var col_width = self.hasClass('masonry') ? '.js-portfolio-item' : '.js-item-width';
				var justified = +self.attr('data-justified');

				if (justified) {
					self.justifiedGallery({
						rowHeight : 210,
						lastRow : 'justify',
						captions : false,
						margins : 0,
					});
				} else {
					self.isotope({
						itemSelector: '.js-portfolio-item',
						layoutMode: 'masonry',
						hiddenStyle: {
							opacity: 0,
						},
						visibleStyle: {
							opacity: 1
						},
						masonry: {
							columnWidth: col_width,
							filter: '*'
						}
					});

					calcHeight(self);

					if (self.attr('data-load-type') == 'pagination') {
						var itemsPerPage = parseInt(self.attr('data-load'));
						setPagination(self, itemsPerPage, '*');
						goToPage(1, self, '*');
					} else if (self.attr('data-load-type') == 'button') {
						var itemsPerPage = parseInt(self.attr('data-load'));
						setLoadMore(self, itemsPerPage, '*');
						loadMore(1, self, '*');
					} else {
						changeFilter(self, '*');
					}
				}
			});
		}
	}

	/*********************/
	/***** IMG TO BG *****/
	/*********************/
	function wpc_add_img_bg(img_sel, parent_sel) {
		if (!img_sel) {

			return false;
		}
		var $parent, $imgDataHidden, _this;
		$(img_sel).each(function () {
			_this          = $(this);
			$imgDataHidden = _this.data('s-hidden');
			$parent        = _this.closest(parent_sel);
			$parent        = $parent.length ? $parent : _this.parent();
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

	/*********************/
	/*** CALC HEIGHT *****/
	/*********************/
	function calcHeight($container) {
		if ($container.hasClass('grid')) {
			var width = $container.find('.js-item-width').outerWidth();
			var space = $(window).width() > 767 ? 30 : 16;

			$($container).find('.js-portfolio-item').each(function () {
				var row    = parseInt($(this).attr('data-row'), 10);
				row        = (row > 2 && $(window).width() <= 767) ? 2 : row;
				var height = row * width;

				if ($(this).hasClass('space-normal')) {
					height += space * (row - 1);
				}

				$(this).find('.cs-portfolio__image').css('height', height);
			});
		}
	}

	/*********************/
	/*** Set load more ***/
	/*********************/
	function setLoadMore($container, itemsPerPage, currentFilter) {
		var currentNumberPages;
		var SettingsPagesOnItems = function () {
			var itemsLength = $container.children('.js-portfolio-item').length;
			var pages       = Math.ceil(itemsLength / itemsPerPage);
			var item        = 1;
			var page        = 1;
			var selector    = '.js-portfolio-item';
			selector += (currentFilter != '*') ? currentFilter : '';

			$container.children(selector).each(function () {

				if (item > itemsPerPage) {
					page++;
					item = 1;
				}
				$(this).attr('data-page', page);

				item++;
			});

			currentNumberPages = page;
		}();

		// Create pagers
		var CreatePagers = function () {
			if (currentNumberPages >= 2) {
				var $isotopePager = $container.parent().find('.cs-portfolio__load').length ? $container.parent().find('.cs-portfolio__load') : $('<div class="cs-portfolio__load"></div>');

				$isotopePager.html('');

				var name  = $container.attr('data-btn-name');
				var style = $container.attr('data-btn-style');

				var $pager = $('<a href="javascript:void(0);" class="js-portfolio-load ' + style + '" data-load-item="2" data-pages="' + currentNumberPages + '">' + name + '</a>');

				$pager.click(function () {
					var load = parseInt($(this).attr('data-load-item'), 10);
					var page = parseInt($(this).attr('data-pages'), 10);
					$(this).attr('data-load-item', load + 1);
					loadMore(load, $container, currentFilter);
					if (load == page) {
						$(this).parent().remove();
					}
				});

				$pager.appendTo($isotopePager);

				$container.after($isotopePager);
			} else {
				$container.parent().find('.cs-portfolio__load').remove();
			}
		}();
	}

	/*********************/
	/*** Set pagination ***/
	/*********************/
	function setPagination($container, itemsPerPage, currentFilter) {
		var currentNumberPages;

		var SettingsPagesOnItems = function () {
			var itemsLength = $container.children('.js-portfolio-item').length;
			var pages       = Math.ceil(itemsLength / itemsPerPage);
			var item        = 1;
			var page        = 1;
			var selector    = '.js-portfolio-item';
			selector += (currentFilter != '*') ? currentFilter : '';

			$container.children(selector).each(function () {

				if (item > itemsPerPage) {
					page++;
					item = 1;
				}
				$(this).attr('data-page', page);

				item++;
			});
			currentNumberPages = page;
		}();

		// Create pagers
		var CreatePagers = function () {
			if (currentNumberPages > 1) {
				var $isotopePager = $container.parent().find('.cs-portfolio__pagination').length ? $container.parent().find('.cs-portfolio__pagination') : $('<div class="cs-portfolio__pagination"></div>');
				$isotopePager.html();

				var prev = $('<a href="javascript:void(0);" class="cs-portfolio__pagination-prev"></a>');
				var next = $('<a href="javascript:void(0);" class="cs-portfolio__pagination-next"></a>');

				prev.appendTo($isotopePager);

				for (var i = 0; i < currentNumberPages; i++) {
					var class_item = (i == 0) ? 'active' : '';
					var $pager     = $('<a href="javascript:void(0);" class="cs-portfolio__pagination-page ' + class_item + '" data-page="' + (i + 1) + '"></a>');
					var number     = (i + 1) > 9 ? (i + 1) : '0' + (i + 1);
					$pager.html(number);

					$pager.click(function () {
						var page = $(this).eq(0).attr('data-page');
						$(this).addClass('active').siblings().removeClass('active');
						goToPage(page, $container, currentFilter);
					});

					$pager.appendTo($isotopePager);
				}

				prev.on('click', function () {
					$(this).parent().find('.active').prev('.cs-portfolio__pagination-page').click();
				});

				next.on('click', function () {
					$(this).parent().find('.active').next('.cs-portfolio__pagination-page').click();
				});

				next.appendTo($isotopePager);

				$container.after($isotopePager);
			} else {
				$container.parent().find('.cs-portfolio__pagination').remove();
			}

		}();
	}

	/*********************/
	/*** Change Filter ***/
	/*********************/
	function changeFilter($container, selector, selectorString) {
		if (!!$container.attr('data-justified')) {
			$container.justifiedGallery({
				filter: selectorString
			});

			return;
		}

		$container.find('.js-portfolio-item').removeClass('visibility-item').children().removeClass('animated');
		$container.find(selector).addClass('visibility-item').children().addClass('animated');

		$(selector).find('img').each(function () {
			var src = $(this).attr('data-src');
			$(this).attr('src', src);
		});

		wpc_add_img_bg($container.find(selector).find('.s-img-switch'));

		$container.isotope({
			filter: selector
		});
		$container.isotope('layout');
	}

	/*********************/
	/*** FULL WIDTH ***/
	/*********************/
	function fullWidth() {
		if ($('.js-portfolio-list.full-width-space:not(.mosaics)').length) {
			$('.js-portfolio-list.full-width-space:not(.mosaics)').each(function () {
				var space = $(window).width() > 767 ? 30 : 0;
				$(this).width(document.documentElement.clientWidth - space);
			});
		}

		if ($('.js-portfolio-list.full-width:not(.mosaics)').length) {
			$('.js-portfolio-list.full-width:not(.mosaics)').each(function () {
				var space = $(this).hasClass('no-space') ? 0 : 30;
				$(this).width(document.documentElement.clientWidth + space);
			});
		}
	}

	/*********************/
	/**** GO TO PAGE *****/
	/*********************/
	function goToPage(currentPage, $container, currentFilter) {
		var selector = '.js-portfolio-item';
		selector += (currentFilter != '*') ? currentFilter : '';
		selector += '[data-page="' + currentPage + '"]';
		changeFilter($container, $(selector));
	}

	/*********************/
	/***** LOAD MORE *****/
	/*********************/
	function loadMore(currentPage, $container, currentFilter) {
		var selector = '';

		for (var i = 1; i <= currentPage; i++) {
			selector += '.js-portfolio-item';
			selector += (currentFilter != '*') ? currentFilter : '';
			selector += '[data-page="' + i + '"]';
			selector += currentPage == i ? '' : ',';
		}

		changeFilter($container, $(selector));
	}

	/*********************/
	/***** FILTER *****/
	/*********************/

	function checkOtherItemsFilter(filter_items, filter_select) {
		filter_items.each(function () {
			var item_select_category = $(this).attr('data-tabs');
			var item_select_filter = $(this).attr('data-filter');
			var item_filter = Object.assign({}, filter_select);

			item_filter[item_select_category] = item_select_filter;

			var item_current_filter = '';

			for (var item_property in item_filter) {
				if (item_filter[item_property] != '*') {
					item_current_filter += item_filter[item_property];
				}
			}

			if (!$(this).closest('.js-portfolio').find(item_current_filter).length) {
				$(this).addClass('hide');
			} else {
				$(this).removeClass('hide');
			}
		});
	}

	$('.js-portfolio-filter-btn').on("click", function (e) {
		e.preventDefault();

		var filter_items = $(this).closest('.js-portfolio').find('.js-portfolio-filter-btn').not('[data-filter="*"]');
		var filter_all = [];
		var filter_select = {};
		var $container = $(this).closest('.js-portfolio').find('.js-portfolio-list');
		var loadType = $container.attr('data-load-type');
		var itemsPerPage = $container.attr('data-load');
		var tabs = $(this).is('[data-tabs]') ? $(this).attr('data-tabs') : '';
		var filter = $(this).attr('data-filter');
		var select_items = $(this).closest('.js-portfolio').find('[data-select-filter]');

		$(this).closest('.js-portfolio').find('.cs-portfolio__filter-content-inner').removeClass('show').addClass('hide');

		$(this).addClass('active').siblings().removeClass('active');

		if (tabs.length) {
			$(this).closest('.js-portfolio').find('[data-tabs-head="' + tabs + '"]').addClass('active').attr('data-select-filter', filter);

			if (filter == '*') {
				$(this).closest('.js-portfolio').find('[data-tabs-head="' + tabs + '"]').removeClass('active');
			}
		} else {
			select_items.removeClass('active').attr('data-select-filter', '*');
		}

		select_items.each(function () {
			var item_filter = $(this).attr('data-select-filter');
			var item_select = $(this).attr('data-tabs-head');

			filter_select[item_select] = item_filter;
			filter_all.push(item_filter);
		});

		let filters = filter_all.reduce(function (accumulator, currentValue) {
			if (currentValue != '*') {
				return accumulator + currentValue;
			}

			return accumulator;
		}, '');

		if (!filters) {
			filters = '*';
		}

		checkOtherItemsFilter(filter_items, filter_select);

		if (loadType == 'button') {
			setLoadMore($container, itemsPerPage, filters);
			loadMore(1, $container, filters);
		} else if (loadType == 'pagination') {
			setPagination($container, itemsPerPage, filters);
			goToPage(1, $container, filters);
		} else {
			changeFilter($container, $(filters), filters);
		}
	});

	$('.cs-portfolio__filter-tabs-current').on("click", function () {
		$('.js-portfolio-filter-btn').removeClass('active');
	});

	function hideTabContent(tabContent){
		for( let i = 0; i < tabContent.length; i++ ) {
			tabContent[i].classList.remove('show');
			tabContent[i].classList.add('hide');
		}
	}

	function showTabContent(tabContent, b){
		if ( tabContent[b].classList.contains('hide')) {
			tabContent[b].classList.remove('hide');
			tabContent[b].classList.add('show');
		}
	}

	if ( $('.cs-portfolio__bar').length ){
		let tab = document.querySelectorAll('.cs-portfolio__filter-tabs-item'),
			info = document.querySelector('.cs-portfolio__filter-tabs'),
			tabContent = document.querySelectorAll('.cs-portfolio__filter-content-inner');

		info.addEventListener('mouseover', function(e){
			let target = e.target;
			if ( target && target.classList.contains('cs-portfolio__filter-tabs-item')) {
				for ( let i = 0; i < tab.length; i++ ) {
					if ( target == tab[i]){
						hideTabContent(tabContent);
						showTabContent(tabContent, i);
						break;
					}
				}
			}
		});
	}

	/*=====================*/
	/* POPUP HOVER PORTFOLIO */
	/*=====================*/
	function typeRect () {
		if($(window).width() > 992){
			let articleGrid = $('.js-portfolio .js-portfolio-list .js-portfolio-item.style-5');
			$('body').append('<div class="popup-span"></div>');
			$('.popup-span').append('<p class="popup-cut"></p>');

			$(articleGrid).mousemove(function (eventObject) {
				$('.popup-span').find('.cs-portfolio__item-title').remove();
				$('.popup-span').find('.cs-portfolio__category').remove();

				$(this).find('.cs-portfolio__item-title').clone().appendTo('.popup-span');
				$(this).find('.cs-portfolio__category').clone().appendTo('.popup-span');

				$('.popup-span').css({
					"top" : eventObject.pageY + 35,
					"left" : eventObject.pageX + 15
				}).show();


				var posBody = $( ".popup-span" ).offset().left;
				var doc_w = $(window).width();
				if (posBody > doc_w - 250){
					$('.popup-span').css({
						"top" : eventObject.pageY + 35,
						"right" : doc_w - eventObject.pageX,
						'left': 'auto'
					}).show();
				} else{
					$('.popup-span').css({
						"top" : eventObject.pageY + 35,
						"left" : eventObject.pageX + 15,
						'right': 'auto'
					}).show();
				}
			}).mouseout(function () {
				$('.popup-span').hide()
					.html("")
					.css({
						"top" : 0,
						"left" : 0,
					});
			});
		}
	}

	$('.cs-portfolio-full__filter-item').on('click', function () {
		$(this).toggleClass("active")
	});

	$('.js-filter-btn').on('click', function (e) {
		var filterValue = [];
		$('[data-filter].active').each(function(i){
			filterValue[i] = $(this).attr('data-filter');
		});

		var separator = ',';

		if (!!$('.js-portfolio-list').attr('data-justified')) {
			$('.js-portfolio-list').justifiedGallery({
				filter: filterValue.join(separator)
			});
		} else {
			$('.js-portfolio-list').isotope({
				filter: filterValue.join(separator)
			});
		}


		e.preventDefault();
	});

	$('.js-filter-reset-btn').on('click', function () {
		$('.cs-portfolio-full__filter-item').removeClass("active")
	});

	if( $('.header_style').length ){
		$('.filter').css("display", "flex").on('click', function () {
			$( ".cs-portfolio-full__bar" ).appendTo( "body" ).toggleClass("active");
			$('.cs-portfolio__overlay').appendTo( "body" ).toggleClass("active");
			$('body').toggleClass("filter-overlay");



			$(this).parent().toggleClass('opened');

			$('.cs-portfolio__close').appendTo( "body" ).css({
				'top': $(this).offset().top - $(window).scrollTop(),
				'right': $(window).outerWidth() - ($(this).offset().left + $(this).outerWidth()),
				'display': 'flex'
			});

			if($('.aside-animation').length){
				$('body').toggleClass("aside-filter");

				if($(window).width() > 991){
					$('.cs-portfolio__close').appendTo( "body" ).css({
						'top': 50,
						'right': 50,
						'display': 'flex'
					});
				}

				$('.open').css({
					'display': 'none'
				});


			}
		});

		$('.cs-portfolio__overlay').on('click', function () {
			$('.cs-portfolio-full__bar').removeClass("active");
			$('.cs-portfolio__overlay').removeClass("active");
			$('body').removeClass("filter-overlay");
			$('.filter').parent().removeClass('opened');
			$('.cs-portfolio__close').css("display", "none");
			if($('.aside-animation').length){
				$('body').toggleClass("aside-filter");
				$('.open').css({
					'display': 'flex'
				});
			}
		});

		$('.cs-portfolio__close').on('click', function () {
			$('.cs-portfolio-full__bar').toggleClass("active");
			$('.cs-portfolio__overlay').toggleClass("active");
			$('body').toggleClass("filter-overlay");
			$(this).css("display", "none");
			$('.filter').parent().removeClass('opened');
			if($('.aside-animation').length){
				$('body').toggleClass("aside-filter");
				$('.open').css({
					'display': 'flex'
				});
			}
		})

	}


	$(window).on('load resize', function () {
		fullWidth();
		calcHeight($('.js-portfolio-list'));
	});

	$(window).on('load', function () {
		portfolioIsotope();
		typeRect();
	});


	$('.js-portfolio-list img').on('load', function () {
		$(this).closest('.js-portfolio-list').each(function () {
			if ($(this).closest('.js-portfolio-list').attr('data-justified') == undefined) {
				$(this).isotope('layout');
			}
		})
	});
})(jQuery, window, document);
