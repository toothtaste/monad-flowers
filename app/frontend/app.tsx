import { BrowserRouter, Route, Routes } from "react-router"
import Flowers from "./pages/Flowers"
import Home from "./pages/Home"
import Receiver from "./pages/Receiver"
import Result from "./pages/Result"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flowers" element={<Flowers />} />
        <Route path="/receiver" element={<Receiver />} />
        <Route path="/result/:hash" element={<Result />} />
      </Routes>
    </BrowserRouter>
  )
}
