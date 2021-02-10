/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

const transform = (data) => {
    console.log('Validity initiated');
    console.log(JSON.stringify(data));
    for (let { group } of data) {
      const newRows = [];
      for (const row of group) {
        if (row.reviewDate) {
          // Validate date if below 30 days
          const validityDate = new Date();
          validityDate.setMonth(validityDate.getMonth() - 1 );
          const reviewDate = new Date(row.reviewDate[0].raw);
  
          if (reviewDate.getTime() >= validityDate.getTime()) {
            newRows.push(row);
          }
        }
      }
      delete data[0].group;
      data[0].group = newRows;
      data[0].rows = newRows.length;
  
      if (!newRows.length) {
        // If no valid rows are present then remove other data.
        data.pop();
      }
    }
  
    return data;
  }
  
  module.exports = { transform };
  