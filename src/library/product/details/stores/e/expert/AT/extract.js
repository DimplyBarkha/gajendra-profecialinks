const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    transform: transform,
    domain: 'expert.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let content = null;
    let image = null;

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(async function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    const apiManufCall = await context.evaluate(async function () {
      return document.querySelector('iframe#loadbeeTabContent') ? document.querySelector('iframe#loadbeeTabContent').getAttribute('src') : null;
    });

    if (apiManufCall) {
      await context.goto(apiManufCall);
      // The code snippet below will be executed in the website's scope.
      await context.evaluate(async function () {
        console.log('hiiii');
        console.log(document.querySelector('h1.next-chapter'));
      });
      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(async function () {
        const images = document.querySelectorAll('body img');
        const imagesSrc = [];
        [...images].forEach((element) => {
          imagesSrc.push(element.getAttribute('src'));
        });
        return imagesSrc.join(' || ');
      });
      image = images;
      await context.goto(link);
      addHiddenInfo('ii_manufContent', content);
      addHiddenInfo('ii_manufImg', image);
    }

    const urlLink = await context.evaluate(async function () {
      return window.location.href;
    });

    addHiddenInfo('iio_product_url', urlLink);
    const ratingReviews = await context.evaluate(async function () {
      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }

      const productObj = getEleByXpath('//script[contains(@type, "application/ld+json") and contains(text(), "Product")]');
      return JSON.parse(productObj);
    });

    console.log('ratingReviews');
    console.log(ratingReviews);

    addHiddenInfo('iio_rating', ratingReviews && ratingReviews.aggregateRating && ratingReviews.aggregateRating.ratingValue ? ratingReviews.aggregateRating.ratingValue : '');
    addHiddenInfo('iio_rating_count', ratingReviews && ratingReviews.aggregateRating && ratingReviews.aggregateRating.reviewCount ? ratingReviews.aggregateRating.reviewCount : '');

    return await context.extract(productDetails, { transform: transformParam });
  },
};
