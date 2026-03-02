import { useState } from 'react'
import { Button } from '../ui/Button'

export const JobPosting = (props: {
  companyName: string
  jobId: string
  jobName: string
  skills: any
  alreadyApplied: number
}) => {
  const [hasApplied, setHasApplied] = useState(Boolean(props.alreadyApplied))
  const [isLoading, setIsLoading] = useState(false)

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

  const handleApplyToJob = async () => {
    try {
      setIsLoading(true)
      const applicantId = await getApplicantID()
      await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/apply_to_job',
        {
          method: 'POST',
          body: JSON.stringify({ jobId: props.jobId, applicantId }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
      setHasApplied(true)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-4 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-lg uppercase tracking-tight text-foreground">
            {props.jobName}
          </h3>
          <p className="font-medium text-sm text-foreground/80 mt-1">
            Company: {props.companyName}
          </p>
          <p className="text-sm text-foreground/70 mt-1">
            Skills: {Array.isArray(props.skills) ? props.skills.join(', ') : props.skills}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button
            variant="primary"
            size="sm"
            disabled={hasApplied}
            onClick={handleApplyToJob}
          >
            {isLoading ? 'Loading...' : hasApplied ? 'Applied' : 'Apply'}
          </Button>
        </div>
      </div>
    </div>
  )
}
