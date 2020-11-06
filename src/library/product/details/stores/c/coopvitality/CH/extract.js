
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    transform: null,
    domain: 'coopvitality.ch',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // @ts-ignore
      const brand = window.dlObjects[0].ecommerce.detail.products[0].brand;
      addElementToDocument('brand', brand);

      // @ts-ignore
      const category = window.dlObjects[0].ecommerce.detail.products[0].category;
      var z = category.split("/");
      var len = z.length;
      for (let i=0 ; i<len; i++){
        addElementToDocument('category', z[i]);
      }
      // addElementToDocument('category', z[1]);
      // addElementToDocument('category', z[1]);
      // addElementToDocument('category', z[1]);

      

    });
    await context.extract(productDetails);
  },
};
