import { BrowserRouter, Routes, Route } from "react-router";
import { Navigate } from "react-router";
import Login from "../modules/auth/views/Login";
import LayoutStudent from "../components/layout/layoutStudent";
import LayoutAdmin from "../components/layout/layoutAdmin";
import LayoutTeacher from "../components/layout/layoutTeacher";
import Videos from '../modules/teacher/views/Videos'
import Simuladores from "../modules/student/views/simulador";
import Categorias from "../modules/student/views/categorias";
import SimuladorFormulario from "../modules/student/views/simuladorFormulario";
import RegisterForm from "../modules/auth/views/RegisterForm";
import PasswordRecoveryForm from "../modules/auth/views/PasswordRecoveryForm";
import CategoriasAdmin from "../modules/admin/views/CategoriasList";
import SimuladoresAdmin from "../modules/admin/views/SimuladoresList";
import SimuladorFormAdmin from "../modules/admin/views/SimuladorForm";
import ListaEstudiantes from "../modules/teacher/views/ListaEstudiantes";
import UsuariosList from "../modules/admin/views/UsuariosList";
import EvaluarEstudiante from "../modules/teacher/views/EvaluarEstudiante";
import EvaluarSimulador from "../modules/teacher/views/EvaluarSimulador";
import ResultadosEstudiante from "../modules/student/views/resultados";
import ComentariosEstudiante from "../modules/student/views/comentariosList";
import StudentSimulators from "../modules/admin/views/simulatorHistory/StudentSimulators";
import SimulatorDetail from "../modules/admin/views/simulatorHistory/SimulatorDetail";
import SugerirSimulador from "../modules/student/views/sugerirSimulador";
import SeleccionarEstudiante from "../modules/teacher/views/SeleccionarEstudiante";
import AprobarSugerencias from "../modules/admin/views/AprobarSugerencias"; 


const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<PasswordRecoveryForm />} />

        <Route path="/student" element={<LayoutStudent />}>
          <Route index element={<Navigate to="simuladores" replace />} />
          <Route path="simuladores" element={<Categorias />} />
          <Route path="simuladores/:categoriaID" element={<Simuladores />} />
          <Route path="formulario/:simuladorID" element={<SimuladorFormulario />} />
          <Route path="resultadosObtenidos" element={<ResultadosEstudiante />} />
          <Route path="comentariosObtenidos" element={<ComentariosEstudiante />} />
          <Route path="sugerirSimulador" element={<SugerirSimulador/>} />
        </Route>

        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Navigate to="usuarios" replace />} />
          <Route path="usuarios" element={<UsuariosList />} />
          <Route path="categorias" element={<CategoriasAdmin />} />
          <Route path="categoria/:simuladorID" element={<SimuladoresAdmin />} />
          <Route path="simulador/:formularioID" element={<SimuladorFormAdmin />} />
          <Route path="historial/:estudianteID" element={<StudentSimulators />} />
          <Route path="historial/:estudianteID/:simuladorID" element={<SimulatorDetail />} />
          <Route path="sugerenciaSimulador" element={<AprobarSugerencias />} />
        </Route>

        <Route path="/teacher" element={<LayoutTeacher />}>
          <Route index element={<Navigate to="seleccionarEstudiante" replace />} />
          <Route path="seleccionarEstudiante" element={<SeleccionarEstudiante />} />
          <Route path="estudiantesSeleccionados" element={<ListaEstudiantes />} />
          <Route path="evaluarEstudiante" element={<EvaluarEstudiante />} />
          <Route path="evaluarSimulador" element={<EvaluarSimulador />} />
          <Route path="videos" element={<Videos />} />
        </Route>
  
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;