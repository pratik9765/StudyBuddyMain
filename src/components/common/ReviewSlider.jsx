import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import "../../App.css"
// Icons
import { FaQuoteLeft, FaStar } from "react-icons/fa"


// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 32

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  // console.log(reviews)

  return (
    <div className="w-full min-w-0 text-white">
      <div className="my-8 w-full sm:my-10">
        {reviews.length === 0 ? (
          <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-8 text-center text-richblack-300">
            No learner reviews are available yet.
          </div>
        ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={18}
          loop={reviews.length > 3}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          breakpoints={{
            640: {
              slidesPerView: Math.min(2, reviews.length),
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: Math.min(3, reviews.length),
              spaceBetween: 24,
            },
          }}
          className="review-slider !w-full !pb-12"
        >
          {reviews.map((review, i) => {
            const reviewText = review?.review || ""
            return (
              <SwiperSlide key={review?._id || i} className="!h-auto">
                <article className="flex h-full min-h-[270px] min-w-0 flex-col rounded-xl border border-richblack-700 bg-richblack-800 p-5 text-sm text-richblack-25 shadow-[0_18px_45px_rgba(0,0,0,0.18)] sm:p-6">
                  <FaQuoteLeft className="mb-5 text-2xl text-yellow-100/70" />

                  <p className="min-w-0 flex-1 break-words leading-6 text-richblack-100">
                    {reviewText.split(" ").length > truncateWords
                      ? `${reviewText
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")}…`
                      : reviewText}
                  </p>

                  <div className="mt-5 flex items-center gap-2">
                    <span className="font-semibold text-yellow-100">
                      {Number(review?.rating || 0).toFixed(1)}
                    </span>
                    <div
                      className="flex gap-1 text-yellow-100"
                      aria-label={`${review?.rating || 0} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <FaStar
                          key={starIndex}
                          className={
                            starIndex < Math.round(review?.rating || 0)
                              ? "text-yellow-100"
                              : "text-richblack-600"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex min-w-0 items-center gap-3 border-t border-richblack-700 pt-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt={`${review?.user?.firstName || "Learner"} profile`}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-richblack-5">{`${review?.user?.firstName || "Learner"} ${review?.user?.lastName || ""}`}</h3>
                      <p className="mt-0.5 truncate text-xs font-medium text-richblack-400">
                        {review?.course?.courseName}
                      </p>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            )
          })}
        </Swiper>
        )}
      </div>
    </div>
  )
}

export default ReviewSlider
