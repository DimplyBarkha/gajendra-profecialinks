const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'voila',
    transform,
    domain: 'voila.ca',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;
    await context.evaluate(async () => {
      const ids1 = [];
      let scrollTop = 0;
      while (scrollTop !== 40000) {
        const products = document.evaluate('//a[contains(@class,"base__ImageWrapper")]/img', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        console.log('Length: ' + productsCount);
        await stall(1000);
        let array = document.querySelectorAll('div[class*="base__Wrapper"]');
        array.forEach((element) => {
          if (element.getAttribute('data-test') != null) {
            ids1.push(element.getAttribute('data-test'));
          }
        })
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 40000 || productsCount > 160) {
          await stall(5000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const ids = [...new Set(ids1)];
      const actualidArray = [];
      ids.forEach((element) => {
        let id = element.replace(/(fop-wrapper:)(.+)/g, "$2");
        actualidArray.push(id);
      })
      const requiredArray = actualidArray.slice(0, 150);
      let idAfterJoin = requiredArray.join(',');
      const apilink = `https://voila.ca/api/v4/products/decorate?productIds=${idAfterJoin}`;
      const productData = await fetch(apilink);
      const jsonData = await productData.json();
      const nameArray = []
      const imageArray = []
      const productUrlArray = []
      const idArray = []
      const brandArray = []
      const priceArray = []
      jsonData.forEach((element) => {
        imageArray.push(element.image && element.image.src);
        nameArray.push(element.image && element.image.description);
        brandArray.push(element.brand);
        idArray.push(element.retailerProductId);
        priceArray.push(element.price && element.price.current && element.price.current.amount)
      })
      idArray.forEach((element) => {
        productUrlArray.push(`https://voila.ca/products/${element}/details`)
      })
      productUrlArray.forEach((element, index) => {
        const newElement = document.createElement('div');
        newElement.className = "productinfo";
        newElement.setAttribute('image', imageArray[index]);
        newElement.setAttribute('name', nameArray[index]);
        newElement.setAttribute('url', productUrlArray[index]);
        newElement.setAttribute('id', idArray[index]);
        newElement.setAttribute('price', priceArray[index]);
        newElement.setAttribute('brand', brandArray[index]);
        document.body.append(newElement)
      })
    })
    return await context.extract(productDetails, { transform });
  }
};
