const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'Intermarche',
    transform: cleanUp,
    zipcode: '',
    domain: 'intermarche.com',
  },
  implementation: async ({ input }, { transform }, context, { productDetails }) => {
    await context.evaluate(() => {
      const Ispresent = document.querySelector('a[class="AddToCartButtonV2styled__StyledButtonDefault-kmxtys-2 kUxuMD AddToCartButtonV2styled__commonButtonStyle-kmxtys-1 ljJjzu"]');
      if (Ispresent) {
        const newDiv = document.createElement('div');
        newDiv.className = "avail";
        newDiv.setAttribute('availability', "In stock");
        const body = document.querySelector('body');
        body.append(newDiv);
      }
      const isValid = document.querySelectorAll('div[class="styled__ProductConditionnement-rc4bd7-2 kvnQKM"]').length;
      if (isValid) {
        const appendContent = document.querySelectorAll('div[class="styled__ProductConditionnement-rc4bd7-2 kvnQKM"]');
        let data = '';
        for (let i = 1; i < appendContent.length; i++) {
          data = data + " " + appendContent[i].innerText;
        }
        const brandName = document.querySelector('div[class="styled__ProductLibelle-rc4bd7-1 fARrZk"]') && document.querySelector('div[class="styled__ProductLibelle-rc4bd7-1 fARrZk"]').innerText;
        let finalName = '';
        finalName = brandName.concat(data);
        const nameDiv = document.createElement('div');
        nameDiv.className = 'productName';
        nameDiv.setAttribute("name", finalName);
        const body = document.querySelector('body');
        body.append(nameDiv);
      }
    });
    const check = await context.evaluate(() => {
      if (document.querySelector('a[class="didomi-popup-close didomi-no-link-style"]')) {
        return true;
      }
    });
    const valid = check;
    if (valid) {
      await context.click('a[class="didomi-popup-close didomi-no-link-style"]');
      if (document.querySelector('div[class="product-price--unit ProductPrice__PriceUnit-w3194n-5 eJDoAw"]')) {
        await context.waitForSelector('div[class="product-price--unit ProductPrice__PriceUnit-w3194n-5 eJDoAw"]', { waituntil: 'load' })
      }
    }
    await context.extract(productDetails, { transform })
  },
};