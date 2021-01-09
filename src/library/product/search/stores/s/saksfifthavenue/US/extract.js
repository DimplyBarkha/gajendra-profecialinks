const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    const accCookie = document.querySelector('button.ao-cb__button.ao-cb__button--accept');
    if (accCookie) {
      // @ts-ignore
      accCookie.click();
    }
  });
  await context.evaluate(async function () {
    const promoClose = document.querySelector('button.promotionModalClose.icon-close.c-modal-close.u-pos--absolute.ico.ico-close.ico-lg');
    if (promoClose) {
      // @ts-ignore
      promoClose.click();
    }
  });

  try {
    await context.waitForSelector('div.welcome-modal-body', { timeout: 25000 });
  } catch (error) {
    console.log('No pop up');
  }
  await context.evaluate(async function () {
    const popup = document.querySelector('.consent-tracking-close');
    if (popup) {
      // @ts-ignore
      popup.click();
    }
  });

  async function scrollToRec(node) {
    await context.evaluate(async (node) => {
      const element = document.querySelector(node) || null;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 5000);
        });
      }
    }, node);
  }
  async function paginationNext () {
    return await context.evaluate(async () => {
      return !!document.querySelector('p.page-item.next');
    });
  }

  let pageNextExists = await paginationNext();
  console.log('pageNextExists!@');
  console.log(pageNextExists);
  while (pageNextExists === false) {
    await scrollToRec('footer.footer-content');
    await new Promise((resolve) => {
      setTimeout(resolve, 5000);
    });
    console.log('pageNextExists!2');
    console.log(pageNextExists);
    pageNextExists = await paginationNext();
  }
  console.log('totalll!@');
  async function prod () {
    return await context.evaluate(async () => {
      return document.querySelectorAll('div.product-grid div.col-6').length
      ;
    });
  }
  console.log(await prod());
  

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'saksfifthavenue',
    transform,
    domain: 'saksfifthavenue.com',
    zipcode: '',
  },
  implementation,
};
