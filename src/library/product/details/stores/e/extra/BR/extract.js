const {transform} = require("../Format")

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 20000));
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          await stall(500);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000) {
            await stall(5000);
            break;
          }
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const url = window.location.href;
    addHiddenDiv(`document_url`, url);
    //@ts-ignore
    var productId = window.siteMetadata.page.product?.idProduct;
    addHiddenDiv(`document_product_id`, productId);

    function addHiddenDivWithClass (class1, content1) {
      const newDiv1 = document.createElement('div');
      newDiv1.className = class1;
      newDiv1.textContent = content1;
      newDiv1.style.display = 'none';
      document.body.appendChild(newDiv1);
    }

    
  
      var imgs = document.querySelectorAll("#flix-lg-inpage img")
      imgs.forEach(x=> addHiddenDivWithClass('aplusImages',x.getAttribute("srcset")));
  });
  
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'extra',
    transform,
    domain: 'extra.com.br',
    zipcode: '',
  },
  implementation,
};

