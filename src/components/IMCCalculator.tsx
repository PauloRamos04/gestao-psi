import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Statistic,
  Divider,
  Tag
} from 'antd';
import {
  CalculatorOutlined,
  InfoCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface IMCResult {
  imc: number;
  classification: string;
  color: string;
  description: string;
}

const IMCCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [result, setResult] = useState<IMCResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateIMC = (peso: number, altura: number): IMCResult => {
    const alturaMetros = altura / 100;
    const imc = peso / (alturaMetros * alturaMetros);
    
    let classification = '';
    let color = '';
    let description = '';

    if (imc < 18.5) {
      classification = 'Abaixo do peso';
      color = 'blue';
      description = 'Você está abaixo do peso ideal. Consulte um nutricionista para uma dieta adequada.';
    } else if (imc >= 18.5 && imc < 25) {
      classification = 'Peso normal';
      color = 'green';
      description = 'Parabéns! Você está com o peso ideal. Mantenha uma alimentação equilibrada e pratique exercícios.';
    } else if (imc >= 25 && imc < 30) {
      classification = 'Sobrepeso';
      color = 'orange';
      description = 'Você está com sobrepeso. Considere uma dieta balanceada e exercícios regulares.';
    } else if (imc >= 30 && imc < 35) {
      classification = 'Obesidade Grau I';
      color = 'red';
      description = 'Você está com obesidade grau I. É importante buscar orientação médica e nutricional.';
    } else if (imc >= 35 && imc < 40) {
      classification = 'Obesidade Grau II';
      color = 'red';
      description = 'Você está com obesidade grau II. Procure acompanhamento médico especializado.';
    } else {
      classification = 'Obesidade Grau III';
      color = 'red';
      description = 'Você está com obesidade grau III. É essencial buscar tratamento médico imediato.';
    }

    return {
      imc: Number(imc.toFixed(1)),
      classification,
      color,
      description
    };
  };

  const onFinish = async (values: { peso: number; altura: number }) => {
    setLoading(true);
    
    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
      const imcResult = calculateIMC(values.peso, values.altura);
      setResult(imcResult);
      setLoading(false);
    }, 500);
  };

  const resetCalculator = () => {
    form.resetFields();
    setResult(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <CalculatorOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Calculadora de IMC
            </Title>
            <Text type="secondary">
              Calcule seu Índice de Massa Corporal e veja sua classificação
            </Text>
          </div>

          <Divider />

          <Row gutter={[24, 24]}>
            {/* Formulário */}
            <Col xs={24} lg={12}>
              <Card title="Dados para Cálculo" size="small">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Peso (kg)"
                    name="peso"
                    rules={[
                      { required: true, message: 'Por favor, insira o peso!' },
                      { type: 'number', min: 1, max: 500, message: 'Peso deve estar entre 1 e 500 kg' }
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Ex: 70"
                      suffix="kg"
                      style={{ fontSize: '16px' }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Altura (cm)"
                    name="altura"
                    rules={[
                      { required: true, message: 'Por favor, insira a altura!' },
                      { type: 'number', min: 50, max: 250, message: 'Altura deve estar entre 50 e 250 cm' }
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder="Ex: 175"
                      suffix="cm"
                      style={{ fontSize: '16px' }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<CalculatorOutlined />}
                        size="large"
                      >
                        Calcular IMC
                      </Button>
                      <Button
                        onClick={resetCalculator}
                        icon={<ReloadOutlined />}
                        size="large"
                      >
                        Limpar
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Resultado */}
            <Col xs={24} lg={12}>
              <Card title="Resultado" size="small">
                {result ? (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Statistic
                        title="Seu IMC"
                        value={result.imc}
                        suffix="kg/m²"
                        valueStyle={{ 
                          color: result.color === 'green' ? '#52c41a' : 
                                 result.color === 'orange' ? '#fa8c16' : '#ff4d4f',
                          fontSize: '32px',
                          fontWeight: 'bold'
                        }}
                      />
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <Tag color={result.color} style={{ fontSize: '16px', padding: '8px 16px' }}>
                        {result.classification}
                      </Tag>
                    </div>

                    <Alert
                      message={result.description}
                      type={result.color === 'green' ? 'success' : 
                            result.color === 'orange' ? 'warning' : 'error'}
                      icon={<InfoCircleOutlined />}
                      showIcon
                    />
                  </Space>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">
                      Preencha os dados ao lado para calcular seu IMC
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Informações sobre IMC */}
          <Card title="Sobre o IMC" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={5}>O que é o IMC?</Title>
                <Paragraph>
                  O Índice de Massa Corporal (IMC) é uma medida internacional usada para calcular 
                  se uma pessoa está no peso ideal. Ele foi desenvolvido pelo polímata Lambert Quételet 
                  no fim do século XIX.
                </Paragraph>
              </Col>
              <Col xs={24} md={12}>
                <Title level={5}>Classificação</Title>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div><Tag color="blue">Abaixo do peso</Tag> <Text>IMC &lt; 18,5</Text></div>
                  <div><Tag color="green">Peso normal</Tag> <Text>IMC 18,5 - 24,9</Text></div>
                  <div><Tag color="orange">Sobrepeso</Tag> <Text>IMC 25,0 - 29,9</Text></div>
                  <div><Tag color="red">Obesidade Grau I</Tag> <Text>IMC 30,0 - 34,9</Text></div>
                  <div><Tag color="red">Obesidade Grau II</Tag> <Text>IMC 35,0 - 39,9</Text></div>
                  <div><Tag color="red">Obesidade Grau III</Tag> <Text>IMC ≥ 40,0</Text></div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default IMCCalculator;

