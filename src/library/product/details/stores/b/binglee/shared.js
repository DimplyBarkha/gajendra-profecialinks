
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/

const transform = (data,context) => {
  //var $ = context.jQuery;
  //var jsonLD = $('script[type="application/ld+json"]');
  //console.log("data0=============="+JSON.stringify(data))
  for (const { group } of data) {
    for (const row of group) {  
     // console.log("row=============="+JSON.stringify(row))   

      if (row.ratingCount) {
        let text = '';
        row.ratingCount.forEach(item => {
         // console.log("ratingCount======"+JSON.stringify(JSON.parse(item.raw).aggregateRating.reviewCount));
          text = JSON.parse(item.raw).aggregateRating.reviewCount;
        });
        row.ratingCount = [{ text }];
      }

      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          //console.log("aggregateRating======"+JSON.stringify(JSON.parse(item.raw).aggregateRating.ratingValue));
          text = JSON.parse(item.raw).aggregateRating.ratingValue;
        });
        row.aggregateRating = [{ text }];
      }

    }
  }


  // Clean up data
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
