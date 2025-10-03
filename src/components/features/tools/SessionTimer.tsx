import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Statistic,
  Divider,
  Tag,
  Progress,
  InputNumber,
  Select,
  message
} from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
  SoundOutlined,
  BellOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeLeft: number;
  totalTime: number;
  sessionType: string;
  currentPhase: string;
}

const SessionTimer: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    isPaused: false,
    timeLeft: 0,
    totalTime: 0,
    sessionType: 'individual',
    currentPhase: 'preparacao'
  });
  
  const [sessionDuration, setSessionDuration] = useState<number>(50);
  const [breakDuration, setBreakDuration] = useState<number>(10);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Configurações de sessão
  const sessionTypes = {
    individual: { name: 'Sessão Individual', duration: 50, break: 10 },
    casal: { name: 'Sessão de Casal', duration: 60, break: 15 },
    grupo: { name: 'Sessão de Grupo', duration: 90, break: 20 },
    supervisao: { name: 'Supervisão', duration: 120, break: 30 }
  };

  const phases = {
    preparacao: { name: 'Preparação', duration: 5, color: '#1890ff' },
    sessao: { name: 'Sessão', duration: sessionDuration, color: '#52c41a' },
    intervalo: { name: 'Intervalo', duration: breakDuration, color: '#fa8c16' },
    finalizacao: { name: 'Finalização', duration: 5, color: '#722ed1' }
  };

  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 1) {
            // Tempo esgotado
            handleTimeUp();
            return {
              ...prev,
              isRunning: false,
              timeLeft: 0
            };
          }
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1
          };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.isPaused]);

  const handleTimeUp = () => {
    if (soundEnabled) {
      playNotificationSound();
    }
    
    if (notificationsEnabled) {
      message.success('Tempo esgotado!', 3);
    }

    // Determinar próxima fase
    const currentPhaseIndex = Object.keys(phases).indexOf(timer.currentPhase);
    const nextPhase = Object.keys(phases)[currentPhaseIndex + 1];
    
    if (nextPhase) {
      setTimer(prev => ({
        ...prev,
        currentPhase: nextPhase,
        timeLeft: phases[nextPhase as keyof typeof phases].duration * 60,
        totalTime: phases[nextPhase as keyof typeof phases].duration * 60
      }));
    } else {
      // Sessão completa
      setTimer(prev => ({
        ...prev,
        isRunning: false,
        currentPhase: 'preparacao'
      }));
      message.success('Sessão completa!', 5);
    }
  };

  const playNotificationSound = () => {
    // Criar um tom de notificação simples
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const startTimer = (phase: string = 'preparacao') => {
    const phaseConfig = phases[phase as keyof typeof phases];
    setTimer({
      isRunning: true,
      isPaused: false,
      timeLeft: phaseConfig.duration * 60,
      totalTime: phaseConfig.duration * 60,
      sessionType: timer.sessionType,
      currentPhase: phase
    });
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const stopTimer = () => {
    setTimer({
      isRunning: false,
      isPaused: false,
      timeLeft: 0,
      totalTime: 0,
      sessionType: timer.sessionType,
      currentPhase: 'preparacao'
    });
  };

  const resetTimer = () => {
    stopTimer();
    setSessionDuration(50);
    setBreakDuration(10);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (timer.totalTime === 0) return 0;
    return ((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100;
  };

  const getPhaseColor = (): string => {
    return phases[timer.currentPhase as keyof typeof phases]?.color || '#1890ff';
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <Title level={2}>
              <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Temporizador de Sessão
            </Title>
            <Text type="secondary">
              Controle o tempo das suas sessões de terapia
            </Text>
          </div>

          <Divider />

          <Row gutter={[24, 24]}>
            {/* Controles */}
            <Col xs={24} lg={12}>
              <Card title="Configurações" size="small">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Tipo de Sessão:</Text>
                    <Select
                      value={timer.sessionType}
                      onChange={(value) => setTimer(prev => ({ ...prev, sessionType: value }))}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      {Object.entries(sessionTypes).map(([key, config]) => (
                        <Option key={key} value={key}>
                          {config.name} ({config.duration}min)
                        </Option>
                      ))}
                    </Select>
                  </div>

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text strong>Duração da Sessão:</Text>
                      <InputNumber
                        value={sessionDuration}
                        onChange={(value) => setSessionDuration(value || 50)}
                        min={10}
                        max={180}
                        suffix="min"
                        style={{ width: '100%', marginTop: '8px' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Text strong>Duração do Intervalo:</Text>
                      <InputNumber
                        value={breakDuration}
                        onChange={(value) => setBreakDuration(value || 10)}
                        min={5}
                        max={60}
                        suffix="min"
                        style={{ width: '100%', marginTop: '8px' }}
                      />
                    </Col>
                  </Row>

                  <div>
                    <Space>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => startTimer('preparacao')}
                        disabled={timer.isRunning}
                        size="large"
                      >
                        Iniciar Sessão
                      </Button>
                      <Button
                        icon={timer.isPaused ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                        onClick={pauseTimer}
                        disabled={!timer.isRunning}
                        size="large"
                      >
                        {timer.isPaused ? 'Continuar' : 'Pausar'}
                      </Button>
                      <Button
                        danger
                        icon={<StopOutlined />}
                        onClick={stopTimer}
                        disabled={!timer.isRunning}
                        size="large"
                      >
                        Parar
                      </Button>
                      <Button
                        icon={<ReloadOutlined />}
                        onClick={resetTimer}
                        size="large"
                      >
                        Reset
                      </Button>
                    </Space>
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Timer Display */}
            <Col xs={24} lg={12}>
              <Card title="Temporizador" size="small">
                {timer.isRunning || timer.timeLeft > 0 ? (
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    {/* Fase Atual */}
                    <div style={{ textAlign: 'center' }}>
                      <Tag color={getPhaseColor()} style={{ fontSize: '16px', padding: '8px 16px' }}>
                        {phases[timer.currentPhase as keyof typeof phases]?.name || 'Preparação'}
                      </Tag>
                    </div>

                    {/* Tempo */}
                    <div style={{ textAlign: 'center' }}>
                      <Statistic
                        title="Tempo Restante"
                        value={formatTime(timer.timeLeft)}
                        valueStyle={{ 
                          color: getPhaseColor(),
                          fontSize: '48px',
                          fontWeight: 'bold',
                          fontFamily: 'monospace'
                        }}
                      />
                    </div>

                    {/* Progresso */}
                    <div>
                      <Progress
                        percent={getProgressPercentage()}
                        strokeColor={getPhaseColor()}
                        showInfo={false}
                        style={{ marginBottom: '8px' }}
                      />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatTime(timer.totalTime - timer.timeLeft)} / {formatTime(timer.totalTime)}
                      </Text>
                    </div>

                    {/* Status */}
                    <Alert
                      message={
                        timer.isPaused ? 'Sessão pausada' : 
                        timer.isRunning ? 'Sessão em andamento' : 'Sessão finalizada'
                      }
                      type={timer.isPaused ? 'warning' : 
                            timer.isRunning ? 'info' : 'success'}
                      showIcon
                    />
                  </Space>
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <ClockCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                    <div>
                      <Text type="secondary">
                        Configure e inicie uma nova sessão
                      </Text>
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Configurações de Notificação */}
          <Card title="Configurações de Notificação" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Space>
                  <SoundOutlined />
                  <Text>Som de notificação</Text>
                  <Button
                    type={soundEnabled ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                  >
                    {soundEnabled ? 'Ativado' : 'Desativado'}
                  </Button>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space>
                  <BellOutlined />
                  <Text>Notificações do navegador</Text>
                  <Button
                    type={notificationsEnabled ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  >
                    {notificationsEnabled ? 'Ativado' : 'Desativado'}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Informações sobre o Temporizador */}
          <Card title="Sobre o Temporizador" size="small">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={5}>Fases da Sessão</Title>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div><Tag color="#1890ff">Preparação</Tag> <Text>5 minutos - Preparação inicial</Text></div>
                  <div><Tag color="#52c41a">Sessão</Tag> <Text>50-120 minutos - Sessão principal</Text></div>
                  <div><Tag color="#fa8c16">Intervalo</Tag> <Text>10-30 minutos - Pausa entre sessões</Text></div>
                  <div><Tag color="#722ed1">Finalização</Tag> <Text>5 minutos - Encerramento</Text></div>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Title level={5}>Dicas de Uso</Title>
                <Paragraph>
                  • Use o temporizador para manter o foco durante as sessões<br/>
                  • Configure alertas sonoros para não perder o tempo<br/>
                  • Ajuste a duração conforme o tipo de terapia<br/>
                  • Faça pausas regulares para manter a qualidade
                </Paragraph>
              </Col>
            </Row>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default SessionTimer;

