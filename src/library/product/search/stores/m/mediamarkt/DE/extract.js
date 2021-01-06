const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function autoScroll () {
    await context.evaluate(async function () {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
  await autoScroll();
  const addRating = async function (cotnext) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll(
        '.ProductFlexBox__StyledListItem-sc-1xuegr7-0.cBIIIT .ProductRating__StyledWrapper-q99jve-0.bkeRRU[aria-label]',
      );
      productList.forEach((product) => {
        const ratingText = product.getAttribute('aria-label');
        const regexFloat = /(\d)(\.)(\d)/;
        const regexInteger = /(\d)(?= von)/;
        const ratingFloat = ratingText.match(regexFloat);
        const ratingInteger = ratingText.match(regexInteger);
        if (ratingFloat) {
          const rating = ratingFloat[0].replace('.', ',');
          product.setAttribute('ratingFormatted', rating);
        } else {
          product.setAttribute('ratingFormatted', ratingInteger[0]);
        }
      });
    });
  };
  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll(
        '.ProductFlexBox__StyledListItem-sc-1xuegr7-0.cBIIIT',
      );
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);
  await addRating(context);
  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.de',
    zipcode: '',
  },
  implementation,
};
