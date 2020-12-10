async function getStockFunc ({ context }) {
  async function getStockValue () {
    const API = 'https://www.dosfarma.com/carrito';
    const token = window.static_token;
    const productId = window.product_page_product_id.value;
    const body = `token=${token}&id_product=${productId}&id_customization=0&qty=1&add=1&action=update`;
    const response = await fetch(API, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
        accept: 'application/json, text/javascript, */*; q=0.01',
      },
      body,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    });
    console.log('response', response);
    const json = await response.json();
    const stock = json.cart ? json.cart.products.find(prod => prod.id_product === productId).stock_quantity : 0;
    document.body.setAttribute('stock', stock);
    return stock;
  }
  await context.evaluate(getStockValue);
};
module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'ES',
    store: 'dosfarma',
    transform: null,
    loadedSelector: null,
    noResultsXPath: null,
    getStockFunc,
    domain: 'dosfarma.com',
    zipcode: '',
  },
};
