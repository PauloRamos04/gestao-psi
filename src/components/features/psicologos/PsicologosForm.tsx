import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, message, DatePicker, Spin } from 'antd';
import { FormularioPsicologo, Categoria } from '../../../types';
import apiService from '../../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

interface PsicologosFormProps {
  psicologo?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const PsicologosForm: React.FC<PsicologosFormProps> = ({ psicologo, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoadingData(true);
      const data = await apiService.getCategorias();
      setCategorias(data);
    } catch (error) {
      message.error('Erro ao carregar categorias');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const formData: FormularioPsicologo = {
        psicologLogin: values.psicologLogin,
        nome: values.nome,
        dtAtivacao: values.dtAtivacao ? values.dtAtivacao.format('YYYY-MM-DD') : undefined,
        categoriaId: values.categoriaId
      };

      if (psicologo) {
        await apiService.atualizarPsicologo(psicologo.id, formData);
        message.success('Psicólogo atualizado com sucesso!');
      } else {
        await apiService.criarPsicologo(formData);
        message.success('Psicólogo criado com sucesso!');
      }
      
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar psicólogo');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Carregando dados...</p>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={psicologo || {
        categoriaId: categorias[0]?.id || 1,
        dtAtivacao: dayjs()
      }}
    >
      <Form.Item
        label="Login"
        name="psicologLogin"
        rules={[
          { required: true, message: 'Por favor, informe o login!' },
          { min: 3, message: 'Mínimo 3 caracteres!' }
        ]}
      >
        <Input placeholder="Ex: psicologo2" />
      </Form.Item>

      <Form.Item
        label="Nome Completo"
        name="nome"
        rules={[
          { required: true, message: 'Por favor, informe o nome!' },
          { min: 3, message: 'Mínimo 3 caracteres!' }
        ]}
      >
        <Input placeholder="Ex: Dr. João Silva" />
      </Form.Item>

      <Form.Item
        label="Data de Ativação"
        name="dtAtivacao"
      >
        <DatePicker 
          style={{ width: '100%' }} 
          format="DD/MM/YYYY"
          placeholder="Selecione a data"
        />
      </Form.Item>

      <Form.Item
        label="Categoria"
        name="categoriaId"
        rules={[{ required: true, message: 'Por favor, selecione a categoria!' }]}
      >
        <Select placeholder="Selecione a categoria">
          {categorias.map(cat => (
            <Option key={cat.id} value={cat.id}>
              {cat.nome}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {psicologo ? 'Atualizar' : 'Criar'} Psicólogo
          </Button>
          <Button onClick={onCancel}>
            Cancelar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PsicologosForm;

