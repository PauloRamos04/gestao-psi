import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Select, Button, Space, message, DatePicker, Tabs, 
  Switch, Row, Col, InputNumber, Spin 
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  BankOutlined,
  LockOutlined,
  SearchOutlined
} from '@ant-design/icons';
import type { Psicologo, Categoria } from '../../../types';
import apiService from '../../../services/api';
import dayjs from 'dayjs';
import { buscarCep } from '../../../utils/cep';
import { maskCEP } from '../../../utils/masks';

const { TextArea } = Input;
const { Option } = Select;

interface PsicologosFormProps {
  psicologo?: Psicologo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PsicologosForm: React.FC<PsicologosFormProps> = ({ psicologo, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [criarUsuario, setCriarUsuario] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  useEffect(() => {
    loadCategorias();
    if (psicologo) {
      form.setFieldsValue({
        ...psicologo,
        dataNascimento: psicologo.dataNascimento ? dayjs(psicologo.dataNascimento) : null,
        dtAtivacao: psicologo.dtAtivacao ? dayjs(psicologo.dtAtivacao) : null,
      });
    }
  }, [psicologo]);

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

  const handleBuscarCep = async () => {
    const cep = form.getFieldValue('cep');
    if (!cep) {
      message.warning('Digite um CEP');
      return;
    }

    setBuscandoCep(true);
    try {
      const data = await buscarCep(cep);
      if (data) {
        form.setFieldsValue({
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
          complemento: data.complemento
        });
        message.success('CEP encontrado!');
      } else {
        message.error('CEP não encontrado');
      }
    } catch (error) {
      message.error('Erro ao buscar CEP');
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        dataNascimento: values.dataNascimento?.format('YYYY-MM-DD'),
        dtAtivacao: values.dtAtivacao?.format('YYYY-MM-DD'),
      };

      // Remove o campo criarUsuarioCheck que é apenas controle do frontend
      delete data.criarUsuarioCheck;

      // Se não quer criar usuário, remove os campos relacionados
      if (!criarUsuario) {
        delete data.username;
        delete data.senha;
        delete data.tipoUserId;
      }

      if (psicologo) {
        await apiService.atualizarPsicologo(psicologo.id, data);
        message.success('Psicólogo atualizado!');
      } else {
        await apiService.criarPsicologo(data);
        if (criarUsuario && data.username) {
          message.success('Psicólogo e usuário criados com sucesso!');
        } else {
          message.success('Psicólogo cadastrado com sucesso!');
        }
      }

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

  const tabsItems = [
    {
      key: '1',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Dados Básicos
        </span>
      ),
      children: (
        <>
          <Form.Item name="nome" label="Nome Completo" rules={[{ required: true, message: 'Nome é obrigatório' }]}>
            <Input placeholder="Dr(a). Nome Completo" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="cpf" label="CPF">
                <Input placeholder="000.000.000-00" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rg" label="RG">
                <Input placeholder="00.000.000-0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="crp" label="CRP">
                <Input placeholder="06/12345" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="E-mail" rules={[{ type: 'email' }]}>
                <Input placeholder="email@exemplo.com" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="telefone" label="Telefone">
                <Input placeholder="(00) 0000-0000" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="celular" label="Celular">
                <Input placeholder="(00) 00000-0000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="dataNascimento" label="Data de Nascimento">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="genero" label="Gênero">
                <Select placeholder="Selecione">
                  <Option value="MASCULINO">Masculino</Option>
                  <Option value="FEMININO">Feminino</Option>
                  <Option value="OUTRO">Outro</Option>
                  <Option value="PREFIRO_NAO_DIZER">Prefiro não dizer</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estadoCivil" label="Estado Civil">
                <Select placeholder="Selecione">
                  <Option value="SOLTEIRO">Solteiro(a)</Option>
                  <Option value="CASADO">Casado(a)</Option>
                  <Option value="DIVORCIADO">Divorciado(a)</Option>
                  <Option value="VIUVO">Viúvo(a)</Option>
                  <Option value="UNIAO_ESTAVEL">União Estável</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '2',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <HomeOutlined style={{ marginRight: 8 }} />
          Endereço
        </span>
      ),
      children: (
        <>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="cep" label="CEP">
                <Input 
                  placeholder="00000-000" 
                  maxLength={9}
                  onChange={(e) => {
                    const masked = maskCEP(e.target.value);
                    form.setFieldValue('cep', masked);
                  }}
                  suffix={
                    <Button
                      type="text"
                      icon={<SearchOutlined />}
                      loading={buscandoCep}
                      onClick={handleBuscarCep}
                      size="small"
                    />
                  }
                />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item name="logradouro" label="Logradouro">
                <Input placeholder="Rua, Avenida, etc." />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="numeroEndereco" label="Número">
                <Input placeholder="123" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="complemento" label="Complemento">
                <Input placeholder="Apto, Bloco, etc." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bairro" label="Bairro">
                <Input placeholder="Bairro" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={18}>
              <Form.Item name="cidade" label="Cidade">
                <Input placeholder="Cidade" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="estado" label="UF">
                <Select placeholder="UF" showSearch>
                  <Option value="SP">SP</Option>
                  <Option value="RJ">RJ</Option>
                  <Option value="MG">MG</Option>
                  <Option value="ES">ES</Option>
                  <Option value="PR">PR</Option>
                  <Option value="SC">SC</Option>
                  <Option value="RS">RS</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '3',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <BookOutlined style={{ marginRight: 8 }} />
          Formação
        </span>
      ),
      children: (
        <>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="universidadeFormacao" label="Universidade">
                <Input placeholder="Nome da universidade" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="anoFormacao" label="Ano de Formação">
                <InputNumber style={{ width: '100%' }} placeholder="2020" min={1950} max={2030} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="formacaoAcademica" label="Formação Acadêmica">
            <TextArea rows={3} placeholder="Graduação, pós-graduação, mestrado, doutorado..." maxLength={2000} showCount />
          </Form.Item>

          <Form.Item name="especializacoes" label="Especializações">
            <TextArea rows={2} placeholder="Especializações e cursos complementares" maxLength={2000} showCount />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="abordagemTerapeutica" label="Abordagem Terapêutica">
                <Input placeholder="Ex: TCC, Psicanálise, Gestalt" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="anosExperiencia" label="Anos de Experiência">
                <InputNumber style={{ width: '100%' }} min={0} max={60} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="areasAtuacao" label="Áreas de Atuação">
            <Input placeholder="Ex: Ansiedade, Depressão, Relacionamentos" />
          </Form.Item>
        </>
      ),
    },
    {
      key: '4',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <BankOutlined style={{ marginRight: 8 }} />
          Profissional
        </span>
      ),
      children: (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="dtAtivacao" label="Data de Ativação">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="valorConsulta" label="Valor da Consulta (R$)">
                <InputNumber 
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  placeholder="150.00"
                  prefix="R$"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="duracaoSessaoMinutos" label="Duração Sessão (min)">
                <InputNumber style={{ width: '100%' }} min={15} max={180} placeholder="50" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="categoriaId" label="Categoria" rules={[{ required: true, message: 'Categoria é obrigatória' }]}>
                <Select placeholder="Selecione">
                  {categorias.map(cat => (
                    <Option key={cat.id} value={cat.id}>{cat.nome}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="aceitaConvenio" label="Aceita Convênio?" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="conveniosAceitos" label="Convênios Aceitos">
            <Input placeholder="Ex: Unimed, Amil, Bradesco Saúde" />
          </Form.Item>

          <Form.Item name="bio" label="Bio / Apresentação">
            <TextArea rows={4} placeholder="Biografia profissional para apresentação..." maxLength={1000} showCount />
          </Form.Item>

          <Form.Item name="observacoes" label="Observações">
            <TextArea rows={2} placeholder="Observações internas" maxLength={500} showCount />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="telefoneEmergencia" label="Telefone Emergência">
                <Input placeholder="(00) 00000-0000" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contatoEmergenciaNome" label="Nome Contato Emergência">
                <Input placeholder="Nome" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '5',
      label: (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          <LockOutlined style={{ marginRight: 8 }} />
          Criar Usuário
        </span>
      ),
      children: (
        <>
          <div style={{ 
            padding: '12px 16px', 
            backgroundColor: '#e6f7ff', 
            border: '1px solid #91d5ff', 
            borderRadius: '4px',
            marginBottom: 16 
          }}>
            <p style={{ margin: 0, color: '#0050b3' }}>
              💡 <strong>Atenção:</strong> Ative o switch abaixo para criar automaticamente um usuário de acesso para este psicólogo. 
              Se não ativar, o psicólogo será cadastrado mas NÃO terá acesso ao sistema.
            </p>
          </div>
          
          <Form.Item 
            name="criarUsuarioCheck" 
            label={<strong>Criar usuário de acesso ao sistema?</strong>} 
            valuePropName="checked"
          >
            <Switch 
              onChange={(checked) => setCriarUsuario(checked)} 
              checkedChildren="SIM" 
              unCheckedChildren="NÃO" 
            />
          </Form.Item>

          {criarUsuario && (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f0f5ff', 
              borderRadius: '4px',
              marginTop: 16 
            }}>
              <Form.Item name="username" label="Username (Login)" rules={[{ required: criarUsuario, message: 'Username é obrigatório' }]}>
                <Input placeholder="Ex: joao.silva" />
              </Form.Item>

              <Form.Item name="senha" label="Senha" rules={[{ required: criarUsuario, min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }]}>
                <Input.Password placeholder="Mínimo 6 caracteres" />
              </Form.Item>

              <Form.Item name="tipoUserId" label="Tipo de Usuário (Opcional)">
                <Select placeholder="Deixe em branco para usar PSICOLOGO" allowClear>
                  <Option value={2}>Psicólogo</Option>
                  <Option value={1}>Admin</Option>
                  <Option value={3}>Funcionário</Option>
                </Select>
              </Form.Item>

              <div style={{ 
                padding: '8px 12px', 
                backgroundColor: '#d9f7be', 
                border: '1px solid #b7eb8f', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                ✅ Ao salvar, o usuário será criado automaticamente com estes dados
              </div>
            </div>
          )}

          {!criarUsuario && (
            <div style={{ 
              padding: '8px 12px', 
              backgroundColor: '#fff7e6', 
              border: '1px solid #ffd591', 
              borderRadius: '4px',
              marginTop: 16,
              fontSize: '12px'
            }}>
              ⚠️ O psicólogo será cadastrado, mas você precisará criar o usuário manualmente depois na aba "Usuários"
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        categoriaId: categorias[0]?.id,
        dtAtivacao: dayjs(),
        ativo: true,
        aceitaConvenio: false,
        duracaoSessaoMinutos: 50,
      }}
    >
      <Tabs 
        items={tabsItems} 
        tabPosition="left"
        style={{ minHeight: 400 }}
        tabBarStyle={{ width: 200 }}
      />

      <Form.Item style={{ marginTop: 24 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {psicologo ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PsicologosForm;
