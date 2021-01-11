async function implementation (inputs, parameters, context, dependencies) {
  const { createUrl, variants } = dependencies;
  await context.evaluate(function () {
    function addHiddenDiv (id, variantId, url) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.setAttribute('variantId', variantId);
      newDiv.setAttribute('href', url);
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    const variants = document.querySelectorAll('ul[class*="prdct__bullets"] li, div[class*="prdct__colors"] li');
    if (variants.length > 1) {
      variants.forEach(e => {
        const link = e.querySelector('a');
        if (link !== null) {
          const href = link.getAttribute('href');
          addHiddenDiv('variant', href.match(/s(\d+)/)[1], 'https://www.nocibe.fr'.concat(href));
        } else {
          const activeVariant = document.querySelector('link[rel="canonical"]')
            ? document.querySelector('link[rel="canonical"]').getAttribute('href') : '';
          addHiddenDiv('variant', activeVariant.match(/s(\d+)/)[1], activeVariant);
        }
      });
    }
  }, createUrl);
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    transform: null,
    domain: 'nocibe.fr',
    zipcode: '',
  },
  implementation,
};
