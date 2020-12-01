const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'apteka',
    transform: transform,
    domain: 'apteka.ru',
    zipcode: '',
  },
  implementation: async (inputs, { transform }, context, { productDetails: data }) => {
    await context.click('.TownSelector button.icon-close')
      .catch(() => { });
    await context.evaluate(async function () {
      const addHiddenDiv = (id, content) => {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      };
      const productVariants = document.evaluate('//p[@class = "ProductVariant__item"]//span', document, null, XPathResult.ANY_TYPE);
      const productDesc = document.evaluate('//div[@class = "ProdDescList"]//div', document, null, XPathResult.ANY_TYPE);
      const productImages = document.evaluate('//div[@class = "productImage__preview"]//img/@src', document, null, XPathResult.ANY_TYPE);
      const productCategory = document.evaluate('//nav[contains(@class, "ProductPage__crumbs")]//li[position() > 1 and position() < last()]', document, null, XPathResult.ANY_TYPE);
      const productPrice = document.evaluate('(//div[contains(@class, "ProductPage__price")])[2]', document, null, XPathResult.STRING_TYPE).stringValue;
      const productListPrice = document.evaluate('//div[contains(@class, "ProductPage__old-price")]', document, null, XPathResult.STRING_TYPE).stringValue;
      const productIngredients = document.evaluate('//div[@class = "ProdDescList"]//h3[contains(text(), "Состав")]//following-sibling::dl//div', document, null, XPathResult.ANY_TYPE);
      const productDirections = document.evaluate('//div[@class = "ProdDescList"]//h3[contains(text(), "Лекарственная форма")]//following-sibling::dl//div', document, null, XPathResult.ANY_TYPE);
      const productWarnings = document.evaluate('//span[@class = "warn"]', document, null, XPathResult.ANY_TYPE);
      let variants = '', description = '', data, category = '', subCategory = '', ingredients = '', directions = '', images = '', warnings = '';
      while (data = productVariants.iterateNext()) {
        if (variants === '') {
          variants += data.innerText;
        } else {
          variants += ' | ' + data.innerText;
        }
      }
      while (data = productImages.iterateNext()) {
        if (images === '') {
          images += data.nodeValue.replace("preview", "original");
        } else {
          images += ' | ' + data.nodeValue.replace("preview", "original");
        }
      }
      while (data = productIngredients.iterateNext()) {
        if (data.innerText !== '') {
          if (ingredients === '') {
            ingredients += data.innerText;
          } else {
            ingredients += ' | ' + data.innerText;
          }
        }
      }
      while (data = productDirections.iterateNext()) {
        if (data.innerText !== '') {
          if (directions === '') {
            directions += data.innerText;
          } else {
            directions += ' | ' + data.innerText;
          }
        }
      }
      while (data = productWarnings.iterateNext()) {
        if (data.innerText !== '') {
          if (warnings === '') {
            warnings += data.innerText;
          } else {
            warnings += ' | ' + data.innerText;
          }
        }
      }
      while (data = productDesc.iterateNext()) {
        if (data.innerText !== '') {
          if (description === '') {
            description += data.innerText;
          } else {
            description += ' | ' + data.innerText;
          }
        }
      }
      while (data = productCategory.iterateNext()) {
        if (category === '') {
          category = data.innerText;
        } else {
          if (subCategory === '') {
            subCategory += data.innerText;
          } else {
            subCategory += ' > ' + data.innerText;
          }
        }
      }
      addHiddenDiv('import_product_id', location.href.split('/').filter(item => item !== '').splice(-1)[0].split('-').splice(-1)[0]);
      addHiddenDiv('import_product_variants', variants);
      addHiddenDiv('import_product_images', images);
      addHiddenDiv('import_product_desc', description);
      addHiddenDiv('import_product_category', category);
      addHiddenDiv('import_product_subcat', subCategory);
      addHiddenDiv('import_product_price', productPrice);
      addHiddenDiv('import_product_ingredients', ingredients);
      addHiddenDiv('import_product_directions', directions);
      addHiddenDiv('import_product_listprice', productListPrice);
      addHiddenDiv('import_product_warnings', warnings);
      addHiddenDiv('import_product_url', location.href);
    });
    return await context.extract(data, { transform });
  },
};
