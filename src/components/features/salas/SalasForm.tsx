import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Space } from 'antd';
import { Sala } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';

const { TextArea } = Input;

interface SalasFormProps {
  sala?: Sala;
  onSuccess: () => void;
  onCancel: () => void;
}

const SalasForm: React.FC<SalasFormProps> = ({ sala, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sala) {
      form.setFieldsValue({
        nome: sala.nome
      });
    }
  }, [sala, form]);

  const handleSubmit = async (values: any) => {
    if (!user?.clinicaId) return;
    
    setLoading(true);
    try {
      const data = {
        clinicaId: user.clinicaId,
        nome: values.nome
      };

      if (sala) {
        await apiService.atualizarSala(sala.id, data);
        message.success('Sala atualizada com sucesso!');
      } else {
        await apiService.criarSala(data);
        message.success('Sala criada com sucesso!');
      }
      
      onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao salvar sala';
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
    >
      <Form.Item
        name="nome"
        label="Nome da Sala"
        rules={[
          { required: true, message: 'Informe o nome da sala' },
          { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
          { max: 100, message: 'Nome deve ter no máximo 100 caracteres' }
        ]}
      >
        <Input placeholder="Ex: Sala 1, Consultório A" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {sala ? 'Atualizar' : 'Criar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SalasForm;

