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

                Toastify({                    
                    
                    duration: 2000,
                    text: "product added to cart",
                    backgroundColor: "linear-gradient(to right, #3e7c7, #88cbc)",
                    close: true,
                    offset: { x: 70, y: 150 }
            
                }).showToast();

            }else if(response.status==false){
                Toastify({
                    background: "linear-gradient(to right, #1982dd, #67a0d1)",
                    duration: 2000,
                    text: "product already in cart",                  
                    close: true,
                    offset: { x: 70, y: 150 }
            
                }).showToast();
            }else{
                Toastify({

                    text: "please login to add to cart",
                    backgroundColor: "linear-gradient(to right, #dd5151, #cf438a)",
                    className: "error",
                    duration: 2000,
                    close: true,
                    offset: { x: 70, y: 150 }
            
                }).showToast();
            }
        }
    })
}


// quantity increase and decrease in cart

async function changeQuantity(cartId, proId, count) {

    let quantity = parseInt(document.getElementById(proId).innerHTML)
    let price = document.getElementById('price' + proId).innerHTML
    count = parseInt(count)
    let num = price * count


    if (count == -1 && quantity == 1) {
        let sure = await sweetAlert({
            title: "Are you sure?",
            text: "The selected item will be removed from cart",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        if (sure == null) return

    }


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
            console.log('heu in success')

            console.log(response)
            if (response.productRemove) {

                document.getElementById('cart-count').innerHTML -= 1

                if (response.subTotal) {
                    document.getElementById('proDetail' + proId).remove()
                } else {
                    location.reload()
                }

            } else {
                console.log(response)
                document.getElementById(proId).innerHTML = quantity + count
                document.getElementById('total' + proId).innerHTML = quantity * price + num

            }
            document.getElementById('total').innerHTML = response.subTotal
            document.getElementById('totals').innerHTML = response.subTotal

        }

    })
}


// remove cart item

async function removeProduct(cartId, proId) {

    console.log("hey removeProduct")
    let sure = await sweetAlert({
        title: "Are you sure?",
        text: "The selected item will be removed from cart",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    if (sure) {
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

                    location.reload()

                }
            }
        })
    }
}
