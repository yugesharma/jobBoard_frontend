import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

const API_URL =
     'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/get_applicants_for_job'

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

export const ReviewJobPage = () => {
     const location = useLocation()
     const { state } = location as { state?: { jobID?: string } }
     const jobID = state?.jobID || ''
     const cacheKey = `reviewJobData:${jobID}`
     const cachedData = (() => {
          if (!jobID) return null
          try {
               const cached = sessionStorage.getItem(cacheKey)
               return cached ? JSON.parse(cached) : null
          } catch {
               return null
          }
     })()
     const [jobName, setJobName] = useState(cachedData?.jobName || '')
     const [skillsNeeded, setSkillsNeeded] = useState(
          cachedData?.skillsNeeded || ''
     )
     const [waitlistedApplicants, setWaitlistedApplicants] = useState<any[]>(
          cachedData?.waitlistedApplicants || []
     )
     const [hirableApplicants, setHirableApplicants] = useState<any[]>(
          cachedData?.hirableApplicants || []
     )
     const [unacceptableApplicants, setUnacceptableApplicants] = useState<any[]>(
          cachedData?.unacceptableApplicants || []
     )
     const [offeredApplicants, setOfferedApplicants] = useState<any[]>(
          cachedData?.offeredApplicants || []
     )
     const [hiredApplicants, setHiredApplicants] = useState<any[]>(
          cachedData?.hiredApplicants || []
     )
     const [offersRejected, setOffersRejected] = useState<any[]>(
          cachedData?.offersRejected || []
     )
     const [error, setError] = useState<String | null>(null)
     const [isLoading, setIsLoading] = useState(!cachedData)
     const [showLoading, setShowLoading] = useState(false)
     const [waitlistedPagination, setWaitlistedPagination] = useState(0)
     const [hirablePagination, setHirablePagination] = useState(0)
     const [unacceptablePagination, setUnacceptablePagination] =
          useState(0)
     const [offeredPagination, setOfferedPagination] = useState(0)
     const [hiredPagination, setHiredPagination] = useState(0)
     const [rejectedPagination, setRejectedPagination] = useState(0)
     const [waitlistedTotal, setWaitlistedTotal] = useState(
          cachedData?.waitlistedTotal || 0
     )
     const [hirableTotal, setHirableTotal] = useState(
          cachedData?.hirableTotal || 0
     )
     const [unacceptableTotal, setUnacceptableTotal] = useState(
          cachedData?.unacceptableTotal || 0
     )
     const [offeredTotal, setOfferedTotal] = useState(
          cachedData?.offeredTotal || 0
     )
     const [hiredTotal, setHiredTotal] = useState(cachedData?.hiredTotal || 0)
     const [rejectedTotal, setRejectedTotal] = useState(
          cachedData?.rejectedTotal || 0
     )
     const PAGE_SIZE = 5

     useEffect(() => {
          if (!isLoading) {
               setShowLoading(false)
               return
          }

          const timer = setTimeout(() => {
               setShowLoading(true)
          }, 500)

          return () => clearTimeout(timer)
     }, [isLoading])

     const nextPage = (
          setter: React.Dispatch<React.SetStateAction<number>>
     ) => {
          setter((prev) => prev + PAGE_SIZE)
     }
     const prevPage = (
          setter: React.Dispatch<React.SetStateAction<number>>
     ) => {
          setter((prev) => Math.max(prev - PAGE_SIZE, 0)) 
     }

     const fetchJobData = async () => {
          try {
               const idToken = localStorage.getItem('id_token')

               const response = await fetch(`${API_URL}`, {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({
                         jobId: jobID,
                         pageSize: PAGE_SIZE,
                         offsets: [
                              waitlistedPagination,
                              hirablePagination,
                              unacceptablePagination,
                              offeredPagination,
                              hiredPagination,
                              rejectedPagination,
                         ],
                    }),
               })

               if (!response.ok) {
                    throw new Error(
                         `HTTP error! Status: ${response.status}`
                    )
               }

               const data = await response.json()
               setJobName(data.jobName.jobName)
               setSkillsNeeded(data.skills.join(', '))
               setWaitlistedApplicants(data.waitlistedApplicants)
               setHirableApplicants(data.hirableApplicants)
               setUnacceptableApplicants(data.unacceptableApplicants)
               setOfferedApplicants(data.offeredApplicants)
               setHiredApplicants(data.hiredApplicants)
               setOffersRejected(data.rejectedByApplicants)
               setWaitlistedTotal(data.counts.waitlistedTotal)
               setHirableTotal(data.counts.hirableTotal)
               setUnacceptableTotal(data.counts.unacceptableTotal)
               setOfferedTotal(data.counts.offeredTotal)
               setHiredTotal(data.counts.hiredTotal)
               setRejectedTotal(data.counts.rejectedTotal)

               if (
                    waitlistedPagination === 0 &&
                    hirablePagination === 0 &&
                    unacceptablePagination === 0 &&
                    offeredPagination === 0 &&
                    hiredPagination === 0 &&
                    rejectedPagination === 0
               ) {
                    sessionStorage.setItem(
                         cacheKey,
                         JSON.stringify({
                              jobName: data.jobName.jobName,
                              skillsNeeded: data.skills.join(', '),
                              waitlistedApplicants: data.waitlistedApplicants,
                              hirableApplicants: data.hirableApplicants,
                              unacceptableApplicants:
                                   data.unacceptableApplicants,
                              offeredApplicants: data.offeredApplicants,
                              hiredApplicants: data.hiredApplicants,
                              offersRejected: data.rejectedByApplicants,
                              waitlistedTotal: data.counts.waitlistedTotal,
                              hirableTotal: data.counts.hirableTotal,
                              unacceptableTotal:
                                   data.counts.unacceptableTotal,
                              offeredTotal: data.counts.offeredTotal,
                              hiredTotal: data.counts.hiredTotal,
                              rejectedTotal: data.counts.rejectedTotal,
                         })
                    )
               }
          } catch (e: any) {
               setError(e.message)
          } finally {
               setIsLoading(false)
          }
     }

     useEffect(() => {
          fetchJobData()
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [
          waitlistedPagination,
          hirablePagination,
          unacceptablePagination,
          offeredPagination,
          hiredPagination,
          rejectedPagination,
     ])

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

     if (isLoading && !jobName) {
          return null
     }

     if (error) {
          return (
               <main className="min-h-screen bg-background border-b-4 border-foreground">
                    <section className="max-w-7xl mx-auto py-12 px-4">
                         <h1 className="font-black text-2xl uppercase text-foreground">Error</h1>
                         <p className="mt-2 font-medium text-primary-red">Failed to load company data: {error}</p>
                    </section>
               </main>
          )
     }

     const handleRateApplicant = async (
          jobAppId: string,
          rating: string
     ) => {
          const idToken = localStorage.getItem('id_token')
          let testPayload = {
               appId: jobAppId,
               status: rating,
          }
          const applicant =
               waitlistedApplicants.find((a) => a.jobAppId === jobAppId) ||
               hirableApplicants.find((a) => a.jobAppId === jobAppId) ||
               unacceptableApplicants.find((a) => a.jobAppId === jobAppId)

          const removeFromCurrentList = (applicant: any) => {
               if (applicant) {
                    if (waitlistedApplicants.includes(applicant)) {
                         setWaitlistedApplicants(
                              waitlistedApplicants.filter(
                                   (a) => a.jobAppId !== jobAppId
                              )
                         )
                    } else if (hirableApplicants.includes(applicant)) {
                         setHirableApplicants(
                              hirableApplicants.filter(
                                   (a) => a.jobAppId !== jobAppId
                              )
                         )
                    } else if (
                         unacceptableApplicants.includes(applicant)
                    ) {
                         setUnacceptableApplicants(
                              unacceptableApplicants.filter(
                                   (a) => a.jobAppId !== jobAppId
                              )
                         )
                    }
               }
          }
          removeFromCurrentList(applicant)

          if (rating === 'waitList') {
               setWaitlistedApplicants([
                    ...waitlistedApplicants,
                    applicant,
               ])
          } else if (rating === 'hirable') {
               setHirableApplicants([...hirableApplicants, applicant])
          } else if (rating === 'unacceptable') {
               setUnacceptableApplicants([
                    ...unacceptableApplicants,
                    applicant,
               ])
          }

          const response = await fetch(
               'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/rate_applicant',
               {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(testPayload),
               }
          )
          await response.json()
          await fetchJobData()
     }

     const handleExtendOffer = async (jobAppId: string) => {
          const idToken = localStorage.getItem('id_token')
          let testPayload = {
               appId: jobAppId,
          }
          const response = await fetch(
               'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/extend_job_offer',
               {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(testPayload),
               }
          )
          await response.json()
          await fetchJobData()
     }

     const handleWithdrawRescindOffer = async (jobAppId: string) => {
          const idToken = localStorage.getItem('id_token')
          let testPayload = {
               appId: jobAppId,
          }
          const response = await fetch(
               'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/withdraw_rescind_job_offer',
               {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify(testPayload),
               }
          )
          await response.json()
          await fetchJobData()
     }

     type ExtendOfferButtonProps = {
          jobAppId: string
     }
     const ExtendOfferButton = ({ jobAppId }: ExtendOfferButtonProps) => (
          <Button variant="secondary" size="sm" onClick={() => handleExtendOffer(jobAppId)}>
               Extend Offer
          </Button>
     )

     type WithdrawOfferButtonProps = {
          jobAppId: string
     }
     const WithdrawOfferButton = ({ jobAppId }: WithdrawOfferButtonProps) => (
          <Button variant="yellow" size="sm" onClick={() => handleWithdrawRescindOffer(jobAppId)}>
               Withdraw Offer
          </Button>
     )

     const RescindOfferButton = ({ jobAppId }: WithdrawOfferButtonProps) => (
          <Button variant="danger" size="sm" onClick={() => handleWithdrawRescindOffer(jobAppId)}>
               Rescind Offer
          </Button>
     )

     type PaginateListProps = {
          offset: number
          total: number
          setter: React.Dispatch<React.SetStateAction<number>>
     }
     const PaginationButtons = ({ offset, total, setter }: PaginateListProps) => (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t-2 border-foreground/30">
               <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => prevPage(setter)}>
                    <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
               </Button>
               <Button variant="outline" size="sm" disabled={PAGE_SIZE + offset >= total} onClick={() => nextPage(setter)}>
                    <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
               </Button>
          </div>
     )

     type RateApplicantButtonProps = {
          jobAppId: string
     }
     const applicantCard = 'bg-white border-2 sm:border-4 border-foreground shadow-bauhaus p-4 mb-4'
     const RateApplicantButton = ({ jobAppId }: RateApplicantButtonProps) => {
          const [open, setOpen] = useState(false)
          return (
               <div className="relative">
                    <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
                         <span className="uppercase font-bold text-xs">Rate</span>
                         <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                    </Button>
                    {open && (
                         <div className="absolute top-full left-0 mt-2 z-10 bg-white border-2 sm:border-4 border-foreground shadow-[4px_4px_0px_0px_black] min-w-[150px]">
                              <button
                                   type="button"
                                   className="block w-full text-left px-4 py-3 font-bold text-sm uppercase tracking-wide hover:bg-muted/50 border-b-2 border-foreground/20 transition-colors last:border-0"
                                   onClick={() => { handleRateApplicant(jobAppId, 'waitList'); setOpen(false) }}
                              >
                                   Waitlist
                              </button>
                              <button
                                   type="button"
                                   className="block w-full text-left px-4 py-3 font-bold text-sm uppercase tracking-wide hover:bg-muted/50 border-b-2 border-foreground/20 transition-colors last:border-0"
                                   onClick={() => { handleRateApplicant(jobAppId, 'hirable'); setOpen(false) }}
                              >
                                   Hirable
                              </button>
                              <button
                                   type="button"
                                   className="block w-full text-left px-4 py-3 font-bold text-sm uppercase tracking-wide hover:bg-muted/50 transition-colors"
                                   onClick={() => { handleRateApplicant(jobAppId, 'unacceptable'); setOpen(false) }}
                              >
                                   Unacceptable
                              </button>
                         </div>
                    )}
               </div>
          )
     }

     const renderWaitlistedApplicants = waitlistedApplicants.map((a, index) => (
          <div className={applicantCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                         <h4 className="font-bold text-lg text-foreground">{a.appName}</h4>
                         <p className="text-sm text-foreground/70 mt-1 font-medium">{a.app_skills}</p>
                    </div>
                    <div className="flex-shrink-0">
                         <RateApplicantButton jobAppId={a.jobAppId} />
                    </div>
               </div>
          </div>
     ))

     const renderHirableApplicants = hirableApplicants.map((a, index) => (
          <div className={applicantCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                         <h4 className="font-bold text-lg text-foreground">{a.appName}</h4>
                         <p className="text-sm text-foreground/70 mt-1 font-medium">{a.app_skills}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
                         <RateApplicantButton jobAppId={a.jobAppId} />
                         <ExtendOfferButton jobAppId={a.jobAppId} />
                    </div>
               </div>
          </div>
     ))

     const renderUnacceptableApplicants = unacceptableApplicants.map((a, index) => (
          <div className={applicantCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                         <h4 className="font-bold text-lg text-foreground">{a.appName}</h4>
                         <p className="text-sm text-foreground/70 mt-1 font-medium">{a.app_skills}</p>
                    </div>
                    <div className="flex-shrink-0">
                         <RateApplicantButton jobAppId={a.jobAppId} />
                    </div>
               </div>
          </div>
     ))

     const renderOfferedApplicants = offeredApplicants.map((a, index) => (
          <div className={applicantCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                         <h4 className="font-bold text-lg text-foreground">{a.appName}</h4>
                         <p className="text-sm text-foreground/70 mt-1 font-medium">{a.app_skills}</p>
                    </div>
                    <div className="flex-shrink-0">
                         <WithdrawOfferButton jobAppId={a.jobAppId} />
                    </div>
               </div>
          </div>
     ))

     const renderHiredApplicants = hiredApplicants.map((a, index) => (
          <div className={applicantCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                         <h4 className="font-bold text-lg text-foreground">{a.appName}</h4>
                         <p className="text-sm text-foreground/70 mt-1 font-medium">{a.app_skills}</p>
                    </div>
                    <div className="flex-shrink-0">
                         <RescindOfferButton jobAppId={a.jobAppId} />
                    </div>
               </div>
          </div>
     ))

     const renderOffersRejected = offersRejected.map((a, index) => (
          <div className={applicantCard} key={index}>
               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                         <h4 className="font-bold text-lg text-foreground">{a.appName}</h4>
                         <p className="text-sm text-foreground/70 mt-1 font-medium">{a.app_skills}</p>
                    </div>
                    <div className="flex-shrink-0">
                         <ExtendOfferButton jobAppId={a.jobAppId} />
                    </div>
               </div>
          </div>
     ))

     const sectionBox = 'bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6'
     const sectionTitle = 'font-bold text-xl sm:text-2xl uppercase tracking-wider border-b-2 sm:border-b-4 border-foreground pb-3 mb-6'
     const applicantItemBox = 'bg-white border-2 border-foreground shadow-[3px_3px_0px_0px_black] p-4 mb-4 hover:-translate-y-0.5 transition-transform duration-200'

     return (
          <main className="min-h-screen bg-background border-b-4 border-foreground">
               <section className="max-w-screen-2xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
                    <div className="bg-primary-blue text-white border-2 sm:border-4 border-foreground shadow-[4px_4px_0px_0px_black] p-4 sm:p-6 mb-12">
                         <h1 className="font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tighter leading-tight">Job: {jobName}</h1>
                         <p className="font-bold text-sm sm:text-base mt-3 uppercase tracking-wide">Skills Required: {skillsNeeded}</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                         <div className={sectionBox}>
                              <h3 className={sectionTitle}>Waitlisted</h3>
                              <div className="space-y-4">
                                   {renderWaitlistedApplicants}
                              </div>
                              <PaginationButtons offset={waitlistedPagination} total={waitlistedTotal} setter={setWaitlistedPagination} />
                         </div>
                         <div className={sectionBox}>
                              <h3 className={sectionTitle}>Hirable</h3>
                              <div className="space-y-4">
                                   {renderHirableApplicants}
                              </div>
                              <PaginationButtons offset={hirablePagination} total={hirableTotal} setter={setHirablePagination} />
                         </div>
                         <div className={sectionBox}>
                              <h3 className={sectionTitle}>Unacceptable</h3>
                              <div className="space-y-4">
                                   {renderUnacceptableApplicants}
                              </div>
                              <PaginationButtons offset={unacceptablePagination} total={unacceptableTotal} setter={setUnacceptablePagination} />
                         </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
                         <div className={sectionBox}>
                              <h3 className={sectionTitle}>Offer Extended</h3>
                              <div className="space-y-4">
                                   {renderOfferedApplicants}
                              </div>
                              <PaginationButtons offset={offeredPagination} total={offeredTotal} setter={setOfferedPagination} />
                         </div>
                         <div className={sectionBox}>
                              <h3 className={sectionTitle}>Hired</h3>
                              <div className="space-y-4">
                                   {renderHiredApplicants}
                              </div>
                              <PaginationButtons offset={hiredPagination} total={hiredTotal} setter={setHiredPagination} />
                         </div>
                         <div className={sectionBox}>
                              <h3 className={sectionTitle}>Offers Rejected By</h3>
                              <div className="space-y-4">
                                   {renderOffersRejected}
                              </div>
                              <PaginationButtons offset={rejectedPagination} total={rejectedTotal} setter={setRejectedPagination} />
                         </div>
                    </div>
               </section>
          </main>
     )
}
