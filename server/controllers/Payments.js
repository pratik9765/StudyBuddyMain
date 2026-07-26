const { getRazorpayInstance } = require("../config/razorpay")
const Course = require("../models/Course")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id
  if (!Array.isArray(courses) || courses.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide at least one course." })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnroled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  const options = {
    amount: Math.round(total_amount * 100),
    currency: "INR",
    receipt: `course_${Date.now()}_${userId.slice(-6)}`,
  }

  try {
    // Initiate the payment using Razorpay
    const instance = getRazorpayInstance()
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.error("Razorpay order creation failed:", error.error || error.message)
    const status = error.code === "RAZORPAY_NOT_CONFIGURED" ? 503 : 502
    return res.status(status).json({
      success: false,
      message:
        error.code === "RAZORPAY_NOT_CONFIGURED"
          ? error.message
          : error.error?.description ||
            "Razorpay rejected the order request. Check that the backend key and secret are valid and belong to the same mode.",
    })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    try {
      await enrollStudents(courses, userId)
    } catch (error) {
      console.error("Enrollment failed after payment verification:", error)
      return res.status(500).json({
        success: false,
        message: "Payment was verified, but course enrollment failed.",
      })
    }
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
  return res.status(200).json({ success: true, message: "Payment email sent" })
}

// enroll the student in the courses
const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Course ID and User ID are required")
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { studentsEnroled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        throw new Error("Course not found")
      }
      console.log("Updated course: ", enrolledCourse)

      let courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId,
      })
      if (!courseProgress) {
        courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId,
          completedVideos: [],
        })
      }
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      try {
        const emailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
          )
        )
        console.log("Email sent successfully: ", emailResponse.response)
      } catch (emailError) {
        console.error("Enrollment email failed:", emailError.message)
      }
    } catch (error) {
      throw error
    }
  }
}
