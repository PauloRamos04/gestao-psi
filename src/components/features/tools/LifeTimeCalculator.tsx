import React, { useState } from 'react';
import {
  Card,
  Form,
  DatePicker,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Progress
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  HeartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface LifeTimeResult {
  age: number;
  daysLived: number;
  weeksLived: number;
  monthsLived: number;
  yearsLived: number;
  lifeExpectancy: number;
  remainingYears: number;
  remainingDays: number;
  lifeProgress: number;
  nextBirthday: string;
  daysToNextBirthday: number;
}

const LifeTimeCalculator: React.FC = () => {
  const [form] = Form.useForm();
  const [result, setResult] = useState<LifeTimeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateLifeTime = (birthDate: dayjs.Dayjs): LifeTimeResult => {
    const now = dayjs();
    const birth = birthDate;
    
    // Calcular idade
    const age = now.diff(birth, 'year');
    
    // Calcular tempo vivido
    const daysLived = now.diff(birth, 'day');
    const weeksLived = Math.floor(daysLived / 7);
    const monthsLived = now.diff(birth, 'month');
    const yearsLived = age;
    
    // Expectativa de vida no Brasil (IBGE 2023)
    const lifeExpectancy = 75.5; // anos
    const remainingYears = Math.max(0, lifeExpectancy - age);
    const remainingDays = Math.floor(remainingYears * 365.25);
    
    // Progresso da vida
    const lifeProgress = Math.min(100, (age / lifeExpectancy) * 100);
    
    // Próximo aniversário
    const nextBirthday = birth.add(age + 1, 'year');
    const daysToNextBirthday = nextBirthday.diff(now, 'day');

    return {
      age,
      daysLived,
      weeksLived,
      monthsLived,
      yearsLived,
      lifeExpectancy,
      remainingYears,
      remainingDays,
      lifeProgress,
      nextBirthday: nextBirthday.format('DD/MM/YYYY'),
      daysToNextBirthday
    };
  };

  const onFinish = async (values: { birthDate: dayjs.Dayjs }) => {
    setLoading(true);
    
    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
      const lifeTimeResult = calculateLifeTime(values.birthDate);
      setResult(lifeTimeResult);
      setLoading(false);
    }, 500);
  };

  const resetCalculator = () => {
    form.resetFields();
    setResult(null);
  };

  const getProgressColor = (progress: number): string => {
    if (progress < 25) return '#52c41a';
    if (progress < 50) return '#1890ff';
    if (progress < 75) return '#fa8c16';
    return '#ff4d4f';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Calculadora de Tempo de Vida
            </Title>
            <Text type="secondary">
              Descubra quantos dias, semanas e anos você já viveu
            </Text>
          </div>

          <Divider />

          <Row gutter={[24, 24]}>
            {/* Formulário */}
            <Col xs={24} lg={12}>
              <Card title="Data de Nascimento" size="small">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Data de Nascimento"
                    name="birthDate"
                    rules={[
                      { required: true, message: 'Por favor, selecione sua data de nascimento!' }
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%', fontSize: '16px' }}
                      placeholder="Selecione sua data de nascimento"
                      format="DD/MM/YYYY"
                      disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<CalendarOutlined />}
                        size="large"
                      >
                        Calcular Tempo de Vida
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
                    {/* Progresso da Vida */}
                    <div>
                      <Text strong>Progresso da Vida</Text>
                      <Progress
                        percent={result.lifeProgress}
                        strokeColor={getProgressColor(result.lifeProgress)}
                        format={(percent) => `${percent?.toFixed(1)}%`}
                        style={{ marginTop: '8px' }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Baseado na expectativa de vida brasileira ({result.lifeExpectancy} anos)
                      </Text>
                    </div>

                    {/* Estatísticas */}
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <Statistic
                          title="Idade Atual"
                          value={result.age}
                          suffix="anos"
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Dias Vividos"
                          value={result.daysLived}
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Semanas Vividas"
                          value={result.weeksLived}
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title="Meses Vividos"
                          value={result.monthsLived}
                          valueStyle={{ color: '#fa8c16' }}
                        />
                      </Col>
                    </Row>

                    {/* Informações Adicionais */}
                    <Alert
                      message={
                        <Space direction="vertical" size="small">
                          <div>
                            <HeartOutlined style={{ marginRight: '4px' }} />
                            <Text strong>Próximo aniversário:</Text> {result.nextBirthday}
                          </div>
                          <div>
                            <Text strong>Faltam:</Text> {result.daysToNextBirthday} dias
                          </div>
                          {result.remainingYears > 0 && (
                            <div>
                              <Text strong>Tempo restante estimado:</Text> {result.remainingYears.toFixed(1)} anos ({result.remainingDays} dias)
                            </div>
                          )}
                        </Space>
                      }
                      type="info"
                      icon={<InfoCircleOutlined />}
                      showIcon
                    />
                  </Space>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">
                      Selecione sua data de nascimento para calcular seu tempo de vida
                    </Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Informações sobre Tempo de Vida */}
          <Card title="Sobre o Tempo de Vida" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={5}>Como é calculado?</Title>
                <Paragraph>
                  O cálculo considera sua data de nascimento e a data atual para determinar 
                  exatamente quantos dias, semanas, meses e anos você já viveu. 
                  Também mostra o progresso baseado na expectativa de vida brasileira.
                </Paragraph>
              </Col>
              <Col xs={24} md={12}>
                <Title level={5}>Expectativa de Vida</Title>
                <Paragraph>
                  A expectativa de vida no Brasil é de aproximadamente 75,5 anos (IBGE 2023). 
                  Este valor é usado como referência para calcular o progresso da vida, 
                  mas pode variar conforme fatores como estilo de vida, genética e condições socioeconômicas.
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default LifeTimeCalculator;

