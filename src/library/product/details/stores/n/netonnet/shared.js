
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.availabilityText) {
				let newText = 'Out Of Stock';
				row.availabilityText.forEach(item => {
					if (item.text.trim() === 'false') {
						newText = 'In Stock';
					}
				});
				row.availabilityText = [{ text: newText }];
			}
			if (row.sku) {
				let newText = "";
				row.sku.forEach(item => {
					newText = item.text.replace("Art.nr: ", "")
				});
				row.sku = [{ text: newText }];
			}
			if (row.variantId) {
				let newText = "";
				row.variantId.forEach(item => {
					newText = item.text.replace("Art.nr: ", "")
				});
				row.variantId = [{ text: newText }];
			}
			if (row.price || row.listPrice) {
				if (row.price) {
					var priceVar = 	row.price;
				}
				if (row.listPrice) {
					var priceVar = 	row.listPrice;
				}
				//listPrice
				/* let newText = "";
				row.price.forEach(item => {
					newText = item.text.trim().replace(",-", "");
				});
				row.price = [{ text: newText }]; */

				let newText = "";
				priceVar.forEach(item => {
					newText = item.text.trim().replace(",-", "");
				});
				priceVar = [{ text: newText }];
				if (row.price) {
					row.price = priceVar;
				}
				if (row.listPrice) {
					row.listPrice = priceVar;
				}
			}
			if (row.firstVariant) {
				let newText = "";
				row.firstVariant.forEach(item => {
					var res = item.text.trim().split("/");
					var res = res[res.length-2].split(".")[1];
					newText = res;
				});
				row.firstVariant = [{ text: newText }];
			}
			if (row.aggregateRating) {
				var newText=''
				row.aggregateRating.forEach(item => {

					var received_per = item.text.replace("width: ", "")
					received_per = received_per.replace("%", "");

					if(received_per >= 1){
						var aggregate_rating = ( received_per * 5 )/100;
						if(aggregate_rating > 0){
						newText = aggregate_rating.toString();
						}else
						{
							newText = '0';
						}
					}
				});
				row.aggregateRating = [{ text: newText.replace('.',',') }];
			}
			if(row.shippingDimensions)
						{
				let newText = '';

				row.shippingDimensions.forEach(item => {
					var shippingDimensions = item.text;
					if(shippingDimensions.length > 0){
						newText += shippingDimensions.toString()+"X";
					}

				});
				newText = newText.substring(0,newText.length-1);
				row.shippingDimensions = [{ text: newText }];
			}

			if(row.description)
						{
				let newText = '';

				row.description.forEach(item => {
					var description = item.text;
					if(description.length > 0){
						newText += description.toString()+"||";
					}

				});
				newText = newText.substring(0,newText.length-2);
				row.description = [{ text: newText }];
			}

			if (row.specifications) {
				let newText = '';
				var index = 1;
				row.specifications.forEach(item => {
					var specifications = item.text;
					if(specifications.length > 0){

						if(index %2 != 0)
						{
						 newText += specifications+":";
						}
						else
						{
							newText += specifications+"|";
						}
					}
					index++;
				});
				newText = newText.substring(0,newText.length-1);
				row.specifications = [{ text: newText }];
			   }
			if (row.alternateImages) {
				row.alternateImages.forEach(item => {
					item.text = item.text.replace('Large','Extra');
				});
			}

			if (row.inTheBoxUrl) {
				row.inTheBoxUrl.forEach(item => {
				  item.text = 'https://www.netonnet.no'+ item.text
				});
			}
		}
	}

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

	return data;
};

module.exports = { transform };
