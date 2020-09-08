const transform = (data) => {
    for (const { group} of data) {
        for (const row of group) {
            if (row.id) {
                 var string = row.id[0].text.split(' ').splice(-2).toString();
                row.id = string.replace(/,/g , ' ');
            }
        }
      }
      return data;
  };
  
  module.exports = { transform } 