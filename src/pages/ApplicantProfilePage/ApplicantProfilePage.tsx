import { useState, useEffect } from 'react'
import { EditApplicantProfileModal } from '../../modals/EditApplicantProfileModal'
import { AddApplicantSkillModal } from '../../modals/AddApplicantSkillModal'
import { Applicant, JobApplication } from '../../entity/model'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

const hash = window.location.hash.substring(1)
const params = new URLSearchParams(hash)

const idToken = params.get('id_token')
if (idToken) {
     localStorage.setItem('id_token', idToken)
}

const accessToken = params.get('access_token')
if (accessToken) {
     localStorage.setItem('access_token', accessToken)
}
const getUserInfo = async () => {
     const accessTokenFromStorage = localStorage.getItem('access_token')
     if (!accessTokenFromStorage) {
          throw new Error('No access token found in storage.')
     }

     const userResponse = await fetch(
          'https://us-east-287wvnq12q.auth.us-east-2.amazoncognito.com/oauth2/userInfo',
          {
               headers: {
                    Authorization: `Bearer ${accessTokenFromStorage}`,
               },
          }
     )

     const userInfo = await userResponse.json()
     return userInfo
}

const API_URL =
     'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant'

const initialApplicantState: Applicant = new Applicant('', '')
initialApplicantState.skills = []
initialApplicantState.appliedJobs = []
initialApplicantState.offeredJobs = []
initialApplicantState.acceptedJobs = []
initialApplicantState.rejectedJobs = []

