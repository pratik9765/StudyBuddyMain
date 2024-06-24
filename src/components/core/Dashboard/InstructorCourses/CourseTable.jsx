import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {Table, Thead, Tr, Th, Tbody, Td} from 'react-super-responsive-table'
import { COURSE_STATUS } from '../../../../utils/constants';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyles.css';
import { useNavigate } from 'react-router';

function CourseTable({courses, setCourses}) {

    const dispatch = useDispatch();
    const {token} = useState((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const navigate = useNavigate();

    const handleCourseDelete = async() => {
        setLoading(true);

        await deeteCourse({courseId:courseId}, token);
        const result = await fetchInstructorCourses(token);
        if(result){
            setCourses(result);
        }

        setConfirmationModal(null);
        setLoading(false);
    }

  return (
    <div className='text-white'>
        <Table>
            <Thead>
                <Tr>
                    <Th>Courses</Th>
                </Tr>
                <Tr>
                    <Th>Duration</Th>
                </Tr>
                <Tr>
                    <Th>Price</Th>
                </Tr>
                <Tr>
                    <Th>Actions</Th>
                </Tr>
            </Thead>

            <Tbody>
                {
                    courses.length === 0 ? (
                        <Tr>
                            <Td>
                                No courses found
                            </Td>
                        </Tr>
                    ) : 
                    (
                        courses?.map((course) => (
                            <Tr key={courses?._id} className='flex gap-x-10 border-richblack-800 p-8'>
                                <Td className='flex gap-x-4'>
                                    <img src={course?.thumbnail} alt="" 
                                        className='h-[150px] w-[220px] rounded-lg object-cover'
                                    />
                                    <div className='flex flex-col'>
                                        <p>{course.courseName}</p>
                                        <p>{course.courseDescription}</p>
                                        <p>Created : </p>
                                        {
                                            course.status === COURSE_STATUS.DRAFT ? (
                                                <p className='text-pink-50'>DRAFTED</p>
                                            ) :
                                            (
                                                <p className='text-yellow-50'>PUBLISHED</p>
                                            )
                                        }
                                    </div>
                                </Td>

                                <Td>
                                    2 hr 30 min
                                </Td>

                                <Td>
                                    ${course.price}
                                </Td>

                                <Td >
                                    <button
                                        disabled={loading}
                                        onClick={() => {
                                            navigate(`/dashboard/edit-course/${course._id}`)
                                        }}
                                        className='mr-[19px]'
                                    >
                                        EDIT
                                    </button>

                                    <button
                                        disabled={loading}
                                        onClick={() => {
                                            setConfirmationModal({
                                                text1:"Do you want to delete this course ?",
                                                text2:"All the data related to this course will be deleted?",
                                                btn1Text:"Delete",
                                                btn2Text:"Cancel",
                                                btn1Handler: !loading ? () =>
                                                 handleCourseDelete(course._id) : () => {},
                                                btn2Handler: !loading ? () =>
                                                    setConfirmationModal(null) : () => {}
                                            })
                                        }}
                                    >
                                        Delete
                                    </button>
                                </Td>
                            </Tr>
                        ))
                    )
                }
            </Tbody>
        </Table>

        {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default CourseTable