import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Space, Avatar, Upload, message, Divider, Row, Col, Spin, Typography, Modal
} from 'antd';
import {
  UserOutlined, CameraOutlined, SaveOutlined, MailOutlined, PhoneOutlined, BankOutlined, IdcardOutlined, DeleteOutlined, UploadOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';
import type { Usuario } from '../types';
import { maskPhone } from '../utils/masks';
import { isValidEmail, isValidPhone } from '../utils/validators';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [profileForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoadingData(true);
      if (user?.userId) {
        const data = await apiService.getUsuario(user.userId);
        setUserData(data);
        profileForm.setFieldsValue(data);
      }
    } catch (error: any) {
      message.error('Erro ao carregar dados do usuário');
    } finally {
      setLoadingData(false);
    }
  };

  const handleProfileUpdate = async (values: any) => {
    try {
      setLoading(true);
      await apiService.atualizarMeuPerfil(values);
      message.success('Perfil atualizado com sucesso!');
      loadUserData();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = async (info: any) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      const fotoUrl = info.file.response?.url;
      if (fotoUrl) {
        try {
          await apiService.atualizarMeuPerfil({ fotoUrl });
          message.success('Foto atualizada com sucesso!');
          setPreviewImage(null);
          loadUserData();
        } catch (error) {
          message.error('Erro ao atualizar foto');
        }
      }
      setUploading(false);
    } else if (info.file.status === 'error') {
      message.error('Erro no upload da foto');
      setUploading(false);
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
  };

  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const maskedValue = maskPhone(e.target.value);
    profileForm.setFieldsValue({ [field]: maskedValue });
  };

  const validateEmail = (rule: any, value: string) => {
    if (value && !isValidEmail(value)) {
      return Promise.reject(new Error('E-mail inválido'));
    }
    return Promise.resolve();
  };

  const validatePhone = (rule: any, value: string) => {
    if (value && !isValidPhone(value)) {
      return Promise.reject(new Error('Telefone inválido'));
    }
    return Promise.resolve();
  };

  if (loadingData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#8c8c8c' }}>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Meu Perfil</Title>
        <Paragraph type="secondary">
          Gerencie suas informações pessoais e foto de perfil
        </Paragraph>
      </div>

      <Card bordered={false}>
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
        >
          {/* Seção da Foto */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Space direction="vertical" size="large" align="center">
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  size={120}
                  src={previewImage || userData?.fotoUrl}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1890ff' }}
                />
                {uploading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Spin size="small" />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#1890ff',
                    borderRadius: '50%',
                    width: 36,
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid white',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <CameraOutlined style={{ color: 'white', fontSize: 16 }} />
                </div>
              </div>
              
              <Upload
                id="photo-upload"
                name="file"
                showUploadList={false}
                action={`${process.env.REACT_APP_API_URL || 'http://localhost:8081/api'}/uploads/foto`}
                headers={{
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }}
                onChange={handleUploadChange}
                onPreview={handlePreview}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Apenas imagens são permitidas!');
                    return false;
                  }
                  const isLt5M = file.size / 1024 / 1024 < 5;
                  if (!isLt5M) {
                    message.error('A imagem deve ter menos de 5MB!');
                    return false;
                  }
                  return true;
                }}
                style={{ display: 'none' }}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Alterar Foto
                </Button>
              </Upload>
              
              {userData?.fotoUrl && (
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    Modal.confirm({
                      title: 'Remover foto de perfil?',
                      content: 'Esta ação não pode ser desfeita.',
                      okText: 'Remover',
                      okType: 'danger',
                      cancelText: 'Cancelar',
                      onOk: async () => {
                        try {
                          await apiService.atualizarMeuPerfil({ fotoUrl: null });
                          message.success('Foto removida com sucesso!');
                          loadUserData();
                        } catch (error) {
                          message.error('Erro ao remover foto');
                        }
                      }
                    });
                  }}
                >
                  Remover Foto
                </Button>
              )}
            </Space>
            
            <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
              {userData?.titulo || user?.tituloSite || 'Usuário'}
            </Title>
            <Text type="secondary">{userData?.cargo || 'Cargo não definido'}</Text>
          </div>

          <Divider />

          {/* Informações Pessoais */}
          <Title level={5}>Informações Pessoais</Title>
          <Row gutter={16}>
            <Col xs={24} md={24}>
              <Form.Item
                name="nomeCompleto"
                label="Nome Completo"
                rules={[{ required: true, message: 'Nome completo é obrigatório' }]}
              >
                <Input prefix={<IdcardOutlined />} placeholder="Nome completo" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  { required: false },
                  { validator: validateEmail }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="email@exemplo.com"
                  type="email"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                name="celular" 
                label="Celular"
                rules={[
                  { required: false },
                  { validator: validatePhone }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="(00) 00000-0000"
                  onChange={(e) => handlePhoneChange(e, 'celular')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item 
                name="telefone" 
                label="Telefone"
                rules={[
                  { required: false },
                  { validator: validatePhone }
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="(00) 0000-0000"
                  onChange={(e) => handlePhoneChange(e, 'telefone')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="cargo" label="Cargo">
                <Input prefix={<BankOutlined />} placeholder="Ex: Psicólogo, Recepcionista" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="departamento" label="Departamento">
            <Input prefix={<BankOutlined />} placeholder="Ex: Clínica, Administrativo" />
          </Form.Item>

          <Form.Item name="observacoes" label="Observações">
            <TextArea rows={4} placeholder="Observações sobre o usuário..." />
          </Form.Item>

          <Divider />

          {/* Informações da Conta */}
          <Title level={5}>Informações da Conta</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">Usuário: </Text>
              <Text strong>{userData?.username}</Text>
            </div>
            <div>
              <Text type="secondary">Clínica: </Text>
              <Text strong>{user?.clinicaNome}</Text>
            </div>
            <div>
              <Text type="secondary">Psicólogo: </Text>
              <Text strong>{user?.psicologoNome}</Text>
            </div>
            <div>
              <Text type="secondary">Tipo de Usuário: </Text>
              <Text strong>{userData?.tipoNome || user?.tipoUser}</Text>
            </div>
            <div>
              <Text type="secondary">Último Acesso: </Text>
              <Text>{userData?.ultimoAccesso ? new Date(userData.ultimoAccesso).toLocaleString('pt-BR') : 'Não disponível'}</Text>
            </div>
          </Space>

          <Divider />

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={loading} 
              block 
              size="large"
            >
              Salvar Perfil
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Modal de Preview da Imagem */}
      <Modal
        open={!!previewImage}
        title="Preview da Foto"
        footer={null}
        onCancel={() => setPreviewImage(null)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage || ''} />
      </Modal>
    </div>
  );
};

export default ProfilePage;



