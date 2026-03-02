import React, { useState, useEffect } from 'react'
import { Company } from '../../entity/model'
import { useNavigate } from 'react-router-dom'
import { EditCompanyProfileModal } from '../../modals/EditCompanyProfileModal'
import { ApplicantCountModal } from '../../modals/ApplicantCountModal'
import { Button } from '../../components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const API_URL =
  'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company'
const UPDATE_JOB_API_URL =
  'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/update_job_status'

const hash = window.location.hash.substring(1)
const params = new URLSearchParams(hash)
const idToken = params.get('id_token')
if (idToken) localStorage.setItem('id_token', idToken)
const accessToken = params.get('access_token')
if (accessToken) localStorage.setItem('access_token', accessToken)

const initialCompanyState: Company = new Company('', '')

export const CompanyProfilePage = () => {
  const [company, setCompany] = useState<Company>(initialCompanyState)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoading, setShowLoading] = useState(false)
  const [error, setError] = useState<String | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [inactivePagination, setInactivePagination] = useState(0)
  const [activePagination, setActivePagination] = useState(0)
  const [closedPagination, setClosedPagination] = useState(0)
  const [inactiveTotal, setInactiveTotal] = useState(0)
  const [activeTotal, setActiveTotal] = useState(0)
  const [closedTotal, setClosedTotal] = useState(0)
  const [applicantCountModalOpen, setApplicantCountModalOpen] = useState(false)
  const [compId, setCompId] = useState<string | null>(() => sessionStorage.getItem('compId'))
  const PAGE_SIZE = 5
  const navigate = useNavigate()

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
    if (compId) return // Already have cached ID
    
    const fetchCompId = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        const userResponse = await fetch(
          'https://us-east-2hh9ybuzoy.auth.us-east-2.amazoncognito.com/oauth2/userInfo',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const userInfo = await userResponse.json()
        sessionStorage.setItem('compId', userInfo.sub)
        setCompId(userInfo.sub)
      } catch (e) {
        console.error('Error fetching user ID:', e)
        setError('Failed to authenticate user')
        setIsLoading(false)
      }
    }
    
    fetchCompId()
  }, [])

  const nextPage = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => prev + PAGE_SIZE)
  }
  const prevPage = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => Math.max(prev - PAGE_SIZE, 0))
  }

  const handleCreateJobClick = () => navigate('/pages/CreateJobPage')
  const handleEditJobClick = (jobID: String) => {
    navigate('/pages/EditJobPage', { state: { jobID } })
  }
  const handleReviewJobClick = (jobID: String, skills: String[]) => {
    navigate('/pages/ReviewJobPage', { state: { jobID, skills } })
  }

  const handleLogout = () => {
    localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    sessionStorage.clear()
    window.location.href = `https://us-east-2hh9ybuzoy.auth.us-east-2.amazoncognito.com/logout?client_id=2r86kj5psq1s1asm89u2md7dh9&logout_uri=${process.env.REACT_APP_REDIRECT_URL}/pages/RoleSelectionPage`
  }

  const handleJobStatusUpdate = async (
    jobId: String,
    action: 'activate' | 'inactivate' | 'close'
  ) => {
    try {
      const idToken = localStorage.getItem('id_token')
      if (!idToken) throw new Error('No user token found.')
      const response = await fetch(UPDATE_JOB_API_URL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, action }),
      })
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Failed to update job status')
      }
      // Refetch company data using cached compId
      const dataResponse = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          compId: compId,
          pageSize: PAGE_SIZE,
          offsets: [inactivePagination, activePagination, closedPagination],
        }),
      })
      if (!dataResponse.ok) throw new Error(`HTTP error! Status: ${dataResponse.status}`)
      const data = await dataResponse.json()
      const loadedCompany = new Company(data.compName, '')
      loadedCompany.inactiveJobs = data.inactiveJobs || []
      loadedCompany.activeJobs = data.activeJobs || []
      loadedCompany.closedJobs = data.closedJobs || []
      setInactiveTotal(data.counts.inactiveTotal)
      setActiveTotal(data.counts.activeTotal)
      setClosedTotal(data.counts.closedTotal)
      setCompany(loadedCompany)
    } catch (err: any) {
      console.error('Error updating job:', err)
    }
  }

  useEffect(() => {
    if (!compId) return // Wait until compId is available
    
    const fetchCompanyData = async () => {
      try {
        const idToken = localStorage.getItem('id_token')
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            compId: compId,
            pageSize: PAGE_SIZE,
            offsets: [inactivePagination, activePagination, closedPagination],
          }),
        })
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        const loadedCompany = new Company(data.compName, '')
        loadedCompany.inactiveJobs = data.inactiveJobs || []
        loadedCompany.activeJobs = data.activeJobs || []
        loadedCompany.closedJobs = data.closedJobs || []
        setInactiveTotal(data.counts.inactiveTotal)
        setActiveTotal(data.counts.activeTotal)
        setClosedTotal(data.counts.closedTotal)
        setCompany(loadedCompany)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompanyData()
  }, [compId, inactivePagination, activePagination, closedPagination])

  const jobBox =
    'bg-white border-2 sm:border-4 border-foreground shadow-bauhaus p-4 mb-4 transition-transform duration-200 hover:-translate-y-0.5 min-h-[100px] flex flex-col justify-between'

  const PaginationButtons = ({
    offset,
    total,
    setter,
  }: {
    offset: number
    total: number
    setter: React.Dispatch<React.SetStateAction<number>>
  }) => (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={offset === 0}
        onClick={() => prevPage(setter)}
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={PAGE_SIZE + offset >= total}
        onClick={() => nextPage(setter)}
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
      </Button>
    </div>
  )

  if (showLoading) {
    return (
      <main className="min-h-screen bg-background border-b-4 border-foreground">
        <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="font-black text-2xl sm:text-3xl uppercase tracking-tighter text-foreground">
            Loading Profile...
          </h1>
          <div className="mt-4 h-2 w-full bg-muted border-2 border-foreground max-w-md">
            <div className="h-full bg-primary-blue animate-pulse" style={{ width: '60%' }} />
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background border-b-4 border-foreground">
        <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="font-black text-2xl sm:text-3xl uppercase tracking-tighter text-foreground">
            Error
          </h1>
          <p className="mt-2 font-medium text-primary-red">
            Failed to load company data: {error}
          </p>
        </section>
      </main>
    )
  }

  // Don't render content until data is loaded
  if (isLoading && !company.compName) {
    return null
  }

  return (
    <>
      <main className="min-h-screen bg-background border-b-4 border-foreground">
        <section className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="md" onClick={handleCreateJobClick}>
                  Create Job
                </Button>
                <Button variant="secondary" size="md" onClick={() => setModalOpen(true)}>
                  Edit Profile
                </Button>
              </div>
              <Button
                variant="yellow"
                size="md"
                onClick={() => setApplicantCountModalOpen(true)}
              >
                Check Applicant Availability
              </Button>
            </div>
            <Button variant="secondary" size="md" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tighter text-foreground text-center mb-10">
            {company.compName}
          </h1>

          <EditCompanyProfileModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            company={company}
            setCompany={setCompany}
          />
          <ApplicantCountModal
            isOpen={applicantCountModalOpen}
            onClose={() => setApplicantCountModalOpen(false)}
            company={company}
            setCompany={setCompany}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
              <h3 className="font-bold text-xl sm:text-2xl uppercase tracking-wider text-foreground border-b-2 border-foreground pb-2 mb-4">
                Inactive Jobs
              </h3>
              {company.inactiveJobs.map((j, index) => (
                <div key={index} className={jobBox}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-foreground">{j.jobName}</h4>
                      <p className="text-sm text-foreground/80 mt-1">{Array.isArray(j.skillsNeeded) ? j.skillsNeeded.join(', ') : j.skillsNeeded}</p>
                      <p className="text-sm font-medium mt-2">Hired: 0</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      <Button size="sm" variant="secondary" onClick={() => handleEditJobClick(j.jobId)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleJobStatusUpdate(j.jobId, 'close')}>
                        Close Job
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleJobStatusUpdate(j.jobId, 'activate')}>
                        Activate Job
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <PaginationButtons
                offset={inactivePagination}
                total={inactiveTotal}
                setter={setInactivePagination}
              />
            </div>

            <div className="bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
              <h3 className="font-bold text-xl sm:text-2xl uppercase tracking-wider text-foreground border-b-2 border-foreground pb-2 mb-4">
                Active Jobs
              </h3>
              {company.activeJobs.map((j, index) => (
                <div key={index} className={jobBox}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-foreground">{j.jobName}</h4>
                      <p className="text-sm text-foreground/80 mt-1">{Array.isArray(j.skillsNeeded) ? j.skillsNeeded.join(', ') : j.skillsNeeded}</p>
                      <p className="text-sm font-medium mt-2">Applied: {j.numApplied}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                      <Button size="sm" variant="secondary" onClick={() => handleReviewJobClick(j.jobId, j.skillsNeeded)}>
                        Review
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleJobStatusUpdate(j.jobId, 'inactivate')}>
                        Inactivate
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleJobStatusUpdate(j.jobId, 'close')}>
                        Close Job
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <PaginationButtons
                offset={activePagination}
                total={activeTotal}
                setter={setActivePagination}
              />
            </div>
          </div>

          <div className="mt-8 bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
            <h3 className="font-bold text-xl sm:text-2xl uppercase tracking-wider text-foreground border-b-2 border-foreground pb-2 mb-4">
              Closed Jobs
            </h3>
            {company.closedJobs.map((j, index) => (
              <div key={index} className={jobBox}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-foreground">{j.jobName}</h4>
                    <p className="text-sm text-foreground/80 mt-1">{Array.isArray(j.skillsNeeded) ? j.skillsNeeded.join(', ') : j.skillsNeeded}</p>
                    <p className="text-sm font-medium mt-2">Hired: 0</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => handleReviewJobClick(j.jobId, j.skillsNeeded)}>
                    Review
                  </Button>
                </div>
              </div>
            ))}
            <PaginationButtons
              offset={closedPagination}
              total={closedTotal}
              setter={setClosedPagination}
            />
          </div>
        </section>
      </main>
    </>
  )
}
