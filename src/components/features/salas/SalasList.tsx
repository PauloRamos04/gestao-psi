import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Card,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/api';
import { Sala } from '../../../types';
import SalasForm from './SalasForm';

const SalasList: React.FC = () => {
  const { user } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSala, setEditingSala] = useState<Sala | undefined>();

  useEffect(() => {
    loadSalas();
  }, []);

  const loadSalas = async () => {
    if (!user?.clinicaId) return;
    
    setLoading(true);
    try {
      const data = await apiService.getSalas(user.clinicaId);
      setSalas(data);
    } catch (error) {
      message.error('Erro ao carregar salas');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSala(undefined);
    setModalVisible(true);
  };

  const handleEdit = (sala: Sala) => {
    setEditingSala(sala);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deletarSala(id);
      message.success('Sala removida com sucesso!');
      loadSalas();
    } catch (error) {
      message.error('Erro ao remover sala');
    }
  };

  const handleSuccess = () => {
    setModalVisible(false);
    setEditingSala(undefined);
    loadSalas();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string) => (
        <Space>
          <HomeOutlined style={{ color: '#1890ff' }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'Clínica',
      dataIndex: ['clinica', 'nome'],
      key: 'clinica',
      render: (text: string) => text || '-',
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 120,
      render: (_: any, record: Sala) => (
        <Space size="small">
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Tem certeza que deseja remover esta sala?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Remover">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salas</h1>
          <p className="text-gray-600">Gerencie as salas da clínica</p>
        </div>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadSalas}
            loading={loading}
          >
            Atualizar
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Nova Sala
          </Button>
        </Space>
      </div>

      {/* Estatísticas */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total de Salas"
              value={salas.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabela */}
      <Card>
        <Table
          columns={columns}
          dataSource={salas}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} salas`,
          }}
        />
      </Card>

      {/* Modal */}
      <Modal
        title={editingSala ? 'Editar Sala' : 'Nova Sala'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingSala(undefined);
        }}
        footer={null}
        width={600}
      >
        <SalasForm
          sala={editingSala}
          onSuccess={handleSuccess}
          onCancel={() => {
            setModalVisible(false);
            setEditingSala(undefined);
          }}
        />
      </Modal>
    </div>
  );
};

export default SalasList;
