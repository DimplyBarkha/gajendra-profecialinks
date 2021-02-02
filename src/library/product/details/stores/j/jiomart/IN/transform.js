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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let descText = row.description[0].text.replace('•', '|| ');

        if (row.additionalBullets) {
          row.additionalBullets.forEach(bullet => {
            descText += `|| ${bullet.text}`;
          });
        }

        row.description = [{ text: descText }];
      }

        if (row.quantity && row.quantity[0].text.includes('Buy')) {
            delete row.quantity;
        }

        if (row.ratingCount && row.ratingCount[0].value === 0){
            delete row.ratingCount;
            delete row.aggregateRating;
            delete row.aggregateRatingText;
        }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = {
  transform,
};
