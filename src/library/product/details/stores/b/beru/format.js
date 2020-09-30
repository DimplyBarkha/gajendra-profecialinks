/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        row.aggregateRating.map(item => {
          item.text = item.text.replace(".", ",");
        });
      }
      if (row.price) {
        row.price.map(item => {
          item.text = item.text.replace(/\s/gm, "").slice(0, -1);
        });
      }
      if (row.listPrice) {
        row.listPrice.map(item => {
          item.text = item.text.replace(/\s/gm, "").slice(0, -1);
        });
      }
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.color) {
        var colors = ['красный', 'серый', 'белый', 'серебристый', 'синий', 'коричневый', 'желтый', 'черный', 'розовый', 'зеленый', 'фиолетовый'];
        const colorArray = row.color.map((item) => {
          var colorArr = item.text.split(' ');
          var finalColor = '';
          for (var clr of colorArr) {
            if (colors.includes(clr)) {
              finalColor = +' ' + clr;
            }
          }
          return finalColor;
        });
        row.color = [{ text: colorArray.join(' '), xpath: row.color[0].xpath }];
      }
      if (row.promotion) {
        const promotionTextArray = row.promotion.map((item) => {
          return item.text;
        });
        if (promotionTextArray.length) {
          row.promotion = [{ text: '-' + promotionTextArray[0] + '%' }];
        }
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo = [{ text: row.additionalDescBulletInfo.map(item => item.text).join(" || ") }]
      }
      if (row.description) {
        row.description = [{ text: row.description.map(item => item.text.replace(/\./gm, " ||")).join(" || ") }]
      }
      if (row.alternateImages) {
        row.alternateImages && row.alternateImages.shift();
      }
      if (row.specifications) {
        row.specifications = [{ text: row.specifications.map((item, index) => index % 2 === 0 ? item.text + " : " : item.text + " || ").join("") }]
      }
    }
  }
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
