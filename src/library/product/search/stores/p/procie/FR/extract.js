const { transform } = require('./shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  async function addUrl () {
    await context.evaluate(() => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const url = window.location.href;
      addHiddenDiv('added-searchurl', url);
    });
  }
  async function pagination () {
    if (await checkForPagination()) {
      console.log('Pagination applicable');
      while (await checkForPagination()) {
        console.log('Pagination is running');
        await addUrl();
        await context.extract(productDetails, { transform }, { type: 'APPEND' });
        await context.click("li[class='pagination-next ng-scope'] a");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      return await context.extract(productDetails, { transform });
    } else {
      console.log('Extracting Last Page');
      await addUrl();
      return await context.extract(productDetails, { transform });
    }
  }
  async function checkForPagination () {
    return await context.evaluate(() => {
      return document.querySelector("li[class='pagination-next ng-scope'] a") ? true : false;
    });
  }
  return await pagination();
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    transform,
    domain: 'procie.fr',
    zipcode: '',
  },
  implementation,
};
