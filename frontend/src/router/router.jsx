import { BrowserRouter, Routes, Route } from "react-router";
import Login from "../modules/auth/views/Login";
import LayoutStudent from "../components/layout/layoutStudent";
import LayoutAdmin from "../components/layout/layoutAdmin";
import LayoutTeacher from "../components/layout/layoutTeacher";
import Videos from '../modules/teacher/views/Videos'
import Simuladores from "../modules/student/views/simulador";
import Categorias from "../modules/student/views/categorias";
import SimuladorFormulario from "../modules/student/views/simuladorFormulario";


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/student" element={<LayoutStudent />}>
          <Route path="simuladores" element={<Categorias />} />
          <Route path="simuladores/:categoriaID" element={<Simuladores />} />
          <Route path="formulario/:simuladorID" element={<SimuladorFormulario />} />
        </Route>

        <Route path="/admin" element={<LayoutAdmin />}></Route>
        <Route path="/teacher" element={<LayoutTeacher />}>
         <Route path="videos" element={<Videos />} />
        
        </Route>
  
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;