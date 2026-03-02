import {
  Dispatch,
  FormEvent,
  MouseEventHandler,
  SetStateAction,
  useState,
} from 'react'
import { Users } from 'lucide-react'
import { Company } from '../entity/model'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

interface ApplicantCountModalProps {
  isOpen: boolean
  onClose: MouseEventHandler
  company: Company
  setCompany: Dispatch<SetStateAction<Company>>
}

export const ApplicantCountModal: React.FC<ApplicantCountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [skillSet, setSkillSet] = useState('')
  const [applicantCount, setApplicantCount] = useState<number | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement
    setSkillSet(target.value)
  }

  const idToken = localStorage.getItem('id_token')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const skillsArray = skillSet
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const response = await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/get_applicant_count',
        {
          method: 'POST',
          body: JSON.stringify({
            skillSet: skillsArray,
            length: skillsArray.length,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      ).then((r) => r)
      const result = await response.json()
      setApplicantCount(result[0].matched_count)
      navigate('/pages/CompanyProfilePage')
    } catch (error) {
      console.log(error)
    }
  }

  const close = () => (onClose as (e?: React.MouseEvent) => void)()

  return (
    <Modal isOpen={isOpen} onClose={close} title="Get Applicant Count">
      <div className="flex justify-center mb-4">
        <span className="w-12 h-12 flex items-center justify-center bg-foreground text-white border-2 border-foreground shadow-bauhaus">
          <Users className="w-6 h-6" strokeWidth={2.5} />
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-sm uppercase tracking-wider text-foreground mb-1">
            Skills (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. python, ai, react"
            value={skillSet}
            onChange={handleChange}
            className="w-full px-3 py-2 border-2 border-foreground bg-white text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-foreground"
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Get Number of Applicants
        </Button>
        {applicantCount !== null && (
          <div className="mt-4 p-4 bg-primary-blue/10 border-2 border-foreground text-foreground font-medium text-center">
            <strong>{applicantCount}</strong> applicants match this skillset.
          </div>
        )}
      </form>
    </Modal>
  )
}
