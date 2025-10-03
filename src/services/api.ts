import axios, { AxiosInstance, AxiosResponse } from 'axios';
import mockApi from './mockApi';
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
  FiltroPeriodo,
  FiltroDia
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private useMock: boolean = true; // Altere para false quando o backend estiver funcionando

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:8080/api',
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
    if (this.useMock) {
      return mockApi.login(credentials);
    }
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  // Usuários
  async getUsuarios(): Promise<Usuario[]> {
    if (this.useMock) {
      return mockApi.getUsuarios();
    }
    const response: AxiosResponse<Usuario[]> = await this.api.get('/usuarios');
    return response.data;
  }

  async getUsuario(id: number): Promise<Usuario> {
    if (this.useMock) {
      return mockApi.getUsuario(id);
    }
    const response: AxiosResponse<Usuario> = await this.api.get(`/usuarios/${id}`);
    return response.data;
  }

  async ativarUsuario(id: number): Promise<void> {
    if (this.useMock) {
      return mockApi.ativarUsuario(id);
    }
    await this.api.post(`/usuarios/${id}/ativar`);
  }

  async desativarUsuario(id: number): Promise<void> {
    if (this.useMock) {
      return mockApi.desativarUsuario(id);
    }
    await this.api.post(`/usuarios/${id}/desativar`);
  }

  // Clínicas
  async getClinica(login: string): Promise<Clinica> {
    if (this.useMock) {
      return mockApi.getClinica(login);
    }
    const response: AxiosResponse<Clinica> = await this.api.get(`/clinicas/${login}`);
    return response.data;
  }

  // Psicólogos
  async getPsicologo(login: string): Promise<Psicologo> {
    if (this.useMock) {
      return mockApi.getPsicologo(login);
    }
    const response: AxiosResponse<Psicologo> = await this.api.get(`/psicologos/${login}`);
    return response.data;
  }

  // Pacientes
  async getPacientes(clinicaId: number, psicologId: number): Promise<Paciente[]> {
    if (this.useMock) {
      return mockApi.getPacientes(clinicaId, psicologId);
    }
    const response: AxiosResponse<Paciente[]> = await this.api.get(`/pacientes?clinicaId=${clinicaId}&psicologId=${psicologId}`);
    return response.data;
  }

  // Salas
  async getSalas(clinicaId: number): Promise<Sala[]> {
    if (this.useMock) {
      return mockApi.getSalas(clinicaId);
    }
    const response: AxiosResponse<Sala[]> = await this.api.get(`/salas?clinicaId=${clinicaId}`);
    return response.data;
  }

  // Sessões
  async getSessoesPorPeriodo(filtro: FiltroPeriodo): Promise<Sessao[]> {
    if (this.useMock) {
      return mockApi.getSessoesPorPeriodo(filtro);
    }
    const response: AxiosResponse<Sessao[]> = await this.api.get('/sessoes/periodo', {
      params: filtro
    });
    return response.data;
  }

  async getSessoesPorDia(filtro: FiltroDia): Promise<Sessao[]> {
    if (this.useMock) {
      return mockApi.getSessoesPorDia(filtro);
    }
    const response: AxiosResponse<Sessao[]> = await this.api.get('/sessoes/dia', {
      params: filtro
    });
    return response.data;
  }

  // Pagamentos
  async getPagamentosPorPeriodo(filtro: FiltroPeriodo): Promise<Pagamento[]> {
    if (this.useMock) {
      return mockApi.getPagamentosPorPeriodo(filtro);
    }
    const response: AxiosResponse<Pagamento[]> = await this.api.get('/pagamentos/periodo', {
      params: filtro
    });
    return response.data;
  }

  // Faturamento
  async getFaturamentoPorPeriodo(filtro: FiltroPeriodo): Promise<number> {
    if (this.useMock) {
      return mockApi.getFaturamentoPorPeriodo(filtro);
    }
    const response: AxiosResponse<number> = await this.api.get('/faturamento/periodo', {
      params: filtro
    });
    return response.data;
  }

  // Mensagens
  async getMensagensAtivas(): Promise<Mensagem[]> {
    if (this.useMock) {
      return mockApi.getMensagensAtivas();
    }
    const response: AxiosResponse<Mensagem[]> = await this.api.get('/mensagens');
    return response.data;
  }
}

const apiService = new ApiService();
export default apiService;
