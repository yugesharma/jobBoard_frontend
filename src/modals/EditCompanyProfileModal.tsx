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

interface EditCompanyProfileProps {
  isOpen: boolean
  onClose: MouseEventHandler
  company: Company
  setCompany: Dispatch<SetStateAction<Company>>
}

export const EditCompanyProfileModal: React.FC<EditCompanyProfileProps> = ({
  isOpen,
  onClose,
  company,
  setCompany,
}) => {
  const [companyName, setCompanyName] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLInputElement
    setCompanyName(target.value)
  }

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setCompany({ ...company, compName: companyName })
    setCompanyName('')
    try {
      const compID = await getCompID()
      const response = await fetch(
        'https://ilv0fynikf.execute-api.us-east-2.amazonaws.com/prod/company/edit_company',
        {
          method: 'POST',
          body: JSON.stringify({ compID, newName: companyName }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        }
      ).then((r) => r)
      await response.json()
      close()
      navigate('/pages/CompanyProfilePage')
    } catch (error) {
      console.log(error)
    }
  }

  const close = () => (onClose as (e?: React.MouseEvent) => void)()

  return (
    <Modal isOpen={isOpen} onClose={close} title="Edit Profile">
      <div className="flex justify-center mb-4">
        <span className="w-12 h-12 flex items-center justify-center bg-foreground text-white border-2 border-foreground shadow-bauhaus">
          <Users className="w-6 h-6" strokeWidth={2.5} />
        </span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold text-sm uppercase tracking-wider text-foreground mb-1">
            New Company Name
          </label>
          <input
            type="text"
            value={companyName}
            onChange={handleChange}
            className="w-full px-3 py-2 border-2 border-foreground bg-white text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-foreground"
          />
        </div>
        <Button type="submit" variant="primary" size="md">
          Submit
        </Button>
      </form>
    </Modal>
  )
}
