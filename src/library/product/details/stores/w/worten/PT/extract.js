const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'worten',
    transform,
    domain: 'worten.pt',
    zipcode: '',
  }, implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    try {
      await context.waitForSelector('.w-cookies-popup__wrapper .w-button-primary', { timeout: 10000 });
      await context.evaluate(function () {
        console.log('Clicking on button.');
        document.querySelector('.w-cookies-popup__wrapper .w-button-primary').click();
      });
    } catch (er) {
      console.log('Error while accepting cookies button.', er);
    }

    await context.waitForNavigation({ timeout: 50000, waitUntil: 'networkidle0' });
    await context.evaluate(function () {
      var rating = document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext() && document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent && document.evaluate('//script[@type="application/ld+json"][1][contains(text(),"ratingValue")]', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.replace(/(.+ratingValue":"([^\"]+).+)/g, '$2');
      if (rating) {
        var Frating = Number(rating).toFixed(1).replace('.', ',');
        document.body.setAttribute('rating', Frating);
      }
      console.log('Scrolling to the bottom of page.');
      if (document.querySelector('.footer__bar')) {
        document.querySelector('.footer__bar').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }
    });

    try {
      await context.waitForSelector('#flixmediaInsert', { timeout: 10000 });
    } catch (err) {
      console.log('Enhanced content did not load');
    }

    await context.extract(productDetails, { transform });
  },
};
