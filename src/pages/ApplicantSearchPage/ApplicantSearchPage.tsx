import { useEffect, useState } from 'react'
import { JobPosting } from '../../components/JobPosting/JobPosting'
import { Button } from '../../components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const ApplicantSearchPage = () => {
  const [jobPostings, setJobPostings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [noMatch, setNoMatch] = useState(false)
  const [pageEnd, setPageEnd] = useState(false)
  const [pageOffset, setPageOffset] = useState(0)
  const [companySearch, setCompanySearch] = useState('')
  const [skillSearch, setSkillSearch] = useState('')
  const [whichSearch, setWhichSearch] = useState('')
  const PAGE_SIZE = 6

  const accessToken = localStorage.getItem('access_token')
  const idToken = localStorage.getItem('id_token')

  const getApplicantID = async () => {
    const userResponse = await fetch(
      'https://us-east-287wvnq12q.auth.us-east-2.amazoncognito.com/oauth2/userInfo',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const userInfo = await userResponse.json()
    return userInfo.sub
  }

  const handleSearchBySkill = async () => {
    try {
      const applicantId = await getApplicantID()
      setNoMatch(false)
      setIsLoading(true)
      setJobPostings([])
      const response = await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/search_jobs_by_skill',
        {
          method: 'POST',
          body: JSON.stringify({
            skillSearchString: skillSearch,
            applicantId,
            offset: pageOffset,
            pageSize: PAGE_SIZE,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
      const result = await response.json()
      if (result.length === 0) {
        if (pageOffset > 0) setPageEnd(true)
        else setNoMatch(true)
      } else {
        setNoMatch(false)
      }
      setJobPostings(result)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchByCompany = async () => {
    try {
      const applicantId = await getApplicantID()
      setNoMatch(false)
      setIsLoading(true)
      setJobPostings([])
      const response = await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/search_jobs_by_company',
        {
          method: 'POST',
          body: JSON.stringify({
            companySearchString: companySearch,
            applicantId,
            offset: pageOffset,
            pageSize: PAGE_SIZE,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
      const result = await response.json()
      if (result.length === 0) {
        if (pageOffset > 0) setPageEnd(true)
        else setNoMatch(true)
      } else {
        setNoMatch(false)
      }
      setJobPostings(result)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (whichSearch === 'company') handleSearchByCompany()
    else if (whichSearch === 'skill') handleSearchBySkill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageOffset, whichSearch])

  const nextPage = () => {
    if (!pageEnd) setPageOffset((prev) => prev + PAGE_SIZE)
  }
  const prevPage = () => {
    setPageEnd(false)
    setPageOffset((prev) => Math.max(prev - PAGE_SIZE, 0))
  }

  const handleSearchBySkillClick = () => {
    if (pageOffset === 0 && whichSearch === 'skill') handleSearchBySkill()
    else {
      setPageOffset(0)
      setWhichSearch('skill')
    }
  }

  const handleSearchByCompanyClick = () => {
    if (pageOffset === 0 && whichSearch === 'company') handleSearchByCompany()
    else {
      setPageOffset(0)
      setWhichSearch('company')
    }
  }

  const inputStyles =
    'flex-1 min-w-0 px-3 py-2 border-2 border-foreground bg-white text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-foreground'

  return (
    <main className="min-h-screen bg-background border-b-4 border-foreground">
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-foreground text-center mb-8">
          Find Jobs
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="skillSearchInput"
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search By Skill"
              className={inputStyles}
            />
            <Button variant="primary" size="md" onClick={handleSearchBySkillClick}>
              Search
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="companySearchInput"
              type="text"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              placeholder="Search By Company"
              className={inputStyles}
            />
            <Button variant="secondary" size="md" onClick={handleSearchByCompanyClick}>
              Search
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="py-8">
            <p className="font-bold text-foreground text-center">Loading Jobs...</p>
            <div className="mt-2 max-w-md mx-auto h-2 bg-muted border-2 border-foreground">
              <div className="h-full bg-primary-blue animate-pulse" style={{ width: '50%' }} />
            </div>
          </div>
        )}

        {noMatch && (
          <p className="font-bold text-foreground text-center py-4">
            Sorry, no jobs match your search
          </p>
        )}

        {pageEnd && !isLoading && (
          <p className="font-bold text-foreground text-center py-2">
            No more results
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobPostings.map((jobPosting: any) => (
            <JobPosting
              key={jobPosting.jobId}
              companyName={jobPosting.compName}
              jobId={jobPosting.jobId}
              jobName={jobPosting.jobName}
              skills={JSON.parse(jobPosting.jobSkills || '[]')}
              alreadyApplied={JSON.parse(jobPosting.alreadyApplied || '0')}
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-8 gap-4">
          <Button
            variant="outline"
            size="md"
            disabled={noMatch || pageOffset === 0}
            onClick={prevPage}
          >
            <ChevronLeft className="w-4 h-4 mr-1" strokeWidth={2.5} />
            Previous Page
          </Button>
          <Button
            variant="outline"
            size="md"
            disabled={noMatch || pageEnd}
            onClick={nextPage}
          >
            Next Page
            <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2.5} />
          </Button>
        </div>
      </section>
    </main>
  )
}
