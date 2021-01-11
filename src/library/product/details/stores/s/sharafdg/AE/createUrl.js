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
    if (document.querySelector('div.no-results-container')) {
      return false;
    } else {
      return true;
    }
  });

  if (noResults) return url;
  const prodUrl = await context.evaluate(() => {
    return document.querySelector('div.search-results div.product-items div.carousel-details a') ? document.querySelector('div.search-results div.product-items div.carousel-details a').href : false;
  });
  if (prodUrl) {
    await goto({ url: prodUrl });
  } else {
    return url;
  }
  return (await context.evaluate(id)) || url;
}

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'sharafdg.com',
    prefix: null,
    url: 'https://uae.sharafdg.com/?q={id}&post_type=product',
    country: 'AE',
    store: 'sharafdg',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation,
};
