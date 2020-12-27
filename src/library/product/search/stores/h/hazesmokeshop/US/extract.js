async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const brandlist = 'ul.wc-brand-list-layered-nav-product_brand';
  await context.waitForSelector('ul.wc-brand-list-layered-nav-product_brand');
  // await context.waitForXPath('//a[text()="Juul"]').click;
  await context.click('li > a[text()="Juul"]');
  // await context.evaluate(async () => {
    
  //   if(document.getElementById("ul.wc-brand-list-layered-nav-product_brand")){
  //     console.log("Product List");
  //   }
  //   // await new Promise(r => setTimeout(r, 1000));

  // })
  return await context.extract(productDetails);
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'hazesmokeshop',
    transform: null,
    domain: 'hazesmokeshop.ca',
    zipcode: '',
  },
  // implementation,
};
