import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  Spin,
  Alert,
  Modal,
  message,
  Tooltip
} from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Prontuario } from '../../../types';
import apiService from '../../../services/api';
import ProntuarioForm from './ProntuarioForm';
import { format } from 'date-fns';

const { Title, Text } = Typography;

interface ProntuariosListProps {
  pacienteId: number;
  pacienteNome: string;
}

const ProntuariosList: React.FC<ProntuariosListProps> = ({ pacienteId, pacienteNome }) => {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedProntuario, setSelectedProntuario] = useState<Prontuario | null>(null);

  useEffect(() => {
    loadProntuarios();
  }, [pacienteId]);

  const loadProntuarios = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProntuariosPorPaciente(pacienteId);
      setProntuarios(data);
    } catch (err: any) {
      setError('Erro ao carregar prontuários');
      message.error('Erro ao carregar prontuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este prontuário? Esta ação não pode ser desfeita.',
      okText: 'Sim, excluir',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await apiService.deletarProntuario(id);
          message.success('Prontuário excluído com sucesso!');
          loadProntuarios();
        } catch (err: any) {
          message.error('Erro ao excluir prontuário');
        }
      }
    });
  };

  const handleView = (prontuario: Prontuario) => {
    setSelectedProntuario(prontuario);
    setViewModalVisible(true);
  };

  const handleEdit = (prontuario: Prontuario) => {
    setSelectedProntuario(prontuario);
    setModalVisible(true);
  };

  const getTipoBadge = (tipo: string) => {
    const colors: Record<string, string> = {
      'ANAMNESE': 'blue',
      'EVOLUCAO': 'green',
      'OBSERVACAO': 'orange'
    };
    return <Tag color={colors[tipo] || 'default'}>{tipo}</Tag>;
  };

  const columns = [
    {
      title: 'Data',
      dataIndex: 'dataRegistro',
      key: 'dataRegistro',
      width: 120,
      render: (data: string) => format(new Date(data), 'dd/MM/yyyy HH:mm'),
      sorter: (a: Prontuario, b: Prontuario) => 
        new Date(a.dataRegistro).getTime() - new Date(b.dataRegistro).getTime(),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 120,
      render: (tipo: string) => getTipoBadge(tipo),
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
      key: 'titulo',
      ellipsis: true,
      render: (text: string) => text || <Text type="secondary">Sem título</Text>,
    },
    {
      title: 'Conteúdo',
      dataIndex: 'conteudo',
      key: 'conteudo',
      ellipsis: true,
      render: (text: string) => text?.substring(0, 100) + (text?.length > 100 ? '...' : ''),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 150,
      render: (_: any, record: Prontuario) => (
        <Space>
          <Tooltip title="Visualizar">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Erro"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <FileTextOutlined /> Prontuários - {pacienteNome}
            </Title>
            <Text type="secondary">{prontuarios.length} registro(s)</Text>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedProntuario(null);
              setModalVisible(true);
            }}
          >
            Novo Registro
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={prontuarios}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} registros`,
          }}
        />
      </Card>

      {/* Modal de Criação/Edição */}
      <Modal
        title={selectedProntuario ? 'Editar Prontuário' : 'Novo Prontuário'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedProntuario(null);
        }}
        footer={null}
        width={800}
      >
        <ProntuarioForm
          pacienteId={pacienteId}
          prontuario={selectedProntuario}
          onSuccess={() => {
            setModalVisible(false);
            setSelectedProntuario(null);
            loadProntuarios();
          }}
          onCancel={() => {
            setModalVisible(false);
            setSelectedProntuario(null);
          }}
        />
      </Modal>

      {/* Modal de Visualização */}
      <Modal
        title="Visualizar Prontuário"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedProntuario(null);
        }}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Fechar
          </Button>
        ]}
        width={800}
      >
        {selectedProntuario && (
          <div>
            <p><strong>Data do Registro:</strong> {format(new Date(selectedProntuario.dataRegistro), 'dd/MM/yyyy HH:mm')}</p>
            <p><strong>Tipo:</strong> {getTipoBadge(selectedProntuario.tipo)}</p>
            
            {selectedProntuario.titulo && (
              <p><strong>Título:</strong> {selectedProntuario.titulo}</p>
            )}
            
            <p><strong>Conteúdo:</strong></p>
            <p style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '12px', borderRadius: '4px' }}>
              {selectedProntuario.conteudo}
            </p>
            
            {selectedProntuario.queixaPrincipal && (
              <>
                <p><strong>Queixa Principal:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedProntuario.queixaPrincipal}</p>
              </>
            )}
            
            {selectedProntuario.objetivoTerapeutico && (
              <>
                <p><strong>Objetivo Terapêutico:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedProntuario.objetivoTerapeutico}</p>
              </>
            )}
            
            {selectedProntuario.historico && (
              <>
                <p><strong>Histórico:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedProntuario.historico}</p>
              </>
            )}
            
            {selectedProntuario.evolucao && (
              <>
                <p><strong>Evolução:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedProntuario.evolucao}</p>
              </>
            )}
            
            {selectedProntuario.planoTerapeutico && (
              <>
                <p><strong>Plano Terapêutico:</strong></p>
                <p style={{ whiteSpace: 'pre-wrap' }}>{selectedProntuario.planoTerapeutico}</p>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProntuariosList;
