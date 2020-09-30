const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'nordstrom',
    transform,
    domain: 'nordstrom.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      var checkPriceRange = document.querySelector('section#product-page-price-lockup span#current-price-string') && document.querySelector('section#product-page-price-lockup span#current-price-string').textContent && document.querySelector('section#product-page-price-lockup span#current-price-string').textContent.includes('–');
      if (checkPriceRange) {
        document.querySelector('div#size-filter-product-page-anchor') && document.querySelector('div#size-filter-product-page-anchor').click();
        document.querySelector('ul#size-filter-product-page-option-list li') && document.querySelector('ul#size-filter-product-page-option-list li').click();
        document.querySelector('ul#product-page-swatches li button') && document.querySelector('ul#product-page-swatches li button').click();
      }

      const videoUrls = [];
      const dataArr = window.__INITIAL_CONFIG__.viewData;
      const videoID = dataArr.salesVideoShot ? dataArr.salesVideoShot.id : dataArr.vendorVideoShot ? dataArr.vendorVideoShot.id : '';
      if (videoID) {
        videoUrls.push(videoID);
      }

      if (videoUrls.length) {
        videoUrls.map(ele => {
          const videoUrl = 'https://fast.wistia.net/embed/iframe/' + ele;
          const element = document.createElement('a');
          element.setAttribute('class', 'appendedvideo');
          element.href = videoUrl;
          document.body.appendChild(element);
        });
      }

      const obj = dataArr.filters && dataArr.filters.color && dataArr.filters.color.byId;
      const checkObj = obj && obj[Object.keys(obj)[0]] && obj[Object.keys(obj)[0]].value;
      if (checkObj) {
        const variantID = dataArr.filters && dataArr.filters.color && dataArr.filters.color.allIds;
        variantID.map(ele => {
          const element = document.createElement('a');
          element.setAttribute('class', 'appendedvariantid');
          element.href = ele;
          document.body.appendChild(element);
        });
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
