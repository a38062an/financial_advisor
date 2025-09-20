export interface ChartData {
  type: 'pie' | 'bar' | 'doughnut' | 'horizontalBar';
  data: {
    labels: string[];
    datasets: Array<{
      label?: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }>;
  };
  options: {
    responsive: boolean;
    plugins?: {
      title?: {
        display: boolean;
        text: string;
      };
    };
    scales?: {
      x?: {
        beginAtZero?: boolean;
      };
      y?: {
        beginAtZero?: boolean;
      };
    };
  };
}

export interface AnalysisData {
  entities: Array<{
    category: string;
    keyword: string;
    context: string;
    confidence: number;
  }>;
  financial_metrics: Array<{
    value: number;
    raw_text: string;
    context: string;
    position: number;
  }>;
  sentiment: string;
  key_topics: string[];
  action_items: string[];
}

export interface WebSocketMessage {
  type: 'chart_update' | 'meeting_started' | 'error' | 'audio_transcript' | 'meeting_start';
  data?: any;
  analysis?: AnalysisData;
  message?: string;
  transcript?: string;
  status?: string;
}