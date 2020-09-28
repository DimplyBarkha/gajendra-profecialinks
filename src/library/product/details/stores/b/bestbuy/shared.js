
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
        // if (row.alternateImages) {
        //   row.alternateImages.forEach(item => {
        //     item.text= item.text.replace(/(100x100)/, '500X500');
        //   });
        // }
        if (row.brandText) {
          row.brandText.forEach(item => {
            item.text= item.text ? item.text.split(' ')[0] : '';
          });
        }
        if (row.description) {
          row.description.forEach(item => {
            item.text= item.text ? item.text.replace(/•(.*)<br>/gm) : '';
          });
        }
        if (row.alternateImages) {
          let primaryImg = '';
          if(row.image){
            row.image.forEach(item =>{
              primaryImg = item.text;
              console.log('primaryImg: ', primaryImg);
             })
          }
          let array = [];
          row.alternateImages.forEach(item =>{
          if(item.text !== primaryImg){
            array.push(item.text);
          }
          })
          // array = array.filter(item => item !== primaryImg);
          // @ts-ignore
          array = [...new Set(array)];
          row.alternateImages = [
            {
              text: array.join(' | '),
            },
          ];
        }

          if (row.image) {
          row.image.forEach(item => {
            item.text= item.text.replace(/(100x100)/, '500X500');
          });
        }
      }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  
  module.exports = { transform };
  