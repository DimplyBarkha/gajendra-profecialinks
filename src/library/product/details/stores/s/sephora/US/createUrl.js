
async function implementation (
  inputs,
  parameters,
  context,
  { goto },
) {
  const { id } = inputs;
  async function getProductUrl () {
    return document.body.innerText.match(/targetValue":"([^"]+)/);
  }
  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    await goto({ url });
    const productUrl = await context.evaluate(getProductUrl);
    return productUrl ? ('https://www.sephora.com/' + productUrl[1]) : `https://www.sephora.com/search?keyword=${id}`;
  }
}
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'sephora.com',
    prefix: null,
    country: 'US',
    store: 'sephora',
    url: 'https://www.sephora.com/api/catalog/search?type=keyword&q={id}&content=true&includeRegionsMap=true&page=60&currentPage=1&constructorSessionID=1&constructorClientID=22caad64-c195-4213-bfc9-ed2fe1a59996&targetSearchEngine=nlp&country_switch=us',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation,
};
