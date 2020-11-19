
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
      const link = 'https://pistorone.ch'.concat(document.querySelector('a[rel="details"]').getAttribute('href'));

      // @ts-ignore
      document.querySelector('a[rel="details"]').click();

      await new Promise((resolve) => setTimeout(resolve, 6000));
        function addElementToDocument (id, value, key) {
          const catElement = document.createElement('div');
          catElement.id = id;
          catElement.innerText = value;
          catElement.setAttribute('content', key);
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        };

        addElementToDocument('url', '', link)

        const availabilityElem = document.querySelector('div.available_from_info.prod_order_info')
        if (availabilityElem==null) {
          const stockElem = document.createElement('div');
          stockElem.setAttribute('class', 'available_from_info prod_order_info')
          stockElem.innerText = "In Stock";
          stockElem.style.display = 'none';
          document.getElementById("prod_info").appendChild(stockElem);
        }

        const nameElem = document.querySelector('#detail_title').innerHTML
        const prodName = nameElem.match(/([^,]+)/) ? nameElem.match(/([^,]+)/)[1] : nameElem
        addElementToDocument('product_name', '', prodName)


      });
      return await context.extract(productDetails, { transform });
      },
};
