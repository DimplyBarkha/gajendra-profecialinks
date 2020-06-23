
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'lookfantastic',
    transform: null,
    domain: 'lookfantastic.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
      function addHiddenDiv (id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll("li[class*='productListProducts_product'] a[class*='productBlock_link_price']")[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const product = document.querySelectorAll("li[class*='productListProducts_product']");
      let rank = ((window.location.href).indexOf('pageNumber=')) ? Number((window.location.href).replace(/.*pageNumber=(.*)/, '$1')) : 0;
      if (!rank) {
        rank = 1;
      } else {
        rank = (rank - 1) * 42 + 1;
      }
      for (let i = 0; i < product.length; i++) {
        const productUrl = (product[i].querySelector("a[class*='productBlock_link_price']")) ? product[i].querySelector("a[class*='productBlock_link_price']").getAttribute('href') : '';
        const id = (product[i].querySelector("div[data-component*='productBlock']")) ? product[i].querySelector("div[data-component*='productBlock']").getAttribute('rel') : '';
        // @ts-ignore
        const name = (product[i].querySelector('h3.productBlock_productName')) ? product[i].querySelector('h3.productBlock_productName').innerText : '';
        if (productUrl) {
          addHiddenDiv('ii_productUrl', 'https://www.lookfantastic.com' + productUrl, i);
        }
        if (id) {
          addHiddenDiv('ii_id', id, i);
        }
        if (name) {
          addHiddenDiv('ii_name', name, i);
        }
        addHiddenDiv('ii_rankOrganic', rank++, i);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
