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
    if (document.querySelector('div[id="noresult"]')) {
      return true;
    } else {
      return false;
    }
  });
  if (noResults) return url;
  const prodUrl = await context.evaluate(() => {
    return document.querySelector('div[id="boxes"] div.browsingitem a.name') ? document.querySelector('div[id="boxes"] div.browsingitem a.name').getAttribute('href').replace(/(.+)/g, 'https://www.alza.cz$1') : false;
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
    domain: 'alza.cz',
    prefix: null,
    url: 'https://www.alza.cz/search.htm?exps={id}',
    country: 'CZ',
    store: 'alza',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation,
};
