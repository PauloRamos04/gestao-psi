import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Space, Switch } from 'antd';
import { Mensagem } from '../../../types';
import apiService from '../../../services/api';

const { TextArea } = Input;

interface MensagensFormProps {
  mensagem?: Mensagem;
  onSuccess: () => void;
  onCancel: () => void;
}

const MensagensForm: React.FC<MensagensFormProps> = ({ mensagem, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mensagem) {
      form.setFieldsValue({
        titulo: mensagem.titulo,
        conteudo: mensagem.conteudo,
        status: mensagem.status
      });
    }
  }, [mensagem, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        titulo: values.titulo,
        conteudo: values.conteudo,
        status: values.status !== undefined ? values.status : true
      };

      if (mensagem) {
        await apiService.atualizarMensagem(mensagem.id, data);
        message.success('Mensagem atualizada com sucesso!');
      } else {
        await apiService.criarMensagem(data);
        message.success('Mensagem criada com sucesso!');
      }
      
      onSuccess();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao salvar mensagem';
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
      initialValues={{ status: true }}
    >
      <Form.Item
        name="titulo"
        label="Título"
        rules={[
          { required: true, message: 'Informe o título' },
          { min: 3, message: 'Título deve ter pelo menos 3 caracteres' },
          { max: 200, message: 'Título deve ter no máximo 200 caracteres' }
        ]}
      >
        <Input placeholder="Título da mensagem" />
      </Form.Item>

      <Form.Item
        name="conteudo"
        label="Conteúdo"
        rules={[
          { required: true, message: 'Informe o conteúdo' },
          { min: 10, message: 'Conteúdo deve ter pelo menos 10 caracteres' }
        ]}
      >
        <TextArea
          rows={6}
          placeholder="Conteúdo da mensagem"
          showCount
          maxLength={1000}
        />
      </Form.Item>

      <Form.Item
        name="status"
        label="Ativa"
        valuePropName="checked"
      >
        <Switch checkedChildren="Sim" unCheckedChildren="Não" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {mensagem ? 'Atualizar' : 'Criar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MensagensForm;

