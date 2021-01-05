
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: null,
    domain: 'brack.ch',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { variants } = dependencies;

    var sameRpcProducts = [];
    var productPageVariants = [];
    var allVariants = [];

    // checking if a product has variants and writing variants data into DOM
    const addAllVariantsToDOM = async () => {
      await context.evaluate(async (variantArr) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
          return newDiv;
        }
        if (variantArr.length !== 0) {
          for (let i = 0; i < variantArr.length; i++) {
            addHiddenDiv('variantId', variantArr[i].sku);
            addHiddenDiv('variantUrl', variantArr[i].url);
          }
        }
      }, allVariants);
    };

    const addVariantsToVariantArr = async () => {
      const variantsFromOneProductPage = await context.evaluate(async () => {
        var variantsData = [];
        const variantElements = document.querySelectorAll('div.productStage__productVariants li[class*="productStage__variantItem"] > a');
        variantElements.forEach(element => {
          const variantData = {
            sku: element.getAttribute('href') ? element.getAttribute('href').match(/-([0-9]+)$/g) : null,
            url: element.getAttribute('href') ? 'https://www.brack.ch' + element.getAttribute('href') : null,
          };
          variantsData.push(variantData);
        });
        return variantsData;
      });
      productPageVariants = [...productPageVariants, ...variantsFromOneProductPage];
    };

    // checking if extractor is on a search results page
    const isOnSearchResultsPage = await context.evaluate(async () => {
      return window.location.href.includes('search?');
    });
    if (isOnSearchResultsPage) {
      sameRpcProducts = await context.evaluate(async () => {
        var productsData = [];
        const sameRpcProductElements = document.querySelectorAll('ul.productList > li.product-card');
        sameRpcProductElements.forEach(element => {
          const url = 'https://www.brack.ch' + (element.querySelector('a.product__overlayLink') ? element.querySelector('a.product__overlayLink').getAttribute('href') : '');
          const productData = {
            sku: element.getAttribute('data-sku'),
            url: url,
          };
          productsData.push(productData);
        });
        return productsData;
      });
      for (let i = 0; i < sameRpcProducts.length; i++) {
        await context.goto(sameRpcProducts[i].url);
        await addVariantsToVariantArr();
      }
    } else {
      await addVariantsToVariantArr();
    }
    allVariants = [...sameRpcProducts, ...productPageVariants];
    await addAllVariantsToDOM();

    return await context.extract(variants);
  },
};
