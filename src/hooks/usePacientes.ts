import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import apiService from '../services/api';
import { Paciente, FormularioPaciente } from '../types';

export const usePacientes = (clinicaId?: number, psicologId?: number) => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPacientes = useCallback(async () => {
    if (!clinicaId || !psicologId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPacientesList(clinicaId, psicologId);
      setPacientes(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao carregar pacientes';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, psicologId]);

  useEffect(() => {
    loadPacientes();
  }, [loadPacientes]);

  const criarPaciente = async (data: FormularioPaciente) => {
    try {
      const novoPaciente = await apiService.criarPaciente(data);
      setPacientes([...pacientes, novoPaciente]);
      message.success('Paciente criado com sucesso!');
      return novoPaciente;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao criar paciente';
      message.error(errorMsg);
      throw err;
    }
  };

  const atualizarPaciente = async (id: number, data: FormularioPaciente) => {
    try {
      const pacienteAtualizado = await apiService.atualizarPaciente(id, data);
      setPacientes(pacientes.map(p => p.id === id ? pacienteAtualizado : p));
      message.success('Paciente atualizado com sucesso!');
      return pacienteAtualizado;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar paciente';
      message.error(errorMsg);
      throw err;
    }
  };

  const deletarPaciente = async (id: number) => {
    try {
      await apiService.deletarPaciente(id);
      setPacientes(pacientes.filter(p => p.id !== id));
      message.success('Paciente removido com sucesso!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao remover paciente';
      message.error(errorMsg);
      throw err;
    }
  };

  const ativarPaciente = async (id: number) => {
    try {
      await apiService.ativarPaciente(id);
      await loadPacientes();
      message.success('Paciente ativado com sucesso!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao ativar paciente';
      message.error(errorMsg);
      throw err;
    }
  };

  return {
    pacientes,
    loading,
    error,
    loadPacientes,
    criarPaciente,
    atualizarPaciente,
    deletarPaciente,
    ativarPaciente
  };
};

