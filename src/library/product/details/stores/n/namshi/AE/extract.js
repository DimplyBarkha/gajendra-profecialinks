const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'namshi',
    transform,
    domain: 'namshi.com',
    zipcode: "''",
  }, implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function() {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const firstSize = document.querySelector('ul#product_size li label.available') && document.querySelector('ul#product_size li label.available').textContent ? document.querySelector('ul#product_size li label.available').textContent : "";
      //getting color from scriptTag. changes are made as per the requirement - 19314
      let color = "";
      let colorNode = document.evaluate(`//table[@class="product_attributes"]//th[contains(.,'Color')]/following-sibling::th`, document).iterateNext();
      if(colorNode && colorNode.textContent) {
        color = colorNode.textContent.trim();
      }
      //variant_information
      let variant_information = "";
      if(color) {
        variant_information = color;
      }
      if(firstSize) {
        variant_information =  `${variant_information} ${firstSize}`;
      }
      addHiddenDiv('variant_information', variant_information);
      let name = document.querySelector('h1.product__name') ? document.querySelector('h1.product__name').textContent : "";
      addHiddenDiv('name_extended', `${name} ${variant_information}`); 
    });
    return await context.extract(productDetails, { transform: transformParam });
  }
};
