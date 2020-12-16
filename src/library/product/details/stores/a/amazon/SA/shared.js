/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const numberPattern = /\d+/g;

  function cleanText (str) {
    return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  }
  function findField (key, value) {
    try {
      const obj = value.find(e => e.text.includes(key));
      return [{ text: cleanText(obj.text.replace(key, '').replace(':', '')) }];
    } catch (e) {
      return '';
    }
  }
  data.forEach(el => {
    el.group.forEach((gr, index) => {
      try {
        if (gr && gr.quantity && gr.quantity.length) gr.quantity[0].text = gr.quantity[0].text.match(numberPattern).join('');
        if (gr && gr.specifications && gr.specifications.length) gr.specifications[0].text = cleanText(gr.specifications[0].text);
        if (gr && gr.aggregateRating && gr.aggregateRating.length) {
          const end = gr.aggregateRating[0].text.indexOf(' ');
          gr.aggregateRating[0].text = gr.aggregateRating[0].text.slice(0, end);
        }
        if (gr && gr.asin && gr.asin.length) {
          gr.asin = findField('ASIN', gr.asin);
          gr['_input'] = gr.asin;
          gr['variantId'] = gr.asin;
        }
        const text = findField('Product Dimensions', gr.weightGross) ? findField('Product Dimensions', gr.weightGross)[0].text : findField('Package Dimensions', gr.weightGross)[0].text;
        if (text.length) {
          const start = text.indexOf(';');
          gr.weightGross = [{ text: text.slice(start, 50).replace(';', '') }];
          gr.shippingWeight = [{ text: text.slice(start, 50).replace(';', '') }];
          gr.shippingDimensions = [{ text: cleanText(text.slice(0, start)).replace(';', '') }];
        }
        if (gr && gr.mpc && gr.mpc.length) gr.mpc = findField('Item model number', gr.mpc);
        if (gr && gr.salesRankCategory && gr.salesRankCategory.length) {
          const rank = findField('Best Sellers Rank', gr.salesRankCategory)[0].text;
          const categoryEnd = rank.indexOf(' in ');
          const rankEnd = rank.indexOf('(');
          gr.salesRank = [{ text: rank.slice(0, categoryEnd).replace('#', '') }];
          gr.salesRankCategory = [{ text: cleanText(rank.slice(categoryEnd, rankEnd).replace('in', '')) }];
        }
      } catch (e) {
        console.log(e);
      }
    });
  });
  return data;
};
module.exports = { transform };
