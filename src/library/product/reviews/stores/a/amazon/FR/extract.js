const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  for (const { group } of data) {
    for (const row of group) {
      if (row.sku) {
        let sku_code = row.sku[0].text;
        sku_code = sku_code.split('/');
        row.sku[0].text = sku_code[sku_code.length - 1];
      }
      if (row.rating) {
        let rating = row.rating[0].text;
        rating = rating.split(' ');
        row.rating[0].text = rating[0].replace(',', '.');
      }
      if (row.aggregateRating) {
        let aggregateRating = row.aggregateRating[0].text;
        aggregateRating = aggregateRating.split(' ');
        row.aggregateRating[0].text = aggregateRating[0].replace(',', '.');
      }
      if(row.helpful){
      	const help = row.helpful[0].raw;
      	if(help=='Une personne a trouvé cela utile'){
      		row.helpful[0].text = 1;
      		delete row.helpful[0].error;
      		row.helpful[0].value = 1;
      	}
      }	
      if (row.sourceUrl) {
        let sourceUrl = row.sourceUrl[0].text;
        row.sourceUrl[0].text = 'https://www.amazon.fr' + sourceUrl;
      }
      

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    domain: 'amazon.fr',
    zipcode: "''",
  },
};
