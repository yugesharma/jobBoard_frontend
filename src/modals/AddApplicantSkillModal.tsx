import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from 'react'
import { UserPlus } from 'lucide-react'
import { Applicant } from '../entity/model'
import { useNavigate } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

interface AddSkillsProps {
  isOpen: boolean
  onClose: () => void
  applicant: Applicant
  setApplicant: Dispatch<SetStateAction<Applicant>>
}

export const AddApplicantSkillModal: React.FC<AddSkillsProps> = ({
  isOpen,
  onClose,
  applicant,
  setApplicant,
}) => {
  const [skillSet, setSkillSet] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement
    setSkillSet(target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const skillsArray = skillSet.split(',').map((s) => s.trim()).filter(Boolean)
      const idTokenFromStorage = localStorage.getItem('id_token')
      const appID = localStorage.getItem('appID')
      await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/add_applicant_skills',
        {
          method: 'POST',
          body: JSON.stringify({ appID, skillSet: skillsArray }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idTokenFromStorage}`,
          },
        }
      )
      if (skillsArray.length > 0) {
        setApplicant((prev) => ({
          ...prev,
          skills: [
            ...(Array.isArray(prev.skills) ? prev.skills : []),
            ...skillsArray,
          ].filter(Boolean),
        }))
        onClose()
        navigate('/pages/ApplicantProfilePage')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const inputStyles =
    'w-full px-3 py-2 border-2 border-foreground bg-white text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-foreground'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome! Add some skills to proceed">
      <div className="flex justify-center mb-4">
        <span className="w-12 h-12 flex items-center justify-center bg-foreground text-white border-2 border-foreground shadow-bauhaus">
          <UserPlus className="w-6 h-6" strokeWidth={2.5} />
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
            className={inputStyles}
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Add skills
        </Button>
      </form>
    </Modal>
  )
}
