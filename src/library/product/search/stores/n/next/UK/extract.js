const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve) => setTimeout(resolve, 2000));
  await context.evaluate(async function () {
    // remove popups
    if (document.querySelector('div[class="lightbox_background"]') !== null) {
      document.querySelector('div[class="countrySelector"]').remove();
      document.querySelector('div[class="lightbox_background"]').remove();
    };
    if (document.querySelector('div[class~="CookieConsent"]') !== null) {
      document.querySelector('div[class="CookieConsentCross"]').click();
    }
  });

  await context.evaluate(async function () {
    // scroll the page
    while (true) {
      window.scrollTo({ top: (document.body.scrollHeight) - 1500, behavior: 'smooth' });
      await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      const elements = document.querySelectorAll('article[class="Item Fashion  "]').length;
      const productsAmount = parseInt(document.querySelector('div[id="total-results-count"]').innerText.replace(' Products', ''));
      if (elements >= 150 || elements === productsAmount) {
        break;
      }
    }
  });
  var data = await context.extract(productDetails, { transform });
  for (let i = 0; i < data[0].group.length; i++) {
    if ('thumbnail' in data[0].group[i]) {
      if (data[0].group[i].thumbnail[0].text.includes('greyPlaceholder') && data[0].group[i].id) {
        data[0].group[i].thumbnail[0].text = data[0].group[i].thumbnail[0].text.replace('greyPlaceholder', data[0].group[i].id[0].text);
      }
    }
    if (data[0].group[i].aggregateRating2) {
      const rating = data[0].group[i].aggregateRating2[0].text;
      data[0].group[i].aggregateRating2[0].text = rating[0] + '.' + rating[1];
    }
  }
  return data;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'next',
    transform: transform,
    domain: 'next.co.uk',
    zipcode: '',
  },
  implementation,
};
