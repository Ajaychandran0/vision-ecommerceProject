/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// toggle user Addresses in user profile

let addressIsShown = false

if (localStorage.getItem('showAddress')) {
  console.log('hey in localstaorage')
  document.getElementById('user-addresses').classList.remove('hidden')
  localStorage.removeItem('showAddress')
}

function toggleAddress () {
  const address = document.getElementById('user-addresses')
  if (!addressIsShown) {
    address.classList.remove('hidden')
    addressIsShown = true
  } else {
    address.classList.add('hidden')
    addressIsShown = false
  }
}

// add address onclik

function addAddress () {
  localStorage.setItem('showAddress', true)
}

// get edit user Address

function getEditAddress (addressId) {
  $.ajax({
    url: '/edit-address',
    data: {
      addressId
    },
    method: 'post',
    success: (address) => {
      console.log(address)

      document.getElementById('firstname').value = address.firstname
      document.getElementById('lastname').value = address.lastname
      document.getElementById('email').value = address.email
      document.getElementById('house').value = address.house
      document.getElementById('area').value = address.area
      document.getElementById('landmark').value = address.landmark
      document.getElementById('mobile').value = address.mobile
      document.getElementById('country').value = address.country
      document.getElementById('state').value = address.state
      document.getElementById('district').value = address.district
      document.getElementById('city').value = address.city
      document.getElementById('pincode').value = address.pincode
      document.getElementById('addressId').value = address._id
    }
  })
}

// post edit address page

const editAddressForm = document.getElementById('address-edit-modal')

editAddressForm.addEventListener('submit', (e) => {
  console.log('ehehehehe hey in event lsistener')
  const addressId = document.getElementById('addressId').value
  console.log(addressId)
  e.preventDefault()

  $.ajax({

    url: '/edit-address-post/' + addressId,
    method: 'post',
    data: {
      firstname: document.getElementById('firstname').value,
      lastname: document.getElementById('lastname').value,
      email: document.getElementById('email').value,
      house: document.getElementById('house').value,
      area: document.getElementById('area').value,
      landmark: document.getElementById('landmark').value,
      mobile: document.getElementById('mobile').value,
      country: document.getElementById('country').value,
      state: document.getElementById('state').value,
      district: document.getElementById('district').value,
      city: document.getElementById('city').value,
      pincode: document.getElementById('pincode').value
    },
    success: (response) => {
      console.log(response)
      if (response.status) {
        localStorage.setItem('showAddress', true)
        location.reload()
      }
    }
  })
})

// delete User Address

function deleteAddress (addressId) {
  $.ajax({
    url: 'delete-address',
    method: 'delete',
    data: { addressId },
    success: (response) => {
      if (response.deleteAddress) {
        document.getElementById('address-card' + addressId).remove()
      }
    }
  })
}
