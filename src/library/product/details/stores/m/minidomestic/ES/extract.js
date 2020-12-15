
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'minidomestic',
    transform: null,
    domain: 'minidomestic.es',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.evaluate(async function () {
      await new Promise(resolve => setTimeout(resolve, 6000));
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };
      const specifications = document.querySelectorAll('table.UserAttributes tr');
      let productSpecs = '';
      specifications.forEach(tr => {
        if (tr.children.length > 1) {
          productSpecs += tr.children[0].innerText + ': ' + tr.children[1].innerText + '|| ';
        };
      });
      const productId = window.dataLayer.find(dl => dl.event === "detail").ecommerce.detail.products[0].productid;
      addHiddenDiv('import_product_specs', productSpecs);
      addHiddenDiv('import_product_id', productId);
    });
    return await context.extract(data, { transform });
  },
};
