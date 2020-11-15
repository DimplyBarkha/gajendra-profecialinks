const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'citilink',
    transform,
    domain: 'citilink.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      addHiddenDiv('import_availability_text', window.dataLayer[0].productAvailability);
      addHiddenDiv('import_product_weight', dataLayer[0].additions.properties.Вес);
      addHiddenDiv('import_product_warranty', dataLayer[0].additions.properties.Гарантия);
      addHiddenDiv('import_list_price', parseInt(window.dataLayer[0].productClubPrice));
    })
    return await context.extract(data, { transform });
  }
};
