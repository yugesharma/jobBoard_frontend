import { useState, useEffect, Key, FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const COMPANY_API_URL =
  'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/admin/company_report'
const APPLICANT_API_URL =
  'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/admin/applicant_report'
const JOBS_API_URL =
  'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/admin/jobs_report'

const hash = window.location.hash.substring(1)
const params = new URLSearchParams(hash)
const idToken = params.get('id_token')
if (idToken) localStorage.setItem('id_token', idToken)
const accessToken = params.get('access_token')
if (accessToken) localStorage.setItem('access_token', accessToken)

interface CompanyDataProps {
  compId: String
  compName: String
  job_count: Number
  application_count: Number
  hired_count: Number
}

interface ApplicantDataProps {
  appId: String
  appName: String
  jobs_applied: Number
  jobs_accepted: Number
  jobs_withdrawn: Number
}

interface JobDataProps {
  jobId: String
  jobName: String
  compName: String
  isActive: number
  applicant_count: Number
  offered_count: Number
  hired_count: Number
  withdrawn_count: Number
}

enum SelectedDataType {
  Company = 'COMPANY',
  Jobs = 'JOBS',
  Applicant = 'APPLICANT',
}

const dataTitles = ['Companies Report', 'Jobs Report', 'Applicants Report']

const handleLogout = () => {
  localStorage.removeItem('id_token')
  localStorage.removeItem('access_token')
  window.location.href = `https://us-east-27dlffulpz.auth.us-east-2.amazoncognito.com/logout?client_id=603gu3crjkkj3bg7o1u8sh8s7&logout_uri=${process.env.REACT_APP_REDIRECT_URL}/pages/RoleSelectionPage`
}

const tableWrap = 'overflow-x-auto rounded-none border-4 border-[#121212] shadow-[8px_8px_0px_0px_#121212] bg-[#F0F0F0]'
const tableStyle = 'w-full border-collapse'
const thStyle = 'px-4 py-3 text-left font-black uppercase text-sm tracking-widest bg-[#121212] text-white border-4 border-[#121212]'
const tdStyle = 'px-4 py-3 font-medium border-4 border-[#121212]'
const rowStyle = 'bg-[#F0F0F0] hover:bg-[#F0C020] transition-none'

export const AdminProfilePage = () => {
  const [companyData, setCompanyData] = useState<CompanyDataProps[]>([])
  const [applicantData, setApplicantData] = useState<ApplicantDataProps[]>([])
  const [jobsData, setJobsData] = useState<JobDataProps[]>([])
  const [dataSelected, setDataSelected] = useState(SelectedDataType.Company)
  const [dataTitle, setDataTitle] = useState(dataTitles[0])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<String | null>(null)
  const [companiesPagination, setCompaniesPagination] = useState(0)
  const [applicantsPagination, setApplicantsPagination] = useState(0)
  const [jobsPagination, setJobsPagination] = useState(0)
  const [companiesTotal, setCompaniesTotal] = useState(0)
  const [applicantsTotal, setApplicantsTotal] = useState(0)
  const [jobsTotal, setJobsTotal] = useState(0)
  const PAGE_SIZE = 10

  const nextPage = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => prev + PAGE_SIZE)
  }
  const prevPage = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter((prev) => Math.max(prev - PAGE_SIZE, 0))
  }

  const handleClick = (e: FormEvent) => {
    const target = e.target as HTMLButtonElement
    if (target.name === 'companyData') {
      setDataSelected(SelectedDataType.Company)
      setDataTitle(dataTitles[0])
    } else if (target.name === 'jobData') {
      setDataSelected(SelectedDataType.Jobs)
      setDataTitle(dataTitles[1])
    } else if (target.name === 'applicantData') {
      setDataSelected(SelectedDataType.Applicant)
      setDataTitle(dataTitles[2])
    }
  }

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const idToken = localStorage.getItem('id_token')
        const response = await fetch(`${COMPANY_API_URL}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ PAGE_SIZE: PAGE_SIZE, offset: companiesPagination }),
        })
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        setCompaniesTotal(data.total_count)
        setCompanyData(data.companies)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompanyData()
  }, [companiesPagination])

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const idToken = localStorage.getItem('id_token')
        const response = await fetch(`${APPLICANT_API_URL}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ offset: applicantsPagination, PAGE_SIZE: PAGE_SIZE }),
        })
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        setApplicantsTotal(data.total_count)
        setApplicantData(data.applicants)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchApplicantData()
  }, [applicantsPagination])

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        const idToken = localStorage.getItem('id_token')
        const response = await fetch(`${JOBS_API_URL}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ offset: jobsPagination, PAGE_SIZE: PAGE_SIZE }),
        })
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
        const data = await response.json()
        setJobsTotal(data.total_count)
        setJobsData(data.jobs)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    if (dataSelected === SelectedDataType.Jobs) fetchJobsData()
  }, [jobsPagination, dataSelected])

  const PaginationButtons = ({
    offset,
    total,
    setter,
  }: {
    offset: number
    total: number
    setter: React.Dispatch<React.SetStateAction<number>>
  }) => (
    <div className="flex justify-center gap-4 mt-6 p-4 bg-[#F0F0F0]">
      <button
        className="aspect-square w-12 h-12 flex items-center justify-center bg-[#1040C0] text-white border-2 border-[#121212] rounded-none shadow-[4px_4px_0px_0px_#121212] hover:bg-[#1040C0]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-none"
        disabled={offset === 0}
        onClick={() => prevPage(setter)}
      >
        <ChevronLeft className="w-6 h-6" strokeWidth={3} />
      </button>
      <button
        className="aspect-square w-12 h-12 flex items-center justify-center bg-[#1040C0] text-white border-2 border-[#121212] rounded-none shadow-[4px_4px_0px_0px_#121212] hover:bg-[#1040C0]/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed transition-none"
        disabled={PAGE_SIZE + offset >= total}
        onClick={() => nextPage(setter)}
      >
        <ChevronRight className="w-6 h-6" strokeWidth={3} />
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background border-b-4 border-foreground">
        <section className="max-w-7xl mx-auto py-12 px-4">
          <h1 className="font-black text-2xl uppercase tracking-tighter text-foreground">
            Loading {dataSelected} Data...
          </h1>
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
          <p className="mt-2 font-medium text-primary-red">
            Failed to load {dataSelected} data: {error}
          </p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background border-b-4 border-foreground">
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-6">
          <Button variant="secondary" size="md" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-foreground text-center mb-10">
          {dataTitle}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-3">
            <Button
              name="companyData"
              variant={dataSelected === SelectedDataType.Company ? 'primary' : 'outline'}
              size="lg"
              onClick={handleClick}
            >
              Companies Report
            </Button>
            <Button
              name="jobData"
              variant={dataSelected === SelectedDataType.Jobs ? 'primary' : 'outline'}
              size="lg"
              onClick={handleClick}
            >
              Jobs Report
            </Button>
            <Button
              name="applicantData"
              variant={dataSelected === SelectedDataType.Applicant ? 'primary' : 'outline'}
              size="lg"
              onClick={handleClick}
            >
              Applicants Report
            </Button>
          </div>

          <div className="lg:col-span-3">
            {dataSelected === SelectedDataType.Company && (
              <div className={tableWrap}>
                <table className={tableStyle}>
                  <thead>
                    <tr>
                      <th className={thStyle}>Company Name</th>
                      <th className={thStyle}># Jobs</th>
                      <th className={thStyle}># Applicants</th>
                      <th className={thStyle}># Hired</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyData?.map((d) => (
                      <tr key={d.compId as Key} className={rowStyle}>
                        <td className="px-4 py-3 border-4 border-[#121212] font-bold text-[#121212]">{d.compName}</td>
                        <td className={`${tdStyle} ${d.job_count.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.job_count.valueOf()}
                        </td>
                        <td className={`${tdStyle} ${d.application_count.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.application_count.valueOf()}
                        </td>
                        <td className={`${tdStyle} ${d.hired_count.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.hired_count.valueOf()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationButtons
                  offset={companiesPagination}
                  total={companiesTotal}
                  setter={setCompaniesPagination}
                />
              </div>
            )}

            {dataSelected === SelectedDataType.Jobs && (
              <div className={tableWrap}>
                <table className={tableStyle}>
                  <thead>
                    <tr>
                      <th className={thStyle}>Job Title</th>
                      <th className={thStyle}>Company</th>
                      <th className={`${thStyle} w-24`}>Status</th>
                      <th className={`${thStyle} w-28`}># Applicants</th>
                      <th className={`${thStyle} w-24`}># Offered</th>
                      <th className={`${thStyle} w-20`}># Hired</th>
                      <th className={`${thStyle} w-28`}># Withdrawn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobsData?.map((d) => (
                      <tr key={d.jobId as Key} className={rowStyle}>
                        <td className="px-4 py-3 border-4 border-[#121212] font-bold text-[#121212]">{d.jobName}</td>
                        <td className={tdStyle}>{d.compName}</td>
                        <td className={`${tdStyle} w-24 ${d.isActive ? 'font-bold text-[#1040C0] uppercase' : 'text-[#121212]/30 uppercase'}`}>
                          {d.isActive ? 'Active' : 'Inactive'}
                        </td>
                        <td className={`${tdStyle} w-28 ${d.applicant_count.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.applicant_count.valueOf()}
                        </td>
                        <td className={`${tdStyle} w-24 ${d.offered_count.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.offered_count.valueOf()}
                        </td>
                        <td className={`${tdStyle} w-20 ${d.hired_count.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.hired_count.valueOf()}
                        </td>
                        <td className={`${tdStyle} w-28 ${d.withdrawn_count.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.withdrawn_count.valueOf()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationButtons
                  offset={jobsPagination}
                  total={jobsTotal}
                  setter={setJobsPagination}
                />
              </div>
            )}

            {dataSelected === SelectedDataType.Applicant && (
              <div className={tableWrap}>
                <table className={tableStyle}>
                  <thead>
                    <tr>
                      <th className={thStyle}>Applicant Name</th>
                      <th className={thStyle}># Jobs Applied</th>
                      <th className={thStyle}># Jobs Accepted</th>
                      <th className={thStyle}># Jobs Withdrawn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicantData?.map((d) => (
                      <tr key={d.appId as Key} className={rowStyle}>
                        <td className="px-4 py-3 border-4 border-[#121212] font-bold text-[#121212]">{d.appName}</td>
                        <td className={`${tdStyle} ${d.jobs_applied.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.jobs_applied.valueOf()}
                        </td>
                        <td className={`${tdStyle} ${d.jobs_accepted.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.jobs_accepted.valueOf()}
                        </td>
                        <td className={`${tdStyle} ${d.jobs_withdrawn.valueOf() === 0 ? 'text-[#121212]/30' : 'font-black text-lg text-[#D02020]'}`}>
                          {d.jobs_withdrawn.valueOf()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationButtons
                  offset={applicantsPagination}
                  total={applicantsTotal}
                  setter={setApplicantsPagination}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
