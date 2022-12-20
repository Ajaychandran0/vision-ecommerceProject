/* eslint-disable no-undef */
// otp login

const loginForm = document.getElementById('otp-login-form')
const otpInput = document.getElementById('otp-input')
let mobileNumber
let isOtpDelivered = false

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  mobileNumber = parseInt(document.getElementById('phoneInput').value)
  if (isNaN(mobileNumber)) {
    alert('Invalid mobile number')
  } else {
    if (isOtpDelivered) {
      const code = otpInput.value
      const response = await verifyOTP(mobileNumber, code)

      if (response.status === 'approved') {
        const userStatus = await loginUser(mobileNumber)
        if (userStatus.userLogin) {
          window.location.href = '/'
        } else {
          location.reload()
        }
      } else {
        alert('Invalid OTP')
      }
      return
    }

    const response = await sendVerificationCode(mobileNumber)

    if (response.status === 'pending') {
      otpInput.parentElement.classList.remove('hidden')
      document.getElementById('otp-submit').innerHTML = 'Sign in'
      isOtpDelivered = true
    }
  }
})

// send verification code (otp) function
async function sendVerificationCode (mobileNumber) {
  const response = await axios.post('/send-otp', { mobileNumber })

  if (response.status === 200) {
    return response.data.verification
  } else {
    return response.data
  }
}

// verify verification code (otp) function
async function verifyOTP (mobileNumber, code) {
  const response = await axios.post('/verify-otp', { mobileNumber, code })
  console.log(response)

  if (response.status === 200) {
    return response.data.verification_check
  } else {
    alert('error:please try again')
    return location.reload()
  }
}

// login user via otp

async function loginUser (mobileNumber) {
  const response = axios.post('/otp-login', { mobileNumber })
  return response
}
