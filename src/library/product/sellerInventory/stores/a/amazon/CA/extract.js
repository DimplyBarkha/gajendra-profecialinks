const { transform } = require('../../../../shared');
async function getStockFunc ({ context, sellerId }) {
  await context.click('span#hlb-view-cart a');
  await context.waitForNavigation();
  await context.waitForSelector('span.quantity span span');
  await context.click('span.quantity span span');
  await context.waitForSelector('li.quantity-option:last-child a');
  await context.click('li.quantity-option:last-child a');
  await context.setInputValue('input.sc-quantity-textfield', '999');
  await context.click('span.sc-update-link a');
  await context.waitForSelector('div.sc-quantity-update-message');
  await context.evaluate(() => {
    document.body.setAttribute('quantity', document.querySelector('span.sc-number-of-items').innerText.match(/[0-9]{1,}/g)[0]);
  });
  await context.click('input[value*="Delete"]');
}

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'CA',
    store: 'amazon',
    transform,
    getStockFunc,
    domain: 'amazon.ca',
    loadedSelector: '#hlb-view-cart',
    zipcode: '',
  },
};
