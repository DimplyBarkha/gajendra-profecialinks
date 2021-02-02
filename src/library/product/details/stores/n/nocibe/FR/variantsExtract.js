
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'FR',
    store: 'nocibe',
    transform: null,
    domain: 'nocibe.fr',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { variants } = dependencies;

    await context.evaluate(function () {
      function addHiddenDiv (id, variantId, url, parentDiv = null) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.setAttribute('variantId', variantId);
        newDiv.setAttribute('href', url);
        newDiv.style.display = 'none';

        if (parentDiv) {
          parentDiv.appendChild(newDiv);
        } else {
          document.body.appendChild(newDiv);
        }
        return newDiv;
      }

      const variants = document.querySelectorAll('ul[class*="prdct__bullets"] li, div[class*="prdct__colors"] li');
      if (variants.length > 1) {
        variants.forEach(e => {
          const link = e.querySelector('a');
          if (link !== null) {
            const href = link.getAttribute('href');
            const newDiv = addHiddenDiv('variants', '');
            addHiddenDiv('variant', href.match(/s(\d+)/)[1], 'https://www.nocibe.fr'.concat(href), newDiv);
          } else {
            const activeVariant = document.querySelector('link[rel="canonical"]')
              ? document.querySelector('link[rel="canonical"]').getAttribute('href') : '';
            const newDiv = addHiddenDiv('variants', '');
            addHiddenDiv('variant', activeVariant.match(/-s(\d+)/)[1], activeVariant, newDiv);
          }
        });
      }
      if (variants.length === 0) {
        const url = document.evaluate('//link[(@rel="canonical") and not(contains(@href, "youtube"))]/@href', document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        const id = url.match(/-s(\d+)/)[1];
        const newDiv = addHiddenDiv('variants', '');
        addHiddenDiv('variant', id, url, newDiv);
      }
    });
    await context.extract(variants);
  },
};
