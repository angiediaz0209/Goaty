import './goaty/theme.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MuseApp from './App.jsx'
import Landing from './goaty/pages/Landing.jsx'
import Onboarding from './goaty/pages/Onboarding.jsx'
import AppShell from './goaty/components/AppShell.jsx'
import Dashboard from './goaty/pages/Dashboard.jsx'
import RoadmapPage from './goaty/pages/RoadmapPage.jsx'
import LessonPage from './goaty/pages/LessonPage.jsx'
import QuizPage from './goaty/pages/QuizPage.jsx'
import ProjectPage from './goaty/pages/ProjectPage.jsx'
import ChatPage from './goaty/pages/ChatPage.jsx'
import CommunityPage from './goaty/pages/CommunityPage.jsx'
import CommunityRoadmapDetail from './goaty/pages/CommunityRoadmapDetail.jsx'
import BadgesPage from './goaty/pages/BadgesPage.jsx'
import GamesPage from './goaty/pages/GamesPage.jsx'
import NotificationsPage from './goaty/pages/NotificationsPage.jsx'
import ProfilePage from './goaty/pages/ProfilePage.jsx'
import SettingsPage from './goaty/pages/SettingsPage.jsx'
import PricingPage from './goaty/pages/PricingPage.jsx'
import NotFoundPage from './goaty/components/NotFoundPage.jsx'

function MuseRoute() {
  // Muse expects its own dark theme index.css. We import it lazily only here.
  return (
    <div className="muse-root">
      <MuseApp />
    </div>
  )
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="lesson/:id" element={<LessonPage />} />
          <Route path="quiz/:id" element={<QuizPage />} />
          <Route path="project/:id" element={<ProjectPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/:id" element={<CommunityRoadmapDetail />} />
          <Route path="badges" element={<BadgesPage />} />
          <Route path="games" element={<GamesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/muse/*" element={<MuseRoute />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
