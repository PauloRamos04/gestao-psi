import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, message, DatePicker, Tabs, Switch, Row, Col, InputNumber } from 'antd';
import { UserOutlined, HomeOutlined, MedicineBoxOutlined, SafetyCertificateOutlined, HeartOutlined, SearchOutlined } from '@ant-design/icons';
import type { Paciente } from '../../../types';
import apiService from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import dayjs from 'dayjs';
import { buscarCep } from '../../../utils/cep';
import { maskCEP, maskCPF, maskPhone } from '../../../utils/masks';

const { TextArea } = Input;
const { Option} = Select;

interface PacienteFormProps {
  paciente?: Paciente | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PacienteForm: React.FC<PacienteFormProps> = ({ paciente, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  useEffect(() => {
    if (paciente) {
      form.setFieldsValue({
        ...paciente,
        dataNascimento: paciente.dataNascimento ? dayjs(paciente.dataNascimento) : null,
        dataPrimeiraConsulta: paciente.dataPrimeiraConsulta ? dayjs(paciente.dataPrimeiraConsulta) : null,
      });
    }
  }, [paciente, form]);

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
    if (!user?.clinicaId || !user?.psicologId) {
      message.error('Dados do usuário incompletos');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...values,
        clinicaId: user.clinicaId,
        psicologId: user.psicologId,
        dataNascimento: values.dataNascimento?.format('YYYY-MM-DD'),
        dataPrimeiraConsulta: values.dataPrimeiraConsulta?.format('YYYY-MM-DD'),
      };

      if (paciente) {
        await apiService.atualizarPaciente(paciente.id, data);
        message.success('Paciente atualizado!');
      } else {
        await apiService.criarPaciente(data);
        message.success('Paciente cadastrado!');
      }

      onSuccess();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar paciente');
    } finally {
      setLoading(false);
    }
  };

