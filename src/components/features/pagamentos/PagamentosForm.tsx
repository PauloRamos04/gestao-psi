import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, message, Space, InputNumber, Switch, Row, Col, Divider } from 'antd';
import { Pagamento, Paciente, FormularioPagamento, TipoPagamento } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface PagamentosFormProps {
  pagamento?: Pagamento;
  onSuccess: () => void;
  onCancel: () => void;
}

const PagamentosForm: React.FC<PagamentosFormProps> = ({ pagamento, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [ehConvenio, setEhConvenio] = useState(false);

  // Tipos de pagamento fixos (pode vir do backend depois)
  const tiposPagamento: TipoPagamento[] = [
    { id: 1, nome: 'Dinheiro' },
    { id: 2, nome: 'Cartão de Crédito' },
    { id: 3, nome: 'Cartão de Débito' },
    { id: 4, nome: 'PIX' },
    { id: 5, nome: 'Transferência' }
  ];

  useEffect(() => {
    loadPacientes();
    if (pagamento) {
      setEhConvenio(pagamento.ehConvenio || false);
      form.setFieldsValue({
        pacienteId: pagamento.pacienteId,
        valor: pagamento.valor,
        data: dayjs(pagamento.data),
        tipoPagamentoId: pagamento.tipoPagamentoId,
        observacoes: pagamento.observacoes || '',
        ehConvenio: pagamento.ehConvenio || false,
        convenio: pagamento.convenio,
        numeroGuia: pagamento.numeroGuia,
        valorConvenio: pagamento.valorConvenio,
        valorCoparticipacao: pagamento.valorCoparticipacao
      });
    }
  }, [pagamento]);

  const loadPacientes = async () => {
    try {
      if (!user?.clinicaId || !user?.psicologId) return;
      
      const data = await apiService.getPacientesList(user.clinicaId, user.psicologId);
      setPacientes(data.filter(p => p.status));
    } catch (error) {
      message.error('Erro ao carregar pacientes');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!user?.clinicaId || !user?.psicologId) return;
    
    setLoading(true);
    try {
      const data: FormularioPagamento = {
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        pacienteId: values.pacienteId,
        valor: values.valor,
        data: values.data.format('YYYY-MM-DD'),
        tipoPagamentoId: values.tipoPagamentoId,
        observacoes: values.observacoes,
        // Campos de Convênio
        ehConvenio: values.ehConvenio || false,
        convenio: values.convenio,
        numeroGuia: values.numeroGuia,
        valorConvenio: values.valorConvenio,
        valorCoparticipacao: values.valorCoparticipacao
      };

      if (pagamento) {
        await apiService.atualizarPagamento(pagamento.id, data);
        message.success('Pagamento atualizado com sucesso!');
      } else {
        await apiService.criarPagamento(data);
        message.success('Pagamento registrado com sucesso!');
      }
      
      onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao salvar pagamento';
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
        valor: 0
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
        name="valor"
        label="Valor (R$)"
        rules={[
          { required: true, message: 'Informe o valor' },
          { type: 'number', min: 0.01, message: 'Valor deve ser maior que zero' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="0,00"
          min={0}
          step={0.01}
          precision={2}
          prefix="R$"
        />
      </Form.Item>

      <Form.Item
        name="data"
        label="Data do Pagamento"
        rules={[{ required: true, message: 'Selecione a data' }]}
      >
        <DatePicker
          style={{ width: '100%' }}
          format="DD/MM/YYYY"
          placeholder="Selecione a data"
        />
      </Form.Item>

      <Form.Item
        name="tipoPagamentoId"
        label="Forma de Pagamento"
        rules={[{ required: true, message: 'Selecione a forma de pagamento' }]}
      >
        <Select placeholder="Selecione">
          {tiposPagamento.map(t => (
            <Option key={t.id} value={t.id}>{t.nome}</Option>
          ))}
        </Select>
      </Form.Item>

      <Divider>Convênio</Divider>

      <Form.Item
        name="ehConvenio"
        label="Pagamento via Convênio?"
        valuePropName="checked"
      >
        <Switch 
          onChange={(checked) => setEhConvenio(checked)}
          checkedChildren="SIM"
          unCheckedChildren="NÃO"
        />
      </Form.Item>

      {ehConvenio && (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="convenio"
                label="Nome do Convênio"
                rules={[{ required: ehConvenio, message: 'Informe o convênio' }]}
              >
                <Input placeholder="Ex: Unimed, Amil, Bradesco" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numeroGuia"
                label="Número da Guia"
              >
                <Input placeholder="Número da guia/autorização" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="valorConvenio"
                label="Valor Convênio (R$)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0,00"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="R$"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="valorCoparticipacao"
                label="Coparticipação (R$)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0,00"
                  min={0}
                  step={0.01}
                  precision={2}
                  prefix="R$"
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ 
            padding: '8px 12px', 
            backgroundColor: '#e6f7ff', 
            border: '1px solid #91d5ff', 
            borderRadius: '4px',
            marginBottom: 16,
            fontSize: '12px'
          }}>
            💡 <strong>Dica:</strong> Valor Total = Valor Convênio + Coparticipação
          </div>
        </>
      )}

      <Form.Item
        name="observacoes"
        label="Observações"
      >
        <TextArea
          rows={3}
          placeholder="Observações sobre o pagamento"
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {pagamento ? 'Atualizar' : 'Registrar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PagamentosForm;

