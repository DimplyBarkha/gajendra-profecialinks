async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        await stall(1500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        const totalProductOnPage = document.querySelectorAll('ul[id="navlist"]>li');
        console.log('total product on the page is this number ->', totalProductOnPage.length);
        if (scrollTop > 20000 || totalProductOnPage.length >= 150) {
          console.log('here the loop is going to break');
          await stall(1500);
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
  await context.evaluate(() => {
    var searchUrl = window.location.href;
    var appendElements = document.querySelectorAll('ul[id="navlist"]>li');
    if (appendElements.length) {
      appendElements.forEach((element) => {
        element.setAttribute('searchurl', searchUrl);
      })
    }
  });
  try {
    await context.waitForSelector('div[data-bv-show="inline_rating"]', { timeout: 4000 });
    console.log(`id value loaded successfully`);
  } catch (e) {
    console.log(`id value did not load at all`);
  }
  //Api method for fetching the rating value and review count
  await context.evaluate(async () => {
    const productId = document.querySelectorAll('div[data-bv-show="inline_rating"]');

    const productCodes = [];

    productId.forEach((element) => {
      let text = element.getAttribute('data-bv-productid');
      productCodes.push(text);
    })

    const prodString = productCodes.join(',');

    const apistring = `https://api.bazaarvoice.com/data/statistics.json?apiversion=5.4&passkey=caiGlgNZJbkmq4vv9Aasd5JdLBg2YKJzgwEEhL0sLkQUw&stats=Reviews&filter=ContentLocale:en_GB,en*&filter=ProductId:${prodString}`;

    const response = await fetch(apistring);

    const responseData = await response.json();
    console.log(`this is the value for responseData ${responseData}`);

    const ratingArr = [];

    const reviewArr = [];

    const idArray = [];

    responseData.Results.forEach((element) => {
      ratingArr.push(element.ProductStatistics.ReviewStatistics.AverageOverallRating);
      reviewArr.push(element.ProductStatistics.ReviewStatistics.TotalReviewCount);
      idArray.push(element.ProductStatistics.ProductId);
    })
    console.log(`this is the value for rating${ratingArr}`);
    console.log(`this is the value for rating${reviewArr}`);
    console.log(`this is the value for rating${reviewArr}`);
    idArray.forEach((id, index) => {
      let sel = `div[data-bv-productid="${id}"]`;
      const appendElement = document.querySelector(sel);
      appendElement.setAttribute('rating', ratingArr[index]);
      appendElement.setAttribute('review', reviewArr[index]);
    })

  })
  return await context.extract(productDetails, { transform });
}
const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    transform,
    zipcode: '',
    domain: 'sportsdirect.com',
  },
  implementation,
};
