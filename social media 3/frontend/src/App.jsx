import React from 'react'
import {Routes,Route} from "react-router-dom"
import {Toaster} from "react-hot-toast"
import {useQuery} from "@tanstack/react-query"
import {Navigate} from "react-router-dom"
import {HomePage, LoginPage, SigninPage} from "./pages"
import LoadingSpinner from './components/common/LoadingSpinner'
import Sidebar from './components/common/Sidebar'

const App = () => {
  const [data, isLoading] = useQuery({
    queryKey: ["authuser"],
    queryFn: async () => {
      try{
        const res = await fetch("/api/auth/getuser")
        let data = await res.json()
        if(!data) {
          return null
        }
        if(!res.ok) {
          throw new Error(data.error || "Something went wrong")
        }
      }
      catch(error) {
        console.log(error.message)
        throw error
      }
    },
    retry: false
  })
  if(isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/> 
      </div>
    )
  }
  return (
    <div className='flex max-w-6xl mx-auto'>
      {data && <Sidebar />}
      <Routes>
        <Route 
          path='/'
          element = {data ? <HomePage /> : <Navigate to={"/login"} />}
        />
        <Route
          path='/login'
          element = {!data ? <LoginPage /> : <Navigate to = {"/"} />} 
        /> 
        <Route
          path='/signup'
          element = {!data ? <SigninPage /> : <Navigate to={"/"}/>} 
        />
        
      </Routes>
      
    </div>
  )
}

export default App
