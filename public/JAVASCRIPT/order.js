/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
async function cancelOrderItem (orderId, proId) {
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'The item will be cancelled from your order',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure == null) return

  $.ajax({

    url: '/cancel-order',
    data: {
      orderId,
      proId
    },
    method: 'delete',
    success: (response) => {
      if (response) {
        document.getElementById('user-order-status' + orderId + proId).innerHTML = '<p class="mx-4 mt-3 font-weight-bold" style="color: red;font-size: 16px;">Cancelled</p>'
        const total = Number(document.getElementById('total' + orderId + proId).innerHTML)
        document.getElementById('total' + orderId).innerHTML -= total
      }
    }
  })
}

async function returnOrderItem (orderId, proId) {
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'The item will be cancelled from your order',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure == null) return

  $.ajax({

    url: '/return-order',
    data: {
      orderId,
      proId
    },
    method: 'patch',
    success: (response) => {
      document.getElementById('user-order-status' + orderId + proId).innerHTML = '<p class="mx-4 mt-3" style="color: red;font-size: 16px;">Returning...</p>'
    }
  })
}
