const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'belk',
    transform: cleanUp,
    domain: 'belk.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDom (element, id) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      }

      function replaceAt (string, index, replacement, endIndex) {
        return string.substr(0, index) + replacement + string.substr(endIndex);
      }

      const listPrice = document.querySelector('.product-price .standardprice')
        ? document.querySelector('.product-price .standardprice').childNodes[0].nodeValue
        : document.querySelector('.product-price .price-standard')
          ? document.querySelector('.product-price .price-standard').innerText
          : '';
      addElementToDom(listPrice, 'listPrice');

      const price = document.querySelector('.product-price .price-sales') ? document.querySelector('.product-price .price-sales').firstChild.nodeValue : listPrice;
      addElementToDom(price, 'price');

      const availabilityText = document.querySelector(".product-price link[itemprop='availability'")
        ? document.querySelector(".product-price link[itemprop='availability'").getAttribute('href').toLowerCase().includes('instock')
          ? 'In Stock'
          : 'Out of Stock'
        : '';
      addElementToDom(availabilityText, 'availabilityText');

      let ratingCount = document.querySelector("div[data-bv-show='rating_summary'] meta[itemprop='reviewCount'")
        ? document.querySelector("div[data-bv-show='rating_summary'] meta[itemprop='reviewCount'").getAttribute('content')
        : '';
      ratingCount = ratingCount === '0' ? '' : ratingCount;
      addElementToDom(ratingCount, 'ratingCount');

      const specifications = document.querySelector('.tabs .tab .tab-1 ul') ? document.querySelectorAll('.tabs .tab .tab-1 ul') : [];
      let specificationItems = '';
      let warrantyText = '';
      let count = 0;
      specifications.forEach((spec) => {
        const list = spec.querySelectorAll('li');
        list.forEach((elem) => {
          const text = elem.innerText;
          if (text.toLowerCase().includes('length') || text.toLowerCase().includes('width') || text.toLowerCase().includes('height')) {
            if (count <= 2) {
              if (count === 0) {
                specificationItems += text.toLowerCase().replace(/(length)?(width)?(height)?(:)?/g, '');
              } else {
                specificationItems += 'x' + text.toLowerCase().replace(/(length)?(width)?(height)?(:)?/g, '');
              }
              count++;
            }
          }
          if (text.toLowerCase().includes('warranty')) {
            warrantyText = text;
          }
        });
      });
      let additionalDescBulletInfo = '';
      specifications.forEach((ul) => {
        additionalDescBulletInfo += '\n' + ul.innerText;
      });
      additionalDescBulletInfo = additionalDescBulletInfo.replace(/\n/g, '||');
      const headers = document.querySelector('.tabs .tab .tab-1 h3') ? document.querySelectorAll('.tabs .tab .tab-1 h3') : [];
      let material = '';
      const indexDetails = 0;
      let ageSuitability = '';
      headers.forEach((header, i) => {
        if (header.innerText.toLowerCase().includes('material')) {
          material = document.querySelector(`.tabs .tab .tab-1 ul:nth-of-type(${i + 1})`)
            ? document.querySelector(`.tabs .tab .tab-1 ul:nth-of-type(${i + 1}) li:nth-of-type(1)`).innerText
            : '';
        }
        if (header.innerText.toLowerCase().includes('specifications')) {
          if (specificationItems === '') {
            specificationItems = document.querySelector(`.tabs .tab .tab-1 ul:nth-of-type(${i + 1})`)
              ? document.querySelector(`.tabs .tab .tab-1 ul:nth-of-type(${i + 1})`).innerText
              : '';
          }
        }
        if (header.innerText.toLowerCase().includes('details')) {
          const detailsList = document.querySelector(`.tabs .tab .tab-1 ul:nth-of-type(${indexDetails + 1})`)
            ? document.querySelectorAll(`.tabs .tab .tab-1 ul:nth-of-type(${indexDetails + 1}) li`)
            : [];
          detailsList.forEach((li) => {
            if (li.innerText.toLowerCase().includes('age')) ageSuitability = li.innerText;
          });
        }
      });
      addElementToDom(material, 'material');
      addElementToDom(warrantyText, 'warrantyText');
      addElementToDom(additionalDescBulletInfo, 'additionalDescBulletInfo');
      addElementToDom(specificationItems, 'specificationItems');
      addElementToDom(ageSuitability, 'ageSuitability');

      const variants = document.querySelector('.product-variations ul li.color ul li[data-colorvalue]')
        ? document.querySelectorAll('.product-variations ul li.color ul li[data-colorvalue]')
        : [];
      let variantsText = '';
      variants.forEach((variant, i) => {
        if (i === 0) {
          variantsText += variant.getAttribute('data-colorvalue');
        } else {
          variantsText += ' | ' + variant.getAttribute('data-colorvalue');
        }
      });
      addElementToDom(variantsText, 'variantsText');

      const gtin = document.querySelector('.product-UPC-container .product-UPC')
        ? document.querySelector('.product-UPC-container .product-UPC').innerText.replace('UPC: ', '')
        : '';
      addElementToDom(gtin, 'gtin');

      let description = document.querySelector('.tabs .tab .tab-content .copyline-tab') ? document.querySelector('.tabs .tab .tab-content .copyline-tab').innerText : '';
      const bulletsArr = document.querySelector('.tabs .tab .tab-content .copyline-tab ul')
        ? Array.from(document.querySelectorAll('.tabs .tab .tab-content .copyline-tab ul'))
        : [];
      if (description) {
        if (bulletsArr) {
          bulletsArr.forEach((ul) => {
            let ulText = ul.innerText;
            const startIndex = description.indexOf(ulText);
            const endIndex = startIndex + ulText.length;
            ulText = '||' + ulText.replace(/\n/g, '||');
            description = replaceAt(description, startIndex, ulText, endIndex);
          });
        }
      }
      addElementToDom(description, 'formattedDescription');
    });
    await context.extract(productDetails);
  },
};
