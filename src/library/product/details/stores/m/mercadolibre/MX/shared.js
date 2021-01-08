/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        // gr['_url'] = gr.url;
        // if (gr.image) {
        //   gr.image[0].text = gr.image[0].text.replace(/ 2x/g, '');
        // }
        if (gr && gr.description) {
          gr.description[0].text = gr.description[0].text.replace(/(\n \n \n \n|\n \n \n|\n \n|\r\n|\n|\r)/gm, ' ');
        }

        if (gr.alternateImages) {
          gr.alternateImages.shift();
          // gr.alternateImages = gr.alternateImages.map(item => ({
          //   text: item.text.replace(/ 2x/g, ''),
          //   xpath: item.xpath,
          // }));
        }

        if (gr && gr.brandText) {
          const mainInfo = JSON.parse(gr.brandText[0].text);
          gr.brandText = [{ text: mainInfo.brand ? mainInfo.brand.replace("'", ' ') : '' }];
          gr.sku = [{ text: mainInfo.sku }];
          gr.variantId = [{ text: mainInfo.productID }];
          gr.weightNet = [{ text: mainInfo.weight ? mainInfo.weight : '' }];
          try {
            gr.ratingCount = [{ text: mainInfo.aggregateRating.reviewCount }];
          } catch (e) {
            gr.ratingCount = [];
          }
          try {
            gr.aggregateRating = [{ text: mainInfo.aggregateRating.ratingValue }];
          } catch (e) {
            gr.aggregateRating = [{ text: 0 }];
          }
        }

        if (gr.gtin) {
          try {
            gr.gtin[0].text = gr.gtin[0].text.match(/SKU .*|SKU: .*/)[0].replace(/SKU |SKU: /, '').trim();
          } catch (e) {
            gr.gtin[0].text = '';
          }
        }
        // if (gr && gr.gtin) {
        //   const text = gr.gtin[0].text;
        //   const start = text.indexOf('SKU: ');
        //   if (start !== -1) {
        //     const t = text.substring(start + 5, text.length);
        //     try {
        //       const a = t.indexOf('\n');
        //       gr.gtin[0].text = t.substring(0, a);
        //     } catch (e) {
        //       gr.gtin[0].text = t;
        //     }
        //   } else {
        //     gr.gtin = [];
        //   }
        // }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
