import clientErrorHandling from "@/lib/clientErrorsReporting"
import { BrowserRouter, Route, Routes } from "react-router"
import Bee from "./components/Bee"
import Header from "./components/Header"
import Warning from "./components/Warning"
import Flowers from "./pages/Flowers"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Receiver from "./pages/Receiver"
import Result from "./pages/Result"

clientErrorHandling()

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flowers" element={<Flowers />} />
        <Route path="/receiver" element={<Receiver />} />
        <Route path="/result" element={<Result />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Bee />
      <Warning />
    </BrowserRouter>
  )
}
