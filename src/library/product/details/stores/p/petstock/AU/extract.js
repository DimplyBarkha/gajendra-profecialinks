
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'petstock',
    transform: null,
    domain: 'petstock.com.au',
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
      const optionSelect = document.querySelector('h3.product-select-header').parentElement
      const variantButtons = document.querySelectorAll('div.product-select.clearfix label input')
      for (let i = 0; i < variantButtons.length; i++) {
        //@ts-ignore
        variantButtons[i].click()
        const optionElement = document.createElement('div')
        optionElement.setAttribute('class', 'items-rows items')
        optionSelect.appendChild(optionElement)
        const itemValue = document.createElement('div')
        itemValue.setAttribute('class', 'item-value')
        itemValue.textContent = variantButtons[i].parentElement.getAttribute('title')
        optionElement.appendChild(itemValue)
        const itemTotal = document.createElement('div')
        itemTotal.setAttribute('class', 'item-total')
        itemTotal.textContent = document.querySelector('div.quantity-select.quantity-solo.items div.item-total').innerHTML
        optionElement.appendChild(itemTotal)
        const itemStock = document.createElement('span')
        itemStock.setAttribute('class', 'out-of-stock')
        itemStock.textContent = document.querySelector('div.quantity-select.quantity-solo.items span.out-of-stock') ? document.querySelector('div.quantity-select.quantity-solo.items span.out-of-stock').innerHTML : 'In Stock'
        optionElement.appendChild(itemStock)
      };

      const url = document.location.href
      addElementToDocument('pageUrl', '', url)

      const domain = 'https://www.petstock.com.au'
      const imageUrl = document.querySelector('div.span6.media-info-wrapper li a') ? document.querySelector('div.span6.media-info-wrapper li a').getAttribute('href') : null
      if (imageUrl != null) {
        const image = domain.concat(imageUrl)
        addElementToDocument('prodImage', '', image)
      }
      const images = document.querySelectorAll('div.span6.media-info-wrapper li a')
      images.forEach(element => {
        const imgUrl = element.getAttribute('href')
        const img = domain.concat(imgUrl)
        element.setAttribute('imgUrl', img)
      });
      //@ts-ignore
      const name = document.querySelector('h1.product-name.sc') ? document.querySelector('h1.product-name.sc').innerText : null
      const variants = document.querySelectorAll('div.product-select.clearfix div.optionSet')
      variants.forEach(element => {
        //@ts-ignore
        const variant = element.nextSibling.innerText
        element.setAttribute('nameExtended', name.concat(' ', variant))    
      });

      const sizeVariants = document.querySelectorAll('div.items-rows.items div.item')
      sizeVariants.forEach(element => {
        //@ts-ignore
        const size = element.innerText.match(/(^.+)/) ? element.innerText.match(/(^.+)/)[1] : element
        element.setAttribute('nameExtended', name.concat(' ', size))
      });

    });
    return await context.extract(productDetails, { transform });
  },
};
