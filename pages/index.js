import PassageLogin from '@/components/login'
import { getAuthenticatedUserFromSession } from '@/utils/passage'
import { useEffect } from 'react'
import Router from 'next/router';

export default function Home({isAuthorized}) {
  useEffect(()=> {
    if(isAuthorized){
      Router.push('/dashboard')
    }
  })
  
    return(
      <div className="container m-auto text-center bg-slate-600">
        <PassageLogin />
      </div>
    ) 
}


export const getServerSideProps = async (context) => {
  const loginProps = await getAuthenticatedUserFromSession(context.req, context.res)
    return {
      props: {
        isAuthorized: loginProps.isAuthorized?? false,
        userID: loginProps.userID?? ''
      },
    }
}