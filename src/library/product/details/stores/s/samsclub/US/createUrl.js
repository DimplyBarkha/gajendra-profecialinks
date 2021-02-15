async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;
  const { goto } = dependencies;
  let url;
  if (parameters.url) {
    url = parameters.url.replace('{id}', encodeURIComponent(id));
    await goto({ url });
  }
  const noResults = await context.evaluate(() => {
    if (document.querySelector('div[class*="error-page-title"]')) {
      return true;
    } else {
      return false;
    }
  });
  if (noResults) return url;
  const prodUrl = await context.evaluate(() => {
    return document.querySelector('div[class*="infinite-loader"] ul li:first-child a') ? document.querySelector('div[class*="infinite-loader"] ul li:first-child a').getAttribute('href').replace(/^(.*)/g, 'https://www.samsclub.com$1') : false;
  });
  if (prodUrl) {
    await goto({ url: prodUrl });
  } else {
    return url;
  }
  return prodUrl;
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'samsclub.com',
    url: 'https://www.samsclub.com/s/{id}',
    country: 'US',
    store: 'samsclub',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation,
};
