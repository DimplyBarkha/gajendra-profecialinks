/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const numberPattern = /\d+/g;

  function cleanText(str) {
    return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  }

  function findField(key, value) {
    try {
      const obj = value.find(e => e.text.includes(key));
      return [{text: cleanText(obj.text.replace(key, '').replace(':', ''))}];
    } catch (e) {
      return false;
    }
  }

  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        if (gr && gr.nameExtended && gr.nameExtended.length) {
          const text = gr.nameExtended[0].text;
          let packSize = null;
          try {
            packSize = text.includes('Pack');
          } catch (e) {
            packSize = null;
          }
          if (packSize) {
            const start = text.indexOf('Pack');
            const cutText = text.slice(start, 200);
            const end = cutText.indexOf(',');
            gr['packSize'] = [{text: cutText.slice(0, end).match(numberPattern).join('')}];
          }
        }
        if (gr && gr.secondaryImageTotal && gr.secondaryImageTotal.length) gr.secondaryImageTotal = [{text: gr.secondaryImageTotal.length - 1}];
        if (gr && gr.quantity && gr.quantity.length) gr.quantity[0].text = gr.quantity[0].text.replace('Size:', '').trim();
        else gr.quantity = [];
        if (gr && gr.specifications && gr.specifications.length) gr.specifications[0].text = cleanText(gr.specifications[0].text);
        if (gr && gr.aggregateRating && gr.aggregateRating.length) {
          const end = gr.aggregateRating[0].text.indexOf(' ');
          gr.aggregateRating[0].text = +gr.aggregateRating[0].text.slice(0, end);
        }
        if (gr && gr.asin && gr.asin.length) {
          gr.asin = findField('ASIN', gr.asin);
          gr['input'] = gr.asin;
          gr['variantId'] = gr.asin;
        }
        let text;
        if (findField('Package Dimensions', gr.weightGross)) {
          text = findField('Package Dimensions', gr.weightGross)[0].text;
        } else if (findField('Product Dimensions', gr.weightGross)) {
          text = findField('Product Dimensions', gr.weightGross)[0].text;
        }
        if (text) {
          const start = text.indexOf(';');
          gr.weightGross = [{text: text.slice(start, 50).replace(';', '')}];
          gr.shippingWeight = [{text: text.slice(start, 50).replace(';', '')}];
          gr.shippingDimensions = [{text: cleanText(text.slice(0, start)).replace(';', '')}];
        } else {
          gr.weightGross = [];
          gr.shippingWeight = [];
          gr.shippingDimensions = [];
        }
        if (gr && gr.mpc && gr.mpc.length) gr.mpc = findField('Item model number', gr.mpc);
        if (gr && gr.manufacturer && gr.manufacturer.length) gr.manufacturer = findField('Manufacturer', gr.manufacturer);
        if (gr && gr.descriptionBullets && gr.descriptionBullets.length) gr.descriptionBullets[0].text = +gr.descriptionBullets[0].text;
        else gr.descriptionBullets = [];
        if (gr && gr.salesRankCategory && gr.salesRankCategory.length) {
          let rank = findField('Best Sellers Rank', gr.salesRankCategory);
          if (rank.length) {
            rank = rank[0].text;
            const categoryEnd = rank.indexOf(' in ');
            const rankEnd = rank.indexOf('(');
            gr.salesRank = [{text: rank.slice(0, categoryEnd).replace('#', '')}];
            gr.salesRank[0].text = +gr.salesRank[0].text.replace(',', '').replace('.', '');
            gr.salesRankCategory = [{text: cleanText(rank.slice(categoryEnd, rankEnd).replace('in', ''))}];
          } else {
            gr.salesRank = [];
            gr.salesRankCategory = [];
          }
          // gr.descriptionBullets[0].text = +gr.descriptionBullets[0].text;
        } else {
          gr.salesRank = [];
          gr.salesRankCategory = [];
        }
        gr['_input'] = gr.input;

        // price
        if(gr.price){
          gr.price[0].text = gr.price[0].text.replace(/SAR: /, '')
          console.log(gr.price[0].text, 'PRICE');
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = {transform};
