const { transform } = require('./transform');

/*
*  @param { { url?: string,  id?: string} } inputs
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
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, dependencies) => {
    async function getVariants () {
      const variants = await context.evaluate(function () {
        const variantList = [];
        const node = document.querySelector("script[id='item']");
        if (node && node.textContent) {
          const jsonObj = node.textContent.startsWith('{"item":') ? JSON.parse(node.textContent) : null;
          if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox) {
            const elements = jsonObj.item.product.buyBox.products;
            if (elements && elements.length > 0) {
              console.log(elements.length);
              for (let i = 0; i < elements.length; i++) {
                const id = elements[i].usItemId;
                if (id) {
                  variantList.push(id);
                }
              }
            }
          }
        }
        return variantList;
      });
      return variants;
    };
    async function addMarketingContent () {
      await context.evaluate(function () {
        const node = document.querySelector("script[id='item']");
        if (node && node.textContent) {
          const jsonObj = node.textContent.startsWith('{"item":') ? JSON.parse(node.textContent) : null;
          if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox && jsonObj.item.product.buyBox.products &&
              jsonObj.item.product.buyBox.products[0]) {
            const content = jsonObj.item.product.buyBox.products[0];
            if (content.idmlSections && content.idmlSections.marketingContent) {
              const newDiv = document.createElement('div');
              newDiv.id = 'added-marketing';
              newDiv.innerHTML = unescape(jsonObj.item.product.buyBox.products[0].idmlSections.marketingContent);
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }
            if (content.shippingOptions && content.shippingOptions[0] && content.shippingOptions[0].fulfillmentPrice) {
              let price = '0';
              if (content.freeShippingThresholdPrice && content.freeShippingThresholdPrice.price) {
                price = '0';
              } else {
                price = content.shippingOptions[0].fulfillmentPrice.price;
              }
              const newDiv = document.createElement('div');
              newDiv.id = 'added-sprice';
              newDiv.textContent = price;
              newDiv.style.display = 'none';
              document.body.appendChild(newDiv);
            }
          }
        }
      });
    };

    async function addUrl () {
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
      let url = window.location.href;
      const splits = url ? url.split('?')[0].split('/') : [];
      url = (splits.length > 1) ? splits[splits.length - 2] : '';
      addHiddenDiv('added-sku', url);
      const sellerUrl = 'https://www.walmart.com/product/id/sellers';
      const sUrl = sellerUrl.replace('id', url);
      console.log(sUrl);
      const result = await getSellerInformation(sUrl);
      const sellerDiv = addHiddenDiv('added-sellers', '');
      sellerDiv.innerHTML = result;
    };

    const allVariants = await getVariants();
    await addMarketingContent();
    // await context.evaluate(scrollForIframe);
    // await context.evaluate(collectEnhancedContent, [], 'iframe[id="iframe-AboutThisItem-marketingContent"]');
    await context.evaluate(addUrl);
    await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
    console.log(allVariants);
    // start at 1 to skip the first variant which is this page
    const cnt = (allVariants && allVariants.length < 21) ? allVariants.length : 21;
    for (let i = 1; i < cnt; i++) {
      try {
        const id = allVariants[i];
        const url = await dependencies.createUrl({ id });
        await dependencies.goto({ url });
        // await context.evaluate(scrollForIframe);
        // await context.evaluate(collectEnhancedContent, [], 'iframe[id="iframe-AboutThisItem-marketingContent"]');
        await addMarketingContent();
        await context.evaluate(addUrl);
        await context.extract(dependencies.productDetails, { transform: transformParam, type: 'APPEND' });
      } catch (exception) {
        console.log(exception);
      }
    }
  },
};
