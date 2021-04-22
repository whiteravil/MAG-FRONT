import $ from 'jquery'
window.jQuery = $
window.$ = $

import Inputmask from "inputmask"

function init() {

	let logoRow      = $('.logo-row'),
			logoRowTop   = logoRow.offset().top,
			logoRowWidth = logoRow.width(),
			logoBlock    = $('.logo-block');

	// let logoDefaultScale = $('.logo-block .logo').css('transform'),
	let logo      = $('.logo-block .logo'),
			logoWidth = logo.width();
			// scaleCoef = parseFloat(logoDefaultScale.replace('matrix(', '').replace(')', '').split(', ')[0]);

	let bluredVideo = $('.blured-video');

	let menu          = $('.main-menu'),
			menuTop       = menu.offset().top,
			menuSticky    = $('.main-menu-sticky'),
			menuStickyTop = menuSticky.offset().top;

	let sAbout          = $('.s-about'),
			sAboutHeight    = sAbout.outerHeight(),
			sAboutTop       = sAbout.offset().top,
			aboutDate       = $('.about-date'),
			aboutDateHeight = aboutDate.outerHeight(),
			aboutDateTop    = aboutDate.offset().top;

	let sPosterConstructions    = $('.s-poster-constructions'),
			sPosterConstructionsTop = sPosterConstructions.offset().top,
			sClients        	      = $('.s-clients'),
			sClientsTop     	      = sClients.offset().top,
			headerCallbackHeight    = $('.header-callback').outerHeight(true);

	function scaleLogo(scrTop) {

		if ( scrTop >= logoRowTop ) {
			logoBlock.addClass('no-fixed');
		}
		else {
			// let scaleDynamicCoef = scrTop / logoRowTop * ( 1 - scaleCoef ) + scaleCoef ;
			let proport          = scrTop / logoRowTop,
					scaleDynamicCoef = proport * ( logoRowWidth - logoWidth ) + logoWidth,
					blurPX           = proport * 25;
			logoBlock.removeClass('no-fixed');
			// $('.logo-block .logo').css('transform', `scale(${scaleDynamicCoef})`)
			logo.css('width', `${scaleDynamicCoef}`);
			// $('.main-window-bg').get(0).style.setProperty('--main-window-blur', `${blurPX}px`);
			bluredVideo.css('opacity', scrTop / menuTop);
		}

		if ( scrTop >= menuTop ) {
			menuSticky.addClass('fixed');
			bluredVideo.addClass('full-blured')
		}
		else {
			menuSticky.removeClass('fixed');
			bluredVideo.removeClass('full-blured')
		}

		let if_a = scrTop >= sPosterConstructionsTop - headerCallbackHeight,
				if_b = scrTop < sPosterConstructionsTop + sPosterConstructions.outerHeight() - headerCallbackHeight,
				if_c = scrTop >= sClientsTop - headerCallbackHeight,
				if_d = scrTop < sClientsTop + sClients.outerHeight() - headerCallbackHeight;

		if ( ( if_a && if_b ) || ( if_c && if_d ) ) {
			menuSticky.addClass('dark')
		}
		else {
			menuSticky.removeClass('dark')
		}

	}

	function animateSAbout(scrTop) {

		let topAnimate = scrTop - aboutDateTop + $(window).height();

		let transformAboutDate = topAnimate > 0 ? topAnimate : 0;

		if ( scrTop >= sAboutTop - $(window).height() / 2 ) {
			sAbout.addClass('animate')
		}
		else {
			sAbout.removeClass('animate')
		}

		$('.about-date').css('transform', `translate3d(${transformAboutDate / 5}px, 0, 0)`)
	}

	let windowTop = $(window).scrollTop();

	scaleLogo(windowTop);
	animateSAbout(windowTop);

	function adwScroll(scrTop) {

		$('.adw-wrapper').each(function() {

			let ths        = $(this),
					top        = ths.offset().top,
					height     = ths.outerHeight(),
					blurBlock  = ths.find('.adw-img-bg-blur'),
					blur       = blurBlock.find('img'),
					content    = ths.find('.adw-content'),
					blurHeight = blur.outerHeight();

			if ( scrTop >= top ) {
				let blurOpacity = (scrTop - top) / (height - blurHeight - $(window).height());
				blur.attr('style', `opacity: ${blurOpacity}`);
				if ( blurOpacity >= 1 ) {
					blurBlock.addClass('animate')
				}
				else {
					blurBlock.removeClass('animate')
				}
			}

		});

	}

	let numbersFactsWrapper = $('.numbers-facts-wrapper'),
			numbersFactsWrapperTop = numbersFactsWrapper.offset().top,
			numbersBigImg = $('.numbers-facts-wrapper-big-nmb-value');

	function scaleNmb(scrTop) {

		if ( scrTop >= numbersFactsWrapperTop ) {
			let scaleCoef = scrTop - numbersFactsWrapperTop;
			numbersBigImg.css('transform', `scale(${1 + scaleCoef / 400})`);
			$('.numbers-facts-item').each(function() {
				let ths = $(this),
						thsTop = ths.offset().top;
				if ( scrTop > thsTop - $(window).height() / 1.5 ) {
					ths.addClass('animate')
				}
				else {
					ths.removeClass('animate')
				}
			});
		}

	}

	adwScroll(windowTop);

	let sClientsHeight = sClients.outerHeight();

	$('.clients-block').each(function(i) {

		let tapeWrapper = $(this),
				tape 		    = tapeWrapper.find('.clients-tape'),
				tapeWidth   = tape.outerWidth(true),
				maxWidth    = tapeWrapper.width(),
				xCoord      = 0,
				slider;

		function startSlider(scrTop) {
			let startScroll = $('.clients-wrapper').offset().top - $(window).outerHeight();
			if ( scrTop >= startScroll ) {
				xCoord = scrTop - startScroll;
				tape.css('transform', `translate3d(${ i % 2 == 0 ? xCoord / 2 : -xCoord / 2 }px, 0, 0)`)
			}
		}
		startSlider();

		$(window).on('scroll', function() {
			let scrTop = $(window).scrollTop();
			if ( scrTop > sClientsTop - $(window).height() && scrTop < sClientsTop + sClientsHeight ) {
				startSlider(scrTop)
			}
		});

	});

	$(window).on('scroll', function() {

		let scrTop = $(window).scrollTop();

		scaleLogo(scrTop);

		if ( scrTop > sAboutTop - $(window).height() && scrTop <= sAboutTop + sAboutHeight ) {
			animateSAbout(scrTop);
		}

		adwScroll(scrTop);

		scaleNmb(scrTop);

	});

	// $(document).on('click', function() {
	// 	$('.adw-img-bg-blur').toggleClass('animate')
	// })

	function counter() {

		$('.adw-img-banner-square-counter').each(function() {

			let ths = $(this);

			ths.find('.adw-img-banner-square-counter-item').each(function() {
				let counterItem = $(this),
				tape = counterItem.find('span'),
				tapeH = tape.outerHeight(),
				needTranslate = tapeH - counterItem.outerHeight();

				tape.attr('style', `transform: translate3d(0, -${needTranslate}px, 0)`);
			});

		});

	}counter();

	let phoneMask = new Inputmask({
  	mask: "+7 999 999 99 99",
  	showMaskOnHover: false
  });

  phoneMask.mask('.phone-mask');

}

window.onload = () => {

	init();

}

// window.onresize = () => {

// 	init();

// }
