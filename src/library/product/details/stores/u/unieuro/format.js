/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingDimensions) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.shippingDimensions.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ' X ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        console.log(newDesc);
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.shippingDimensions = nDesc;
      }
      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ' || ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        console.log(newDesc);
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }
      if (row.description) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.description.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        console.log(newDesc);
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.description = nDesc;
      }
    }
  }
  return data;
};

module.exports = { transform };
