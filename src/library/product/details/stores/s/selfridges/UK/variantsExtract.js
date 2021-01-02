
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    transform: null,
    domain: 'selfridges.com',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { variants } = dependencies;

    // if there is no result for search term
    await context.evaluate(async () => {
      const noResultsSearchTerm = document.querySelector('body.page-no-results');
      if (noResultsSearchTerm) {
        throw new Error('No Results for this RPC');
      }
    });

    if (inputs.id) {
      try {
        // if we're on search site we should click and select first item
        var detailsPage = await context.evaluate(async () => {
          await new Promise((resolve) => setTimeout(resolve, 8000));
          const selector = document.querySelector('a.c-prod-card__images');
          if (selector) {
            var productLink = selector.getAttribute('href');
          }
          return productLink;
        });

        // check if detailsPage exists
        if (detailsPage) {
          await context.goto('https://www.selfridges.com/' + detailsPage, { waitUntil: 'networkidle0', checkBlocked: true });
          await new Promise((resolve) => setTimeout(resolve, 8000));
        }
      } catch (err) {
        console.log('Stopped at search page');
      }
    }
    await context.evaluate(() => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function findJsonObj (scriptXPath) {
        try {
          const element = document.evaluate(scriptXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let jsonStr = element.textContent;
          jsonStr = jsonStr.trim();
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log(error.message);
        }
      }
 
      const dataObj = findJsonObj('//script[@data-component="pdp-semantic-data"]');
      if (dataObj && dataObj.model) {
        dataObj.model.forEach(element => {
          addElementToDocument('added-variantId', element.sku);
        });
        
      }

    });
    /* await new Promise((resolve) => setTimeout(resolve, 8000));
    await context.evaluate(() => {
      const isColor = document.querySelector('section[data-js-variant-type="multi-colour"]');
      if (isColor) {
        const variantUrls = [];
        [...document.querySelectorAll('section[data-js-variant-type="multi-colour"] div[data-select-count-text="Colours"] span.c-select__dropdown-item')].map((ele) => variantUrls.push(ele.getAttribute('data-js-action')));
        const array = document.querySelectorAll('section[data-js-variant-type="multi-colour"] div[data-select-count-text="Colours"] span.c-select__dropdown-item');
        for (let i = 0; i < variantUrls.length; i++) {
          const currentUrl = document.querySelector('link[rel="canonical"]').getAttribute('href');
          array[i].setAttribute('variantUrl', `${currentUrl}?previewAttribute=${variantUrls[i]}`);
        }
      } else {
        const oneUrl = document.querySelector('link[rel="canonical"]').getAttribute('href');
        document.querySelector('section[data-js-component="productHero"]').setAttribute('variantUrl', oneUrl);
      }
    });
 */
    return await context.extract(variants);
  },
};
