/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// highlight the selected nav item
$('.menu-item').click(function (e) {
  localStorage.setItem('navItem', $(this).text().trim())
})

$(window).on('load', highLightSelectedItem())
function highLightSelectedItem () {
  switch (localStorage.getItem('navItem')) {
    case 'Dashboard':
      $('#dashboard').addClass('highlight')
      $('#iconDashboard').addClass('highlight')
      break
    case 'Orders':
      $('#orders').addClass('highlight')
      $('#iconOrders').addClass('highlight')
      break
    case 'Users':
      $('#users').addClass('highlight')
      $('#iconUsers').addClass('highlight')
      break
    case 'Products':
      $('#products').addClass('highlight')
      $('#iconProducts').addClass('highlight')
      break
    case 'categories':
      $('#category').addClass('highlight')
      $('#iconCategory').addClass('highlight')
      break
    case 'Offers':
      $('#offers').addClass('highlight')
      $('#iconOffers').addClass('highlight')
      break
    case 'Coupons':
      $('#coupons').addClass('highlight')
      $('#iconCoupons').addClass('highlight')
      break
    case 'Sales report':
      $('#salesReport').addClass('highlight')
      $('#iconSalesReport').addClass('highlight')
      break
    default:
  }
}

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

// DATE RANGE PICKER
$(function () {
  $('input[name="daterange"]').daterangepicker(
    {
      opens: 'left'
    },
    function (start, end, label) {
      console.log(
        'A new date selection was made: ' +
        start.format('YYYY-MM-DD') +
        ' to ' +
        end.format('YYYY-MM-DD')
      )
    }
  )
})

// pdf export
$(document).ready(function ($) {
  $(document).on('click', '#rep', function (event) {
    event.preventDefault()
    const element = document.getElementById('container_content')

    const randomNumber = Math.floor(Math.random() * (10000000000 - 1)) + 1

    const opt = {
      margin: 0,
      filename: 'Vision (Sales Report)' + randomNumber + '.pdf',
      html2canvas: { scale: 10 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    html2pdf().set(opt).from(element).save()
  })
})

// excel export

function exportDataToExcel () {
  const data = document.getElementById('container_content')
  const fp = XLSX.utils.table_to_book(data, { sheet: 'Vision' })
  XLSX.write(fp, {
    bookType: 'xlsx',
    type: 'base64'
  })
  XLSX.writeFile(fp, 'Vision (Sales Report).xlsx')
}
