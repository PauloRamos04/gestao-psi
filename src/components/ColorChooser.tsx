import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Divider,
  Tag,
  message,
  Tooltip
} from 'antd';
import {
  BgColorsOutlined,
  CheckOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  description: string;
}

const ColorChooser: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [previewMode, setPreviewMode] = useState<boolean>(false);

  const colorThemes: Record<string, ColorTheme> = {
    default: {
      name: 'Padrão',
      primary: '#1890ff',
      secondary: '#52c41a',
      accent: '#fa8c16',
      background: '#ffffff',
      text: '#000000',
      description: 'Tema padrão do sistema com cores profissionais'
    },
    calm: {
      name: 'Calmo',
      primary: '#52c41a',
      secondary: '#13c2c2',
      accent: '#722ed1',
      background: '#f6ffed',
      text: '#135200',
      description: 'Tons verdes e azuis para um ambiente tranquilo'
    },
    warm: {
      name: 'Aconchegante',
      primary: '#fa8c16',
      secondary: '#f5222d',
      accent: '#eb2f96',
      background: '#fff7e6',
      text: '#ad2102',
      description: 'Cores quentes para um ambiente acolhedor'
    },
    professional: {
      name: 'Profissional',
      primary: '#1890ff',
      secondary: '#722ed1',
      accent: '#13c2c2',
      background: '#fafafa',
      text: '#262626',
      description: 'Cores neutras e profissionais para ambiente corporativo'
    },
    nature: {
      name: 'Natureza',
      primary: '#52c41a',
      secondary: '#fa8c16',
      accent: '#13c2c2',
      background: '#f6ffed',
      text: '#135200',
      description: 'Inspirado na natureza com tons de verde e terra'
    },
    ocean: {
      name: 'Oceano',
      primary: '#13c2c2',
      secondary: '#1890ff',
      accent: '#722ed1',
      background: '#e6fffb',
      text: '#003a8c',
      description: 'Tons de azul e turquesa como o oceano'
    },
    sunset: {
      name: 'Pôr do Sol',
      primary: '#fa8c16',
      secondary: '#f5222d',
      accent: '#eb2f96',
      background: '#fff2e8',
      text: '#ad2102',
      description: 'Cores do pôr do sol com tons laranja e rosa'
    },
    forest: {
      name: 'Floresta',
      primary: '#389e0d',
      secondary: '#52c41a',
      accent: '#fa8c16',
      background: '#f6ffed',
      text: '#135200',
      description: 'Verdes profundos como uma floresta'
    }
  };

  const applyTheme = (themeKey: string) => {
    const theme = colorThemes[themeKey];
    if (!theme) return;

    // Aplicar cores ao CSS customizado
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--accent-color', theme.accent);
    root.style.setProperty('--background-color', theme.background);
    root.style.setProperty('--text-color', theme.text);

    // Salvar no localStorage
    localStorage.setItem('selectedTheme', themeKey);
    setSelectedTheme(themeKey);
    
    message.success(`Tema "${theme.name}" aplicado com sucesso!`);
  };

  const resetToDefault = () => {
    // Remover estilos customizados
    const root = document.documentElement;
    root.style.removeProperty('--primary-color');
    root.style.removeProperty('--secondary-color');
    root.style.removeProperty('--accent-color');
    root.style.removeProperty('--background-color');
    root.style.removeProperty('--text-color');

    // Remover do localStorage
    localStorage.removeItem('selectedTheme');
    setSelectedTheme('default');
    
    message.success('Tema padrão restaurado!');
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Carregar tema salvo ao inicializar
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && colorThemes[savedTheme]) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const ColorPreview = ({ theme }: { theme: ColorTheme }) => (
    <div
      style={{
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: theme.background,
        color: theme.text,
        border: `2px solid ${theme.primary}`,
        minHeight: '120px'
      }}
    >
      <Space direction="vertical" size="small">
        <Text strong style={{ color: theme.primary }}>Título de Exemplo</Text>
        <Text style={{ color: theme.text }}>Texto normal do conteúdo</Text>
        <Space>
          <Button size="small" style={{ backgroundColor: theme.primary, borderColor: theme.primary, color: 'white' }}>
            Botão Primário
          </Button>
          <Button size="small" style={{ backgroundColor: theme.secondary, borderColor: theme.secondary, color: 'white' }}>
            Botão Secundário
          </Button>
        </Space>
        <Tag color={theme.accent}>Tag de Exemplo</Tag>
      </Space>
    </div>
  );

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <BgColorsOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Seletor de Cores
            </Title>
            <Text type="secondary">
              Personalize a aparência do sistema com diferentes temas de cores
            </Text>
          </div>

          <Divider />

          {/* Controles */}
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => applyTheme(selectedTheme)}
                >
                  Aplicar Tema Selecionado
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={resetToDefault}
                >
                  Restaurar Padrão
                </Button>
              </Space>
            </Col>
            <Col>
              <Button
                type={previewMode ? 'primary' : 'default'}
                onClick={togglePreview}
              >
                {previewMode ? 'Ocultar Preview' : 'Mostrar Preview'}
              </Button>
            </Col>
          </Row>

          {/* Temas de Cores */}
          <Row gutter={[16, 16]}>
            {Object.entries(colorThemes).map(([key, theme]) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={key}>
                <Card
                  size="small"
                  hoverable
                  style={{
                    border: selectedTheme === key ? `2px solid ${theme.primary}` : '1px solid #d9d9d9',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedTheme(key)}
                >
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    {/* Cores do tema */}
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      <Tooltip title="Cor Primária">
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: theme.primary,
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9'
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Cor Secundária">
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: theme.secondary,
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9'
                          }}
                        />
                      </Tooltip>
                      <Tooltip title="Cor de Destaque">
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: theme.accent,
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9'
                          }}
                        />
                      </Tooltip>
                    </div>

                    {/* Nome do tema */}
                    <div style={{ textAlign: 'center' }}>
                      <Text strong>{theme.name}</Text>
                      {selectedTheme === key && (
                        <CheckOutlined style={{ marginLeft: '8px', color: theme.primary }} />
                      )}
                    </div>

                    {/* Descrição */}
                    <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center' }}>
                      {theme.description}
                    </Text>

                    {/* Preview (se ativado) */}
                    {previewMode && (
                      <ColorPreview theme={theme} />
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Informações sobre Personalização */}
          <Card title="Sobre a Personalização" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={5}>Como Funciona</Title>
                <Paragraph>
                  O seletor de cores permite personalizar a aparência do sistema aplicando 
                  diferentes temas de cores. As cores são aplicadas globalmente e salvas 
                  no seu navegador para persistir entre sessões.
                </Paragraph>
              </Col>
              <Col xs={24} md={12}>
                <Title level={5}>Dicas de Uso</Title>
                <Paragraph>
                  • Escolha cores que facilitem a leitura e reduzam a fadiga visual<br/>
                  • Considere o ambiente onde o sistema será usado<br/>
                  • Use o preview para ver como ficará antes de aplicar<br/>
                  • Você pode sempre restaurar o tema padrão
                </Paragraph>
              </Col>
            </Row>
          </Card>

          {/* Alert sobre Personalização */}
          <Alert
            message="Personalização de Cores"
            description={
              <div>
                <Text>
                  As cores selecionadas são aplicadas apenas na sua sessão atual e salvas 
                  no navegador. Para uma personalização mais avançada, entre em contato 
                  com o administrador do sistema.
                </Text>
              </div>
            }
            type="info"
            icon={<InfoCircleOutlined />}
            showIcon
          />
        </Space>
      </Card>
    </div>
  );
};

export default ColorChooser;
