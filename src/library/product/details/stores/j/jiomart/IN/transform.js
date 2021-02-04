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

        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(bullet => {
            descText += `|| ${bullet.text}`;
          });
        }

        row.description = [{ text: descText }];
      }

      if (row.quantity) {
        const quantText = row.quantity[0].text;
        const lowerCasedQuant = quantText.toLowerCase();

        if (lowerCasedQuant.includes('set') || lowerCasedQuant.includes('pack') || lowerCasedQuant.includes('pak') || lowerCasedQuant.includes('pcs')) {
          row.packSize = [{ text: quantText }];
        }

        if (!lowerCasedQuant.includes('size')) {
          delete row.quantity;
        }
      }

      if (row.ratingCount && row.ratingCount[0].value === 0) {
        delete row.ratingCount;
        delete row.aggregateRating;
        delete row.aggregateRatingText;
      }

      if (row.promotion && row.promotion.length > 1) {
        const allPromos = row.promotion.map(promo => promo.text);
        row.promotion = [{ text: allPromos }];
      }

      row.privacyPolicy ? row.privacyPolicy = [{ text: 'Yes' }] : row.privacyPolicy = [{ text: 'No' }];
      row.customerServiceAvailability ? row.customerServiceAvailability = [{ text: 'Yes' }] : row.customerServiceAvailability = [{ text: 'No' }];
      row.termsAndConditions ? row.termsAndConditions = [{ text: 'Yes' }] : row.termsAndConditions = [{ text: 'No' }];
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
