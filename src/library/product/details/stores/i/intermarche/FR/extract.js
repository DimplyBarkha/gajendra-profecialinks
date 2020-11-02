const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    transform,
    domain: 'intermarche.com',
    zipcode: '',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(function (parentInput) {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let prodUrl = window.location.href.split("product/")
      if (prodUrl[1]) {
        addHiddenDiv(`ii_url`, prodUrl[1]);
      }
      addHiddenDiv(`ii_parentInput`, parentInput);

    }, parentInput);
    const request = await context.searchAllRequests('https://api.intermarche.com/produits/v2/pdvs/02111/produits/*');
    console.log(`Request: ${request}`);
    if(request.responseHeaders.status == 404) {
      throw Error("No product available")
    }
    // const dataRaw = await context.evaluate(function () {
    //   fetch('https://api.intermarche.com/produits/v2/pdvs/11833/produits/0000040198125', {
    //     method: 'GET',
    //     headers: {
    //       'Accept':'application/json, text/plain, */*',
    //       'X-Red-Device':'red_fo_desktop',
    //       'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
    //       'X-Red-Version':'1',
    //       'Sec-Fetch-Site':'same-site'
    //     }
    //   })
    //   .then(response => response.json())
    //   .then(data => {
    //     if(data.url){
    //       console.log("Failed !!!!!!!!!!!!!!!!!!!!")
    //       // return context.reportBlocked(lastResponseData.code, 'CodeAction decided extractor got blocked');
    //     }else{
    //       debugger
    //       console.log('Success:', data);
    //     }
    //   })
    //   .catch((error) => {
    //       console.error('Error:', error);
    //   });
    // });


    // await new Promise(resolve => setTimeout(resolve, 10000));
    return await context.extract(productDetails, { transform: transformParam });
  },
};

