import {
  Dispatch,
  FormEvent,
  MouseEventHandler,
  SetStateAction,
  useState,
} from 'react'
import { User } from 'lucide-react'
import { Applicant } from '../entity/model'
import { useNavigate, Link } from 'react-router-dom'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

interface EditApplicantProfileProps {
  isOpen: boolean
  onClose: MouseEventHandler
  applicant: Applicant
  setApplicant: Dispatch<SetStateAction<Applicant>>
}

export const EditApplicantProfileModal: React.FC<EditApplicantProfileProps> = ({
  isOpen,
  onClose,
  applicant,
  setApplicant,
}) => {
  const [state, setState] = useState({ applicantName: '', skills: '' })
  const navigate = useNavigate()

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement
    setState((s) => ({ ...s, [target.name]: target.value }))
  }

  const accessToken = localStorage.getItem('access_token')
  const idToken = localStorage.getItem('id_token')

  const getAppId = async () => {
    const userResponse = await fetch(
      'https://us-east-287wvnq12q.auth.us-east-2.amazoncognito.com/oauth2/userInfo',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const userInfo = await userResponse.json()
    return userInfo.sub
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const skillsArray = state.skills.split(',').map((item) => item.trim())
    setApplicant({ ...applicant, appName: state.applicantName, skills: skillsArray })
    setState({ applicantName: '', skills: '' })
    try {
      const appId = await getAppId()
      await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/applicant/edit_applicant',
        {
          method: 'POST',
          body: JSON.stringify({
            appID: appId,
            appName: state.applicantName,
            skills: skillsArray,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      )
      close()
      navigate('/pages/ApplicantProfilePage')
    } catch (error) {
      console.log(error)
    }
  }

  const close = () => (onClose as (e?: React.MouseEvent) => void)()

  const inputStyles =
    'w-full px-3 py-2 border-2 border-foreground bg-white text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-foreground'

  return (
    <Modal isOpen={isOpen} onClose={close} title="Edit Profile">
      <div className="flex justify-center mb-4">
        <span className="w-12 h-12 flex items-center justify-center bg-foreground text-white border-2 border-foreground shadow-bauhaus">
          <User className="w-6 h-6" strokeWidth={2.5} />
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-sm uppercase tracking-wider text-foreground mb-1">
            New Applicant Name
          </label>
          <input
            type="text"
            value={state.applicantName}
            name="applicantName"
            onChange={handleChange}
            className={inputStyles}
          />
        </div>
        <div>
          <label className="block font-bold text-sm uppercase tracking-wider text-foreground mb-1">
            Updated Skills (Skill1, Skill2, Skill3,...)
          </label>
          <input
            type="text"
            value={state.skills}
            name="skills"
            onChange={handleChange}
            className={inputStyles}
          />
        </div>
        <Button type="submit" variant="primary" size="md" disabled={!state.skills?.trim()}>
          Submit
        </Button>
      </form>
      <footer className="mt-6 pt-4 border-t-2 border-foreground">
        <Link to="/pages/ApplicantSearchPage">
          <Button variant="secondary" size="sm">See All Jobs</Button>
        </Link>
      </footer>
    </Modal>
  )
}
