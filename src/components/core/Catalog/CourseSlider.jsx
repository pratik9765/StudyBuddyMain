import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import {FreeMode, Pagination} from 'swiper'
import Course_Card from './Course_Card';

function CourseSlider({Courses}) {
  return (
    <>
        {
            Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    spaceBetween={200}
                    pagination={true}
                    modules={[Pagination]}
                    className='mySwiper'
                >
                    {
                        Courses.map((course,index) => (
                            <SwiperSlide key={index} >
                                <Course_Card course={course} Height={"h-[250px]"}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            ) : 
            (<p>No Course Found </p>)
        }
    </>
  )
}

export default CourseSlider