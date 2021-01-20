const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.com',
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      const productUrl = window.location.href;
      document.body.setAttribute('url', productUrl);
      // @ts-ignore
      const dataObj = window.dataLayer[0].product;

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const descriptionIterator = document.evaluate('//div[@class="o-ProductDescriptions"]//div[contains(@class,"o-ProductDescriptions__general")]/section', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
      let description = descriptionIterator.iterateNext();
      let descriptionString = '';
      while (description) {
        descriptionString += `${description.innerText};`;
        description = descriptionIterator.iterateNext();
      }
      if (descriptionString) {
        addElementToDocument('pd_description', descriptionString.trim());
      }
      if (dataObj) {
        addElementToDocument('pd_category', dataObj.categoryPath ? dataObj.categoryPath : '');
        addElementToDocument('pd_price', dataObj.priceBrutto);
      }
      // @ts-ignore
      const mainDataObj = window.__PRELOADED_STATE__[0].componentInitialState.ProductVariantsInitialState;
      if (mainDataObj) {
        var allMediaObj = mainDataObj.variants.find(e => e.media).media;
        addElementToDocument('pd_mpn', mainDataObj.variants[0].manufacturerCode);
        if (allMediaObj) {
          allMediaObj.map(elm => {
            const newlink = document.createElement('a');
            newlink.setAttribute('class', 'append_image');
            newlink.setAttribute('href', elm);
            document.body.appendChild(newlink);
          });
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
