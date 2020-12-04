async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  if (inputs.keywords) {
    let url = 'https://www.jumbo.com/producten/?offSet={offSet}&searchTerms={searchTerms}'.replace(
      '{searchTerms}',
      encodeURIComponent(inputs.keywords),
    );

    for (let offSet = 0; offSet === 150; offSet += 25) {
      url = url.replace('{offSet}', offSet.toString);
      await context.goto(url);

      await context.evaluate(() => {
        const productUrlAll = document.querySelectorAll('.list-methods a.opposite');
        let productUrl;
        const priceArray = [];
        let price;
        const priceSelector = document.querySelectorAll('span.jum-product-price__current-price.d-inline-flex.align-items-start');
        for (let i = 0; i < priceSelector.length; i++) {
          price = priceSelector[i].textContent;

          if (productUrlAll[i].href.includes('https')) {
            productUrl = productUrlAll[i].href;
          } else {
            productUrl = 'https://www.jumbo.com' + productUrlAll[i].href;
          }

          priceArray[0] = price.match('..$');
          priceArray[1] = price.replace(priceArray[0], '');
          price = priceArray[1] + ',' + priceArray[0];

          document.querySelectorAll('.list-methods a.opposite')[i].setAttribute('productUrl', productUrl);
          document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('price', price);
          document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('rank', `${i + 1}`);
          document.querySelectorAll('div[analytics-tag="product card"]')[i].setAttribute('rankOrganic', `${i + 1}`);
        };
      });
    }
    return await context.extract(productDetails);
  } else {
    console.log('No keyword privded');
  };
};

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    url: 'https://www.jumbo.com/producten/?searchTerms={searchTerms}',
    loadedSelector: '.rw',
    noResultsXPath: '//div[@class="error-state-wrapper text-center cl ctr"]/div[@class="server-error"]',
    zipcode: '',
  },
  implementation,
};
