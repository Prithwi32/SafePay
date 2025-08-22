import { Routes, Route } from "react-router-dom"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"
import { ElderModeProvider } from "./contexts/elder-mode"
import HomePage from "./pages/HomePage"
import ConnectBankPage from "./pages/ConnectBankPage"
import SendMoneyPage from "./pages/SendMoneyPage"
import ReviewMoneyPage from "./pages/ReviewMoneyPage"

function App() {
  return (
    <ElderModeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/connect-bank" element={<ConnectBankPage />} />
            <Route path="/send-money" element={<SendMoneyPage />} />
            <Route path="/review-money" element={<ReviewMoneyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ElderModeProvider>
  )
}

export default App
