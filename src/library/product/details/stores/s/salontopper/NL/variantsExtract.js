
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    transform: null,
    domain: 'salontopper.nl',
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

      const variants = document.querySelectorAll('select.autoredirect > option');
      if (variants.length > 1) {
        variants.forEach(e => {
          const link = e.getAttribute('value');
          if (link !== null) {
            const href = 'https://www.salontopper.nl'.concat(link);
            const newDiv = addHiddenDiv('variants', '');
            addHiddenDiv('variant', href.match(/\d+$/)[0], href, newDiv);
          }
        });
      }
      if (variants.length === 0) {
        const url = document.evaluate('//link[@rel="alternate"][@hreflang="nl-nl"]/@href', document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        if (url !== '') {
          const id = url.match(/\d+$/)[0];
          const newDiv = addHiddenDiv('variants', '');
          addHiddenDiv('variant', id, url, newDiv);
        }
      }
    });
    await context.extract(variants);
  },
};
