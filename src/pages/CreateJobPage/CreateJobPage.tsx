import { useNavigate } from 'react-router-dom'
import { useState, KeyboardEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { X } from 'lucide-react'

export const CreateJobPage = () => {
  const [jobName, setJobName] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [noSkillsWarning, setNoSkillsWarning] = useState(false)

  const navigate = useNavigate()
  const accessToken = localStorage.getItem('access_token')
  const idToken = localStorage.getItem('id_token')

  const getCompID = async () => {
    const userResponse = await fetch(
      'https://us-east-2hh9ybuzoy.auth.us-east-2.amazoncognito.com/oauth2/userInfo',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const userInfo = await userResponse.json()
    return userInfo.sub
  }

  const handleAPIRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const compID = await getCompID()
      if (skills.length === 0) {
        setNoSkillsWarning(true)
        throw new Error('Job creation attempted without adding skills')
      }
      await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/create_job',
        {
          method: 'POST',
          body: JSON.stringify({ compID, jobName, skills }),
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

  return (
    <main className="min-h-screen bg-background border-b-4 border-foreground">
      <section className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="font-black text-3xl sm:text-4xl uppercase tracking-tighter text-foreground text-center mb-8">
          Create New Job
        </h1>

        <form onSubmit={handleAPIRequest} className="space-y-6">
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
              <div>
                <Button type="submit" variant="primary" size="md">
                  Create Job
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
