export class Model {
     companies: Company[]
     applicants: Applicant[]

     constructor(companies: Company[], applicants: Applicant[]) {
          this.companies = companies
          this.applicants = applicants
     }
}

export class Company {
     compId: String = ''
     compName: String
     compPassword: String
     inactiveJobs: Job[] = []
     activeJobs: Job[] = []
     closedJobs: Job[] = []

     constructor(compName: String, compPassword: String) {
          this.compName = compName
          this.compPassword = compPassword
     }
}

export class Job {
     jobId: String = ''
     jobName: String
     skillsNeeded: String[] = []
     isActive: boolean = false
     isClosed: boolean = false
     waitList: Applicant[] = []
     hirable: Applicant[] = []
     unacceptable: Applicant[] = []
     offered: Applicant[] = []
     hired: Applicant[] = []
     rejectedBy: Applicant[] = []
     numApplied: String = ''

     constructor(jobName: String) {
          this.jobName = jobName
     }
}

export class JobApplication {
     jobAppId: String = '00000'
     job: Job
     jobName: String = 'jobName'
     skillsNeeded: String[] = []
     applicant: Applicant

     constructor(job: Job, applicant: Applicant) {
          this.job = job
          this.applicant = applicant
          this.jobName = job.jobName
          this.skillsNeeded = job.skillsNeeded
     }
}
export class Applicant {
     appId: String = ''
     appName: String
     appPassword: String
     appliedJobs: JobApplication[] = []
     offeredJobs: JobApplication[] = []
     acceptedJobs: JobApplication[] = []
     rejectedJobs: JobApplication[] = []
     skills: String[] = []

     constructor(appName: String, appPassword: String) {
          this.appName = appName
          this.appPassword = appPassword
     }
}

export class Admin {
     adminName: String
     adminPassword: String

     constructor(adminName: String, adminPassword: String) {
          this.adminName = adminName
          this.adminPassword = adminPassword
     }
}
