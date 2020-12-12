async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const pageLoader = 'div.product-listing.row';
  const ageBtn = 'button#bouncer_modal_submit';
  
  const isSelectorAvailable = async (cssSelector) => {
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    await context.waitForSelector(pageLoader, { timeout: 5000 });

    const ageBtnAvailable = await isSelectorAvailable(ageBtn);
    if (ageBtnAvailable) {
      await context.click(ageBtn);
    }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'thevaporshoppeusa',
    transform: null,
    domain: 'thevaporshoppeusa.com',
    zipcode: "''",
  },
  implementation, 
};
