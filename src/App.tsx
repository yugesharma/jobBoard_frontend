import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage/LandingPage'
import { CompanyProfilePage } from './pages/CompanyProfilePage/CompanyProfilePage'
import { AppBanner } from './components/AppBanner/AppBanner'
import { RoleSelectionPage } from './pages/RoleSelectionPage/RoleSelectionPage'
import { CreateJobPage } from './pages/CreateJobPage/CreateJobPage'
import { EditJobPage } from './pages/EditJobPage/EditJobPage'
import { ApplicantProfilePage } from './pages/ApplicantProfilePage/ApplicantProfilePage'
import { AdminProfilePage } from './pages/AdminProfilePage/AdminProfilePage'
import { ReviewJobPage } from './pages/ReviewJobPage/ReviewJobPage'
import { ApplicantSearchPage } from './pages/ApplicantSearchPage/ApplicantSearchPage'

function App() {
     return (
          <>
               <BrowserRouter>
                    <div>
                         <AppBanner />
                         <Routes>
                              <Route path="/" element={<LandingPage />} />
                              <Route
                                   path="/pages/RoleSelectionPage"
                                   element={<RoleSelectionPage />}
                              />
                              <Route
                                   path="/pages/ApplicantProfilePage"
                                   element={<ApplicantProfilePage />}
                              />
                              <Route
                                   path="/pages/ApplicantSearchPage"
                                   element={<ApplicantSearchPage />}
                              />
                              <Route
                                   path="/pages/CompanyProfilePage"
                                   element={<CompanyProfilePage />}
                              />
                              <Route
                                   path="/pages/CreateJobPage"
                                   element={<CreateJobPage />}
                              />
                              <Route
                                   path="/pages/EditJobPage"
                                   element={<EditJobPage />}
                              />
                              <Route
                                   path="/pages/AdminProfilePage"
                                   element={<AdminProfilePage />}
                              />
                              <Route
                                   path="/pages/ReviewJobPage"
                                   element={<ReviewJobPage />}
                              />
                         </Routes>
                    </div>
               </BrowserRouter>
          </>
     )
}

export default App
