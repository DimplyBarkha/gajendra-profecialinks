const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    transform: transform,
    domain: 'amazon.com',
    zipcode: '',
  },
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function findJsonObj (scriptSelector, startString, endString) {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
        const scriptContent = element.innerText;
        let jsonStr = scriptContent;
        jsonStr = jsonStr.trim();
        jsonStr = jsonStr.replace(/\\n/g, '\\n')
          .replace(/\\'/g, "\\'")
          .replace(/\\"/g, '\\"')
          .replace(/\\&/g, '\\&')
          .replace(/\\r/g, '\\r')
          .replace(/\\t/g, '\\t')
          .replace(/\\b/g, '\\b')
          .replace(/\\f/g, '\\f');
        // eslint-disable-next-line no-control-regex
        jsonStr = jsonStr.replace(/[\u0000-\u0019]+/g, '');
        return jsonStr;
      }
      const url = window.location.href;
      let brandUrl = document.querySelector('a#bylineInfo');
      // @ts-ignore
      brandUrl = brandUrl ? brandUrl.href : '';
      // @ts-ignore
      let currency = document.querySelector('[id="priceblock_ourprice"]');
      // @ts-ignore
      currency = currency !== null ? currency.innerText : '';
      // @ts-ignore
      currency = currency.includes('$') ? '$' : '';
      // @ts-ignore
      let manufacturerDescription = document.querySelector('#aplus');
      // @ts-ignore
      manufacturerDescription = manufacturerDescription !== null ? manufacturerDescription.innerText : ' ';
      // @ts-ignore
      let firstVariant = findJsonObj('{"pageRefreshUrlParams":{"', '{"pageRefreshUrlParams":', '}}');
      // @ts-ignore
      firstVariant = firstVariant !== null ? JSON.parse(firstVariant) : '';
      // @ts-ignore
      // eslint-disable-next-line no-unused-vars
      firstVariant = firstVariant ? firstVariant.pageRefreshUrlParams.parentAsin : '';
      // @ts-ignore
      let largeImgCount = document.querySelector('#imageBlock_feature_div > script:nth-child(2)');
      // @ts-ignore
      largeImgCount = largeImgCount !== null ? largeImgCount.innerText : '';
      // @ts-ignore
      largeImgCount = (largeImgCount.match(/_AC_SL1500_.jpg/g) || []).length;
      // @ts-ignore
      document.querySelector('div.imgTagWrapper').click();
      // @ts-ignore
      // eslint-disable-next-line promise/param-names
      await new Promise(r => setTimeout(r, 5000));
      let secondaryImageTotal = document.querySelectorAll('div.ivRow div.ivThumb div.ivThumbImage');
      // @ts-ignore
      secondaryImageTotal = secondaryImageTotal.length - 1;
      console.log('secondaryImageTotal: ', secondaryImageTotal.length - 1);
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
