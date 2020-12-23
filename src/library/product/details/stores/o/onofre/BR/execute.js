async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  var url = '';
  if (inputs.id) {
    url = `https://busca.onofre.com.br/search?w=${inputs.id}`;
  } else {
    url = inputs.URL || inputs.url;
  }
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  // await context.setUseRelayProxy(false);
  await context.goto(url, {
    timeout: 100000,
    waitUntil: 'networkidle0',
    checkBlocked: true,
    js_enabled: true,
    css_enabled: false,
    random_move_mouse: true,
  });

  await context.waitForNavigation({ waitUntil: 'networkidle0' });

  return await context.evaluate(function () {
    const title = document.title;
    if (title.indexOf('404 - Página não') >= 0) {
      return false;
    } else {
      return true;
    }
  });
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'onofre',
    domain: 'onofre.com.br',
    loadedSelector: 'div.product-image-gallery',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation
};
