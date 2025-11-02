import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, TimePicker, Select, Button, message, Space } from 'antd';
import { Sessao, Paciente, Sala, FormularioSessao } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface SessoesFormProps {
  sessao?: Sessao;
  onSuccess: () => void;
  onCancel: () => void;
}

const SessoesForm: React.FC<SessoesFormProps> = ({ sessao, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  useEffect(() => {
    loadData();
    if (sessao) {
      form.setFieldsValue({
        pacienteId: sessao.pacienteId,
        salaId: sessao.salaId,
        data: dayjs(sessao.data),
        hora: dayjs(sessao.hora, 'HH:mm'),
        observacoes: sessao.observacoes || ''
      });
    }
  }, [sessao]);

  const loadData = async () => {
    try {
      if (!user?.clinicaId || !user?.psicologId) return;
      
      const [pacientesData, salasData] = await Promise.all([
        apiService.getPacientesList(user.clinicaId, user.psicologId),
        apiService.getSalas(user.clinicaId)
      ]);
      
      setPacientes(pacientesData.filter(p => p.status));
      setSalas(salasData);
    } catch (error) {
      message.error('Erro ao carregar dados');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!user?.clinicaId || !user?.psicologId) return;
    
    setLoading(true);
    try {
      const data: FormularioSessao = {
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        pacienteId: values.pacienteId,
        salaId: values.salaId,
        data: values.data.format('YYYY-MM-DD'),
        hora: values.hora.format('HH:mm'),
        observacoes: values.observacoes
      };

      if (sessao) {
        await apiService.atualizarSessao(sessao.id, data);
        message.success('Sessão atualizada com sucesso!');
      } else {
        await apiService.criarSessao(data);
        message.success('Sessão agendada com sucesso!');
      }
      
      onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao salvar sessão';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        data: dayjs(),
        hora: dayjs().add(1, 'hour').startOf('hour')
      }}
    >
      <Form.Item
        name="pacienteId"
        label="Paciente"
        rules={[{ required: true, message: 'Selecione um paciente' }]}
      >
        <Select
          showSearch
          placeholder="Selecione o paciente"
          optionFilterProp="children"
          filterOption={(input, option) =>
            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {pacientes.map(p => (
            <Option key={p.id} value={p.id}>{p.nome}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="data"
        label="Data"
        rules={[{ required: true, message: 'Selecione a data' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          placeholder="Selecione a data"
          disabledDate={(current) => current && current < dayjs().startOf('day')}
        />
      </Form.Item>

      <Form.Item
        name="hora"
        label="Horário"
        rules={[{ required: true, message: 'Selecione o horário' }]}
      >
        <TimePicker
          style={{ width: '100%' }}
          format="HH:mm"
          placeholder="Selecione o horário"
          minuteStep={30}
        />
      </Form.Item>

      <Form.Item
        name="salaId"
        label="Sala"
      >
        <Select
          placeholder="Selecione a sala (opcional)"
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
          }
          notFoundContent={salas.length === 0 ? "Nenhuma sala cadastrada" : undefined}
        >
          {salas.map(s => (
            <Option key={s.id} value={s.id}>{s.nome}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="observacoes"
        label="Observações"
      >
        <TextArea
          rows={3}
          placeholder="Observações sobre a sessão"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {sessao ? 'Atualizar' : 'Agendar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SessoesForm;

