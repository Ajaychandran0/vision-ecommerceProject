/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// order management
$(document).ready(function () {
  $('#example').DataTable()
})

// block user

async function blockUser (userId) {
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'The user will be blocked',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure == null) return

  $.ajax({
    url: '/admin/block-user/' + userId,
    method: 'patch',
    success: (response) => {
      console.log(response)
      if (response) {
        location.reload()
        // $("#user-block-unblock"+userId).load(" #user-block-unblock"+userId)
      }
    }
  })
}

// unblock user
async function unblockUser (userId) {
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'The user will be unblocked',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure == null) return

  $.ajax({
    url: '/admin/unblock-user/' + userId,
    method: 'patch',
    success: (response) => {
      console.log(response)
      if (response) {
        location.reload()
        // $("#user-block-unblock"+userId).load(" #user-block-unblock"+userId)
      }
    }
  })
}

// delete Category

async function deleteCategory (categoryId) {
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'The category will be deleted',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure == null) return

  $.ajax({
    url: '/admin/delete-category/' + categoryId,
    method: 'delete',
    success: (response) => {
      console.log(response)
      if (response) {
        location.reload()
        // $("#user-block-unblock"+userId).load(" #user-block-unblock"+userId)
      }
    }
  })
}

// change order Status

function changeOrderStatus (proId, orderId) {
  const itemStatus = document.getElementById('option' + proId + orderId).value
  console.log(itemStatus)

  $.ajax({

    url: '/admin/change-order-status',
    data: {
      proId,
      status: itemStatus,
      orderId
    },
    method: 'patch',
    success: (response) => {
      if (response) {
        document.getElementById('orderStatus' + proId + orderId).innerHTML = itemStatus
      }
    }
  })
}

// offer management

// product offer delete
async function deleteProOffer (proId) {
  console.log(proId)
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'You want to remove product offer',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure) {
    $.ajax({
      url: '/admin/offers/product-offer',
      method: 'delete',
      data: { proId },
      success: (response) => {
        document.getElementById('proOffer' + proId).remove()
        sweetAlert('successfull', 'Product offer removed succesfully', 'success')
      }
    })
  } else {
    sweetAlert('Cancelled', 'Product offer not changed', 'error')
  }
}

// category offer delete
async function deleteCatOffer (category) {
  console.log(category)
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'You want to remove category offer',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure) {
    $.ajax({
      url: '/admin/offers/category-offer',
      data: { category },
      method: 'delete',
      success: (response) => {
        document.getElementById('catOffer' + category).remove()
        sweetAlert('successfull', 'Category offer removed succesfully', 'success')
      }
    })
  } else {
    sweetAlert('Cancelled', 'Category offer not changed', 'error')
  }
}

// add coupon offer

$('#add-coupon-form').submit((e) => {
  e.preventDefault()
  $.ajax({
    url: '/admin/coupons',
    method: 'post',
    data: $('#add-coupon-form').serialize(),
    success: (status) => {
      if (status) {
        location.reload()
      } else {
        swal({
          title: 'The Coupon Already Exists',
          text: false,
          timer: 1400,
          showConfirmButton: false
        })
      }
    }
  })
})

// delete coupon offer

async function deleteCoupon (couponId) {
  const sure = await sweetAlert({
    title: 'Are you sure?',
    text: 'You want to remove this coupon',
    icon: 'warning',
    buttons: true,
    dangerMode: true
  })
  if (sure) {
    $.ajax({
      url: '/admin/coupon',
      method: 'delete',
      data: { couponId },
      success: (response) => {
        $('#coupon' + couponId).remove()
      }
    })
  } else {
    sweetAlert('Cancelled', 'Coupon not deleted', 'error')
  }
}
