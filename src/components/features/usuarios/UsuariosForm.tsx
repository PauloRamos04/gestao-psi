import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, message, Spin } from 'antd';
import { FormularioUsuario, Clinica, Psicologo, TipoUser } from '../../../types';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';

const { Option } = Select;

interface UsuariosFormProps {
  usuario?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const UsuariosForm: React.FC<UsuariosFormProps> = ({ usuario, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [clinicas, setClinicas] = useState<Clinica[]>([]);
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUser[]>([]);
  const { user } = useAuth();

  // Recarregar dados sempre que o componente for montado
  useEffect(() => {
    loadData();
    
    // Se estiver editando, preencher formulário
    if (usuario) {
      form.setFieldsValue({
        username: usuario.username,
        titulo: usuario.titulo,
        clinicaId: usuario.clinicaId,
        psicologId: usuario.psicologId,
        tipoId: usuario.tipoId
      });
    }
  }, [usuario]); // Sempre recarrega quando modal abre

  const loadData = async () => {
    try {
      setLoadingData(true);
      
      
      const [clinicasData, psicologosData, tiposData] = await Promise.all([
        apiService.getClinicas(),
        apiService.getPsicologos(),
        apiService.getTiposUsuario()
      ]);
      
      
      setClinicas(clinicasData);
      setPsicologos(psicologosData);
      setTiposUsuario(tiposData);
      
      if (clinicasData.length === 0) {
        message.warning('Nenhuma clínica cadastrada. Cadastre uma clínica primeiro.');
      }
      if (psicologosData.length === 0) {
        message.info('Nenhum psicólogo cadastrado. Você pode criar o usuário mesmo assim (psicólogo opcional).');
      }
    } catch (error: any) {
      // Erro já exibido via message
      message.error(error.response?.data?.message || 'Erro ao carregar dados. Verifique se está logado e se o backend está rodando.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      const formData: FormularioUsuario = {
        username: values.username,
        clinicaId: values.clinicaId,
        psicologId: values.psicologId || 1, // Usar psicólogo padrão (ID: 1) se não selecionado
        tipoId: values.tipoId,
        senha: values.senha,
        titulo: values.titulo,
        status: true
      };

      

      if (usuario) {
        await apiService.atualizarUsuario(usuario.id, formData);
        message.success('Usuário atualizado com sucesso!');
      } else {
        await apiService.criarUsuario(formData);
        message.success('Usuário criado com sucesso!');
      }
      
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao criar usuário');
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

  // Verificar se há clínicas disponíveis (obrigatório)
  if (clinicas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: 16, marginBottom: 16 }}>⚠️ Clínicas não encontradas</p>
        <p style={{ color: '#ff4d4f' }}>❌ Nenhuma clínica cadastrada</p>
        <Space style={{ marginTop: 24 }}>
          <Button onClick={loadData}>Tentar Novamente</Button>
          <Button onClick={onCancel}>Fechar</Button>
        </Space>
        <p style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
          💡 Dica: Cadastre uma clínica primeiro em /clinicas
        </p>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        clinicaId: user?.clinicaId || (clinicas[0]?.id),
        psicologId: psicologos[0]?.id, // Opcional, pode ficar vazio
        tipoId: tiposUsuario[0]?.id || 1,
        status: true
      }}
    >
      <Form.Item
        label="Username (Login Único)"
        name="username"
        rules={[
          { required: true, message: 'Por favor, informe o username!' },
          { min: 3, message: 'Mínimo 3 caracteres!' },
          { pattern: /^[a-z0-9_]+$/, message: 'Apenas letras minúsculas, números e underline!' }
        ]}
        tooltip="Login único do usuário. Ex: joao.silva, admin, secretaria1"
      >
        <Input placeholder="Ex: admin, joao.silva" />
      </Form.Item>

      <Form.Item
        label="Nome Completo"
        name="titulo"
        rules={[{ required: true, message: 'Por favor, informe o nome!' }]}
      >
        <Input placeholder="Ex: João Silva" />
      </Form.Item>

      <Form.Item
        label="Senha"
        name="senha"
        rules={[
          { required: true, message: 'Por favor, informe a senha!' },
          { min: 6, message: 'A senha deve ter no mínimo 6 caracteres!' }
        ]}
      >
        <Input.Password placeholder="Digite a senha" />
      </Form.Item>

      <Form.Item
        label="Confirmar Senha"
        name="confirmarSenha"
        dependencies={['senha']}
        rules={[
          { required: true, message: 'Por favor, confirme a senha!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('senha') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('As senhas não coincidem!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirme a senha" />
      </Form.Item>

      <Form.Item
        label="Clínica"
        name="clinicaId"
        rules={[{ required: true, message: 'Por favor, selecione a clínica!' }]}
      >
        <Select placeholder="Selecione a clínica" showSearch optionFilterProp="children">
          {clinicas.map(clinica => (
            <Option key={clinica.id} value={clinica.id}>
              {clinica.nome} ({clinica.clinicaLogin})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Psicólogo (Opcional)"
        name="psicologId"
        tooltip="Se não houver psicólogo, será usado o padrão da clínica"
      >
        <Select 
          placeholder={psicologos.length === 0 ? "Nenhum psicólogo cadastrado (usando padrão)" : "Selecione o psicólogo"} 
          showSearch 
          optionFilterProp="children"
          allowClear
        >
          {psicologos.map(psicologo => (
            <Option key={psicologo.id} value={psicologo.id}>
              {psicologo.nome} ({psicologo.psicologLogin})
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      {psicologos.length === 0 && (
        <p style={{ color: '#1890ff', marginTop: -16, marginBottom: 16, fontSize: 12 }}>
          ℹ️ Nenhum psicólogo cadastrado. Será usado psicólogo padrão (ID: 1). Cadastre em <a href="/psicologos" target="_blank" style={{ fontWeight: 'bold' }}>/psicologos</a>
        </p>
      )}

      <Form.Item
        label="Tipo de Usuário"
        name="tipoId"
        rules={[{ required: true, message: 'Por favor, selecione o tipo!' }]}
      >
        <Select placeholder="Selecione o tipo de usuário">
          {tiposUsuario.map(tipo => (
            <Option key={tipo.id} value={tipo.id}>
              {tipo.nome}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {usuario ? 'Atualizar' : 'Criar'} Usuário
          </Button>
          <Button onClick={onCancel}>
            Cancelar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UsuariosForm;
