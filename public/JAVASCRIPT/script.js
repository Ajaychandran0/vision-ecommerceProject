// image zoom
var options ={
		
    fillContainer: true,
    offset:{vertical:10,horizontal:0},
    scale:1,		
}

new ImageZoom(document.getElementById('image-container'),options)


// change product image before submitting changes in admin side in edit-product page
function viewImage(event){
    document.getElementById('imgView').src=URL.createObjectURL(event.target.files[0])
}


// add to cart

function addToCart(proId){
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if (response.status){

                let count = $('#cart-count').html()
                count = parseInt(count)+1
                $('#cart-count').html(count)
               
            }
        }
    })
}