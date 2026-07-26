import { useEffect, useState } from "react"

import Footer from "../components/common/Footer"
import CourseCard from "../components/core/Catalog/Course_Card"
import { getAllCourses } from "../services/operations/courseDetailsAPI"

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCourses = async () => {
      const publishedCourses = await getAllCourses()
      setCourses(publishedCourses || [])
      setLoading(false)
    }

    loadCourses()
  }, [])

  return (
    <>
      <main className="min-h-[calc(100vh-3.5rem)]">
        <section className="bg-richblack-800 px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-maxContent">
            <p className="text-sm font-medium uppercase tracking-widest text-yellow-50">
              Explore and learn
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-richblack-5 sm:text-4xl">
              All Courses
            </h1>
            <p className="mt-4 max-w-2xl text-richblack-200">
              Browse published courses, view their curriculum, and enroll from
              the course details page.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-maxContent px-4 py-10 sm:py-14">
          {loading ? (
            <div className="grid min-h-[280px] place-items-center">
              <div className="spinner" />
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  Height="h-[220px] sm:h-[240px]"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-10 text-center">
              <p className="text-xl font-semibold text-richblack-5">
                No published courses yet
              </p>
              <p className="mt-2 text-richblack-300">
                Published instructor courses will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
