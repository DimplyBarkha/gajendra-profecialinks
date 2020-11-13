const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto',
    transform: cleanUp,
    domain: 'otto.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
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
      var tempData, valueVariant, valueRating;
      const rawData = document.querySelectorAll('script[type="application/ld+json"]');
      for (let i = 0; i < rawData.length; i++) {
        try {
          // @ts-ignore
          tempData = rawData[i].innerText;
          tempData = JSON.parse(tempData);
          valueRating = tempData.aggregateRating[0].ratingValue;
          valueVariant = tempData.additionalProperty[0].value;
          const newDiv = document.createElement('div');
          newDiv.id = 'rating';
          newDiv.textContent = valueRating;
          newDiv.style.display = 'none';
          const originalDiv = document.querySelectorAll("article[data-variationid=\"" + valueVariant + "\"]")[0];
          // @ts-ignore
          originalDiv.parentNode.insertBefore(newDiv, originalDiv);

        } catch (error) {
          continue;
        }
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
