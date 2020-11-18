
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'pistor',
    transform: null,
    domain: 'pistorone.ch',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {

    await new Promise((resolve) => setTimeout(resolve, 3000));

    await context.evaluate(async function () {
      function addElementToDocument (id, value, key) {
        const catElement = document.createElement('div');
        catElement.id = id;
        catElement.innerText = value;
        catElement.setAttribute('content', key);
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      const urlElem = document.querySelector('meta[property="og:url"]')
      addElementToDocument('url', '', urlElem.getAttribute('content'))

      const availabilityElem = document.querySelector('div.available_from_info.prod_order_info')
      if (availabilityElem==null) {
        const stockElem = document.createElement('div');
        stockElem.setAttribute('class', 'available_from_info prod_order_info')
        stockElem.innerText = "In Stock";
        stockElem.style.display = 'none';
        document.getElementById("prod_info").appendChild(stockElem);
      }

      const nameElem = document.querySelector('meta[property="og:description"]')
      const prodName = nameElem ? (nameElem.getAttribute('content') ? (nameElem.getAttribute('content').match(/<br \/>(.+)/) ? nameElem.getAttribute('content').match(/<br \/>(.+)/)[1] : nameElem.getAttribute('content')) : null) : null
      addElementToDocument('product_name', '', prodName)


    });

    return await context.extract(productDetails, { transform });
    },
};
