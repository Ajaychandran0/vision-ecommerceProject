
// image zoom
var options = {

    fillContainer: true,
    offset: { vertical: 10, horizontal: 0 },
    scale: 1,
}

new ImageZoom(document.getElementById('image-container'), options)


// change product image before submitting changes in admin side in edit-product page
function viewImage(event) {
    document.getElementById('imgView').src = URL.createObjectURL(event.target.files[0])
}


// add to cart

function addToCart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {

                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
                
            }
        }
    })
}


// quantity increase and decrease in cart

function changeQuantity(cartId, proId, count) {

    let quantity = parseInt(document.getElementById(proId).innerHTML)
    let price = document.getElementById('price' + proId).innerHTML
    count = parseInt(count)
    let num = price * count


    $.ajax({

        url: '/cart/change-product-quantity',
        data: {
            cart: cartId,
            product: proId,
            count: count,
            quantity: quantity
        },
        method: 'post',
        success: (response) => {

            console.log(response)
            if (response.productRemove) {
                
                alert('product removed from cart')                
                document.getElementById('cart-count').innerHTML -= 1

                if(response.subTotal[0]){
                    document.getElementById('proDetail' + proId).remove()                   
                }else{
                    location.reload()
                }                

            } else {
                console.log(response)
                document.getElementById(proId).innerHTML = quantity + count
                document.getElementById('total' + proId).innerHTML = quantity * price + num

            }
            document.getElementById('total').innerHTML = response.subTotal[0].total
            document.getElementById('totals').innerHTML = response.subTotal[0].total

        }

    })
}


// remove cart item

function removeProduct(cartId,proId){
    
    $.ajax({

        url: '/cart/removeProduct',
        data: {
            cartId: cartId,
            proId: proId
        },
        method: 'post',
        success: (response) => {
            console.log(response)

            if (response.productRemove) {
                
                alert('product removed from cart')                
                location.reload()                             

            } 

        }

                

    })

}