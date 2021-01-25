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
      let allVariants = [];
      const variants = document.querySelectorAll('div.variant-selection ul li[data-code],#variant > li');
      for (let i = 0; i < variants.length; i++) {
        const variantObj = {};
        const el = variants[i];
        variantObj.id = el.getAttribute('data-code');
        variantObj.url = el.getAttribute('value').match(/^\//) ? 'https://www.e-bebek.com' + el.getAttribute('value') : 'https://www.e-bebek.com/' + el.getAttribute('value');
        if (!variantObj.id) {
          const htmlText = await fetch(variantObj.url).then(resp => resp.text());
          const addedHtml = document.createElement('html');
          addedHtml.innerHTML = htmlText;
          variantObj.id = document.evaluate('*//td[text()="Stok Kodu"]/following-sibling::td', addedHtml, null, XPathResult.STRING_TYPE, null).stringValue.trim();
        }
        allVariants.push(variantObj);
      }
      allVariants = allVariants.filter(el => el.id);
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
