import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState, KeyboardEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { X } from 'lucide-react'

export const EditJobPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = location as { state: { jobID: string } }
  const jobID = state?.jobID
  const [jobName, setJobName] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [noSkillsWarning, setNoSkillsWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const idToken = localStorage.getItem('id_token')

  const fillData = async () => {
    if (!jobID) return
    setIsLoading(true)
    try {
      const response = await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/get_job_by_id',
        {
          method: 'POST',
          body: JSON.stringify({ jobID }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
      const body = await response.json()
      setJobName(body.job.jobName || '')
      setSkills((body.skills || []).map((s: { jobSkill: string }) => s.jobSkill))
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fillData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobID])

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (skills.length === 0) {
        setNoSkillsWarning(true)
        throw new Error('Job edit attempted without any skills')
      }
      await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/edit_job',
        {
          method: 'POST',
          body: JSON.stringify({ jobID, jobName, skills }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
      navigate('/pages/CompanyProfilePage')
    } catch (error) {
      console.log(error)
    }
  }

  const addSkill = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const skill = skillInput.trim()
      if (skill) {
        setNoSkillsWarning(false)
        setSkills((prev) => [...prev, skill])
        setSkillInput('')
      }
    }
  }

  const removeSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index))
  }

  const inputStyles =
    'w-full px-3 py-2 border-2 border-foreground bg-white text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-foreground'

  if (!jobID) {
    return (
      <main className="min-h-screen bg-background border-b-4 border-foreground">
        <section className="max-w-2xl mx-auto py-12 px-4">
          <p className="font-bold text-primary-red">Missing job ID.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background border-b-4 border-foreground">
      <section className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-foreground text-center mb-8">
          Edit Job
        </h1>

        {isLoading ? (
          <div className="bg-white border-2 border-foreground p-6">
            <p className="font-bold text-foreground">Loading data...</p>
            <div className="mt-2 h-2 w-full bg-muted border-2 border-foreground">
              <div className="h-full bg-primary-blue animate-pulse" style={{ width: '40%' }} />
            </div>
          </div>
        ) : (
          <form onSubmit={handleEditJob} className="space-y-6">
            <div className="bg-white border-2 sm:border-4 border-foreground shadow-bauhaus-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-sm uppercase tracking-wider text-foreground mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobName}
                    onChange={(e) => setJobName(e.target.value)}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className="block font-bold text-sm uppercase tracking-wider text-foreground mb-1">
                    Required Skills
                  </label>
                  {noSkillsWarning && (
                    <p className="text-primary-red font-bold text-sm mb-2">
                      Please enter at least one skill
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 p-2 border-2 border-foreground bg-background min-h-[42px]">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary-blue text-white border-2 border-foreground text-sm font-bold uppercase"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="p-0.5 hover:bg-white/20 rounded-none"
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                      placeholder="Type skill, then press Enter"
                      className="flex-1 min-w-[120px] border-none bg-transparent outline-none font-medium text-foreground placeholder:text-foreground/50"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" variant="primary" size="md">
                    Save Job
                  </Button>
                  <Button type="button" variant="outline" size="md" onClick={fillData}>
                    Reset to Original Values
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}
