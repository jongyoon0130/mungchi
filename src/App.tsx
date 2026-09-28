import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import Home from './pages/Home'
import BundleDetail from './pages/BundleDetail'
import Sell from './pages/Sell'
import Signup from './pages/Signup'
import RegisterLot from './pages/RegisterLot'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 상품이 적을 때는 별도 목록 페이지 없이 홈의 전체 상품으로 보낸다 */}
          <Route path="/bundles" element={<Navigate to="/#products" replace />} />
          <Route path="/bundles/:id" element={<BundleDetail />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<RegisterLot />} />

          {/* 경매로 쓰던 시절 주소. 저장해 둔 링크가 깨지지 않게 넘겨 준다 */}
          <Route path="/auctions" element={<Navigate to="/#products" replace />} />
          <Route
            path="/auctions/:id"
            element={<LegacyLotRedirect />}
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

/** /auctions/L-001 → /bundles/L-001 */
function LegacyLotRedirect() {
  const id = window.location.pathname.split('/').pop()
  return <Navigate to={`/bundles/${id}`} replace />
}
