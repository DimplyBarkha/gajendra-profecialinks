
module.exports = {
  implements: 'product/search/extract',
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

    
    const id = document.querySelectorAll('td.type-number.field-extartnr span') 
    id.forEach((e) => {
      const text = e.innerHTML
      e.setAttribute('productid', text)
    });

    const domain = 'https://www.pistorone.ch/'
    const urls = document.querySelectorAll('a[rel="details"]')
    urls.forEach((e) => {
      const url = domain.concat(e.getAttribute('href'))
      e.setAttribute('producturl', url)
    });

    const row = document.querySelectorAll('tr[id]')
    row.forEach((e, index) => {
      const n = (index + 1).toString()
      e.setAttribute('index', n)
    });

    });

    return await context.extract(productDetails, { transform });
    },

  };
