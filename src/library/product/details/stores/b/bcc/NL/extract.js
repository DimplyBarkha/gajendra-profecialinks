const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    transform,
    domain: 'bcc.nl',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    try {
      await context.waitForSelector('div#cookiewallmodal', { timeout: 20000 });
      await context.evaluate(async function () {
        const cookies = document.querySelector('button.cookiewall__accept-btn');
        if (cookies) {
          cookies.click();
        }
      });
      await context.waitForSelector('section#wfinance-terms table', { timeout: 20000 });
    } catch (error) {
      console.log('@@There was an error accepting cookies@@' + JSON.stringify(error));
    }

    await context.evaluate(async function () {
      const getBulletsPoint = document.querySelectorAll('div[data-title="Productinformatie"] ul li');
      if (getBulletsPoint.length) {
        getBulletsPoint.forEach((ele) => ele.textContent = `|| ${ele.textContent}`);
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
