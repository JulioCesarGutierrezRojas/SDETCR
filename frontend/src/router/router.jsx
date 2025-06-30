import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../modules/auth/views/Login";
import LayoutStudent from "../components/layout/layoutStudent";
import LayoutAdmin from "../components/layout/layoutAdmin";
import LayoutTeacher from "../components/layout/layoutTeacher";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student" element={<LayoutStudent />}></Route>
        <Route path="/admin" element={<LayoutAdmin />}></Route>
        <Route path="/teacher" element={<LayoutTeacher />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;