  const tabsItems = [
    {
      key: '1',
      label: <><UserOutlined /> Dados Básicos</>,
      children: (
        <>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="nome"
                label="Nome Completo"
                rules={[{ required: true, message: 'Nome é obrigatório' }]}
              >
                <Input placeholder="Nome completo do paciente" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="cpf" label="CPF">
                <Input 
                  placeholder="000.000.000-00"
                  maxLength={14}
                  onChange={(e) => {
                    const masked = maskCPF(e.target.value);
                    form.setFieldValue('cpf', masked);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rg" label="RG">
                <Input placeholder="00.000.000-0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="orgaoEmissorRg" label="Órgão Emissor">
                <Input placeholder="SSP-SP" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="dataNascimento" label="Data de Nascimento">
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/AAAA" />
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

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="profissao" label="Profissão">
                <Input placeholder="Profissão" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="escolaridade" label="Escolaridade">
                <Select placeholder="Selecione">
                  <Option value="FUNDAMENTAL_INCOMPLETO">Fundamental Incompleto</Option>
                  <Option value="FUNDAMENTAL_COMPLETO">Fundamental Completo</Option>
                  <Option value="MEDIO_INCOMPLETO">Médio Incompleto</Option>
                  <Option value="MEDIO_COMPLETO">Médio Completo</Option>
                  <Option value="SUPERIOR_INCOMPLETO">Superior Incompleto</Option>
                  <Option value="SUPERIOR_COMPLETO">Superior Completo</Option>
                  <Option value="POS_GRADUACAO">Pós-Graduação</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="nacionalidade" label="Nacionalidade">
                <Input placeholder="Brasileiro(a)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="E-mail">
                <Input type="email" placeholder="email@exemplo.com" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="telefone" label="Telefone">
                <Input 
                  placeholder="(00) 0000-0000"
                  maxLength={15}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    form.setFieldValue('telefone', masked);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="celular" label="Celular">
                <Input 
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    form.setFieldValue('celular', masked);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="telefoneRecado" label="Telefone para Recado">
                <Input 
                  placeholder="(00) 0000-0000"
                  maxLength={15}
                  onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    form.setFieldValue('telefoneRecado', masked);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contatoRecadoNome" label="Nome do Contato">
                <Input placeholder="Nome da pessoa" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '2',
      label: <><HomeOutlined /> Endereço</>,
      children: (
        <>
          <Row gutter={16}>
            <Col span={8}>
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
            <Col span={12}>
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
            <Col span={16}>
              <Form.Item name="cidade" label="Cidade">
                <Input placeholder="Cidade" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estado" label="UF">
                <Select placeholder="UF" showSearch>
                  <Option value="SP">SP</Option>
                  <Option value="RJ">RJ</Option>
                  <Option value="MG">MG</Option>
                  <Option value="ES">ES</Option>
                  <Option value="PR">PR</Option>
                  <Option value="SC">SC</Option>
                  <Option value="RS">RS</Option>
                  {/* Adicionar outros estados conforme necessário */}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '3',
      label: <><SafetyCertificateOutlined /> Responsável</>,
      children: (
        <>
          <p style={{ marginBottom: 16, color: '#666' }}>
            Preencha apenas se o paciente for menor de idade
          </p>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="responsavelNome" label="Nome do Responsável">
                <Input placeholder="Nome completo" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="responsavelCpf" label="CPF do Responsável">
                <Input placeholder="000.000.000-00" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="responsavelParentesco" label="Parentesco">
                <Select placeholder="Selecione">
                  <Option value="PAI">Pai</Option>
                  <Option value="MAE">Mãe</Option>
                  <Option value="TUTOR">Tutor(a)</Option>
                  <Option value="OUTRO">Outro</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="responsavelTelefone" label="Telefone do Responsável">
                <Input placeholder="(00) 00000-0000" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: '4',
      label: <><MedicineBoxOutlined /> Informações Clínicas</>,
      children: (
        <>
          <Form.Item name="motivoConsulta" label="Motivo da Consulta">
            <TextArea rows={3} placeholder="Por que o paciente busca terapia?" maxLength={1000} showCount />
          </Form.Item>

          <Form.Item name="queixaPrincipal" label="Queixa Principal">
            <TextArea rows={2} placeholder="Principal queixa do paciente" maxLength={1000} showCount />
          </Form.Item>

          <Form.Item name="historicoFamiliar" label="Histórico Familiar">
            <TextArea rows={3} placeholder="Histórico familiar relevante" maxLength={2000} showCount />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="emTratamentoPsiquiatrico" label="Em Tratamento Psiquiátrico?" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="usoMedicacaoPsiquiatrica" label="Usa Medicação Psiquiátrica?" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="psiquiatraNome" label="Nome do Psiquiatra">
            <Input placeholder="Dr(a)..." />
          </Form.Item>

          <Form.Item name="medicamentosUso" label="Medicamentos em Uso">
            <TextArea rows={2} placeholder="Liste os medicamentos em uso" maxLength={1000} showCount />
          </Form.Item>

          <Form.Item name="alergias" label="Alergias">
            <Input placeholder="Liste alergias conhecidas" />
          </Form.Item>

          <Form.Item name="condicoesMedicas" label="Condições Médicas">
            <TextArea rows={2} placeholder="Condições médicas relevantes" maxLength={1000} showCount />
          </Form.Item>
        </>
      ),
    },
    {
      key: '5',
      label: <><HeartOutlined /> Convênio e Outros</>,
      children: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="convenioSaude" label="Convênio de Saúde">
                <Input placeholder="Nome do convênio" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="numeroCarteirinha" label="Número da Carteirinha">
                <Input placeholder="000000000000" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="plano" label="Plano">
            <Input placeholder="Nome do plano" />
          </Form.Item>

          <Form.Item name="comoConheceu" label="Como Conheceu a Clínica?">
            <Select placeholder="Selecione">
              <Option value="INDICACAO">Indicação</Option>
              <Option value="INTERNET">Internet</Option>
              <Option value="REDES_SOCIAIS">Redes Sociais</Option>
              <Option value="PLACA">Placa/Outdoor</Option>
              <Option value="CONVENIO">Convênio</Option>
              <Option value="OUTRO">Outro</Option>
            </Select>
          </Form.Item>

          <Form.Item name="dataPrimeiraConsulta" label="Data da Primeira Consulta">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="observacoes" label="Observações Gerais">
            <TextArea rows={4} placeholder="Observações adicionais..." maxLength={2000} showCount />
          </Form.Item>
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
        status: true,
        emTratamentoPsiquiatrico: false,
        usoMedicacaoPsiquiatrica: false,
        numeroSessoesRealizadas: 0
      }}
    >
      <Tabs items={tabsItems} />

      <Form.Item style={{ marginTop: 24 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {paciente ? 'Atualizar' : 'Cadastrar'}
          </Button>
          <Button onClick={onCancel}>Cancelar</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PacienteForm;

