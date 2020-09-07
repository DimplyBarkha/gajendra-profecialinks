async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const numberPages = await context.evaluate(async function () {
    let x;
    const numberofresults = document.evaluate("//span[@class='headline--product-count']", document, null, XPathResult.NUMBER_TYPE, null).numberValue;
    const pagesList = [];
    if (numberofresults > 0) {
      const totalPages = Math.ceil(numberofresults / 12);
      for (x = 1; totalPages >= x; x++) {
        pagesList.push(window.location.href + `&p=${x}`);
      }
    }
    return pagesList;
  });
  const extract = [];
  let y;
  for (y = 0; numberPages.length - 1 >= y; y++) {
    await context.goto(numberPages[y]);
    await context.evaluate(async function () {
      let x;
      const allProducts = document.querySelectorAll('div[class="product--box box--basic"]');
      console.log(allProducts);
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
    });
    extract.push(await context.extract(productDetails));
  };
  return extract;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'sopo',
    transform: null,
    domain: 'sopo.at',
    zipcode: '',
  },
  implementation,
};
