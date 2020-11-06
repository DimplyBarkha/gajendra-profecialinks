async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  // const variantsNumber = await context.evaluate(() => {
  //   const variantLength = document.querySelectorAll('.variant-2-panel.active.scroll-pane>div').length;
  //   return variantLength;
  // });

  for (let i = 0; i < 2; i++) { // variantsNumber.length;
    await context.evaluate(() => {
      const categorySelector = document.querySelector('.row.breadcrumbs-section').textContent;
      const category = categorySelector.replace('Zurück zu:', '>');

      document.querySelector('.row.breadcrumbs-section').setAttribute('category', category);
    });

    await context.evaluate(() => {
      if (document.querySelector('.play-button') !== null) {
        document.querySelector('.play-button').click();
      }
    });

    const nextVariant = await context.evaluate(() => {
      return document.querySelectorAll('.variant-2-panel.active.scroll-pane>div')[i];
    });

    if (nextVariant === null) {
      return await context.extract(productDetails);
    } else {
      await context.click(document.querySelectorAll('.variant-2-panel.active.scroll-pane>div')[i]);
    }

    await context.extract(productDetails);
  }
};
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'windeln',
    transform: null,
    domain: 'windeln.de',
    zipcode: '',
  },
  implementation,
};
