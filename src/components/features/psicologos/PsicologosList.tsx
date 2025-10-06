import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Tooltip,
  Avatar,
  Typography,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Psicologo } from '../../../types';
import apiService from '../../../services/api';
import PsicologosForm from './PsicologosForm';
import { format } from 'date-fns';

const { Title, Text } = Typography;

const PsicologosList: React.FC = () => {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPsicologo, setSelectedPsicologo] = useState<Psicologo | null>(null);

  useEffect(() => {
    loadPsicologos();
  }, []);

  const loadPsicologos = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPsicologos();
      setPsicologos(data);
    } catch (error: any) {
      message.error('Erro ao carregar psicólogos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este psicólogo?',
      okText: 'Sim',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await apiService.deletarPsicologo(id);
          message.success('Psicólogo excluído com sucesso!');
          loadPsicologos();
        } catch (error: any) {
          message.error('Erro ao excluir psicólogo');
        }
      }
    });
  };

  const columns = [
    {
      title: 'Psicólogo',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Psicologo) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Login',
      dataIndex: 'psicologLogin',
      key: 'psicologLogin',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Data de Ativação',
      dataIndex: 'dtAtivacao',
      key: 'dtAtivacao',
      render: (data: string) => format(new Date(data), 'dd/MM/yyyy'),
    },
    {
      title: 'Categoria',
      dataIndex: 'categoriaNome',
      key: 'categoria',
      render: (text: string) => <Tag color="green">{text || 'N/A'}</Tag>,
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_: any, record: Psicologo) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPsicologo(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Excluir">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Avatar 
                size={48}
                icon={<TeamOutlined />} 
                style={{ backgroundColor: '#52c41a' }}
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>Psicólogos</Title>
                <Text type="secondary">Gerencie os psicólogos do sistema</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary"
                icon={<PlusOutlined />} 
                onClick={() => {
                  setSelectedPsicologo(null);
                  setModalVisible(true);
                }}
              >
                Novo Psicólogo
              </Button>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadPsicologos}
                loading={loading}
              >
                Atualizar
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Total de Psicólogos"
              value={psicologos.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={psicologos}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} psicólogos`,
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={selectedPsicologo ? 'Editar Psicólogo' : 'Novo Psicólogo'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedPsicologo(null);
        }}
        footer={null}
        width={600}
      >
        <PsicologosForm
          psicologo={selectedPsicologo}
          onSuccess={() => {
            setModalVisible(false);
            setSelectedPsicologo(null);
            loadPsicologos();
          }}
          onCancel={() => {
            setModalVisible(false);
            setSelectedPsicologo(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default PsicologosList;
