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
   
    async function collectVariantInformation (variantRequests) {
      const variantUrl = 'https://www.walmart.com/terra-firma/fetch?rgs=REVIEWS_FIELD,BUY_BOX_PRODUCT_IDML';
      const sellerUrl = 'https://www.walmart.com/product/id/sellers';
      function generateRequest (baseUrl, itemID) {
        var myHeaders = new Headers();
        myHeaders.append('authority', 'www.walmart.com');
        myHeaders.append('pragma', 'no-cache');
        myHeaders.append('cache-control', 'no-cache');
        myHeaders.append('user-agent', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36');
        myHeaders.append('content-type', 'application/json');
        myHeaders.append('accept', '*/*');
        myHeaders.append('Accept-Encoding', 'gzip, deflate, br');
        myHeaders.append('origin', 'https://www.walmart.com');
        myHeaders.append('TE', 'Trailers');
        myHeaders.append('Host', 'https://www.walmart.com');
        myHeaders.append('Content-Length', '22');
        myHeaders.append('Connection', 'keep-alive');
        myHeaders.append('accept-language', 'en-US,en;q=0.9');
        var raw = JSON.stringify({ itemId: itemID });
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
        };
        var request = {};
        request.url = baseUrl;
        request.options = requestOptions;
        return request;
      }
      function getVariantRequests (baseUrl) {
        const variantRequests = [];
        const node = document.querySelector("script[id='item']");
        if (node) {
          const jsonObj = JSON.parse(node.textContent);
          if (jsonObj && jsonObj.item && jsonObj.item.product && jsonObj.item.product.buyBox && jsonObj.item.product.buyBox.products) {
            const products = jsonObj.item.product.buyBox.products;
            products.forEach(product => {
              variantRequests.push(generateRequest(baseUrl, product.usItemId));
            });
          }
        }
        return variantRequests;
      }
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

      function addVariantInformation (id, content) {
        function addHiddenDivTag (parentNode, id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.style.display = 'none';
          newDiv.textContent = content;
          parentNode.appendChild(newDiv);
          return newDiv;
        }
        function addScriptTag (parentNode, id, content) {
          const newDiv = document.createElement('script');
          newDiv.id = id;
          newDiv.textContent = content;
          parentNode.appendChild(newDiv);
          return newDiv;
        }
        if (!content) return;

        const newDiv = addHiddenDivTag(document.body, id, '');
        if (content.upc) addHiddenDivTag(newDiv, 'added-gtin', content.upc);
        if (content.productId) addHiddenDivTag(newDiv, 'added-sku', content.productId);
        if (content.walmartItemNumber) addHiddenDivTag(newDiv, 'added-asin', content.walmartItemNumber);
        if (content.usItemId) addHiddenDivTag(newDiv, 'added-variantId', content.usItemId);
        if (content.manufacturerProductId) addHiddenDivTag(newDiv, 'added-mpc', content.manufacturerProductId);
        if (content.manufactuerName) addHiddenDivTag(newDiv, 'added-mName', content.manufacturerName);
        if (content.brand) addHiddenDivTag(newDiv, 'added-brand', content.brand);
        if (content.numOfReviews) addHiddenDivTag(newDiv, 'added-ratingCount', content.numberOfReviews);
        if (content.averageRating) addHiddenDivTag(newDiv, 'added-rating', content.averageRating);
        if (content.productName) addHiddenDivTag(newDiv, 'added-name', content.productName);
        if (content.priceMap && content.priceMap.WAS) {
          addHiddenDivTag(newDiv, 'added-lprice', content.priceMap.WAS.price);
        } else if (content.priceMap && content.priceMap.LIST) {
          addHiddenDivTag(newDiv, 'added-lprice', content.priceMap.LIST.price);
        }
        if (content.priceMap && content.priceMap.CURRENT) addHiddenDivTag(newDiv, 'added-price', content.priceMap.CURRENT.price);
        if (content.shippingOptions && content.shippingOptions[0] && content.shippingOptions[0].fulfillmentPrice) {
          if (content.freeShippingThresholdPrice && content.freeShippingThresholdPrice.price) {
            addHiddenDivTag(newDiv, 'added-sprice', '0');
          } else {
            addHiddenDivTag(newDiv, 'added-sprice', content.shippingOptions[0].fulfillmentPrice.price);
          }
        } else if (content.priceMap && content.priceMap.LIST) {
          addHiddenDivTag(newDiv, 'added-lprice', content.priceMap.LIST.price);
        }
        if (content.idmlShortDescription && content.idmlLongDescription) {
          addHiddenDivTag(newDiv, 'added-desc', content.idmlShortDescription + ' ' + content.idmlLongDescription);
          addHiddenDivTag(newDiv, 'added-descBullets', content.idmlLongDescription);
        }
        addHiddenDivTag(newDiv, 'added-avail', content.availabilityStatus);
        if (content.marketingContent) {
          const tempDiv = addHiddenDivTag(newDiv, 'added-wc', '');
          tempDiv.innerHTML = content.marketingContent;
          content.marketingContent = 'Added as html';
        }
        if (content.offerCount && content.offerCount > 2 && content.usItemId) {
          let sUrl = sellerUrl.replace('id', content.usItemId);
          console.log(sUrl);
          getSellerInformation(sUrl).then(function (result) {
            // use the result here
            const sellerDiv = addHiddenDivTag(newDiv, 'added-sellers', '');
            sellerDiv.innerHTML = result;
          });
        }
        addScriptTag(newDiv, 'variant', JSON.stringify(content));
      }
      async function getAllUrls (urls) {
        try {
          var data = await Promise.all(
            urls.map(
              url =>
                fetch(url.url, url.options)
                  .then(response => response.json())
                  .catch()));
          return (data);
        } catch (error) {
          console.log(error);
          throw (error);
        }
      }
      var requests = getVariantRequests(variantUrl);
      var responses = await getAllUrls(requests);
      responses.reduce((acc, response, i) => {
        return (i === 0 ? acc : (acc + ',')) + (response && response.payload && response.payload.buyBox && response.payload.buyBox.products ? addVariantInformation('added-variant', response.payload.buyBox.products[0]) : response);
      }, '');
    }
    await context.evaluate(collectVariantInformation);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
