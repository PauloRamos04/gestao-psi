import React, { useState, useEffect } from 'react';
import { Card, Select, Alert } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import ProntuariosList from '../components/features/prontuarios/ProntuariosList';
import apiService from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Paciente } from '../types';

const { Option } = Select;

const ProntuarioPage: React.FC = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    if (!user?.clinicaId || !user?.psicologId) return;
    
    try {
      setLoading(true);
      const data = await apiService.getPacientesList(user.clinicaId, user.psicologId);
      setPacientes(data);
      if (data.length > 0) {
        setSelectedPaciente(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <FileTextOutlined style={{ fontSize: '24px' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              Prontuário Eletrônico
            </h1>
            <p style={{ margin: 0, color: '#666' }}>
              Gerencie os prontuários dos pacientes
            </p>
          </div>
          <Select
            style={{ minWidth: 300 }}
            placeholder="Selecione um paciente"
            value={selectedPaciente?.id}
            onChange={(id) => {
              const paciente = pacientes.find(p => p.id === id);
              setSelectedPaciente(paciente || null);
            }}
            loading={loading}
          >
            {pacientes.map(paciente => (
              <Option key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      {selectedPaciente ? (
        <ProntuariosList
          pacienteId={selectedPaciente.id}
          pacienteNome={selectedPaciente.nome}
        />
      ) : (
        <Card>
          <Alert
            message="Nenhum paciente selecionado"
            description="Selecione um paciente para visualizar seus prontuários."
            type="info"
            showIcon
          />
        </Card>
      )}
    </div>
  );
};

export default ProntuarioPage;

