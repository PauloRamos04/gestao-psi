import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Modal, Button, Space, message, Tooltip } from 'antd';
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import { Sessao } from '../../../types';
import SessoesForm from '../sessoes/SessoesForm';

const AgendaCalendar: React.FC = () => {
  const { user } = useAuth();
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [sessoesDoDia, setSessoesDoDia] = useState<Sessao[]>([]);

  useEffect(() => {
    loadSessoesDoMes();
  }, [selectedDate]);

  const loadSessoesDoMes = async () => {
    if (!user?.clinicaId || !user?.psicologId) return;

    setLoading(true);
    try {
      const inicio = selectedDate.startOf('month').format('YYYY-MM-DD');
      const fim = selectedDate.endOf('month').format('YYYY-MM-DD');

      const data = await apiService.getSessoesPorPeriodo({
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        inicio,
        fim
      });

      setSessoes(data);
    } catch (error) {
      message.error('Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value: Dayjs) => {
    const dataStr = value.format('YYYY-MM-DD');
    const sessoesDia = sessoes.filter(s => s.data === dataStr);
    
    return sessoesDia.map(sessao => ({
      type: sessao.status ? 'success' : 'warning',
      content: `${sessao.hora} - ${sessao.pacienteNome || 'Paciente'}`,
    }));
  };

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type as any} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const onSelect = (date: Dayjs) => {
    setSelectedDate(date);
    const dataStr = date.format('YYYY-MM-DD');
    const sessoesData = sessoes.filter(s => s.data === dataStr);
    setSessoesDoDia(sessoesData);
  };

  const handleAddSessao = () => {
    setModalVisible(true);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    loadSessoesDoMes();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
          <p className="text-gray-600">Visualize e gerencie seus agendamentos</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddSessao}
        >
          Agendar Sessão
        </Button>
      </div>

      {/* Calendário */}
      <Card loading={loading}>
        <Calendar
          dateCellRender={dateCellRender}
          onSelect={onSelect}
          value={selectedDate}
          onChange={setSelectedDate}
        />
      </Card>

      {/* Sessões do Dia Selecionado */}
      {sessoesDoDia.length > 0 && (
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              {`Sessões de ${selectedDate.format('DD/MM/YYYY')}`}
            </Space>
          }
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {sessoesDoDia.map((sessao) => (
              <Card
                key={sessao.id}
                size="small"
                style={{
                  backgroundColor: sessao.status ? '#f6ffed' : '#fff7e6',
                  border: `1px solid ${sessao.status ? '#b7eb8f' : '#ffd591'}`
                }}
              >
                <Space direction="vertical" size="small">
                  <div>
                    <strong>Horário:</strong> {sessao.hora}
                  </div>
                  <div>
                    <strong>Paciente:</strong> {sessao.pacienteNome || 'N/A'}
                  </div>
                  {sessao.salaNome && (
                    <div>
                      <strong>Sala:</strong> {sessao.salaNome}
                    </div>
                  )}
                  {sessao.observacoes && (
                    <div>
                      <strong>Obs:</strong> {sessao.observacoes}
                    </div>
                  )}
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      )}

      {/* Modal de Agendamento */}
      <Modal
        title="Agendar Sessão"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <SessoesForm
          onSuccess={handleSuccess}
          onCancel={() => setModalVisible(false)}
        />
      </Modal>
    </div>
  );
};

export default AgendaCalendar;

