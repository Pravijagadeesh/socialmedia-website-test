import React from 'react'
import {Link, useRouteError} from "react-router-dom"
import {useState,useEffect} from "react"
import Xsvg from "../../../components/svgs/X"
import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import {Mutation, useMutation} from "@tanstack/react-query"
import toast from "react-hot-toast"
  
const SigninPage = () => {
    const [formData, setFormData] = useState({
        userName: "",
        fullName: "",
        email: "",
        password: "",
    })
    console.log(formData)

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ userName , fullName , email, password}) => {
            try{
                const res = await fetch("/api/auth/v1/signup",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userName,fullName,email,password}),
                })
                const data = await res.json()

                if(!res.ok) {
                    throw new Error(data.error || "Failed to create account")
                }
                return data
            }
            catch(error) {
                console.log(error.message)
                throw error
            }
        },

        onSuccess: () => toast.success("Account created successfully"),
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        mutate(formData)
    }

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <Xsvg className= "lg:w-2/3 fill-white" />
      </div>
    </div>
  )
}

export default SigninPage
