const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };
    const GetTagByIdUsingRegex = (tag, id, html) => {
      return new RegExp('<' + tag + "[^>]*id[\\s]?=[\\s]?['\"]" + id + "['\"][\\s\\S]*?</" + tag + '>').exec(html);
    };
    function addElementToDocument (doc, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      doc.appendChild(catElement);
    }
    
    await fetch(window.location.href, { method: 'GET' }).then(r => r.text()).then(htm => {
      const result = GetTagByIdUsingRegex('script', 'is_script', htm);
      const outerHTML = result && result[0] ? result[0] : '';
      const JSstring = JSON.parse(outerHTML.split('window.__INITIAL_STATE__ = ')[1].split(';\n</script>')[0]);
      const widgets = JSstring.pageDataV4.page.data[10003];

      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const productSelectors = document.querySelectorAll('div._3O0U0u>div');
      for (let i = 0; i < productSelectors.length; i++) {
        addElementToDocument(productSelectors[i], 'rankOrganic', `${lastProductPosition + i}`);
        const id = document.querySelectorAll('div._3O0U0u div')[i] ? document.querySelectorAll('div._3O0U0u>div')[i].getAttribute('data-id') : '';
        const urlData = document.querySelectorAll('a._31qSD5')[i] ? document.querySelectorAll('a._31qSD5')[i].href : document.querySelectorAll('a.Zhf2z-')[i].href;
        document.querySelectorAll('div._3O0U0u>div')[i].setAttribute('producturl', `${urlData}`);
        for (let j = 1; j < widgets.length; j++) {
          stall(15000);
          if (widgets[j].widget.data.products && widgets[j].widget.data.products.length) {
            for (let k = 0; k < widgets[j].widget.data.products.length; k++) {
              const productId = widgets[j].widget.data.products[k].productInfo.value.id;
              const imageUrl = widgets[j].widget.data.products[k].productInfo.value.media.images[0].url;
              const image = imageUrl.replace(/\{@width\}|\{@height\}/g, '312').replace(/\{@quality\}/g, '70');
              if (id === productId) {
                addElementToDocument(productSelectors[i], 'image', image);
              }
            }
          }
        }
      }
      localStorage.setItem('prodCount', `${lastProductPosition + productSelectors.length}`);
    });
    stall(1500);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    transform,
    domain: 'flipkart.com',
    zipcode: '',
  },
  implementation,
};
