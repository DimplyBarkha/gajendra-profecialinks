
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop_ch_de',
    transform: null,
    domain: 'nettoshop.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      function allElement(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="c-product-gallery ember-view"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      // const addAlternateImages = getAllXpath("//div[@class='c-product-gallery__item' and parent::div[not(contains(@class,'active'))]]/div/picture/img/@data-src", 'nodeValue');
      const addAlternateImages = getAllXpath("//div[@class='c-product-gallery__item']/div/picture/img/@data-src", 'nodeValue');
      for (let i = 1; i < addAlternateImages.length; i++) {
        allElement('addAlternateImages', addAlternateImages[i], 0);
      }
      try {
        // @ts-ignore
        var brand = window.utag_data;
        allElement('brand', brand._cbrand[0], 0);
        allElement('quantity', brand.product_attributes_quantity[0], 0);
      } catch (error) {

      }
      // space Pipe Concatenation
      const spaceSeparatorSingle = (id, data) => {
        var singleSeparatorText = data.join(' ');
        allElement(id, singleSeparatorText, 0);
      };
      try {
        // @ts-ignore
        document.querySelector('a[class="ivy-tabs-tab ember-view"]').click();
      } catch (error) {

      }
      try {
        const weight = getAllXpath("//tr[@class='c-product-specifications__tr']/th[contains(text(),'Gewicht (netto)')]/parent::tr/td/span/text()", 'nodeValue');
        spaceSeparatorSingle('weight', weight);
      } catch (error) {
      }
      try {
        const color = getAllXpath("//tr[@class='c-product-specifications__tr']/th[contains(text(),'Farbe')]/parent::tr/td/span/text()", 'nodeValue');
        spaceSeparatorSingle('color', color);
      } catch (error) {
      }
      try {
        const description = getAllXpath("//meta[@property='og:description']/@content", 'nodeValue');
        allElement('description', description[0], 0);
      } catch (error) {
      }
      try {
        var finalSpecifications = [];
        const Height = getAllXpath("//tr[@class='c-product-specifications__tr']/th[contains(text(),'Höhe')]/parent::tr/td/span/text()", 'nodeValue');
        const HeightCombined = 'Höhe: ' + Height.join(' ');
        if (Height.length > 0) { finalSpecifications.push(HeightCombined) };
        const Width = getAllXpath("//tr[@class='c-product-specifications__tr']/th[contains(text(),'Breite')]/parent::tr/td/span/text()", 'nodeValue');
        const WidthCombined = 'Breite: ' + Width.join(' ');
        if (Width.length > 0) { finalSpecifications.push(WidthCombined) };
        const Length = getAllXpath("//tr[@class='c-product-specifications__tr']/th[contains(text(),'Länge')]/parent::tr/td/span/text()", 'nodeValue');
        const LengthCombined = 'Länge: ' + Length.join(' ');
        if (Length.length > 0) { finalSpecifications.push(LengthCombined) };
        const Depth = getAllXpath("//tr[@class='c-product-specifications__tr']/th[contains(text(),'Tiefe')]/parent::tr/td/span/text()", 'nodeValue');
        const DepthCombined = 'Tiefe: ' + Depth.join(' ');
        if (Depth.length > 0) { finalSpecifications.push(DepthCombined) };
        allElement('specifications', finalSpecifications.join(', '), 0);
        const guarantee = getAllXpath("//tr[@class='c-product-specifications__tr']/th[contains(text(),'Garantie')]/parent::tr/td/span/text()", 'nodeValue');
        allElement('guarantee', guarantee.join(' '), 0);
      } catch (error) {

      }
      try {
        // @ts-ignore
        var scriptGTIN = document.querySelector('script[type="application/ld+json"]').innerText;
        scriptGTIN = JSON.parse(scriptGTIN);
        allElement('GTIN', scriptGTIN.gtin12, 0);
        allElement('SKU', scriptGTIN.sku, 0);
        allElement('ratingCount', scriptGTIN.aggregateRating.reviewCount, 0);
        allElement('aggregateRating', scriptGTIN.aggregateRating.ratingValue, 0);
      } catch (error) {

      }
      try {
        // @ts-ignore
        const mpc = document.querySelectorAll('span[class="c-product-detail-infos__manufacturer-code"]')[0].innerText;
        allElement('mpc', mpc.split(' ')[1], 0);
      } catch (error) {

      }
      try {
        const variantCount = document.querySelectorAll('ul>li[class="c-product-detail__color-variant-item"]');
        allElement('variantCount', variantCount.length, 0);
      } catch (error) {

      }
      try {
        // @ts-ignore
        document.evaluate("//span[@data-component='c-youtube-embed']/parent::a", document.body, null, 9, null).singleNodeValue.click();
        const video = getAllXpath("//div[@class='c-youtube-embed ember-view']/iframe/@src", 'nodeValue');
        allElement('video', video, 0);
      } catch (error) {

      }
      try {
        const name = getAllXpath("//title/text()", 'nodeValue');
        allElement('name', name, 0);
        
      } catch (error) {
        
      }
    });
    return await context.extract(productDetails, { transform });
  },
};