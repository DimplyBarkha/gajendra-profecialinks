const getStockFunc = async function ({ context, sellerId, id }) {
  async function validInventory (stockNum) {
    await context.setInputValue('input[title="Cantidad"]', (stockNum - 1).toString());
    await context.waitForSelector('span#mas-qty');
    await context.evaluate(async function () {
      document.querySelector('span#mas-qty').click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    const cartErrorMessage = await context.evaluate(async function () {
      return !!document.querySelector('p.item-msg.error');
    });

    if (cartErrorMessage) {
      return false;
    }
    return true;
  }
  async function binSearch (low, high) {
    const mid = Math.floor(((low + high) / 2));

    if (mid < 0) {
      return false;
    }

    console.log('mid ', mid);

    const testMid = await validInventory(mid);

    if (testMid) {
      const testPrevMid = await validInventory(mid - 1);
      const testAfterMid = await validInventory(mid + 1);
      if (testPrevMid && testAfterMid === false) {
        return mid;
      }

      if (testAfterMid) {
        return await binSearch(mid + 1, high);
      }
    }

    return await binSearch(low, mid - 1);
  }

  await context.setInputValue('input#qty', '1');
  await context.click('button[title="Añadir"]');
  await new Promise((resolve, reject) => setTimeout(resolve, 7000));
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
  await context.evaluate(async (lastSearch) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    console.log('testing this!!!');
    addHiddenDiv('ii_productStock', lastSearch);
    addHiddenDiv('ii_name', document.querySelector('h2.product-name a').textContent);
    addHiddenDiv('ii_productPrice', document.querySelector('td.product-cart-total span span').textContent);
  }, lastSearch);
  console.log('lastSearch ', lastSearch);
};
module.exports = { getStockFunc };
