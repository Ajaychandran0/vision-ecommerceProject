/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// add to cart

function addToCart (proId) {
  console.log('sdljf;asdkjfl;asdjf hey in onclicl addt ocart')
  $.ajax({
    url: '/add-to-cart/' + proId,
    method: 'get',
    success: (response) => {
      if (response.status) {
        let count = $('#cart-count').html()
        count = parseInt(count) + 1

        if (response.cartCreated) {
          $('#cart-count').html(1)
        } else {
          $('#cart-count').html(count)
        }

        Toastify({

          duration: 2000,
          text: 'product added to cart',
          backgroundColor: 'linear-gradient(to right, #3e7c7, #88cbc)',
          close: true,
          offset: { x: 70, y: 150 }

        }).showToast()
      } else if (response.status === false) {
        Toastify({
          background: 'linear-gradient(to right, #1982dd, #67a0d1)',
          duration: 2000,
          text: 'product already in cart',
          close: true,
          offset: { x: 70, y: 150 }

        }).showToast()
      } else {
        Toastify({

          text: 'please login to add to cart',
          backgroundColor: 'linear-gradient(to right, #dd5151, #cf438a)',
          className: 'error',
          duration: 2000,
          close: true,
          offset: { x: 70, y: 150 }

        }).showToast()
      }
    }
  })
}

// quantity increase and decrease in cart

async function changeQuantity (cartId, proId, count) {
  const quantity = parseInt(document.getElementById(proId).innerHTML)
  const price = document.getElementById('price' + proId).innerHTML
  count = parseInt(count)
  const num = price * count

  if (count == -1 && quantity == 1) {
    const sure = await sweetAlert({
      title: 'Are you sure?',
      text: 'The selected item will be removed from cart',
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    if (sure == null) return
  }

  $.ajax({

    url: '/cart/change-product-quantity',
    data: {
      cart: cartId,
      product: proId,
      count,
      quantity
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
        document.getElementById('total' + proId).innerHTML = Math.round(((quantity * price + num) + Number.EPSILON) * 100) / 100
      }
      document.getElementById('total').innerHTML = Math.round(((response.subTotal) + Number.EPSILON) * 100) / 100
      document.getElementById('totals').innerHTML = Math.round(((response.subTotal) + Number.EPSILON) * 100) / 100
      $('#couponDiscount').text('00.00')
    }

  })
}

// remove cart item

async function removeProduct (cartId, proId) {
  console.log('hey removeProduct')
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'The selected item will be removed from cart',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure) {
    $.ajax({

      url: '/cart/removeProduct',
      data: {
        cartId,
        proId
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

// select coupons in cart

$('#couponSelectForm').submit((e) => {
  e.preventDefault()

  const coupon = $("input[name='coupon']:checked").val()
  console.log(coupon)
  $('#couponRedeemInput').val(coupon)
  $('#exampleModalLong').modal('toggle')
})

// redeem coupon from cart

$('#redeemCoupon').submit((e) => {
  e.preventDefault()
  $.ajax({
    url: '/redeemCoupon',
    method: 'post',
    data: $('#redeemCoupon').serialize(),
    success: (response) => {
      if (response.message) {
        $('#couponErr').text(response.message)
      } else {
        $('#couponDiscount').text(Math.round(((response.discount) + Number.EPSILON) * 100) / 100)
        $('#totals').text(Math.round(((response.totalPrice) + Number.EPSILON) * 100) / 100)
        $('#couponErr').text('')
      }
    }
  })
})
