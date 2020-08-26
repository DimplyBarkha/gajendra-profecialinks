
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        row.variants = [{
          text: row.variants.reduce((item, currentitem) => {
            return `${item} | ${currentitem.text}`
          }, '').slice(3)
        }]
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length
        }]
        row.additionalDescBulletInfo = [{
          text: row.additionalDescBulletInfo.reduce((item, currentitem) => {
            return `${item} | ${currentitem.text}`
          }, '').trim()
        }]
      }
      if (row.description) {
        let text='';
        if(row.description[0].text.includes('Key Benefits')){
          text = row.description[0].text.split('Key Benefits')
          text = text[0].replace(/(\s*\n\s*)+/g, ' ') + 'Key Benefits' + text[1].replace(/(\s*\n\s*)+/g, ' || ')
        }else{
          text = row.description[0].text.replace(/(\s*\n\s*)+/g, ' ');
        }
        row.description = [{
          text:text
        }]
      }
    }
  }
  return data;
};

module.exports = { transform };
