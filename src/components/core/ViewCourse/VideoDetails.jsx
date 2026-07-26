import { useEffect, useMemo, useRef, useState } from "react"
import {
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCcw,
} from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"

const VideoDetails = () => {
  const { courseId, subSectionId } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse)

  const [loading, setLoading] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  const lectures = useMemo(
    () =>
      courseSectionData.flatMap((section) =>
        section.subSection.map((lecture) => ({
          ...lecture,
          sectionId: section._id,
          sectionName: section.sectionName,
        }))
      ),
    [courseSectionData]
  )

  const currentIndex = lectures.findIndex(
    (lecture) => lecture._id === subSectionId
  )
  const videoData = currentIndex >= 0 ? lectures[currentIndex] : null
  const previousLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null
  const nextLecture =
    currentIndex >= 0 && currentIndex < lectures.length - 1
      ? lectures[currentIndex + 1]
      : null
  const isCompleted = (completedLectures || [])
    .map(String)
    .includes(String(subSectionId))
  const progress =
    totalNoOfLectures > 0
      ? Math.round(
          (new Set((completedLectures || []).map(String)).size /
            totalNoOfLectures) *
            100
        )
      : 0

  useEffect(() => {
    setVideoEnded(false)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [subSectionId])

  useEffect(() => {
    if (courseSectionData.length && !videoData) {
      navigate("/dashboard/enrolled-courses")
    }
  }, [courseSectionData.length, navigate, videoData])

  const navigateToLecture = (lecture) => {
    if (!lecture) return
    navigate(
      `/view-course/${courseId}/section/${lecture.sectionId}/sub-section/${lecture._id}`
    )
  }

  const handleLectureCompletion = async () => {
    if (loading || isCompleted) return true

    setLoading(true)
    const completed = await markLectureAsComplete(
      { courseId, subsectionId: subSectionId },
      token
    )
    if (completed) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
    return completed
  }

  const handleVideoEnded = async () => {
    setVideoEnded(true)
    await handleLectureCompletion()
  }

  if (!videoData) {
    return (
      <div className="grid min-h-[calc(100vh-7rem)] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-5 sm:px-6 sm:py-8 xl:px-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-50">
            {videoData.sectionName}
          </p>
          <p className="mt-1 text-sm text-richblack-400">
            Lesson {currentIndex + 1} of {lectures.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-richblack-400">Overall progress</p>
            <p className="text-sm font-semibold text-richblack-25">
              {progress}% complete
            </p>
          </div>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-richblack-700 sm:w-32">
            <div
              className="h-full rounded-full bg-yellow-50 transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-richblack-700 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
        <div className="relative aspect-video">
          <video
            key={videoData._id}
            ref={videoRef}
            src={videoData.videoUrl}
            poster={courseEntireData?.thumbnail}
            controls
            controlsList="nodownload"
            playsInline
            onEnded={handleVideoEnded}
            className="h-full w-full bg-black object-contain"
          >
            Your browser does not support HTML video.
          </video>

          {videoEnded && (
            <div className="absolute inset-0 grid place-items-center bg-richblack-900/80 p-4 backdrop-blur-sm">
              <div className="text-center">
                <FiCheckCircle className="mx-auto text-5xl text-caribbeangreen-100" />
                <h2 className="mt-3 text-2xl font-semibold text-richblack-5">
                  Lesson complete
                </h2>
                <p className="mt-1 text-sm text-richblack-300">
                  Your course progress has been updated.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      videoRef.current.currentTime = 0
                      videoRef.current.play()
                      setVideoEnded(false)
                    }}
                    className="flex items-center gap-2 rounded-lg border border-richblack-500 bg-richblack-800 px-4 py-2.5 text-sm font-semibold text-richblack-25"
                  >
                    <FiRotateCcw />
                    Rewatch
                  </button>
                  {nextLecture && (
                    <button
                      type="button"
                      onClick={() => navigateToLecture(nextLecture)}
                      className="flex items-center gap-2 rounded-lg bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-richblack-900"
                    >
                      Next lesson
                      <FiChevronRight />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold leading-tight text-richblack-5 sm:text-3xl">
                {videoData.title}
              </h1>
              <p className="mt-3 max-w-4xl whitespace-pre-line leading-7 text-richblack-200">
                {videoData.description || "No description was added for this lesson."}
              </p>
            </div>
            {isCompleted && (
              <span className="hidden shrink-0 items-center gap-2 rounded-full bg-caribbeangreen-900 px-3 py-1.5 text-xs font-semibold text-caribbeangreen-50 sm:flex">
                <FiCheckCircle />
                Completed
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          <button
            type="button"
            disabled={!previousLecture || loading}
            onClick={() => navigateToLecture(previousLecture)}
            className="flex items-center gap-2 rounded-lg border border-richblack-600 bg-richblack-800 px-4 py-2.5 text-sm font-semibold text-richblack-50 transition hover:border-richblack-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft />
            Previous
          </button>

          {!isCompleted && (
            <button
              type="button"
              disabled={loading}
              onClick={handleLectureCompletion}
              className="flex items-center gap-2 rounded-lg border border-yellow-100 px-4 py-2.5 text-sm font-semibold text-yellow-50 transition hover:bg-yellow-50/10 disabled:opacity-50"
            >
              <FiCheckCircle />
              {loading ? "Saving..." : "Mark complete"}
            </button>
          )}

          <button
            type="button"
            disabled={!nextLecture || loading}
            onClick={() => navigateToLecture(nextLecture)}
            className="flex items-center gap-2 rounded-lg bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-richblack-900 transition hover:bg-yellow-25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoDetails
