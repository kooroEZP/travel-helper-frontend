import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'
import ResultPage from './pages/ResultPage'
import PreferencesPage from './pages/PreferencesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="result" element={<ResultPage />} />
          <Route path="preferences/:userId" element={<PreferencesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
