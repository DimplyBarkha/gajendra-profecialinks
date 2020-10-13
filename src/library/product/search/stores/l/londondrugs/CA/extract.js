const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const timeout = parameters.timeout ? parameters.timeout : 10000;
  const searchTerm = await context.evaluate(() => {
    return window.location.pathname;
  });
  if (searchTerm === '/dyson/') {
    await context.click('#learnMoreBTN');
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    await delay(5000);
    await context.waitForFunction(() => {
      return document.querySelector('.ld-sg-button.ld-sg-button--secondary.ld-sg-button--secondary-flex.js-load-more__btn.load-more__btn.hide');
    }, { timeout });
  }
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'londondrugs',
    transform,
    timeout: 70000,
    domain: 'londondrugs.com',
    zipcode: '',
  },
  implementation,
};
