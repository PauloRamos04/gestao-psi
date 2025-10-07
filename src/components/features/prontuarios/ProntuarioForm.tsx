import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, message, Space, Radio } from 'antd';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';

const { TextArea } = Input;
const { Option } = Select;

interface ProntuarioFormProps {
  pacienteId: number;
  prontuario?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProntuarioForm: React.FC<ProntuarioFormProps> = ({
  pacienteId,
  prontuario,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (prontuario) {
      form.setFieldsValue(prontuario);
    }
  }, [prontuario, form]);

  const handleSubmit = async (values: any) => {
    if (!user?.psicologId) {
      message.error('Usuário não tem psicologId configurado!');
      console.error('user:', user);
      return;
    }

    setLoading(true);
    try {
      const data = {
        pacienteId,
        psicologId: user.psicologId,
        ...values
      };
      
      console.log('Dados a serem enviados:', data);

      if (prontuario) {
        await apiService.atualizarProntuario(prontuario.id, data);
        message.success('Prontuário atualizado!');
      } else {
        await apiService.criarProntuario(data);
        message.success('Prontuário criado!');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar prontuário:', error);
      console.error('Resposta do servidor:', error.response?.data);
      message.error(error.response?.data?.message || 'Erro ao salvar prontuário. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ tipo: 'EVOLUCAO', privado: true }}
    >
      <Form.Item
        name="tipo"
        label="Tipo de Registro"
        rules={[{ required: true }]}
      >
        <Radio.Group>
          <Radio value="ANAMNESE">Anamnese</Radio>
          <Radio value="EVOLUCAO">Evolução</Radio>
          <Radio value="OBSERVACAO">Observação</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="titulo"
        label="Título"
        rules={[{ max: 200 }]}
      >
        <Input placeholder="Título do registro (opcional)" />
      </Form.Item>

      <Form.Item
        name="conteudo"
        label="Conteúdo"
        rules={[
          { required: true, message: 'Conteúdo é obrigatório' },
          { min: 10, message: 'Mínimo 10 caracteres' }
        ]}
      >
        <TextArea
          rows={6}
          placeholder="Descreva a evolução, observações ou anamnese"
          showCount
          maxLength={5000}
        />
      </Form.Item>

      <Form.Item
        name="queixaPrincipal"
        label="Queixa Principal"
      >
        <TextArea
          rows={2}
          placeholder="Queixa principal do paciente"
          maxLength={500}
        />
      </Form.Item>

      <Form.Item
        name="objetivoTerapeutico"
        label="Objetivo Terapêutico"
      >
        <TextArea
          rows={2}
          placeholder="Objetivos da terapia"
          maxLength={500}
        />
      </Form.Item>

      <Form.Item
        name="planoTerapeutico"
        label="Plano Terapêutico"
      >
        <TextArea
          rows={3}
          placeholder="Plano de intervenção terapêutica"
          maxLength={2000}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {prontuario ? 'Atualizar' : 'Salvar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ProntuarioForm;

