const getStockFunc = async function ({ context, sellerId, id }) {
<<<<<<< HEAD
  async function validInventory (stockNum) {
    /*
    const ans =  await context.evaluate(async function (stockNum) {
      var formdata = new FormData();

      let formKey = document.querySelector('input[name^="form_key"]');
      formKey = formKey ? formKey.value : '';

      let product = document.querySelector('button[id^="rm-producto-"]');
      let productNum = product ? product.id : '';
      productNum = productNum.includes('rm-producto-') ? productNum.split('rm-producto-')[1] : '';

      formdata.append('form_key', formKey);
      formdata.append(`cart[${productNum}][qty]`, stockNum.toString());
      formdata.append('isAjax', '1');

      var requestOptions = {
        method: 'POST',
        headers: {
        // 'anti-csrftoken-a2z': csrf,
        'content-type': 'application/x-www-form-urlencoded',
        contenttype: 'application/x-www-form-urlencoded;charset=utf-8',
        'x-requested-with': 'XMLHttpRequest',
      },
        body: formdata,
        redirect: 'follow',
      };

      const otherSellersHtml = await fetch('https://www.mifarma.es/checkout/cart/updatePost/?___SID=U', requestOptions)
        .then(response => response.text())
        .then(result => result)
        .catch(error => console.log('error', error));

      console.log('otherSellersHtml')
      console.log(otherSellersHtml)
      return otherSellersHtml;
    }, stockNum);
    console.log('ans')
    // console.log(ans)
    console.log(ans.includes('disponible'))
    if (ans.includes('disponible')) {
      return false;
    }
    return true;
    */
    await context.waitForSelector('input[title="Cantidad"]');
    await context.setInputValue('input[title="Cantidad"]', (stockNum).toString());
    // await context.waitForSelector('span#mas-qty');
    // await context.evaluate(async function () {
    //   document.querySelector('span#mas-qty').click();
    // });
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    const cartErrorMessage = await context.evaluate(async function () {
      return !!document.querySelector('p.item-msg.error');
    });

    const inputValue = await context.evaluate(async function () {
      return document.querySelector('input[title="Cantidad"]') ? Number(document.querySelector('input[title="Cantidad"]').value) : null;
    });

    if (cartErrorMessage) {
      return false;
    }

    if (inputValue !== stockNum) {
      return false;
    }
    return true;
  }
  async function binSearch (low, high) {
    const mid = Math.floor(((low + high) / 2));

    if (mid <= 0) {
      return false;
=======
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
>>>>>>> 7cf691a3286754e82e63870b2a28ef462a36fbc3
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
<<<<<<< HEAD

  await context.setInputValue('input#qty', '1');
  await context.click('button[title="Añadir"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 7000));
  await context.waitForSelector('span.count');
  await context.waitForFunction(function (sel) {
    return Number(document.querySelector(sel).textContent > 0);
  }, { timeout: 45000 }, 'span.count');
  await context.waitForSelector('div#msg-anadircarrito');

  const cartMessage = await context.evaluate(async function () {
    return document.querySelector('div#msg-anadircarrito').textContent;
  });

  if (cartMessage.includes('no está disponible')) {
    console.log('No product');
  } else if (cartMessage.includes('fue agregado al carrito')) {
    console.log('Product here!');
    const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
    const mainUrl = 'https://www.mifarma.es/checkout/cart';
    await context.goto(mainUrl, { timeout, waitUntil, checkBlocked });
  }

  const { timeout = 60000, waitUntil = 'load', checkBlocked = true } = {};
  const mainUrl = 'https://www.mifarma.es/checkout/cart';
  await context.goto(mainUrl, { timeout, waitUntil, checkBlocked });
  const lastSearch = await binSearch(1, 1000);
  console.log('lastSearch ', lastSearch);
  const name = await context.evaluate(async function () {
    return document.querySelector('h2.product-name a').textContent;
  });
  const productPrice = await context.evaluate(async function () {
    return document.querySelector('td.product-cart-total span span').textContent;
  });
  await context.click('button#empty_cart_button');
  await context.waitForSelector('div.page-title h1');
  await context.evaluate(async (lastSearch, name, productPrice) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    console.log('testing this!!!');
    addHiddenDiv('ii_productStock', lastSearch);
    addHiddenDiv('ii_name', name);
    addHiddenDiv('ii_productPrice', productPrice);
  }, lastSearch, name, productPrice);
=======
  const stock = await context.evaluate(main);
  await context.evaluate((stock) => document.body.setAttribute('stock', stock), stock);
>>>>>>> 7cf691a3286754e82e63870b2a28ef462a36fbc3
};
module.exports = { getStockFunc };
