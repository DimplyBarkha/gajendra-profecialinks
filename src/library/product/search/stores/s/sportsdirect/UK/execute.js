module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    "country": "UK",
    "store": "sportsdirect",
    "domain": "sportsdirect.com",
    "url": `https://www.sportsdirect.com/searchresults?DescriptionFilter={searchTerms}`,
    "loadedSelector": null,
    "noResultsXPath": null,
    "zipcode": "",
  },
  // implementation
};

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({
    url,
    zipcode: inputs.zipcode,
  });
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(5000);
          break;
        }
      }

      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, {
      timeout: 10000,
    }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  async function getRatingUrlPerPage (context) {
    const composedUrl = await context.evaluate(function () {
      let url = '';
      const productsLi = document.querySelectorAll('ul.s-productscontainer2>li');
      let prodIdString = '';
      if (productsLi.length > 0) {
        for (var i = 0; i < productsLi.length; i++) {
          let lowerLimit = productsLi[i].getAttribute('li-productid');
          const upperLimit = productsLi[i].getAttribute('li-seq');
          lowerLimit = lowerLimit.substring(0, 6);
          prodIdString += `${lowerLimit}-${upperLimit},`;
        }
      }
      prodIdString = prodIdString.substring(0, prodIdString.lastIndexOf(','));
      // console.log(prodIdString)
      url = `https://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caiGlgNZJbkmq4vv9Aasd5JdLBg2YKJzgwEEhL0sLkQUw&stats=Reviews&filter=ContentLocale:en_GB,en*&filter=ProductId:${prodIdString}`;
      return url;
    });
    console.log('composedUrl' + composedUrl);

    return composedUrl;
  }

  async function getRatingAPIResponse(ratingUrl) {
    const response = await context.evaluate(async function (ratingUrl) {
      const ratingResponse = [];
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
        console.log(data)
        ratingResponse.push(data.Results);
      }
      return ratingResponse;
    }, ratingUrl);
    return response;
  }

  const composeRatingUrlPerPage = await getRatingUrlPerPage(context);
  await getRatingAPIResponse(composeRatingUrlPerPage);

  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
}