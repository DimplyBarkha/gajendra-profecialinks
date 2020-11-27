async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    var response = await fetch(`https://shop.rewe.de/api/product-group?productId=${inputs.id}`);
    if (response.status !== 404) {
      var json = await response.json();
      console.log(json.group.groupList);
      for (let i = 0; i < json.group.groupList.length; i++) {
        const newDiv = document.createElement('div');
        newDiv.id = 'variants';
        newDiv.setAttribute('productId', json.group.groupList[i].productId);
        newDiv.setAttribute('productUrl', `https://shop.rewe.de${json.group.groupList[i].canonicalPath}`);
        document.querySelector('h1.pdr-QuickInfo__heading').append(newDiv);
      }
    } else {
      console.log('404');
      const newDiv = document.createElement('div');
      newDiv.id = 'variants';
      newDiv.setAttribute('productId', document.evaluate('//span[contains(@class,"articleNumber")]/text()[2]', document).iterateNext().textContent);
      newDiv.setAttribute('productUrl', document.querySelector('link[rel="canonical"]').getAttribute('href'));
      document.querySelector('h1.pdr-QuickInfo__heading').append(newDiv);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    transform: null,
    domain: 'shop.rewe.de',
    zipcode: '',
  },
  implementation,
};
