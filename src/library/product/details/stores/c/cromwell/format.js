/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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
      //   if (row.description) {
      //     let text = '';
      //     row.description.forEach(item => {
      //         let t = item.text.replace(/\n \n/g, '||')
      //         // item.text.replace(" ","")
      //         text += `${t.replace(/\n/g, '||')} || `;
      //     });
      //     row.description = [
      //         {
      //             text: text.slice(0, -4),
      //         },
      //     ];
      // }

        if (row.alternateImages) {
          const baseUrl = row.alternateImages[0].text.match(/url\("([^?]+)/)[1];
          row.alternateImages = row.alternateImages.slice(1).map((elm, index) => {
            elm.text = `${baseUrl}_${index + 1}?wid=1920&hei=1080&op_sharpen=1`;
            return { text: elm.text };
          });
        }
        data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
            el.text = clean(el.text);
          }))));
      }
    }
    return data;
  };
  module.exports = { transform };