module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    transform: null,
    domain: 'e-bebek.com',
    zipcode: "''",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { variants } = dependencies;

    await context.evaluate(async () => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      // @ts-ignore
      const allVariants = [...document.querySelectorAll('div.variant-selection ul li[data-code]')].map(el => {
        const variantObj = {};
        variantObj.id = el.getAttribute('data-code');
        variantObj.url = 'https://www.e-bebek.com/' + el.getAttribute('value');
        return variantObj;
      });
      if (!allVariants.length) {
        const currentVariant = {};
        currentVariant.url = window.location.href;
        currentVariant.id = document.evaluate('//td[text()="Stok Kodu"]/following-sibling::td', document, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        allVariants.push(currentVariant);
      }
      for (let i = 0; i < allVariants.length; i++) {
        addElementToDocument('product_variant_id', allVariants[i].id);
        addElementToDocument('product_variant_url', allVariants[i].url);
      }
    });
    await context.extract(variants);
  },
};
