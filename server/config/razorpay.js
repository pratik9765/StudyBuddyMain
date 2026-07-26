const Razorpay = require("razorpay")
require("dotenv").config()

let instance

const isPlaceholder = (value) =>
  !value || /replace|placeholder|your_/i.test(value)

exports.getRazorpayInstance = () => {
  const { RAZORPAY_KEY, RAZORPAY_SECRET } = process.env

  if (isPlaceholder(RAZORPAY_KEY) || isPlaceholder(RAZORPAY_SECRET)) {
    const error = new Error(
      "Razorpay is not configured. Add matching RAZORPAY_KEY and RAZORPAY_SECRET values to server/.env."
    )
    error.code = "RAZORPAY_NOT_CONFIGURED"
    throw error
  }

  if (!instance) {
    instance = new Razorpay({
      key_id: RAZORPAY_KEY,
      key_secret: RAZORPAY_SECRET,
    })
  }

  return instance
}
