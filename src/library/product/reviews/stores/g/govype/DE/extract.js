async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  await context.evaluate(async () => {
    try {
      if (document.querySelector('button#onetrust-accept-btn-handler')) {
        document.querySelector('button#onetrust-accept-btn-handler').click();
      }
      if (document.querySelector('button#btn-entry-age-allow')) {
        document.querySelector('button#btn-entry-age-allow').click();
      }
    }
    catch (e) {
      console.log('button not found');
    }
   /* const shadowDiv = Array.from(document.getElementsByClassName('onetrust-pc-dark-filter'));
    if (shadowDiv[0]) {
      shadowDiv[0].style.display = 'none';
      shadowDiv[0].style.removeProperty('z-index');
    } */
  });
  return await context.extract(productReviews, { transform });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'DE',
    store: 'govype',
    transform: null,
    domain: 'govype.com',
    zipcode: "''",
  },
  implementation,
};
