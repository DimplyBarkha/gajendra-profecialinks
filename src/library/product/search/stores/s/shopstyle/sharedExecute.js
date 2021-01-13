async function implementation (
  inputs,
  { url },
  context,
  dependencies,
) {
  const { query } = inputs;
  console.log(url);

  // uk url: https://www.shopstyle.co.uk/browse/womens-clothes
  const ukRun = url.includes('co.uk');

  const apiUrl = url.indexOf('{queryParams}') > -1 ? url.replace('{queryParams}', query) : url;

  await context.goto(apiUrl.replace(/\s/g,''), { timeout: 20000, waitUntil: 'load' });

  await context.evaluate(async (ukRun) => {
    function addDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      document.body.appendChild(newDiv);
    }
    const data = JSON.parse(document.querySelector('pre').textContent);

    if (ukRun) {
      addDiv('FilterType', data.products[0].retailer.name + ' ' + data.metadata.category.id);
    } else {
      addDiv('FilterType', data.htmlProperties.metaDescription);
    }
    data.products.forEach((product, rankIndex) => {
      const allOptions = product.stock;
      product.rank = rankIndex + 1;
      for (let i = 0; i < allOptions.length; i++) {
        if (allOptions[i].size) {
          product.mySize = allOptions[i].size.name;
        }
        if (allOptions[i].color) {
          product.myColor = allOptions[i].color.name;
        }
        addDiv('product', JSON.stringify(product));
      }
    });
    // data.products.forEach((product, rankIndex) => {
    //   const allSizes = product.sizes.map(size => size.name);
    //   product.rank = rankIndex + 1;
    //   for (let i = 0; i < allSizes.length; i++) {
    //     product.mySize = allSizes[i];
    //     addDiv('product', JSON.stringify(product));
    //   }
    // });
  }, ukRun);

  return true;
}

module.exports = {
  implementation,
};
