
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const state = context.getState();
    let productdata = state.productdata || 0;
    if(!Object.keys(productdata).length){
        const firstrow = data[0].group[0];
        context.setState({ productdata: firstrow });
        productdata = firstrow;
    }
    const { brand, sourceUrl } = productdata;
    for (const { group } of data) {
      for (const row of group) {
          try {
              Object.assign(row, {brand, sourceUrl});
          } catch (error) {
            console.log(error);
          }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  