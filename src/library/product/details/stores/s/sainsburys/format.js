/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {

        for (const { group } of data) {
            for (let row of group) {
                if(row.ratingCount) {
                    row.ratingCount = row.ratingCount.replace(/[^0-9]/g,'')
                }
                if(row.weightNet) {
                    let weight = row.weightNet.split(' ');
                    row.weightNet = weight[weight.length-1]
                }
                if(row.weightGross) {
                    let weight = row.weightNet.split(' ');
                    row.weightNet = weight[weight.length-1]
                }
                if( row.sku ) {
                    row.sku = 'sainsburys_' + row.sku
                }
                if( row.servingSize ) {
                    row.servingSize = row.servingSize.replace('Per', '');
                }
                if( row.servingSizeUom ) {
                    row.servingSizeUom = row.servingSizeUom.replace('Per','').replace(/[0-9]/g, '');
                }

            }
        }
    }
}