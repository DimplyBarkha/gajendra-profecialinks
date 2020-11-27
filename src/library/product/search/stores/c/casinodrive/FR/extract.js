const { transform } = require('./shared');

async function implementation (
  { results },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function (results) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const totalResultsNode = document.querySelector('span[class="header-article-title"]');
    let totalResults = 0;
    if (totalResultsNode) {
      const totalResultsStr = totalResultsNode.textContent.split(':')[1].trim().split(' ')[0];
      totalResults = parseInt(totalResultsStr, 10);
    }
    let productCards = document.querySelectorAll('div[class="lazyload"] ul[class*="prodlist"] li');
    const footer = document.querySelector('div[class="footerV2"]');
    const length = (totalResults > results) ? results : totalResults;
    while (productCards.length < length) {
      footer.scrollIntoView({ behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 10000));
      productCards = document.querySelectorAll('div[class="lazyload"] ul[class*="prodlist"] li');
    }
    productCards[0].scrollIntoView({ behavior: 'smooth' });
  }, results);

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    transform,
    domain: 'casinodrive.fr',
    zipcode: '',
  },
  implementation,
};
