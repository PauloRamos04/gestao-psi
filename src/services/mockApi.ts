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

// Dados mockados
const mockClinica: Clinica = {
  id: 1,
  clinicaLogin: "clinica_psi",
  nome: "Clínica Psicológica São Paulo",
  status: true,
  titulo: "Clínica Principal"
};

const mockPsicologo: Psicologo = {
  id: 1,
  psicologLogin: "dr.silva",
  nome: "Dr. João Silva",
  dtAtivacao: "2024-01-15",
  categoriaId: 1
};

const mockUsuario: Usuario = {
  id: 1,
  clinicaId: 1,
  psicologId: 1,
  tipoId: 1,
  senha: "senha123",
  status: true,
  titulo: "Dr. João Silva",
  clinica: mockClinica,
  psicologo: mockPsicologo
};

const mockUsuarios: Usuario[] = [
  mockUsuario,
  {
    id: 2,
    clinicaId: 1,
    psicologId: 2,
    tipoId: 1,
    senha: "senha123",
    status: true,
    titulo: "Dra. Maria Santos",
    clinica: mockClinica,
    psicologo: {
      id: 2,
      psicologLogin: "dra.maria",
      nome: "Dra. Maria Santos",
      dtAtivacao: "2024-02-01",
      categoriaId: 1
    }
  },
  {
    id: 3,
    clinicaId: 1,
    psicologId: 3,
    tipoId: 2,
    senha: "senha123",
    status: false,
    titulo: "Dr. Pedro Costa",
    clinica: mockClinica,
    psicologo: {
      id: 3,
      psicologLogin: "dr.pedro",
      nome: "Dr. Pedro Costa",
      dtAtivacao: "2024-03-01",
      categoriaId: 2
    }
  }
];

const mockPacientes: Paciente[] = [
  {
    id: 1,
    clinicaId: 1,
    psicologId: 1,
    nome: "Ana Carolina",
    status: true,
    clinica: mockClinica,
    psicologo: mockPsicologo
  },
  {
    id: 2,
    clinicaId: 1,
    psicologId: 1,
    nome: "Bruno Oliveira",
    status: true,
    clinica: mockClinica,
    psicologo: mockPsicologo
  },
  {
    id: 3,
    clinicaId: 1,
    psicologId: 1,
    nome: "Carla Mendes",
    status: true,
    clinica: mockClinica,
    psicologo: mockPsicologo
  }
];

const mockSalas: Sala[] = [
  {
    id: 1,
    clinicaId: 1,
    nome: "Sala 1 - Individual",
    clinica: mockClinica
  },
  {
    id: 2,
    clinicaId: 1,
    nome: "Sala 2 - Casal",
    clinica: mockClinica
  },
  {
    id: 3,
    clinicaId: 1,
    nome: "Sala 3 - Grupo",
    clinica: mockClinica
  }
];

const mockSessoes: Sessao[] = [
  {
    id: 1,
    clinicaId: 1,
    psicologId: 1,
    pacienteId: 1,
    salaId: 1,
    data: new Date().toISOString().split('T')[0],
    hora: "09:00",
    status: "ATIVA",
    clinica: mockClinica,
    psicologo: mockPsicologo,
    paciente: mockPacientes[0],
    sala: mockSalas[0]
  },
  {
    id: 2,
    clinicaId: 1,
    psicologId: 1,
    pacienteId: 2,
    salaId: 1,
    data: new Date().toISOString().split('T')[0],
    hora: "10:30",
    status: "ATIVA",
    clinica: mockClinica,
    psicologo: mockPsicologo,
    paciente: mockPacientes[1],
    sala: mockSalas[0]
  },
  {
    id: 3,
    clinicaId: 1,
    psicologId: 1,
    pacienteId: 3,
    salaId: 2,
    data: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hora: "14:00",
    status: "ATIVA",
    clinica: mockClinica,
    psicologo: mockPsicologo,
    paciente: mockPacientes[2],
    sala: mockSalas[1]
  }
];

