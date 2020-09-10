module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    transform: null,
    domain: 'elkjop.no',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { productDetails } = dependencies;
    await context.evaluate(async function () {
      const accCookie = document.querySelector('button.coi-banner__accept');
      if (accCookie) {
        accCookie.click();
      }
      const resCount = document.querySelector('.count').innerText;
      const resVisible = 12;
      var iter = Math.ceil(resCount/resVisible);
      var i;
      for (i=0; i<iter; i++) {
        window.scrollTo(0,document.querySelector('#searchProductsInfo').scrollHeight);
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      }
    });
    return await context.extract(productDetails);
  },
};
