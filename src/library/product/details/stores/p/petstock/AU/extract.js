
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
      const variantSteps = document.querySelectorAll('div.product-select.clearfix li div.fancy-radios')
      const itemRows = document.querySelector('div.items-rows items')
      const optionElement = document.createElement('div')
      if (itemRows == null) {
        optionElement.setAttribute('class', 'items-rows items')
        optionSelect.appendChild(optionElement)
      }

      let variantButtons
      if (variantSteps.length < 2) {
        variantButtons = (document.querySelectorAll('div.product-select.clearfix label input').length != 0) ? document.querySelectorAll('div.product-select.clearfix label input') : document.querySelectorAll('div.item.option-qty')
      }
      else  {
        variantButtons  = document.querySelectorAll('div.product-select.clearfix li div.fancy-radios')[0].querySelectorAll('label input')
      }
      const priceArr = []
      const stockArr = []
      const skuArr = []
      const colorArr = []
      for (let i = 0; i < variantButtons.length; i++) {
        //@ts-ignore
        variantButtons[i].click()
        if (variantSteps.length < 2) {
          const itemElem = document.createElement('div')
          itemElem.setAttribute('class', 'item')
          optionElement.appendChild(itemElem)
          const itemValue = document.createElement('div')
          itemValue.setAttribute('class', 'item-value')
          itemValue.textContent = variantButtons[i].parentElement.getAttribute('title')
          itemElem.appendChild(itemValue)
          priceArr[i] = document.querySelector('div.quantity-select.quantity-solo.items div.item-total').innerHTML
          stockArr[i] = document.querySelector('div.quantity-select.quantity-solo.items span.out-of-stock') ? document.querySelector('div.quantity-select.quantity-solo.items span.out-of-stock').innerHTML : 'In Stock'
          skuArr[i] = document.querySelector('div.item-qty input').getAttribute('value')
          if (variantButtons[i].className.endsWith('colour-swatch')){
            colorArr[i] = document.querySelectorAll('div.product-select.clearfix li div.fancy-radios.colour-swatches label')[i].getAttribute('title')
          }
        }
        else {
          const secondaryVariantButtons = document.querySelectorAll('div.product-select.clearfix li div.fancy-radios')[1].querySelectorAll('label input')
          for (let j = 0; j < secondaryVariantButtons.length; j++) {
            //@ts-ignore
            secondaryVariantButtons[j].click()
            const itemElem = document.createElement('div')
            itemElem.setAttribute('class', 'item')
            optionElement.appendChild(itemElem)
            const itemValue = document.createElement('div')
            itemValue.setAttribute('class', 'item-value')
            itemValue.textContent = variantButtons[i].parentElement.getAttribute('title').concat(' ', secondaryVariantButtons[j].parentElement.getAttribute('title'))
            itemElem.appendChild(itemValue)
            let arrayNum = i+j+((secondaryVariantButtons.length-1)*i)
            priceArr[arrayNum] = document.querySelector('div.quantity-select.quantity-solo.items div.item-total').innerHTML
            stockArr[arrayNum] = document.querySelector('div.quantity-select.quantity-solo.items span.out-of-stock') ? document.querySelector('div.quantity-select.quantity-solo.items span.out-of-stock').innerHTML : 'In Stock'
            skuArr[arrayNum] = document.querySelector('div.item-qty input').getAttribute('value')
            if (secondaryVariantButtons[0].className.endsWith('colour-swatch')){
              colorArr[arrayNum] = document.querySelectorAll('div.product-select.clearfix li div.fancy-radios.colour-swatches label')[j].getAttribute('title')
            }
          }
        }
      };

      const options = document.querySelectorAll('div.items-rows.items div.item')
      for(let i=0; i<options.length; i++)
      {
        const optionElement = options[i]
        const itemTotal = document.createElement('div')
        itemTotal.setAttribute('class', 'item-total')
        itemTotal.textContent = priceArr[i]
        optionElement.appendChild(itemTotal)
        const itemStock = document.createElement('span')
        itemStock.setAttribute('class', 'out-of-stock')
        itemStock.textContent = stockArr[i]
        optionElement.appendChild(itemStock)
        const itemSKU = document.createElement('div')
        itemSKU.setAttribute('class', 'sku')
        itemSKU.textContent = (skuArr.length > 0) ? skuArr[i] : options[i].parentElement.getAttribute('data-sku')
        optionElement.appendChild(itemSKU)
        const itemColor = document.createElement('div')
        itemColor.setAttribute('class', 'color')
        itemColor.textContent = colorArr[i]
        optionElement.appendChild(itemColor)
      }

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
      const variants = document.querySelectorAll('div.items-rows.items div.item-value')
      variants.forEach(element => {
        //@ts-ignore
        const variant = element.innerText
        element.setAttribute('nameExtended', name.concat(' ', variant))    
      });

      const sizeVariants = document.querySelectorAll('div.items-rows.items div.item')
      variants.forEach(element => {
        //@ts-ignore
        const size = element.innerText.match(/(^.+)/) ? element.innerText.match(/(^.+)/)[1] : element
        element.setAttribute('nameExtended', name.concat(' ', size))
      });

      const reviews = document.querySelector('span[itemprop="reviewCount"]')
      if (reviews == null) {
        const reviewSpot = document.querySelector('div.review-summary')
        const review = document.createElement('span')
        review.setAttribute('itemprop', 'reviewCount')
        review.textContent = '0'
        reviewSpot.appendChild(review)
      }

      const variantNames = document.querySelectorAll('h3.product-select-header.kilo.sc')
      variantNames.forEach(element => {
        //@ts-ignore
        const variantName = element.innerText.match(/Select a (.+)/) ? element.innerText.match(/Select a (.+)/)[1] : null
        if (variantName != null) {
          element.setAttribute('variantName', variantName)
        }
      });

      const weightVariantNames = document.querySelector('div.quantity-select.items.quantity-weights')
      if (weightVariantNames != null) {
        weightVariantNames.setAttribute('variantName', 'weight')
      }

    });

    return await context.extract(productDetails, { transform });
  },
};
