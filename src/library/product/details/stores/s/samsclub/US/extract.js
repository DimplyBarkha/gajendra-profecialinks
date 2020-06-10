
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    transform: null,
    domain: 'samsclub.com',
  },
  implementation: async ({ url }, { country, domain }, context, dependencies) => {
    await context.evaluate(() => {
      const imgAlt = document.querySelector('button[class="sc-image-viewer-img-button"] img') ? document.querySelector('button[class="sc-image-viewer-img-button"] img').alt : null;
      document.body.setAttribute('imagealt', imgAlt);
    });
    await context.extract(dependencies.productDetails);
  },
};
