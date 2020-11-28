const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const mainUrl = await context.evaluate(async function () {
    return document.URL;
  });
  console.log(mainUrl, 'MainURL');
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(700);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  var results = await context.evaluate(async function () {
    const result = [];
    (document.querySelectorAll('div .produit-col a')).forEach((elem) => {
      result.push({
        url: elem.getAttribute('href'),
        id: '',
      });
    });
    return result;
  });
  console.log('Results', results);
  for (var i = 0; i < results.length; i++) {
    await context.goto(results[i].url, {
      timeout: 10000000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    const id = await context.evaluate(async function () {
      const element = document.evaluate('//p[contains(., "Référence fabricant :")]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log(element);
      if (element && element.singleNodeValue) {
        const id = element.singleNodeValue;
        return id ? id.textContent : '';
      } else {
        return '';
      }
    });
    const aggregateRating = await context.evaluate(async function () {
      const element = document.evaluate('//ul[contains(@class,"rating")]//li[contains(@class,"nb-votes")]//span[contains(@itemprop,"ratingValue")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log(element);
      if (element && element.singleNodeValue) {
        const aggregateRating = element.singleNodeValue;
        return aggregateRating ? aggregateRating.textContent : '';
      } else {
        return '';
      }
    });
    const reviewCount = await context.evaluate(async function () {
      const element = document.evaluate('//span[contains(@itemprop,"reviewCount")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      console.log(element);
      if (element && element.singleNodeValue) {
        const reviewCount = element.singleNodeValue;
        return reviewCount ? reviewCount.textContent : '';
      } else {
        return '';
      }
    });
    results[i].id = id;
    results[i].aggregateRating = aggregateRating;
    results[i].reviewCount = reviewCount;
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  };
  await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
  await applyScroll(context);
  // Product ID
  await context.evaluate(async function (results) {
    try {
      var index = 0;
      (document.querySelectorAll('div .produit-col a')).forEach((node) => {
        node.setAttribute('id', results[0][index].id);
        index++;
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }, [results]);
  // AggregateRating
  await context.evaluate(async function (results) {
    try {
      var index = 0;
      (document.querySelectorAll('div .produit-col a')).forEach((node) => {
        node.setAttribute('data-aggregate-rating', results[0][index].aggregateRating);
        index++;
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }, [results]);
  // Review Count
  await context.evaluate(async function (results) {
    try {
      var index = 0;
      (document.querySelectorAll('div .produit-col a')).forEach((node) => {
        node.setAttribute('data-rating-count', results[0][index].reviewCount);
        index++;
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }, [results]);
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'sphere-sante',
    transform: transform,
    domain: 'sphere-sante.com',
    zipcode: "''",
  },
  implementation,
};
