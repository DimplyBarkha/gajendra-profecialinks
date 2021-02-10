
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform: null,
    domain: 'carrefour.fr',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(() => {
      if (document.querySelector("#data-plp_produits")) {
        throw new Error('ERROR: Not a product Page');
      }
    });
    
    await context.evaluate(async function () {
      // @ts-ignore
      const productData = window.ONECF_INITIAL_STATE;
      const purchasability = productData.search.data.attributes.availability.purchasable;
      const availability = purchasability ? 'In stock' : 'Out of stock';
      document.querySelector('body').setAttribute('import-purchasability', purchasability);
      document.querySelector('body').setAttribute('import-availability', availability);
      document.querySelector('body').setAttribute('import-enhanced-content', 'false');

      let imageEls = document.evaluate("//div[@class='pdp-hero'][count(*)>2]/div[@class='pdp-hero__thumbs']/a/img/@src | //div[@class='pdp-hero'][count(*)=2]/div[@id='data-produit-image']//img/@src", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

      for (let i = 0; i < imageEls.snapshotLength; i++) {
        const imageUrl = imageEls.snapshotItem(i).textContent.replace(/(\/media\/)(43x43|540x540)(\/.*.jpg)/g, "https://www.carrefour.fr$11500x1500$3");

        if (imageUrl) {
          const imgEl = document.createElement('import-image');
          imgEl.setAttribute('data', imageUrl);
          document.body.appendChild(imgEl);
        }
      }

      let ingredients = document.evaluate(`//h3[contains(., 'Ingrédients')]/../div/p`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if(ingredients) {
        let ingredientsList = ingredients.textContent.replace('Ingrédients: Ingrédients : ','').replace('Ingrédients: ','').replace('Ingrédients : ','').replace('INGREDIENTS : ','');
        document.body.setAttribute('ingredients', ingredientsList);
      }
      const query = document.evaluate(`//h3[contains(., 'Ingrédients')]/../div/p`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if(query) {
        const results = Array(query.snapshotLength).fill(0).map((element, index) => query.snapshotItem(index));
        let ingredientsList = "";
        if(results.length){
          for (const result of results){
            ingredientsList = ingredientsList + result.textContent;
          }
          document.body.setAttribute('ingredientslist', ingredientsList);
        }
      }




    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
