/* eslint-disable no-undef */
// checkout
let isCartEmpty = false

$('#checkout-form').submit((e) => {
  e.preventDefault()
  if (isCartEmpty) {
    sweetAlert('Error', 'Your cart is empty', 'error').then(() => {
      location.reload()
    })
    return
  }

  $.ajax({
    url: '/place-order',
    method: 'post',
    data: $('#checkout-form').serialize(),
    success: (response) => {
      isCartEmpty = true

      if (response.orderPlaced) {
        location.href = '/order-complete'
      } else if (response.razorpay) {
        razorpayPayment(response.order)
        console.log('in cahec out form razpruay')
      } else if (response.paypal) {
        console.log('hey in paypal response after ajax success')
        console.log(response)
        location.href = response.url
      }
    }
  })
})

function razorpayPayment (order) {
  console.log('in razoerpay payment function')
  const options = {
    key: 'rzp_test_rLwn0qBieVg6NE', // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: 'INR',
    name: 'Vision',
    description: 'Test Transaction',
    image: 'https://example.com/your_logo',
    order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      console.log('in optins variable in raxorpay paymetn function')
      verifyPayment(response, order)
    },

    callback_url: 'https://eneqd3r9zrjok.x.pipedream.net/',
    prefill: {
      name: 'Gaurav Kumar',
      email: 'gaurav.kumar@example.com',
      contact: '9999999999'
    },
    notes: {
      address: 'Razorpay Corporate Office'
    },
    theme: {
      color: '#3399cc'
    }
  }

  const rzp1 = new Razorpay(options)

  rzp1.on('payment.failed', function (response) {
    sweetAlert('Oops.. payment failed', response.error.reason, 'error').then(() => {
      location.reload()
    })
  })

  rzp1.open()
}

// verify razorpay payment

function verifyPayment (payment, order) {
  $.ajax({

    url: '/verify-payment',
    data: {
      payment, order
    },
    method: 'post',
    success: (response) => {
      if (response.status) {
        location.href = '/order-complete'
      } else {
        sweetAlert('Error', 'Your payment has failed!', 'error')
      }
    }
  })
}
