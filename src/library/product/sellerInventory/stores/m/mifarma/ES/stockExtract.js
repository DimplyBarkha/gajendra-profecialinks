const getStockFunc = async function ({ context, sellerId, id }) {
  async function main () {
    async function addToCart (qty) {
      const id = window.id || document.querySelector('span.product_id').textContent;
      const API = `https://www.mifarma.es/checkout/cart/add/product/${id}`;
      const options = {
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: `product=${id}&qty=${qty}&isAjax=1`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
      };
      const response = await fetch(API, options);
      const json = await response.json();
      console.log(json.message);
      return json.message;
    }

    async function parseMessage (message) {
      if (message.includes('no está disponible')) {
        return 'decrease';
      } else if (message.includes('carrito de compras')) {
        return 'stop';
      } else if (message.includes('La cantidad máxima permitida para la compra es')) {
        return message.match(/compra es\s*(\d+)/)[1].trim();
      } else if (message.includes('Este producto se encuentra fuera de existencia')) {
        return 0;
      }
    }

    async function getStockValue (qty) {
      let prev;
      do {
        const message = await addToCart(qty);
        const result = await parseMessage(message);
        if (result === 0) {
          return { message: 'stop', value: 0, prev: 0 };
        }
        if (result === 'stop') {
          return { message, value: qty, prev };
        } else if (result.match(/^\d+$/)) {
          return { message: 'max', value: result };
        }
        prev = qty;
        qty = Math.ceil(qty / 2);
      } while (prev !== qty);
      return { message: 'stop', value: 0, prev: 0 };
    }

    async function getMaxStock () {
      const MAX = 1000;
      let maxProductStock = 0;
      let maxStock = MAX;
      while (maxStock > 0) {
        const data = await getStockValue(maxStock);
        if (data.message === 'max') {
          return data.value;
        }
        maxProductStock += Number(data.value);
        maxStock = Number(data.prev - data.value);
      }
      return maxProductStock;
    }
    return await getMaxStock();
  }
  const stock = await context.evaluate(main);
  await context.evaluate((stock) => document.body.setAttribute('stock', stock), stock);
};
module.exports = { getStockFunc };
