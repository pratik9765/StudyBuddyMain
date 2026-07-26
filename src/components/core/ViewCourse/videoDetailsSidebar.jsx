import { useEffect, useMemo, useState } from "react"
import {
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiPlayCircle,
  FiStar,
  FiX,
} from "react-icons/fi"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

export default function VideoDetailsSidebar({
  isOpen,
  onClose,
  setReviewModal,
}) {
  const [openSections, setOpenSections] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  const completedIds = useMemo(
    () => new Set((completedLectures || []).map(String)),
    [completedLectures]
  )
  const completedCount = Math.min(completedIds.size, totalNoOfLectures)
  const progress =
    totalNoOfLectures > 0
      ? Math.round((completedCount / totalNoOfLectures) * 100)
      : 0

  useEffect(() => {
    if (sectionId) {
      setOpenSections((current) =>
        current.includes(sectionId) ? current : [...current, sectionId]
      )
    }
  }, [location.pathname, sectionId])

  const toggleSection = (id) => {
    setOpenSections((current) =>
      current.includes(id)
        ? current.filter((section) => section !== id)
        : [...current, id]
    )
  }

  const sidebar = (
    <aside className="flex h-full w-[88vw] max-w-[360px] flex-col border-r border-richblack-700 bg-richblack-800 shadow-2xl lg:w-[350px] lg:shadow-none">
      <div className="border-b border-richblack-700 p-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/enrolled-courses")}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-richblack-200 transition hover:bg-richblack-700 hover:text-richblack-5"
          >
            <FiArrowLeft />
            My courses
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-richblack-200 hover:bg-richblack-700 lg:hidden"
            aria-label="Close course content"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <h2 className="mt-4 line-clamp-2 text-lg font-semibold leading-6 text-richblack-5">
          {courseEntireData?.courseName}
        </h2>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-medium">
            <span className="text-richblack-200">Course progress</span>
            <span className="text-yellow-50">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-richblack-600">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-100 to-yellow-50 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-richblack-400">
            {completedCount} of {totalNoOfLectures} lessons completed
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReviewModal(true)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-richblack-600 px-4 py-2.5 text-sm font-semibold text-richblack-50 transition hover:border-yellow-100 hover:text-yellow-50"
        >
          <FiStar />
          Leave a review
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {courseSectionData.map((section, sectionIndex) => {
          const isOpen = openSections.includes(section._id)
          const sectionCompleted = section.subSection.filter((lecture) =>
            completedIds.has(String(lecture._id))
          ).length

          return (
            <div key={section._id} className="border-b border-richblack-700/70">
              <button
                type="button"
                onClick={() => toggleSection(section._id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-richblack-700/60"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-richblack-400">
                    Section {sectionIndex + 1}
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-richblack-25">
                    {section.sectionName}
                  </p>
                  <p className="mt-1 text-xs text-richblack-400">
                    {sectionCompleted}/{section.subSection.length} completed
                  </p>
                </div>
                <FiChevronDown
                  className={`shrink-0 text-richblack-300 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="pb-2">
                  {section.subSection.map((lecture, lectureIndex) => {
                    const isActive = lecture._id === subSectionId
                    const isCompleted = completedIds.has(String(lecture._id))

                    return (
                      <button
                        type="button"
                        key={lecture._id}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${lecture._id}`
                          )
                          onClose()
                        }}
                        className={`group flex w-full items-center gap-3 border-l-2 px-5 py-3 text-left transition ${
                          isActive
                            ? "border-yellow-50 bg-yellow-50/10"
                            : "border-transparent hover:bg-richblack-700/60"
                        }`}
                      >
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${
                            isCompleted
                              ? "border-caribbeangreen-200 bg-caribbeangreen-200 text-richblack-900"
                              : isActive
                              ? "border-yellow-50 text-yellow-50"
                              : "border-richblack-500 text-richblack-300"
                          }`}
                        >
                          {isCompleted ? (
                            <FiCheck />
                          ) : (
                            <FiPlayCircle className="text-sm" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block truncate text-sm ${
                              isActive
                                ? "font-semibold text-yellow-50"
                                : "text-richblack-100 group-hover:text-richblack-5"
                            }`}
                          >
                            {lecture.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-richblack-400">
                            Lesson {lectureIndex + 1}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )

  return (
    <>
      <div className="sticky top-0 hidden h-[calc(100vh-3.5rem)] shrink-0 lg:block">
        {sidebar}
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-richblack-900/80 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close course content"
          />
          <div className="relative h-full">{sidebar}</div>
        </div>
      )}
    </>
  )
}
