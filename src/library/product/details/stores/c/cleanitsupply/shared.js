/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
        
        if (row.videos) {
          let videos1 = [];
          row.videos.forEach(item => {
            if (item.text.indexOf('https:') === -1) {
              item.text = `https://www.youtube.com/watch?v=${item.text}`;
            }
          });
        }
        if (row.specifications) {
          const specs = [];
          let newTxt = '';
          let cnt = 0;
          row.specifications.forEach(item => {
            specs[0] = item;
            item.text = item.text.replace(/(\s?\n)+/g, ' ');
            if (cnt > 0) newTxt = newTxt + ' || ' + item.text;
            else newTxt = newTxt + item.text;
            cnt++;
          });
          specs.forEach(item => {
            item.text = newTxt;
          });
          row.specifications = specs;
        }
        
        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ':')} | `;
          });
          row.description = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
       
        if (row.additionalDescBulletInfo) {
          const descs = [];
          let newTxt = '';
          let cnt = 0;
          row.additionalDescBulletInfo.forEach(item => {
            descs[0] = item;
            item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
            if (cnt > 0) newTxt = newTxt + '|' + item.text;
            else newTxt = newTxt + item.text;
            cnt++;
          });
          descs.forEach(item => {
            item.text = newTxt;
          });
          row.additionalDescBulletInfo = descs;
        }
      }
    }
    // clean data
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
  
    return data;
  };
  module.exports = { transform };