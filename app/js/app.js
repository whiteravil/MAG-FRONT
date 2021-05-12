import $ from 'jquery'
window.jQuery = $
window.$ = $

import Inputmask from "inputmask"
require('../libs/slick/slick.min.js')

function windowHeight() {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
}

if ( $(window).width() <= 576 ) {
	windowHeight();
}

function init() {

	const touchPrevent = e => {
		e.preventDefault();
	}

	function bodyNoScroll() {
		$('body').addClass('no-scroll');
		document.addEventListener('touchmove', touchPrevent, { passive: true });
	}

	function bodyHasScroll() {
		$('body').removeClass('no-scroll');
		document.removeEventListener('touchmove', touchPrevent, { passive: true });
	}

	$('.menu-link').on('click', function (e) {
		e.preventDefault();
		let id = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top
		}, 2000)
	});

	let logoRow = $('.logo-row'),
		logoRowTop = logoRow.offset().top,
		logoRowWidth = logoRow.width(),
		logoBlock = $('.logo-block');

	// let logoDefaultScale = $('.logo-block .logo').css('transform'),
	let logo = $('.logo-block .logo'),
		logoWidth = logo.width();
	// scaleCoef = parseFloat(logoDefaultScale.replace('matrix(', '').replace(')', '').split(', ')[0]);

	let bluredVideo = $('.blured-video');

	let menu = $('.main-menu'),
		menuTop = menu.offset().top,
		menuSticky = $('.main-menu-sticky'),
		menuStickyTop = menuSticky.offset().top;

	let sAbout = $('.s-about'),
		sAboutHeight = sAbout.outerHeight(),
		sAboutTop = sAbout.offset().top,
		aboutDate = $('.about-date'),
		aboutDateHeight = aboutDate.outerHeight(),
		aboutDateTop = aboutDate.offset().top;

	let sPosterConstructions = $('.s-poster-constructions'),
		sPosterConstructionsTop = sPosterConstructions.offset().top,
		sClients = $('.s-clients'),
		sClientsTop = sClients.offset().top,
		headerCallbackHeight = $('.header-callback').outerHeight(true);

	function scaleLogo(scrTop) {

		if (scrTop >= logoRowTop) {
			logoBlock.addClass('no-fixed');
		}
		else {
			// let scaleDynamicCoef = scrTop / logoRowTop * ( 1 - scaleCoef ) + scaleCoef ;
			let proport = scrTop / logoRowTop,
				scaleDynamicCoef = proport * (logoRowWidth - logoWidth) + logoWidth,
				blurPX = proport * 25;
			logoBlock.removeClass('no-fixed');
			// $('.logo-block .logo').css('transform', `scale(${scaleDynamicCoef})`)
			logo.css('width', `${scaleDynamicCoef}`);
			// $('.main-window-bg').get(0).style.setProperty('--main-window-blur', `${blurPX}px`);
			bluredVideo.css('opacity', scrTop / menuTop);
		}

		if (scrTop >= menuTop) {
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

		if ((if_a && if_b) || (if_c && if_d)) {
			menuSticky.addClass('dark')
		}
		else {
			menuSticky.removeClass('dark')
		}

	}

	function animateSAbout(scrTop) {

		let topAnimate = scrTop - aboutDateTop + $(window).height();

		let transformAboutDate = topAnimate > 0 ? topAnimate : 0;

		if (scrTop >= sAboutTop - $(window).height() / 2) {
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

		$('.adw-wrapper').each(function () {

			let ths = $(this),
					top = ths.offset().top,
					mainImg = ths.find('.adw-img-main'),
					height = ths.outerHeight(),
					blurBlock = ths.find('.adw-img-bg-blur'),
					blur = blurBlock.find('img'),
					content = ths.find('.adw-content'),
					blurHeight = blur.outerHeight(),
					blurOpacity = (scrTop - top) / (height - blurHeight - $(window).height());
			if ($(window).width() <= 767) {
				if (scrTop >= top && scrTop < top + height) {
					let imgSCale = 1 + blurOpacity * 3;
					mainImg.attr('style', `transform: scale(${imgSCale > 3 ? 3 : imgSCale})`);
					blurBlock.attr('style', `opacity: ${blurOpacity}`);
				}
			} else {
				if (scrTop >= top && scrTop < top + height) {

					if (blurOpacity <= 1) {
						blur.attr('style', `opacity: ${blurOpacity}`);
						blurBlock.removeClass('animate')
					}
					else if (blurOpacity > 1) {
						blurBlock.addClass('animate')
					}

				}
			}


		});

	}

	let numbersFactsWrapper = $('.numbers-facts-wrapper'),
		numbersFactsWrapperTop = numbersFactsWrapper.offset().top,
		numbersFactsWrapperHeight = numbersFactsWrapper.outerHeight(),
		numbersBigImg = $('.numbers-facts-wrapper-big-nmb-value');

	function scaleNmb(scrTop) {

		if (scrTop >= numbersFactsWrapperTop && scrTop < numbersFactsWrapperHeight + numbersFactsWrapperTop) {
			let scaleCoef = scrTop - numbersFactsWrapperTop;
			numbersBigImg.css('transform', `scale(${1 + scaleCoef / 400})`);
			$('.numbers-facts-item').each(function () {
				let ths = $(this),
					thsTop = ths.offset().top;
				if (scrTop > thsTop - $(window).height() / 1.5) {
					ths.addClass('animate')
				}
				else {
					ths.removeClass('animate')
				}
			});
		}
		else if (scrTop < numbersFactsWrapperTop) {
			numbersBigImg.css('transform', `scale(1)`);
		}

	}

	adwScroll(windowTop);

	let sClientsHeight = sClients.outerHeight();

	$('.clients-block').each(function (i) {

		let tapeWrapper = $(this),
			tape = tapeWrapper.find('.clients-tape');
			// tapeWidth = tape.outerWidth(true),
			// maxWidth = tapeWrapper.width(),
			// xCoord = 0,
			// slider;

		// function startSlider(scrTop) {
		// 	let startScroll = $('.clients-wrapper').offset().top - $(window).outerHeight();
		// 	if (scrTop >= startScroll) {
		// 		xCoord = scrTop - startScroll;
		// 		tape.css('transform', `translate3d(${i % 2 == 0 ? xCoord / 2 : -xCoord / 2}px, 0, 0)`)
		// 	}
		// }
		// startSlider();

		tape.slick({
			infinite: true,
			arrows: false,
			dots: false,
			draggable: false,
			autoplay: true,
			autoplaySpeed: 0,
			cssEase: 'linear',
			variableWidth: true,
			speed: 3000,
			rtl: false,
			pauseOnHover:false
		});

	});

	// $('.contacts-form').on('submit', function(e) {
	// 	e.preventDefault();
	// 	let ths = $(this),
	// 			success = ths.find('.form-success');
	// 	success.addClass('active');
	// 	setTimeout(() => {
	// 		success.removeClass('active')
	// 	}, 5000)
	// });

	$('.form-success-link a').on('click', function(e) {
		e.preventDefault();
		$('.form-success').removeClass('active')
	});

	let sTeam = $('.s-team'),
		sTeamTop = sTeam.offset().top,
		sContacts = $('.s-contacts'),
		sContactsTop = sContacts.offset().top;

	$(window).on('scroll', function () {

		let scrTop = $(window).scrollTop();

		scaleLogo(scrTop);

		if (scrTop > sAboutTop - $(window).height() && scrTop <= sAboutTop + sAboutHeight) {
			animateSAbout(scrTop);
		}

		if (scrTop > sClientsTop - $(window).height() / 1.3) {
			sClients.addClass('animate')
		}
		else {
			sClients.removeClass('animate')
		}

		if (scrTop > sTeamTop - $(window).height() / 1.3) {
			sTeam.addClass('animate')
		}
		else {
			sTeam.removeClass('animate')
		}

		if (scrTop > sContactsTop - $(window).height() / 1.3) {
			sContacts.addClass('animate')
		}
		else {
			sContacts.removeClass('animate')
		}

		adwScroll(scrTop);

		scaleNmb(scrTop);

	});

	function counter() {

		$('.adw-img-banner-square-counter').each(function () {

			let ths = $(this);

			ths.find('.adw-img-banner-square-counter-item').each(function () {
				let counterItem = $(this),
					tape = counterItem.find('span'),
					tapeH = tape.outerHeight(),
					needTranslate = tapeH - counterItem.outerHeight();

				tape.attr('style', `transform: translate3d(0, -${needTranslate}px, 0)`);
			});

		});

	} counter();

	let phoneMask = new Inputmask({
		mask: "+7 999 999-99-99",
		showMaskOnHover: false
	});

	phoneMask.mask('.phone-mask');

	function openPopup(id) {
		let notCurrentPopups = $(`.popup-wrapper:not(${id})`);
		notCurrentPopups.removeClass('opened');
		setTimeout(() => {
			notCurrentPopups.hide()
		}, 400);
		$(id).show();
		setTimeout(() => {
			$(id).addClass('opened')
		}, 50);
		bodyNoScroll();
	}

	function closePopup(e) {
		e !== undefined ? e.preventDefault() : '';
		$('.popup-wrapper').removeClass('opened');
		setTimeout(() => {
			$('.popup-wrapper').hide();
			$('.video-popup-block').html('');
		}, 400);
		bodyHasScroll();
	}

	$(document).on('click', '.open-popup', function (e) {
		e.preventDefault();
		let id = $(this).attr('href');
		openPopup(id);
	});

	$('.popup-close').on('click', closePopup);

	$('.popup-bg').on('click', closePopup);

	$('.popup-wrapper').on('click', function (e) {
		let clickTarget = $(e.target);
		if (clickTarget.hasClass('popup-flex')) {
			closePopup();
		}
	});

	$(document).on('click', function (e) {
		let tg = $(e.target);
		if (tg.closest('.popup-wrapper').length == 1 && !tg.closest('.popup-content').length) {
			closePopup();
		}
	});

	$('.mobile-menu-list a').on('click', function(e) {
		e.preventDefault();
		let id = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(id).offset().top
		}, 700);
		$('.mobile-menu').removeClass('opened');
	});

	$(document).on('keyup', function(e) {
		if (e.key == "Escape") {
			closePopup()
		}
	});

	$('.mobile-menu-open').on('click', function() {
		$('.mobile-menu').addClass('opened');
		bodyNoScroll();
	});

	$('.mobile-menu-close').on('click', function() {
		$('.mobile-menu').removeClass('opened');
		bodyHasScroll();
	});

}

document.addEventListener("DOMContentLoaded", () => {

	init();

});

let firstWidth = window.innerWidth;

window.addEventListener('resize', () => {

	let intViewportWidth = window.innerWidth;

	if ( intViewportWidth < 968 && firstWidth != intViewportWidth ) {

		let loc = window.location.href;

		window.location = loc;

	}

})