export const ApplicantProfilePage = () => {
     const [applicant, setApplicant] = useState<Applicant>(() => {
          const cached = sessionStorage.getItem('applicantData')
          if (cached) {
               try {
                    const data = JSON.parse(cached)
                    const loadedApplicant = new Applicant(data.appName || 'Applicant Profile', '')
                    loadedApplicant.skills = data.skills || []
                    loadedApplicant.appliedJobs = data.appliedJobs || []
                    loadedApplicant.offeredJobs = data.offeredJobs || []
                    loadedApplicant.acceptedJobs = data.acceptedJobs || []
                    loadedApplicant.rejectedJobs = data.rejectedJobs || []
                    return loadedApplicant
               } catch (e) {
                    console.error('Failed to parse cached applicant data:', e)
               }
          }
          return initialApplicantState
     })
     const [isLoading, setIsLoading] = useState(() => {
          // If we have cached data, start with isLoading false
          return !sessionStorage.getItem('applicantData')
     })
     const [showLoading, setShowLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)

     const [modalOpen, setModalOpen] = useState(false)
     const [addSkillModalOpen, setAddSkillModalOpen] = useState(false)
     const [applId, setApplId] = useState<string | null>(() => sessionStorage.getItem('applId'))

     const cacheApplicantData = (nextApplicant: Applicant) => {
          sessionStorage.setItem(
               'applicantData',
               JSON.stringify({
                    appName: nextApplicant.appName,
                    skills: nextApplicant.skills,
                    appliedJobs: nextApplicant.appliedJobs,
                    offeredJobs: nextApplicant.offeredJobs,
                    acceptedJobs: nextApplicant.acceptedJobs,
                    rejectedJobs: nextApplicant.rejectedJobs,
               })
          )
     }

     // Delayed loading indicator - only show if loading takes more than 200ms
     useEffect(() => {
          if (!isLoading) {
               setShowLoading(false)
               return
          }
          
          const timer = setTimeout(() => {
               setShowLoading(true)
          }, 200)
          
          return () => clearTimeout(timer)
     }, [isLoading])

     // Fetch user ID if not cached
     useEffect(() => {
          if (applId) return // Already have cached ID
          
          const fetchApplId = async () => {
               try {
                    const userInfo = await getUserInfo()
                    sessionStorage.setItem('applId', userInfo.sub)
                    setApplId(userInfo.sub)
               } catch (e: any) {
                    console.error('Error fetching user ID:', e)
                    setError(e.message)
                    setIsLoading(false)
               }
          }
          
          fetchApplId()
     }, [])

     useEffect(() => {
          if (!applId) return // Wait until applId is available
          
          const fetchApplicantData = async () => {
               try {
                    const idTokenFromStorage =
                         localStorage.getItem('id_token')
                    if (!idTokenFromStorage) {
                         throw new Error('No ID token found in storage.')
                    }

                    const response = await fetch(
                         `${API_URL}?appId=${applId}`,
                         {
                              headers: {
                                   Authorization: `Bearer ${idTokenFromStorage}`,
                              },
                         }
                    )

         
                    localStorage.setItem('appID', applId)
                    

                    let initialPayLoad={
                         appID: applId,
                         skillSet: []
                    }

                     const skillResponse = await fetch(
                         'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/add_applicant_skills',
                         {
                              method: 'POST',
                              body: JSON.stringify(initialPayLoad),
                              headers: {
                                   'Content-Type': 'application/json',
                                   Authorization: `Bearer ${idTokenFromStorage}`,
                              },
                         }
                    ).then((skillResponse) => skillResponse)


                    if (!response.ok) {
                         const errorData = await response.json()
                         throw new Error(
                              errorData.error ||
                                   `HTTP error! Status: ${response.status}`
                         )
                    }

                    const data = await response.json()

                    const loadedApplicant = new Applicant(
                         data.appName || 'Applicant Profile',
                         ''
                    )
                    loadedApplicant.skills = data.skills || []
                    loadedApplicant.appliedJobs = data.appliedJobs || []
                    loadedApplicant.offeredJobs = data.offeredJobs || []
                    loadedApplicant.acceptedJobs = data.acceptedJobs || []
                    loadedApplicant.rejectedJobs = data.rejectedJobs || []

                    // Cache the applicant data
                    sessionStorage.setItem('applicantData', JSON.stringify({
                         appName: data.appName,
                         skills: data.skills,
                         appliedJobs: data.appliedJobs,
                         offeredJobs: data.offeredJobs,
                         acceptedJobs: data.acceptedJobs,
                         rejectedJobs: data.rejectedJobs
                    }))

                    setApplicant(loadedApplicant)

                    const skillVal=await skillResponse
                    let skillData=await skillVal.json()

                    if (skillData[0].matched_count === 0) {
                         setAddSkillModalOpen(true)
                    }

               } catch (e: any) {
                    setError(e.message)
               } finally {
                    setIsLoading(false)
               }
          }

          fetchApplicantData()
     }, [applId])

     const handleWithdrawApplication = (jobAppId: String) => {
          const idToken = localStorage.getItem('id_token')
          const payload = {
               jobAppId: jobAppId,
          }
          setApplicant((prevApplicant) => ({
               ...prevApplicant,
               appliedJobs: prevApplicant.appliedJobs.filter(
                    (jobApp) => jobApp.jobAppId !== jobAppId
               ),
          }))

          // Clear cache since data changed
          sessionStorage.removeItem('applicantData')

          fetch(
               'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/withdraw_application',
               {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(payload),
               }
          ).then((response) => response.json())
     }

     const handleAcceptJobOffer = async (jobAppId: String) => {
          const idToken = localStorage.getItem('id_token')
          const payload = {
               jobAppId: jobAppId,
          }

          try {
               const response = await fetch(
                    'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/accept_offer',
                    {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${idToken}`,
                         },
                         body: JSON.stringify(payload),
                    }
               )

               if (!response.ok) {
                    throw new Error('Failed to accept offer')
               }

               setApplicant((prevApplicant) => {
                    const acceptedFromOffered = prevApplicant.offeredJobs.find(
                         (jobApp) => jobApp.jobAppId === jobAppId
                    )
                    const acceptedFromRejected = prevApplicant.rejectedJobs.find(
                         (jobApp) => jobApp.jobAppId === jobAppId
                    )
                    const acceptedJob = acceptedFromOffered || acceptedFromRejected

                    if (!acceptedJob) return prevApplicant

                    const nextApplicant = {
                         ...prevApplicant,
                         offeredJobs: prevApplicant.offeredJobs.filter(
                              (jobApp) => jobApp.jobAppId !== jobAppId
                         ),
                         rejectedJobs: prevApplicant.rejectedJobs.filter(
                              (jobApp) => jobApp.jobAppId !== jobAppId
                         ),
                         acceptedJobs: [...prevApplicant.acceptedJobs, acceptedJob],
                    }

                    cacheApplicantData(nextApplicant)
                    return nextApplicant
               })
          } catch (error) {
               console.log(error)
          }
     }

     const handleRejectJobOffer = async (jobAppId: String) => {
          const idToken = localStorage.getItem('id_token')
          const payload = {
               jobAppId: jobAppId,
          }

          try {
               const response = await fetch(
                    'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/reject_offer',
                    {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${idToken}`,
                         },
                         body: JSON.stringify(payload),
                    }
               )

               if (!response.ok) {
                    throw new Error('Failed to reject offer')
               }

               setApplicant((prevApplicant) => {
                    const rejectedFromOffered = prevApplicant.offeredJobs.find(
                         (jobApp) => jobApp.jobAppId === jobAppId
                    )
                    const rejectedFromAccepted = prevApplicant.acceptedJobs.find(
                         (jobApp) => jobApp.jobAppId === jobAppId
                    )
                    const rejectedJob = rejectedFromOffered || rejectedFromAccepted

                    if (!rejectedJob) return prevApplicant

                    const nextApplicant = {
                         ...prevApplicant,
                         offeredJobs: prevApplicant.offeredJobs.filter(
                              (jobApp) => jobApp.jobAppId !== jobAppId
                         ),
                         acceptedJobs: prevApplicant.acceptedJobs.filter(
                              (jobApp) => jobApp.jobAppId !== jobAppId
                         ),
                         rejectedJobs: [...prevApplicant.rejectedJobs, rejectedJob],
                    }

                    cacheApplicantData(nextApplicant)
                    return nextApplicant
               })

          } catch (error) {
               console.log(error)
          }
     }

     const open = () => {
          setModalOpen(true)
     }
     const close = () => {
          // Clear cache in case profile was edited
          sessionStorage.removeItem('applicantData')
          setModalOpen(false)
     }

     type WithdrawButtonProps = {
          jobAppId: String
     }
     const WithdrawButton = ({ jobAppId }: WithdrawButtonProps) => (
          <Button variant="yellow" size="sm" onClick={() => handleWithdrawApplication(jobAppId)}>
            Withdraw Application
          </Button>
     )
     type AcceptButtonProps = {
          jobAppId: String
     }
     const AcceptButton = ({ jobAppId }: AcceptButtonProps) => (
          <Button variant="secondary" size="sm" onClick={() => handleAcceptJobOffer(jobAppId)}>
            Accept
          </Button>
     )
     type RejectButtonProps = {
          jobAppId: String
     }
     const RejectButton = ({ jobAppId }: RejectButtonProps) => (
          <Button variant="danger" size="sm" onClick={() => handleRejectJobOffer(jobAppId)}>
            Reject
          </Button>
     )

     const appliedJobs = applicant.appliedJobs.map(
          (job: JobApplication) => ({
               title: job.jobName,
               skills:job.skillsNeeded || [],
               withdrawButton: <WithdrawButton jobAppId={job.jobAppId} />,
          })
     )

     const jobOffers = applicant.offeredJobs.map(
          (job: JobApplication) => ({
               title: job.jobName,
               skills:
                    job.skillsNeeded && job.skillsNeeded.length > 0
                         ? job.skillsNeeded.join(', ')
                         : 'No skills listed',
               acceptButton: <AcceptButton jobAppId={job.jobAppId} />,
               rejectButton: <RejectButton jobAppId={job.jobAppId} />,
          })
     )

     const acceptedOffers = applicant.acceptedJobs.map(
          (job: JobApplication) => ({
               title: job.jobName,
               skills:
                    job.skillsNeeded && job.skillsNeeded.length > 0
                         ? job.skillsNeeded.join(', ')
                         : 'No skills listed',
               rejectButton: <RejectButton jobAppId={job.jobAppId} />,
          })
     )

     const rejectedOffers = applicant.rejectedJobs.map(
          (job: JobApplication) => ({
               title: job.jobName,
               skills:
                    job.skillsNeeded && job.skillsNeeded.length > 0
                         ? job.skillsNeeded.join(', ')
                         : 'No skills listed',
               acceptButton: <AcceptButton jobAppId={job.jobAppId} />,
          })
     )

     const jobCard =
          'bg-white border-2 sm:border-4 border-foreground shadow-bauhaus p-4 mb-4'
     const renderedAppliedJobs = appliedJobs.map((j, index) => (
          <div className={jobCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                         <h4 className="font-bold text-foreground">{j.title}</h4>
                         <p className="text-sm text-foreground/80 mt-1">
                              {j.skills?.map((s) => String(s).trim()).filter(Boolean).join(', ') || 'No skills listed'}
                         </p>
                    </div>
                    <div>{j.withdrawButton}</div>
               </div>
          </div>
     ))

     const renderedJobOffers = jobOffers.map((j, index) => (
          <div className={jobCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                         <h4 className="font-bold text-foreground">{j.title}</h4>
                         <p className="text-sm text-foreground/80 mt-1">{j.skills}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">{j.acceptButton}{j.rejectButton}</div>
               </div>
          </div>
     ))

     const renderedAcceptedOffers = acceptedOffers.map((j, index) => (
          <div className={jobCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                         <h4 className="font-bold text-foreground">{j.title}</h4>
                         <p className="text-sm text-foreground/80 mt-1">{j.skills}</p>
                    </div>
                    <div>{j.rejectButton}</div>
               </div>
          </div>
     ))

     const renderedRejectedOffers = rejectedOffers.map((j, index) => (
          <div className={jobCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                         <h4 className="font-bold text-foreground">{j.title}</h4>
                         <p className="text-sm text-foreground/80 mt-1">{j.skills}</p>
                    </div>
                    <div>{j.acceptButton}</div>
               </div>
          </div>
     ))

     const navigate = useNavigate()
     const goToSearchJobsPage = () => {
          navigate('/pages/ApplicantSearchPage')
     }

     const handleLogout = () => {
          localStorage.removeItem('id_token')
          localStorage.removeItem('access_token')
          sessionStorage.clear()
          window.location.href = `https://us-east-287wvnq12q.auth.us-east-2.amazoncognito.com/logout?client_id=56b9am2f224tmcu9kheie970rj&logout_uri=${process.env.REACT_APP_REDIRECT_URL}/pages/RoleSelectionPage`
     }

     if (showLoading) {
          return (
               <main className="min-h-screen bg-background border-b-4 border-foreground">
                    <section className="max-w-7xl mx-auto py-12 px-4">
                         <h1 className="font-black text-2xl uppercase text-foreground">Loading Profile...</h1>
                         <div className="mt-4 h-2 w-full bg-muted border-2 border-foreground max-w-md">
                              <div className="h-full bg-primary-blue animate-pulse" style={{ width: '50%' }} />
                         </div>
                    </section>
               </main>
          )
     }

     if (error) {
          return (
               <main className="min-h-screen bg-background border-b-4 border-foreground">
                    <section className="max-w-7xl mx-auto py-12 px-4">
                         <h1 className="font-black text-2xl uppercase text-foreground">Error</h1>
                         <p className="mt-2 font-medium text-primary-red">Failed to load applicant data: {error}</p>
                    </section>
               </main>
          )
     }

     // Don't render content until data is loaded
     if (isLoading && !applicant.appName) {
          return null
     }

     return (
          <>
               <main className="min-h-screen bg-background border-b-4 border-foreground">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                         <div className="flex flex-wrap justify-end gap-3 mb-6">
                              <Button variant="primary" size="md" onClick={open}>Edit Profile</Button>
                              <Button variant="primary" size="md" onClick={goToSearchJobsPage}>Find Jobs</Button>
                              <Button variant="secondary" size="md" onClick={handleLogout}>Logout</Button>
                         </div>
                         <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-foreground text-center mt-6">
                              {applicant.appName}
                         </h1>
                         <h2 className="font-medium text-lg sm:text-xl text-foreground/80 text-center mt-2">
                              Skills: {applicant.skills.join(', ')}
                         </h2>
                         <EditApplicantProfileModal
                              isOpen={modalOpen}
                              onClose={close}
                              applicant={applicant}
                              setApplicant={setApplicant}
                         />
                         <AddApplicantSkillModal
                              isOpen={addSkillModalOpen}
                              onClose={() => {
                                   sessionStorage.removeItem('applicantData')
                                   setAddSkillModalOpen(false)
                              }}
                              applicant={applicant}
                              setApplicant={setApplicant}
                         />

                         <div className="mt-10 bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
                              <h3 className="font-bold text-xl uppercase tracking-wider border-b-2 border-foreground pb-2 mb-4">Applied Jobs</h3>
                              {renderedAppliedJobs}
                         </div>
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                              <div className="bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
                                   <h3 className="font-bold text-xl uppercase tracking-wider border-b-2 border-foreground pb-2 mb-4">New Job Offers</h3>
                                   {renderedJobOffers}
                              </div>
                              <div className="bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
                                   <h3 className="font-bold text-xl uppercase tracking-wider border-b-2 border-foreground pb-2 mb-4">Accepted Job Offers</h3>
                                   {renderedAcceptedOffers}
                              </div>
                              <div className="bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
                                   <h3 className="font-bold text-xl uppercase tracking-wider border-b-2 border-foreground pb-2 mb-4">Rejected Job Offers</h3>
                                   {renderedRejectedOffers}
                              </div>
                         </div>
                    </div>
               </main>
          </>
     )
}
