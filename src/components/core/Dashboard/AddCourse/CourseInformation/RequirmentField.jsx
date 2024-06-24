import React, { useState, useEffect } from 'react'

function RequirmentField({name,label,setValue,register,getValues,errors}) {

    const [requirment, setRequirment] = useState("");
    const [requirmentList,setRequirmentList] = useState([]);

    useEffect(() => {
        register(name, {
            required:true,
            validateHeaderName:(value) => value.length > 0
        })
    }, []);

    useEffect(() => {
        setValue(name,requirmentList);
    },[requirmentList]);

    const handleAddRequirment = () => {
        if(requirment){
            setRequirmentList([...requirmentList,requirment])
            requirment("");
        }

    }

    const handleRemoveRequirment = (index) => {
        const updatedRequirmentList = [...requirmentList];
        updatedRequirmentList.splice(index,1);
        setRequirmentList(updatedRequirmentList)
    }


  return (
    <div>
        <label htmlFor={name}>{label} <sup>*</sup></label>
        <div>
            <input 
                type="text" 
                id={name}
                value={requirment}
                onChange={(e) => setRequirment(e.target.value)}
                className='w-full'
            />
            <button
                type='submit'
                onClick={handleAddRequirment}
                className='font-semibold text-yellow-50'
            >
                Add
            </button>
        </div>

        {
            requirmentList.length > 0 && (
                <ul>
                    {
                        requirmentList.map((requirment,index) => (
                            <li key={index} className='flex items-center text-richblack-5'>
                                <span>{requirment}</span>
                                <button type='button'
                                    onClick={() => handleRemoveRequirment(index)}
                                    className='text-xs text-pure-greys-300'
                                    >

                                    Clear
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
        {
            errors[name] && (
                <span>
                    {label} is required
                </span>
            )
        }
    </div>
  )
}

export default RequirmentField