const mockPagamentos: Pagamento[] = [
  {
    id: 1,
    clinicaId: 1,
    psicologId: 1,
    pacienteId: 1,
    valor: 150.00,
    data: new Date().toISOString().split('T')[0],
    tipoPagamentoId: 1,
    clinica: mockClinica,
    psicologo: mockPsicologo,
    paciente: mockPacientes[0]
  },
  {
    id: 2,
    clinicaId: 1,
    psicologId: 1,
    pacienteId: 2,
    valor: 180.00,
    data: new Date().toISOString().split('T')[0],
    tipoPagamentoId: 2,
    clinica: mockClinica,
    psicologo: mockPsicologo,
    paciente: mockPacientes[1]
  }
];

const mockMensagens: Mensagem[] = [
  {
    id: 1,
    titulo: "Atualização do Sistema",
    conteudo: "O sistema passará por uma atualização no próximo fim de semana. Durante este período, o acesso será limitado.",
    dataCriacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: true
  },
  {
    id: 2,
    titulo: "Nova Funcionalidade",
    conteudo: "Agora você pode visualizar relatórios detalhados de faturamento diretamente no dashboard.",
    dataCriacao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: true
  },
  {
    id: 3,
    titulo: "Lembrete: Backup",
    conteudo: "Lembre-se de fazer backup dos dados importantes regularmente para evitar perda de informações.",
    dataCriacao: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: true
  }
];

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await delay(1000); // Simula delay de rede
    
    // Simula validação básica
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      return {
        token: 'mock-jwt-token-12345',
        user: mockUsuario
      };
    } else {
      throw new Error('Credenciais inválidas');
    }
  }

  async getUsuarios(): Promise<Usuario[]> {
    await delay(500);
    return mockUsuarios;
  }

  async getUsuario(id: number): Promise<Usuario> {
    await delay(300);
    const usuario = mockUsuarios.find(u => u.id === id);
    if (!usuario) throw new Error('Usuário não encontrado');
    return usuario;
  }

  async ativarUsuario(id: number): Promise<void> {
    await delay(300);
    const usuario = mockUsuarios.find(u => u.id === id);
    if (usuario) usuario.status = true;
  }

  async desativarUsuario(id: number): Promise<void> {
    await delay(300);
    const usuario = mockUsuarios.find(u => u.id === id);
    if (usuario) usuario.status = false;
  }

  async getClinica(login: string): Promise<Clinica> {
    await delay(300);
    return mockClinica;
  }

  async getPsicologo(login: string): Promise<Psicologo> {
    await delay(300);
    return mockPsicologo;
  }

  async getPacientes(clinicaId: number, psicologId: number): Promise<Paciente[]> {
    await delay(500);
    return mockPacientes.filter(p => p.clinicaId === clinicaId && p.psicologId === psicologId);
  }

  async getSalas(clinicaId: number): Promise<Sala[]> {
    await delay(300);
    return mockSalas.filter(s => s.clinicaId === clinicaId);
  }

  async getSessoesPorPeriodo(filtro: FiltroPeriodo): Promise<Sessao[]> {
    await delay(500);
    return mockSessoes.filter(s => 
      s.clinicaId === filtro.clinicaId && 
      s.psicologId === filtro.psicologId &&
      s.data >= filtro.inicio && 
      s.data <= filtro.fim
    );
  }

  async getSessoesPorDia(filtro: FiltroDia): Promise<Sessao[]> {
    await delay(300);
    return mockSessoes.filter(s => 
      s.clinicaId === filtro.clinicaId && 
      s.psicologId === filtro.psicologId &&
      s.data === filtro.data
    );
  }

  async getPagamentosPorPeriodo(filtro: FiltroPeriodo): Promise<Pagamento[]> {
    await delay(500);
    return mockPagamentos.filter(p => 
      p.clinicaId === filtro.clinicaId && 
      p.psicologId === filtro.psicologId &&
      p.data >= filtro.inicio && 
      p.data <= filtro.fim
    );
  }

  async getFaturamentoPorPeriodo(filtro: FiltroPeriodo): Promise<number> {
    await delay(300);
    const pagamentos = mockPagamentos.filter(p => 
      p.clinicaId === filtro.clinicaId && 
      p.psicologId === filtro.psicologId &&
      p.data >= filtro.inicio && 
      p.data <= filtro.fim
    );
    return pagamentos.reduce((total, p) => total + p.valor, 0);
  }

  async getMensagensAtivas(): Promise<Mensagem[]> {
    await delay(300);
    return mockMensagens.filter(m => m.status);
  }
}

const mockApiService = new MockApiService();
export default mockApiService;
