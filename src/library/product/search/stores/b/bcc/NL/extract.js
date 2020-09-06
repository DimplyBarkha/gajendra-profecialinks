const { transform } = require("../format")

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'bcc',
    transform,
    domain: 'bcc.nl',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    const RegularSite = await context.evaluate(async function () {

      await new Promise((resolve, reject) => setTimeout(resolve, 7000));
      
      const coockieAcceptBtn = document.evaluate('//div[@id="cookiewallmodal"]//button[contains(@class, "cookiewall__accept-btn")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      
      if (coockieAcceptBtn != null) {
        // @ts-ignore
        coockieAcceptBtn.click();
      }

      function addHiddenDiv(id, content, originalDiv) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        originalDiv.appendChild(newDiv);
      }

      let rank = ((window.location.href).indexOf('index=')) ? Number((window.location.href).replace(/.*index=(.*)/, '$1')) : 0;
      if (!rank) {
        rank = 1;
      } else {
        rank = rank + 1;
      }
      const nodes = document.querySelectorAll(".productlist .lister-product");

      for(var i=0; i<nodes.length;i++){
        let queryParams = new URLSearchParams(window.location.search);
        const page = Math.ceil(rank/18);
        if (page > 1) {
          const val = 18*(page-1);
          queryParams.set("index", val.toString());
        } else {
          const val = 0;
          queryParams.set("index", val.toString());
        }
        const searchUrl = `https://www.bcc.nl/search?${queryParams.toString()}`;
        
        addHiddenDiv('ii-search-url', searchUrl, nodes[i]);
        addHiddenDiv('ii-item-rank', rank, nodes[i]);
        rank++;
      }

      // const node = document.querySelector("body");
      // addHiddenDiv('ii-search-url', window.location.href, node);
    });
    return await context.extract(productDetails, { transform });
  }
};
