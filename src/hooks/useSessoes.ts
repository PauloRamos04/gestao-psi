import { useState, useCallback } from 'react';
import { message } from 'antd';
import apiService from '../services/api';
import { Sessao, FormularioSessao, FiltroPeriodo, FiltroDia } from '../types';

export const useSessoes = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSessoesPorPeriodo = useCallback(async (filtro: FiltroPeriodo) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getSessoesPorPeriodo(filtro);
      setSessoes(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao carregar sessões';
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSessoesPorDia = useCallback(async (filtro: FiltroDia) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getSessoesPorDia(filtro);
      setSessoes(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao carregar sessões';
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarSessao = async (data: FormularioSessao) => {
    try {
      const novaSessao = await apiService.criarSessao(data);
      setSessoes([...sessoes, novaSessao]);
      message.success('Sessão agendada com sucesso!');
      return novaSessao;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao agendar sessão';
      message.error(errorMsg);
      throw err;
    }
  };

  const atualizarSessao = async (id: number, data: FormularioSessao) => {
    try {
      const sessaoAtualizada = await apiService.atualizarSessao(id, data);
      setSessoes(sessoes.map(s => s.id === id ? sessaoAtualizada : s));
      message.success('Sessão atualizada com sucesso!');
      return sessaoAtualizada;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao atualizar sessão';
      message.error(errorMsg);
      throw err;
    }
  };

  const cancelarSessao = async (id: number) => {
    try {
      await apiService.cancelarSessao(id);
      setSessoes(sessoes.filter(s => s.id !== id));
      message.success('Sessão cancelada com sucesso!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao cancelar sessão';
      message.error(errorMsg);
      throw err;
    }
  };

  const deletarSessao = async (id: number) => {
    try {
      await apiService.deletarSessao(id);
      setSessoes(sessoes.filter(s => s.id !== id));
      message.success('Sessão removida com sucesso!');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao remover sessão';
      message.error(errorMsg);
      throw err;
    }
  };

  return {
    sessoes,
    loading,
    error,
    loadSessoesPorPeriodo,
    loadSessoesPorDia,
    criarSessao,
    atualizarSessao,
    cancelarSessao,
    deletarSessao
  };
};

