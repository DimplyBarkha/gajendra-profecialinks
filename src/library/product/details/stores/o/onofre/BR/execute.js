async function implementation (
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
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.innerHTML = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    try {
      const avl = window.dataLayerStage[0].ecommerce.detail.products[0].availability;
      let availability = '';
      if (avl) {
        if (avl === 'Sim') {
          availability = 'In Stock';
        } else if (avl === 'Não') {
          availability = 'Out of stock';
        }
        addHiddenDiv('custom-availability', availability);
      }
    } catch (e) { }
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
  implementation,
};
