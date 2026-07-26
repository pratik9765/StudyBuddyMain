const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Validate course and subsection
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ error: "Invalid course" })
    }

    const isEnrolled = course.studentsEnroled.some(
      (studentId) => studentId.toString() === userId
    )
    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in this course",
      })
    }

    const sections = await Section.find({
      _id: { $in: course.courseContent },
      subSection: subsectionId,
    }).select("_id")
    if (sections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This lesson does not belong to the selected course",
      })
    }

    // Find or create course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
    }

    const alreadyCompleted = courseProgress.completedVideos.some(
      (completedId) => completedId.toString() === subsectionId
    )
    if (alreadyCompleted) {
      return res.status(200).json({
        success: true,
        message: "Lecture already completed",
        completedVideos: courseProgress.completedVideos,
      })
    }

    courseProgress = await CourseProgress.findOneAndUpdate(
      { courseID: courseId, userId },
      { $addToSet: { completedVideos: subsectionId } },
      { new: true }
    )

    return res.status(200).json({
      success: true,
      message: "Course progress updated",
      completedVideos: courseProgress.completedVideos,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }
