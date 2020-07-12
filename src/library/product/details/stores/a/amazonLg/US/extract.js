const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    transform,
    domain: 'amazon.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const url = window.location.href;
      // @ts-ignore
      const brandUrl = document.querySelector('a#bylineInfo').href;
      // @ts-ignore
      let currency = document.querySelector('[id="priceblock_ourprice"]');
      // @ts-ignore
      currency = currency ? currency.innerText : '';
      // @ts-ignore
      currency = currency.includes('$') ? '$' : '';
      // @ts-ignore
      let manufacturerDescription = document.querySelector('#aplus');
      // @ts-ignore
      manufacturerDescription = manufacturerDescription ? manufacturerDescription.innerText : ' ';
      // @ts-ignore
      let firstVariant = document.querySelector('#dp-container > script:nth-child(58)');
      // @ts-ignore
      firstVariant = firstVariant ? firstVariant.innerText : '';
      // @ts-ignore
      firstVariant = firstVariant ? JSON.parse(firstVariant) : '';
      // @ts-ignore
      // eslint-disable-next-line no-unused-vars
      firstVariant = firstVariant ? firstVariant.pageRefreshUrlParams.parentAsin : '';
      // @ts-ignore
      let largeImgCount = document.querySelector('#imageBlock_feature_div > script:nth-child(2)').innerText;
      largeImgCount = (largeImgCount.match(/_AC_SL1500_.jpg/g) || []).length;
      // @ts-ignore
      document.querySelector('div.imgTagWrapper').click();
      // @ts-ignore
      // eslint-disable-next-line promise/param-names
      await new Promise(r => setTimeout(r, 5000));
      let secondaryImageTotal = document.querySelectorAll('div.ivRow div.ivThumb div.ivThumbImage');
      // @ts-ignore
      secondaryImageTotal = secondaryImageTotal.length;
      console.log('secondaryImageTotal: ', secondaryImageTotal.length);
      addElementToDocument('a_pageTimestamp', (new Date()).toISOString().replace(/[TZ]/g, ' '));
      addElementToDocument('a_url', url);
      addElementToDocument('a_brand_url', brandUrl);
      addElementToDocument('a_online_price_currency', currency);
      addElementToDocument('a_manufacturerDescription', manufacturerDescription);
      addElementToDocument('a_first_variant', firstVariant);
      addElementToDocument('a_largeImgCount', largeImgCount);
      addElementToDocument('a_secondaryImageTotal', secondaryImageTotal);
    });
    return await context.extract(productDetails, { transform });
  },
};
