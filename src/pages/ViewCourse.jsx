import { useEffect, useState } from "react"
import { FiMenu } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/videoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true)
      setError("")
      const courseData = await getFullDetailsOfCourse(courseId, token)

      if (!courseData?.courseDetails) {
        setError(
          courseData?.message ||
            "We could not load this course. Confirm that you are enrolled."
        )
        setLoading(false)
        return
      }

      const sections = courseData.courseDetails.courseContent || []
      const totalLectures = sections.reduce(
        (count, section) => count + (section.subSection?.length || 0),
        0
      )

      dispatch(setCourseSectionData(sections))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos || []))
      dispatch(setTotalNoOfLectures(totalLectures))
      setLoading(false)
    }

    loadCourse()
  }, [courseId, dispatch, token])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900 px-4">
        <div className="max-w-lg rounded-xl border border-richblack-700 bg-richblack-800 p-8 text-center">
          <h1 className="text-2xl font-semibold text-richblack-5">
            Course unavailable
          </h1>
          <p className="mt-3 text-richblack-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] bg-richblack-900">
        <VideoDetailsSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          setReviewModal={setReviewModal}
        />

        <main className="min-w-0 flex-1">
          <div className="sticky top-0 z-30 flex h-14 items-center border-b border-richblack-700 bg-richblack-900/95 px-4 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-richblack-600 bg-richblack-800 px-3 py-2 text-sm font-medium text-richblack-25"
            >
              <FiMenu className="text-lg" />
              Course content
            </button>
          </div>
          <Outlet />
        </main>
      </div>

      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
