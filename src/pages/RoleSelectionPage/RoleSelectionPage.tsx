import { Monitor, Users, FileText } from 'lucide-react'
import { Card } from '../../components/ui/Card'

const roleList = [
  {
    role: 'Admin',
    icon: Monitor,
    decoration: 'circle' as const,
    decorationColor: 'red' as const,
    loginLink: `https://us-east-27dlffulpz.auth.us-east-2.amazoncognito.com/login?client_id=603gu3crjkkj3bg7o1u8sh8s7&response_type=token&scope=email+openid+phone&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}%2Fpages%2FAdminProfilePage`,
  },
  {
    role: 'Company',
    icon: Users,
    decoration: 'square' as const,
    decorationColor: 'blue' as const,
    loginLink: `https://us-east-2hh9ybuzoy.auth.us-east-2.amazoncognito.com/login/continue?client_id=2r86kj5psq1s1asm89u2md7dh9&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}%2Fpages%2FCompanyProfilePage&response_type=token&scope=email+openid+phone`,
  },
  {
    role: 'Applicant',
    icon: FileText,
    decoration: 'triangle' as const,
    decorationColor: 'yellow' as const,
    loginLink: `https://us-east-287wvnq12q.auth.us-east-2.amazoncognito.com/login/continue?client_id=56b9am2f224tmcu9kheie970rj&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}%2Fpages%2FApplicantProfilePage&response_type=token&scope=email+openid+phone`,
  },
]

export const RoleSelectionPage = () => {
  return (
    <main className="min-h-screen bg-background border-b-4 border-foreground">
      <section className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:py-24 lg:px-8">
        <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tighter text-foreground text-center mb-12 sm:mb-16">
          Please Select Your Role
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {roleList.map((r, index) => {
            const Icon = r.icon
            return (
              <Card
                key={index}
                decoration={r.decoration}
                decorationColor={r.decorationColor}
                className="p-6 sm:p-8 cursor-pointer"
                onClick={() => (window.location.href = r.loginLink)}
              >
                <div className="flex flex-col items-center gap-4">
                  <span className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-foreground text-white border-2 border-foreground shadow-bauhaus">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2.5} />
                  </span>
                  <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl uppercase tracking-wider text-foreground text-center">
                    {r.role}
                  </h2>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </main>
  )
}
