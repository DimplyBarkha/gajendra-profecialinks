
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'drakes',
    transform,
    domain: 'drakes.com.au',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails }) => {
    await context.evaluate(async () => {
      const searchUrl = window.location.href;
      document.body.setAttribute('search_url', searchUrl);

      const allProducts = document.querySelectorAll('div.TalkerGrid__Item');
      for (let i = 0; i < allProducts.length; i++) {
        const prodElem = allProducts[i];
        const prodUrl = prodElem.querySelector('div.talker__imagery a')
          ? prodElem.querySelector('div.talker__imagery a').href
          : '';
        let id = prodUrl.match(/.+\/(.+)/) ? prodUrl.match(/.+\/(.+)/)[1] : '';
        if (id.length > 60) {
          const idArr = id.split('-');
          id = idArr.map((item) => item.substr(0, 1).toUpperCase()).join('');
        }
        prodElem.setAttribute('added_id', id);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
