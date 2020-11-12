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
    var variantLength = await context.evaluate(async () => {
      return (document.querySelectorAll("select#select-sku option")) ? document.querySelectorAll("select#select-sku option").length || 1 : 1;
    });
console.log(variantLength,'-asda')
  if (variantLength > 0) {
    for (let j = 0; j < variantLength; j++) {
      if (variantLength > 1) {
      var nextSkuUrl =  await context.evaluate(async (j) => {
          const url = window.location.href;
          const currentSku = window.__NEXT_DATA__.props.initialState.Product.sku.id;
          return url.replace(currentSku,document.querySelectorAll("select#select-sku option")[j].value).replace(currentSku,document.querySelectorAll("select#select-sku option")[j].value)
        }, j); 
        await context.goto(nextSkuUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
      }
      await applyScroll(context);
      await context.evaluate(async (j) => {
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
        // var productId = window.siteMetadata.page.product?.idProduct;
        // addHiddenDiv(`document_product_id`, productId);

        function addHiddenDivWithClass(class1, content1) {
          const newDiv1 = document.createElement('div');
          newDiv1.className = class1;
          newDiv1.innerHTML = content1;
          newDiv1.style.display = 'none';
          document.body.appendChild(newDiv1);
        }

        var data = JSON.parse(document.getElementById('__NEXT_DATA__').innerHTML);
        var product = data.props.initialState.Product;
        addHiddenDiv(`document_sku`, product.sku.id);
        addHiddenDiv(`document_variant`, product.sku.name);
        addHiddenDiv(`document_ean`, product.sku.ean);
        addHiddenDiv(`document_product`, product.product.id);
        var videos = product.product.videos;
        // for(var i=0;i<videos.length;i++){
        //   if(videos[i].host == "Youtube"){
        //     //addHiddenDiv("document_video","https://www.youtube.com/embed/" + videos[i].link);
        //     }
        // }
        var url1 = "";
        videos.forEach(video => {
          if(video.host == "Youtube"){
            url1 += "<p>https://www.youtube.com/embed/" + video.link + "</p>";
          }
        });
        console.log(url1);
        addHiddenDivWithClass("document_video", url1);
      },j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
      }
  }
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

