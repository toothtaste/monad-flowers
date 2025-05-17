import { BrowserRouter, Route, Routes } from "react-router"
import Header from "./components/Header"
import Flowers from "./pages/Flowers"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Receiver from "./pages/Receiver"
import Result from "./pages/Result"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flowers" element={<Flowers />} />
        <Route path="/receiver" element={<Receiver />} />
        <Route path="/result/:hash" element={<Result />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
