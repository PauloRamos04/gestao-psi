import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Space, Select, Spin } from 'antd';
import { Sala, Clinica } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';

const { TextArea } = Input;
const { Option } = Select;

interface SalasFormProps {
  sala?: Sala;
  onSuccess: () => void;
  onCancel: () => void;
}

const SalasForm: React.FC<SalasFormProps> = ({ sala, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingClinicas, setLoadingClinicas] = useState(false);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);

  useEffect(() => {
    loadClinicas();
    if (sala) {
      form.setFieldsValue({
        nome: sala.nome,
        clinicaId: sala.clinicaId || user?.clinicaId
      });
    } else if (user?.clinicaId) {
      form.setFieldsValue({
        clinicaId: user.clinicaId
      });
    }
  }, [sala, user, form]);

  const loadClinicas = async () => {
    setLoadingClinicas(true);
    try {
      const data = await apiService.getClinicas();
      setClinicas(data);
    } catch (error) {
      message.error('Erro ao carregar clínicas');
    } finally {
      setLoadingClinicas(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!values.clinicaId) {
      message.error('Por favor, selecione uma clínica');
      return;
    }
    
    if (!values.nome || values.nome.trim().length === 0) {
      message.error('Por favor, informe o nome da sala');
      return;
    }
    
    setLoading(true);
    try {
      const data = {
        clinicaId: values.clinicaId,
        nome: values.nome.trim()
      };

      if (sala) {
        await apiService.atualizarSala(sala.id, data);
        message.success('Sala atualizada com sucesso!');
      } else {
        await apiService.criarSala(data);
        message.success('Sala criada com sucesso!');
      }
      
      // Resetar o formulário
      form.resetFields();
      
      // Chamar onSuccess para fechar o modal e recarregar a lista
      onSuccess();
    } catch (error: any) {
      
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data || {};
        
        if (status === 400) {
          // Erro de validação (Bad Request)
          let errorShown = false;
          
          if (errorData.errors && typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
            // Objeto com erros por campo
            Object.entries(errorData.errors).forEach(([field, errorMessage]: [string, any]) => {
              const fieldName = field === 'nome' ? 'Nome' : field === 'clinicaId' ? 'Clínica' : field;
              const messageText = typeof errorMessage === 'string' ? errorMessage : String(errorMessage);
              setTimeout(() => {
                message.error(`${fieldName}: ${messageText}`, 5);
              }, 100);
              errorShown = true;
            });
          } else if (errorData.errors && Array.isArray(errorData.errors)) {
            errorData.errors.forEach((err: any, index: number) => {
              setTimeout(() => {
                if (err.defaultMessage) {
                  message.error(err.defaultMessage, 5);
                } else if (typeof err === 'string') {
                  message.error(err, 5);
                }
              }, 100 * (index + 1));
              errorShown = true;
            });
          }
          
          if (!errorShown) {
            setTimeout(() => {
              if (errorData?.message) {
                message.error(errorData.message, 6);
              } else {
                message.error('Erro de validação. Verifique os campos obrigatórios.', 6);
              }
            }, 100);
          }
        } else {
          const errorMsg = errorData?.message || `Erro ao salvar sala (Status: ${status})`;
          message.error(errorMsg);
        }
      } else {
        const errorMsg = error.message || 'Erro ao salvar sala. Verifique sua conexão.';
        message.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingClinicas) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>Carregando clínicas...</p>
      </div>
    );
  }

  const handleFinishFailed = (errorInfo: any) => {
    // Mostrar mensagens de erro de validação
    if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
      errorInfo.errorFields.forEach((error: any) => {
        message.error(`${error.name.join('.')}: ${error.errors[0]}`, 5);
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      onFinishFailed={handleFinishFailed}
    >
      <Form.Item
        name="clinicaId"
        label="Clínica"
        rules={[
          { required: true, message: 'Por favor, selecione uma clínica' }
        ]}
      >
        <Select 
          placeholder="Selecione a clínica" 
          showSearch
          optionFilterProp="children"
          disabled={loadingClinicas}
        >
          {clinicas.map(clinica => (
            <Option key={clinica.id} value={clinica.id}>
              {clinica.nome}
            </Option>
          ))}
        </Select>
      </Form.Item>

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
            {sala ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button type="default" htmlType="button" onClick={onCancel}>
            Cancelar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SalasForm;

