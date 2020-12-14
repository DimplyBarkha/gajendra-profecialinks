
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    // Default transform function
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
  
    for (const { group } of data) {
      for (const row of group) {        
        if (row.variantUrl) {
          var dups= [];
          row.variantUrl = row.variantUrl.filter(function (el) {
            // If it is not a duplicate, return true
            if (dups.indexOf(el.text) === -1) {
              dups.push(el.text);
              console.log(dups);
              return true;
            }
  
            return false;
          });
         }
        if (row.variantId) {
          var dups= [];
          row.variantId = row.variantId.filter(function (el) {
            // If it is not a duplicate, return true
            if (dups.indexOf(el.text) === -1) {
              dups.push(el.text);
              console.log(dups);
              return true;
            }
  
            return false;
          });
         }
        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text += item.text.replace(/\s{2,}/g, '').replace(/\n/g, '').trim();
          });
          row.description = [
            {
              text: text,
            },
          ];
        }
        // if (row.variantInformation) {
        //   let text = '';
        //   row.variantInformation.forEach(item => {
        //     text += item.text+'|';
        //   });
        //   row.variantInformation = [
        //     {
        //       text: text.slice(0 , -1),
        //     },
        //   ];
        // }
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += item.text.replace(/\s{2,}/g, '').replace(/\n/g, '').trim();
          });
          row.specifications = [
            {
              text: text,
            },
          ];
        }
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  