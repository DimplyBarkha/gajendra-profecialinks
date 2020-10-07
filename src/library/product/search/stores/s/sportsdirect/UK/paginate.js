module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    "country": "UK",
    "store": "sportsdirect",
    "nextLinkSelector": 'a.NextLink',
    "loadedSelector": 'ul.s-productscontainer2>li',
    "noResultsXPath": null,
    "domain": "sportsdirect.com",
    "zipcode": "",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const {
      keywords,
      page,
      offset
    } = inputs;
    const {
      nextLinkSelector,
      loadedSelector,
      noResultsXPath,
      mutationSelector,
      spinnerSelector,
      openSearchDefinition
    } = parameters;

    if (nextLinkSelector) {
      const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
      if (!hasNextLink) {
        return false;
      }
    }

    const {
      pager
    } = dependencies;
    const success = await pager({
      keywords,
      nextLinkSelector,
      loadedSelector,
      mutationSelector,
      spinnerSelector
    });
    if (success) {

      if (loadedSelector) {
        await context.waitForFunction(function (sel, xp) {
          return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 20000 }, loadedSelector, noResultsXPath);
      }

      async function getRatingUrlPerPage(context) {
        const composedUrl = await context.evaluate(function () {
          let url = '';
          let productsLi = document.querySelectorAll('ul.s-productscontainer2>li');
          let prodIdString = ''
          if (productsLi.length > 0) {
            for (var i = 0; i < productsLi.length; i++) {
              let lowerLimit = productsLi[i].getAttribute('li-productid');
              let upperLimit = productsLi[i].getAttribute('li-seq');
              lowerLimit = lowerLimit.substring(0, 6)
              prodIdString += `${lowerLimit}-${upperLimit},`
            }
    
          }
          prodIdString = prodIdString.substring(0, prodIdString.lastIndexOf(','));
          // console.log(prodIdString)
          url = `https://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caiGlgNZJbkmq4vv9Aasd5JdLBg2YKJzgwEEhL0sLkQUw&stats=Reviews&filter=ContentLocale:en_GB,en*&filter=ProductId:${prodIdString}`
          return url
        });
        console.log('composedUrl' + composedUrl);
    
        return composedUrl;
      }
    
      async function getRatingAPIResponse(ratingUrl) {
        const response = await context.evaluate(async function (ratingUrl) {
          let ratingResponse = [];
          const response = await fetch(ratingUrl, {
            headers: {
              accept: '*/*',
              'accept-language': 'en-US,en;q=0.9',
              'sec-fetch-dest': 'script',
              'sec-fetch-mode': 'no-cors',
              'sec-fetch-site': 'cross-site',
            },
            body: null,
            method: 'GET',
            mode: 'cors',
          });
    
          if (response && response.status === 400) {
            throw new Error('Error when calling API');
          }
    
          if (response && response.status === 404) {
            console.log('Product Not Found!!!!');
          }
    
          if (response && response.status === 200) {
            console.log('Ratings Found!!!!');
            const data = await response.json();
            console.log('da is')
            console.log(data);
            ratingResponse.push(data.Results);
            console.log(ratingResponse);
          }
          return ratingResponse;
        }, ratingUrl)
        return response;
      }
    
      const composeRatingUrlPerPage = await getRatingUrlPerPage(context);
      await getRatingAPIResponse(composeRatingUrlPerPage);
      return true;
    }
    return false

  }

};