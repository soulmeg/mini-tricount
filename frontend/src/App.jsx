import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/groups/:id" element={<GroupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
