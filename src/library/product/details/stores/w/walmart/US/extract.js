const { transform } = require('./transform');

/*
*  @param { { url?: string,  id?: string, parentInput?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'walmart',
    transform: transform,
    domain: 'walmart.com',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, dependencies) => {
    async function addAdditionalContent () {
      await context.evaluate(async function (parentInput) {
        async function getSellerInformation (url) {
          try {
            var data = await
            fetch(url)
              .then(response => response.text())
              .catch();
            return (data);
          } catch (error) {
            console.log(error);
            throw (error);
          }
        }
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
          return newDiv;
        }
        addHiddenDiv('added-parentInput', parentInput);
        const node = document.querySelector("script[id='item']");
        if (node && node.textContent) {
          const jsonObj = node.textContent.startsWith('{"item":') ? JSON.parse(node.textContent) : null;
          if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox && jsonObj.item.product.buyBox.products &&
              jsonObj.item.product.buyBox.products[0]) {
            const content = jsonObj.item.product.buyBox.products[0];
            if (content.idmlSections && content.idmlSections.marketingContent) {
              const marketingDiv = addHiddenDiv('added-marketing', '');
              marketingDiv.innerHTML = unescape(jsonObj.item.product.buyBox.products[0].idmlSections.marketingContent);
            }
            if (content.shippingOptions && content.shippingOptions[0] && content.shippingOptions[0].fulfillmentPrice) {
              let price = '0';
              if (content.freeShippingThresholdPrice && content.freeShippingThresholdPrice.price) {
                price = '0';
              } else {
                price = content.shippingOptions[0].fulfillmentPrice.price;
              }
              addHiddenDiv('added-sprice', price);
            }
          }
        }
        const url = window.location.href;
        const splits = url ? url.split('?')[0].split('/') : [];
        const id = (splits.length > 1) ? splits[splits.length - 2] : '';
        addHiddenDiv('added-sku', id);
        const sellerUrl = `https://www.walmart.com/product/${id}/sellers`;
        const result = await getSellerInformation(sellerUrl);
        const sellerDiv = addHiddenDiv('added-sellers', '');
        sellerDiv.innerHTML = result;
      }, parentInput);
    };

    await addAdditionalContent();
    await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
  },
};
