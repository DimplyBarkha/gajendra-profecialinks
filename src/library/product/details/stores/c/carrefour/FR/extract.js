
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
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
