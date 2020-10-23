// const { cleanUp } = require('../../../../shared');

// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   return await context.extract(productDetails, { transform });
// }

// module.exports = {
//   implements: 'product/details/extract',
//   parameterValues: {
//     country: 'US',
//     store: 'bhphotovideo',
//     transform: cleanUp,
//     domain: 'bhphotovideo.com',
//     zipcode: '',
//   },
//   implementation,
// };

const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'redzac',
    transform: cleanUp,
    domain: 'redzac.at',
    zipcode: '',
  },

  implementation: async (
    { inputString },
    { country, domain },
    context,
    { productDetails },
  ) => {
    await context.waitForSelector(
      '.aperture-body',
    );
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // adding alternateImages to the DOM
      const manIMG = document.querySelectorAll('#bh-app div.thumbnails_1DZ5zUgi10X73vS2maT1B5 img');
      let a = Array.from(manIMG);
      a = a.slice(1, a.lenght);
      a.forEach((img, i, all) => { all[i] = img.currentSrc.replace('thumbnails', 'images500x500'); });
      const alternateImages = a.join(' | ');
      if (alternateImages) addElementToDocument('alternateImages', alternateImages);

      // adding category
      let categories = document.querySelectorAll('#bh-app .breadcrumbs_2FB-m6Pe1vTC6vyPxpP0ib > *') ? [...document.querySelectorAll('#bh-app .breadcrumbs_2FB-m6Pe1vTC6vyPxpP0ib > *')] : '';
      categories = categories.map((elem) => elem.innerText);
      categories = categories.filter(elem => elem);
      const category = categories.join('>');
      if (category) addElementToDocument('category', category);

      // adding price
      let price = document.querySelector('#bh-app div.price_1DPoToKrLP8uWvruGqgtaY') ? document.querySelector('#bh-app div.price_1DPoToKrLP8uWvruGqgtaY').innerText : '';
      // const regex = /\d*\,?\d*\.?\d*/;
      if (price) {
        price = price.replace(',', '');
        // price = regex.exec(price)[0];
        addElementToDocument('price', price);
      };

      // adding listPrice
      let listPrice = document.querySelector('#bh-app del') ? document.querySelector('#bh-app del').innerText : '';
      if (listPrice) {
        const regex = /\$\d*,?\d*\.?\d*/;
        listPrice = regex.exec(listPrice)[0];
        listPrice = listPrice.replace(',', '');
        addElementToDocument('listPrice', listPrice);
      }

      // adding availabilityText
      const availabilityText = document.querySelector('.toCartBtn_2C85cCSy-imVSRqkpuNDT2') ? 'In Stock' : 'Out of Stock';
      addElementToDocument('availabilityText', availabilityText);

      // adding description
      const intro = document.querySelector('div[data-selenium="overviewLongDescription"]') ? document.querySelector('div[data-selenium="overviewLongDescription"]').innerText : '';
      const bullets = document.querySelectorAll('div.descriptionAsTitle_18Nt9BkVcYQO2jcxURBPUl') ? [...document.querySelectorAll('div.descriptionAsTitle_18Nt9BkVcYQO2jcxURBPUl')] : '';
      let description = '';
      let descriptionBullets;
      if (bullets.length >= 1) {
        const bulletsDescArr = [];
        bullets.forEach(element => {
          bulletsDescArr.push(element.innerText);
        });
        description = `${intro}||${bulletsDescArr.join('||')}`;
      } else {
        description = intro;
      }
      if (description) addElementToDocument('description', description);

      // adding descriptionBullets
      if (bullets) descriptionBullets = bullets.length;
      if (descriptionBullets) addElementToDocument('descriptionBullets', descriptionBullets);

      // adding quantity
      const clickOnSpec = async function () {
        function timeout (ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        const spec = document.querySelector('#tabs > div > div > ul > li:nth-child(2) > div > a');
        if (spec) {
          spec.click();
          await timeout(5000);
        }
      };
      await clickOnSpec();
      const quantity = document.querySelector('#bh-app tbody > tr:nth-child(2) > td.value_11Av1yGkVYn9TX48mQeu9v.xh-highlight') ? document.querySelector('#bh-app tbody > tr:nth-child(2) > td.value_11Av1yGkVYn9TX48mQeu9v.xh-highlight').innerText : 'test';
      if (quantity) {
        addElementToDocument('quantity', quantity);
      }

      // const clickOnImages = async function () {
      //   function timeout (ms) {
      //     return new Promise((resolve) => setTimeout(resolve, ms));
      //   }
      //   const nextButton = document.querySelector('div.main-image__container img');
      //   if (nextButton) {
      //     nextButton.click();
      //     await timeout(5000);
      //   }
      // };

      // if (document.querySelector('#tabs > div > div > ul > li:nth-child(2) > div > a')) {
      //   document.querySelector('#tabs > div > div > ul > li:nth-child(2) > div > a').click();
      // }
    });

    await context.extract(productDetails);
  },
};
