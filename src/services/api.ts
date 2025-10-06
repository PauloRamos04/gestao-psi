import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  Usuario, 
  Clinica, 
  Psicologo, 
  Paciente, 
  Sala, 
  Sessao, 
  Pagamento, 
  Mensagem,
  Notificacao,
  Prontuario,
  Categoria,
  TipoUser,
  FiltroPeriodo,
  FiltroDia,
  FormularioPaciente,
  FormularioSessao,
  FormularioPagamento,
  FormularioUsuario,
  FormularioProntuario,
  FormularioClinica,
  FormularioPsicologo
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    const appEnv = process.env.REACT_APP_ENV || 'development';
    const baseURL = appEnv === 'production'
      ? (process.env.REACT_APP_API_URL_PRD || process.env.REACT_APP_API_URL || 'http://localhost:8081/api')
      : (process.env.REACT_APP_API_URL_DEV || process.env.REACT_APP_API_URL || 'http://localhost:8081/api');

    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token nas requisições
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar respostas de erro
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  // ==================== PACIENTES ====================
  async getPacientes(clinicaId: number, psicologId: number, page = 0, size = 10) {
    const response = await this.api.get('/pacientes', {
      params: { clinicaId, psicologId, page, size }
    });
    return response.data;
  }

  async getPacientesList(clinicaId: number, psicologId: number): Promise<Paciente[]> {
    const response: AxiosResponse<Paciente[]> = await this.api.get('/pacientes/todos', {
      params: { clinicaId, psicologId }
    });
    return response.data;
  }

  async getPaciente(id: number): Promise<Paciente> {
    const response: AxiosResponse<Paciente> = await this.api.get(`/pacientes/${id}`);
    return response.data;
  }

  async criarPaciente(data: FormularioPaciente): Promise<Paciente> {
    const response: AxiosResponse<Paciente> = await this.api.post('/pacientes', data);
    return response.data;
  }

  async atualizarPaciente(id: number, data: FormularioPaciente): Promise<Paciente> {
    const response: AxiosResponse<Paciente> = await this.api.put(`/pacientes/${id}`, data);
    return response.data;
  }

  async deletarPaciente(id: number): Promise<void> {
    await this.api.delete(`/pacientes/${id}`);
  }

  async ativarPaciente(id: number): Promise<void> {
    await this.api.post(`/pacientes/${id}/ativar`);
  }

  // ==================== SESSÕES ====================
  async getSessoesPorPeriodo(filtro: FiltroPeriodo): Promise<Sessao[]> {
    const response: AxiosResponse<Sessao[]> = await this.api.get('/sessoes/periodo', {
      params: filtro
    });
    return response.data;
  }

  async getSessoesPorDia(filtro: FiltroDia): Promise<Sessao[]> {
    const response: AxiosResponse<Sessao[]> = await this.api.get('/sessoes/dia', {
      params: filtro
    });
    return response.data;
  }

  async getSessao(id: number): Promise<Sessao> {
    const response: AxiosResponse<Sessao> = await this.api.get(`/sessoes/${id}`);
    return response.data;
  }

  async criarSessao(data: FormularioSessao): Promise<Sessao> {
    const response: AxiosResponse<Sessao> = await this.api.post('/sessoes', data);
    return response.data;
  }

  async atualizarSessao(id: number, data: FormularioSessao): Promise<Sessao> {
    const response: AxiosResponse<Sessao> = await this.api.put(`/sessoes/${id}`, data);
    return response.data;
  }

  async cancelarSessao(id: number): Promise<void> {
    await this.api.post(`/sessoes/${id}/cancelar`);
  }

  async deletarSessao(id: number): Promise<void> {
    await this.api.delete(`/sessoes/${id}`);
  }

  // ==================== PAGAMENTOS ====================
  async getPagamentosPorPeriodo(filtro: FiltroPeriodo): Promise<Pagamento[]> {
    const response: AxiosResponse<Pagamento[]> = await this.api.get('/pagamentos/periodo', {
      params: filtro
    });
    return response.data;
  }

  async getPagamento(id: number): Promise<Pagamento> {
    const response: AxiosResponse<Pagamento> = await this.api.get(`/pagamentos/${id}`);
    return response.data;
  }

  async criarPagamento(data: FormularioPagamento): Promise<Pagamento> {
    const response: AxiosResponse<Pagamento> = await this.api.post('/pagamentos', data);
    return response.data;
  }

  async atualizarPagamento(id: number, data: FormularioPagamento): Promise<Pagamento> {
    const response: AxiosResponse<Pagamento> = await this.api.put(`/pagamentos/${id}`, data);
    return response.data;
  }

  async deletarPagamento(id: number): Promise<void> {
    await this.api.delete(`/pagamentos/${id}`);
  }

  // ==================== SALAS ====================
  async getSalas(clinicaId: number): Promise<Sala[]> {
    const response: AxiosResponse<Sala[]> = await this.api.get('/salas', {
      params: { clinicaId }
    });
    return response.data;
  }

  async getSala(id: number): Promise<Sala> {
    const response: AxiosResponse<Sala> = await this.api.get(`/salas/${id}`);
    return response.data;
  }

  async criarSala(data: { clinicaId: number; nome: string }): Promise<Sala> {
    const response: AxiosResponse<Sala> = await this.api.post('/salas', data);
    return response.data;
  }

  async atualizarSala(id: number, data: { clinicaId: number; nome: string }): Promise<Sala> {
    const response: AxiosResponse<Sala> = await this.api.put(`/salas/${id}`, data);
    return response.data;
  }

  async deletarSala(id: number): Promise<void> {
    await this.api.delete(`/salas/${id}`);
  }

  // ==================== MENSAGENS ====================
  async getMensagensAtivas(): Promise<Mensagem[]> {
    const response: AxiosResponse<Mensagem[]> = await this.api.get('/mensagens');
    return response.data;
  }

  async getMensagensTodas(): Promise<Mensagem[]> {
    const response: AxiosResponse<Mensagem[]> = await this.api.get('/mensagens/todas');
    return response.data;
  }

  async getMensagem(id: number): Promise<Mensagem> {
    const response: AxiosResponse<Mensagem> = await this.api.get(`/mensagens/${id}`);
    return response.data;
  }

  async criarMensagem(data: { titulo: string; conteudo: string; status?: boolean }): Promise<Mensagem> {
    const response: AxiosResponse<Mensagem> = await this.api.post('/mensagens', data);
    return response.data;
  }

  async atualizarMensagem(id: number, data: { titulo: string; conteudo: string; status?: boolean }): Promise<Mensagem> {
    const response: AxiosResponse<Mensagem> = await this.api.put(`/mensagens/${id}`, data);
    return response.data;
  }

  async desativarMensagem(id: number): Promise<void> {
    await this.api.post(`/mensagens/${id}/desativar`);
  }

  async deletarMensagem(id: number): Promise<void> {
    await this.api.delete(`/mensagens/${id}`);
  }

  // ==================== FATURAMENTO ====================
  async getFaturamentoPorPeriodo(filtro: FiltroPeriodo): Promise<number> {
    const response: AxiosResponse<number> = await this.api.get('/faturamento/periodo', {
      params: filtro
    });
    return response.data;
  }

  // ==================== USUÁRIOS ====================
  async getUsuarios(): Promise<Usuario[]> {
    const response: AxiosResponse<Usuario[]> = await this.api.get('/usuarios');
    return response.data;
  }

  async getUsuario(id: number): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.get(`/usuarios/${id}`);
    return response.data;
  }

  async ativarUsuario(id: number): Promise<void> {
    await this.api.post(`/usuarios/${id}/ativar`);
  }

  async desativarUsuario(id: number): Promise<void> {
    await this.api.post(`/usuarios/${id}/desativar`);
  }

  async criarUsuario(data: FormularioUsuario): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.post('/usuarios', data);
    return response.data;
  }

  async atualizarUsuario(id: number, data: FormularioUsuario): Promise<Usuario> {
    const response: AxiosResponse<Usuario> = await this.api.put(`/usuarios/${id}`, data);
    return response.data;
  }

  // ==================== CLÍNICAS ====================
  async getClinicas(): Promise<Clinica[]> {
    const response: AxiosResponse<Clinica[]> = await this.api.get('/clinicas');
    return response.data;
  }

  async getClinica(login: string): Promise<Clinica> {
    const response: AxiosResponse<Clinica> = await this.api.get(`/clinicas/${login}`);
    return response.data;
  }

  async criarClinica(data: FormularioClinica): Promise<Clinica> {
    const response: AxiosResponse<Clinica> = await this.api.post('/clinicas', data);
    return response.data;
  }

  async atualizarClinica(id: number, data: FormularioClinica): Promise<Clinica> {
    const response: AxiosResponse<Clinica> = await this.api.put(`/clinicas/${id}`, data);
    return response.data;
  }

  async ativarClinica(id: number): Promise<void> {
    await this.api.post(`/clinicas/${id}/ativar`);
  }

  async desativarClinica(id: number): Promise<void> {
    await this.api.post(`/clinicas/${id}/desativar`);
  }

  // ==================== PSICÓLOGOS ====================
  async getPsicologos(): Promise<Psicologo[]> {
    const response: AxiosResponse<Psicologo[]> = await this.api.get('/psicologos');
    return response.data;
  }

  async getPsicologo(login: string): Promise<Psicologo> {
    const response: AxiosResponse<Psicologo> = await this.api.get(`/psicologos/${login}`);
    return response.data;
  }

  async criarPsicologo(data: FormularioPsicologo): Promise<Psicologo> {
    const response: AxiosResponse<Psicologo> = await this.api.post('/psicologos', data);
    return response.data;
  }

  async atualizarPsicologo(id: number, data: FormularioPsicologo): Promise<Psicologo> {
    const response: AxiosResponse<Psicologo> = await this.api.put(`/psicologos/${id}`, data);
    return response.data;
  }

  async deletarPsicologo(id: number): Promise<void> {
    await this.api.delete(`/psicologos/${id}`);
  }

  // ==================== CATEGORIAS ====================
  async getCategorias(): Promise<Categoria[]> {
    const response: AxiosResponse<Categoria[]> = await this.api.get('/categorias');
    return response.data;
  }

  // ==================== TIPOS DE USUÁRIO ====================
  async getTiposUsuario(): Promise<TipoUser[]> {
    const response: AxiosResponse<TipoUser[]> = await this.api.get('/tipos-usuario');
    return response.data;
  }

  // ==================== PRONTUÁRIOS ====================
  async getProntuariosPorPaciente(pacienteId: number): Promise<Prontuario[]> {
    const response: AxiosResponse<Prontuario[]> = await this.api.get(`/prontuarios/paciente/${pacienteId}`);
    return response.data;
  }

  async getProntuariosPorPacientePaginado(pacienteId: number, page = 0, size = 10) {
    const response = await this.api.get(`/prontuarios/paciente/${pacienteId}/paginado`, {
      params: { page, size }
    });
    return response.data;
  }

  async getProntuario(id: number): Promise<Prontuario> {
    const response: AxiosResponse<Prontuario> = await this.api.get(`/prontuarios/${id}`);
    return response.data;
  }

  async criarProntuario(data: FormularioProntuario): Promise<Prontuario> {
    const response: AxiosResponse<Prontuario> = await this.api.post('/prontuarios', data);
    return response.data;
  }

  async atualizarProntuario(id: number, data: FormularioProntuario): Promise<Prontuario> {
    const response: AxiosResponse<Prontuario> = await this.api.put(`/prontuarios/${id}`, data);
    return response.data;
  }

  async deletarProntuario(id: number): Promise<void> {
    await this.api.delete(`/prontuarios/${id}`);
  }

  // ==================== RELATÓRIOS ====================
  async getRelatorioSessoes(clinicaId: number, psicologId: number, inicio: string, fim: string) {
    const response = await this.api.get('/relatorios/sessoes', {
      params: { clinicaId, psicologId, inicio, fim }
    });
    return response.data;
  }

  async getRelatorioPacientes(clinicaId: number, psicologId: number) {
    const response = await this.api.get('/relatorios/pacientes', {
      params: { clinicaId, psicologId }
    });
    return response.data;
  }

  async getRelatorioFinanceiro(clinicaId: number, psicologId: number, inicio: string, fim: string) {
    const response = await this.api.get('/relatorios/financeiro', {
      params: { clinicaId, psicologId, inicio, fim }
    });
    return response.data;
  }

  // ==================== NOTIFICAÇÕES ====================
  async getNotificacoesPorUsuario(usuarioId: number): Promise<Notificacao[]> {
    const response: AxiosResponse<Notificacao[]> = await this.api.get(`/notificacoes/usuario/${usuarioId}`);
    return response.data;
  }

  async getNotificacoesNaoLidas(usuarioId: number): Promise<Notificacao[]> {
    const response: AxiosResponse<Notificacao[]> = await this.api.get(`/notificacoes/usuario/${usuarioId}/nao-lidas`);
    return response.data;
  }

  async contarNotificacoesNaoLidas(usuarioId: number): Promise<number> {
    const response: AxiosResponse<number> = await this.api.get(`/notificacoes/usuario/${usuarioId}/contador`);
    return response.data;
  }

  async marcarNotificacaoComoLida(id: number): Promise<void> {
    await this.api.post(`/notificacoes/${id}/marcar-lida`);
  }

  async marcarTodasNotificacoesComoLidas(usuarioId: number): Promise<void> {
    await this.api.post(`/notificacoes/usuario/${usuarioId}/marcar-todas-lidas`);
  }
}

const apiService = new ApiService();
export default apiService;
