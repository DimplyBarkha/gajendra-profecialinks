/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    let rank = 1;
    for (const row of group) {
      if (row.variantType) {
        var arrTemp = []
        row.variantType.forEach(item => {
          arrTemp.push(item.text)
        })
        row.variantType = [{ "text": arrTemp.join(' | ') }]
      }
      if (row.name) {
        row.name[0].text = row.name[0].text.split(',')[0]
      }
      if (row.aggregateRating2) {
        var srtRating = ''
        var strRatingCount = 0
        srtRating = row.aggregateRating2[0].text.match(/one|two|three|four|five/g)
        switch (srtRating[0]) {
          case 'one':
            strRatingCount = 1
            break;
          case 'two':
            strRatingCount = 2
            break;
          case 'three':
            strRatingCount = 3
            break;
          case 'four':
            strRatingCount = 4
            break;
          case 'five':
            strRatingCount = 5
            break;
          default:
            strRatingCount = 0
        }
        row.aggregateRating2[0].text = strRatingCount
      }
      if (row.productUrl) {
        row.productUrl[0].text = 'https://www.petcircle.com.au' + row.productUrl[0].text
      }
      row.rank = row.rankOrganic = [{ "text": rank }];
      rank++;
    }
  }
  return cleanUp(data);
};
module.exports = { transform };