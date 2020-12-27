/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.hasComparisonTable) {
        row.hasComparisonTable = [{ text: 'Yes' }];
      } else {
        row.hasComparisonTable = [{ text: 'No' }];
      }

if (row.inTheBoxText) {
        let indx1;
        let indx2;
        let info=[];
        row.inTheBoxText.forEach(item => {

            info.push(item.text)

       });
       indx1 = info.indexOf('מפרט טכני:');
       if(indx1>0){
        info.splice(indx1)
       }
       row.inTheBoxText = [{'text': info.join('||')}]
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
