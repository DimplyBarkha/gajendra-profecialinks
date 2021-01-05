
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.reviewDate) {
          row.reviewDate.forEach(item => {
            if(item.text.includes("month")){
              var no = item.text.match(/\d+/)[0];
              var d = new Date();
              d.setMonth(d.getMonth() - no);
              item.text = d.toLocaleDateString();
            }else if(item.text.includes("week")){
              var no = item.text.match(/\d+/)[0];
              var d = new Date();
              d.getDate() - (7 * no);
              item.text = d.toLocaleDateString();
            }
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  